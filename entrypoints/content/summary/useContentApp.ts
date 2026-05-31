import { useEffect, useMemo, useRef, useState } from 'react';
import Mustache from 'mustache';
import { toast } from 'sonner';
import { useChat } from '@ai-sdk/react';

import { AiSdkConnectTransport } from '@/lib/ai-sdk-connect-transport';
import { loadModelSettings } from '@/lib/model-settings-storage';
import { loadPromptSettings, seedDefaultPromptIfNeeded } from '@/lib/prompt-settings-storage';
import { loadGeneralSettings } from '@/lib/general-settings-storage';
import { extractWebpageContent, type WebpageContent } from '@/lib/page-extraction';
import { countInputTokens, truncateByTokens } from '@/lib/token-count';
import type { ModelConfigItem } from '@/constants/model-settings';
import type { PromptConfigItem } from '@/constants/prompt-settings';
import type { GeneralSettings } from '@/constants/general-settings';
import { getUiMessages } from '@/lib/i18n';

export function useContentApp() {
  const messagesI18n = getUiMessages();
  const [models, setModels] = useState<ModelConfigItem[]>([]);
  const [prompts, setPrompts] = useState<PromptConfigItem[]>([]);
  const [currentModelId, setCurrentModelId] = useState<string>('');
  const [currentPromptId, setCurrentPromptId] = useState<string>('');
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [pageContent, setPageContent] = useState<WebpageContent | null>(null);
  const [pageContentTokenCount, setPageContentTokenCount] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [showBottom, setShowBottom] = useState(true);
  const [autoSummarizePending, setAutoSummarizePending] = useState(false);
  const [autoSubmitTextPending, setAutoSubmitTextPending] = useState<string | null>(null);

  const modelConfigIdRef = useRef<string | null>(null);
  modelConfigIdRef.current = currentModelId || null;

  const transport = useMemo(
    () =>
      new AiSdkConnectTransport({
        getModelConfigId: () => modelConfigIdRef.current,
      }),
    [],
  );

  const { error, messages, sendMessage, setMessages, status, stop } = useChat({
    transport,
  });

  const currentModel = useMemo(
    () => models.find((m) => m.id === currentModelId),
    [models, currentModelId],
  );

  useEffect(() => {
    if (error) {
      toast.error(error.message || messagesI18n.common.unknownError);
    }
  }, [error]);

  // Initialization
  useEffect(() => {
    let active = true;
    async function init() {
      console.log('[useContentApp] Initializing...');
      await seedDefaultPromptIfNeeded();
      const [modelSettings, promptSettings, generalSettings] = await Promise.all([
        loadModelSettings(),
        loadPromptSettings(),
        loadGeneralSettings(),
      ]);

      if (!active) return;

      setModels(modelSettings.models);
      setPrompts(promptSettings.prompts);
      setCurrentModelId(modelSettings.defaultModelId || (modelSettings.models[0]?.id ?? ''));
      setCurrentPromptId(promptSettings.defaultPromptId || (promptSettings.prompts[0]?.id ?? ''));
      setSettings(generalSettings);
      setShowBottom(generalSettings.enableChatInputBox);

      console.log('[useContentApp] Extracting page content...');
      const extracted = await extractWebpageContent(generalSettings.pageTextExtractMethod, document);
      if (!active) return;
      if (extracted) {
        setPageContent(extracted);
        countInputTokens(extracted.textContent)
          .then((count) => {
            if (active) setPageContentTokenCount(count);
          })
          .catch((e) => console.error('Failed to count tokens', e));
      }

      console.log('[useContentApp] Init finished.', {
        models: modelSettings.models,
        prompts: promptSettings.prompts,
        extracted,
      });

      if (generalSettings.enableAutoBeginSummary) {
        console.log('[useContentApp] Auto trigger summarize by settings is enabled');
        setAutoSummarizePending(true);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  // External trigger (e.g. popup "summarize" button)
  useEffect(() => {
    const handleBegin = () => {
      console.log('[useContentApp] External WEBPAGE_SUMMARY_BEGIN received');
      setAutoSummarizePending(true);
    };
    window.addEventListener('WEBPAGE_SUMMARY_BEGIN', handleBegin);
    return () => {
      window.removeEventListener('WEBPAGE_SUMMARY_BEGIN', handleBegin);
    };
  }, []);

  // External text injection (e.g. context menu "add selection to chat")
  useEffect(() => {
    const handleAddText = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (!customEvent.detail) return;

      setInputText((prev) => {
        const newText = prev ? prev + '\n' + customEvent.detail : customEvent.detail;
        if (settings?.enableAutoBeginChatForAddSelectionToChat) {
          setAutoSubmitTextPending(newText);
          return '';
        }
        return newText;
      });
      setShowBottom((prev) => prev || true);
    };
    window.addEventListener('WEBPAGE_SUMMARY_ADD_TEXT', handleAddText);
    return () => {
      window.removeEventListener('WEBPAGE_SUMMARY_ADD_TEXT', handleAddText);
    };
  }, [settings?.enableAutoBeginChatForAddSelectionToChat]);

  const getContextMessageTexts = async () => {
    const prompt = prompts.find((p) => p.id === currentPromptId);
    if (!prompt || !pageContent || !settings) return null;

    let textContent = pageContent.textContent;

    if (currentModel && currentModel.maxInputTokens > 0) {
      textContent = await truncateByTokens(textContent, currentModel.maxInputTokens);
    }

    const view = {
      textContent,
      articleUrl: pageContent.articleUrl,
      summaryLanguage: settings.summaryLanguage,
      currentSelection: '',
    };

    return {
      prompt,
      systemMessageText: Mustache.render(prompt.systemMessage, view),
      userMessageText: Mustache.render(prompt.userMessage, view),
    };
  };

  const initContextMessage = async () => {
    if (messages.length > 0) return;

    const texts = await getContextMessageTexts();
    if (!texts) return;

    setMessages([
      {
        id: `system-${texts.prompt.id}`,
        role: 'system',
        parts: [{ type: 'text', text: texts.systemMessageText }],
      },
      {
        id: `context-${texts.prompt.id}`,
        role: 'user',
        parts: [{ type: 'text', text: texts.userMessageText }],
      },
    ]);
  };

  const handleSummarize = async () => {
    if (status === 'streaming' || status === 'submitted') {
      stop();
    }

    const texts = await getContextMessageTexts();
    if (!texts) {
      console.warn('[useContentApp] Missing prompt, content, or settings');
      return;
    }

    console.log('[useContentApp] Triggering summarize...');

    setMessages([
      {
        id: `system-${texts.prompt.id}`,
        role: 'system',
        parts: [{ type: 'text', text: texts.systemMessageText }],
      },
    ]);
    await sendMessage({ text: texts.userMessageText });
  };

  const handleMessageSubmit = async (message: { text?: string }) => {
    if (!message.text) return;

    setInputText('');
    await initContextMessage();
    await sendMessage({ text: message.text });
  };

  const handleCopyMessages = async () => {
    try {
      const formattedMessages = messages.map((m) => {
        let textContent = (m as any).content || '';
        if (!textContent && m.parts) {
          textContent = (m.parts as any[])
            .filter((p) => p.type === 'text')
            .map((p) => p.text)
            .join('');
        }
        return { role: m.role, content: textContent };
      });
      await navigator.clipboard.writeText(JSON.stringify(formattedMessages, null, 2));
      toast.success(messagesI18n.popup.copySuccess);
    } catch (err) {
      toast.error(messagesI18n.popup.copyFailed);
      console.error('Failed to copy messages', err);
    }
  };

  // Handle auto summarization once data is fully loaded
  useEffect(() => {
    if (
      autoSummarizePending &&
      pageContent &&
      settings &&
      prompts.length > 0 &&
      currentModelId &&
      currentPromptId
    ) {
      setAutoSummarizePending(false);
      handleSummarize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSummarizePending, pageContent, settings, prompts, currentModelId, currentPromptId]);

  // Handle auto submit text
  useEffect(() => {
    if (
      autoSubmitTextPending &&
      pageContent &&
      settings &&
      prompts.length > 0 &&
      currentModelId &&
      currentPromptId
    ) {
      const textToSubmit = autoSubmitTextPending;
      setAutoSubmitTextPending(null);
      handleMessageSubmit({ text: textToSubmit });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmitTextPending, pageContent, settings, prompts, currentModelId, currentPromptId]);

  return {
    // chat
    messages,
    status,
    error,
    // models & prompts
    models,
    prompts,
    currentModelId,
    setCurrentModelId,
    currentPromptId,
    setCurrentPromptId,
    currentModel,
    // page content
    pageContent,
    pageContentTokenCount,
    // input & UI
    inputText,
    setInputText,
    showBottom,
    setShowBottom,
    // handlers
    handleSummarize,
    handleMessageSubmit,
    handleCopyMessages,
  };
}
