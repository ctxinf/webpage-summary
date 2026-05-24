import React, { useEffect, useMemo, useRef, useState } from 'react';
import { browser } from 'wxt/browser';
import { usePanel } from '@/components/container/PanelContext';
import { sendMessage as sendExtMessage } from '@/lib/messaging';
import { Play, Settings, PlusSquare, PanelRight, PictureInPicture2, Copy, ArrowUpToLine, ArrowDownToLine, ChevronUp, ChevronDown, Eye, ScanEye, X, RefreshCw, Info } from 'lucide-react';
import Mustache from 'mustache';
import { Toaster, toast } from 'sonner';

import { useChat } from '@ai-sdk/react';
import { AiSdkConnectTransport } from '@/lib/ai-sdk-connect-transport';
import { loadModelSettings } from '@/lib/model-settings-storage';
import { loadPromptSettings, seedDefaultPromptIfNeeded } from '@/lib/prompt-settings-storage';
import { loadGeneralSettings } from '@/lib/general-settings-storage';
import { parsePageContent, type WebpageContent } from '@/lib/page-extraction';
import { getModelProviderDefinition, type ModelConfigItem } from '@/constants/model-settings';
import type { PromptConfigItem } from '@/constants/prompt-settings';
import type { GeneralSettings } from '@/constants/general-settings';

import {
  PromptInput,
  type PromptInputMessage,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";

interface ContentAppFrameProps {
  onClose: () => void;
  isMain?: boolean;
  onAdd?: () => void;
}

export function ContentAppFrame({ onClose, isMain = true, onAdd }: ContentAppFrameProps) {
  const { mode, setMode } = usePanel();
  const [showBottom, setShowBottom] = useState(true);

  const [models, setModels] = useState<ModelConfigItem[]>([]);
  const [prompts, setPrompts] = useState<PromptConfigItem[]>([]);
  const [currentModelId, setCurrentModelId] = useState<string>('');
  const [currentPromptId, setCurrentPromptId] = useState<string>('');
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [pageContent, setPageContent] = useState<WebpageContent | null>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (error) {
      toast.error(error.message || '发生未知错误，请重试');
    }
  }, [error]);

  // Initialization
  useEffect(() => {
    let active = true;
    async function init() {
      console.log('[ContentAppFrame] Initializing...');
      await seedDefaultPromptIfNeeded();
      const [modelSettings, promptSettings, generalSettings] = await Promise.all([
        loadModelSettings(),
        loadPromptSettings(),
        loadGeneralSettings()
      ]);

      if (!active) return;

      setModels(modelSettings.models);
      setPrompts(promptSettings.prompts);
      setCurrentModelId(modelSettings.defaultModelId || (modelSettings.models[0]?.id ?? ''));
      setCurrentPromptId(promptSettings.defaultPromptId || (promptSettings.prompts[0]?.id ?? ''));
      setSettings(generalSettings);

      console.log('[ContentAppFrame] Extracting page content...');
      const extracted = parsePageContent(generalSettings.pageTextExtractMethod, document);
      if (extracted) {
        
        // TODO: 在这里根据model的maxoutputTokens,进行截断, 
        setPageContent(extracted);


      }

      console.log('[ContentAppFrame] Init finished.', {
        models: modelSettings.models,
        prompts: promptSettings.prompts,
        extracted
      });

      if (generalSettings.enableAutoBeginSummary) {
        console.log('[ContentAppFrame] Auto trigger summarize by settings is enabled (to be implemented)');
      }
    }
    init();
    return () => { active = false; };
  }, []);

  const initContextMessage = () => {
    if (messages.length > 0) return;

    const prompt = prompts.find(p => p.id === currentPromptId);
    if (!prompt || !pageContent || !settings) return;

    const view = {
      textContent: pageContent.textContent,
      articleUrl: pageContent.articleUrl,
      summaryLanguage: settings.summaryLanguage,
      currentSelection: '',
    };

    const systemMessageText = Mustache.render(prompt.systemMessage, view);
    const userMessageText = Mustache.render(prompt.userMessage, view);

    setMessages([
      { id: `system-${prompt.id}`, role: 'system', parts: [{ type: 'text', text: systemMessageText }] },
      { id: `context-${prompt.id}`, role: 'user', parts: [{ type: 'text', text: userMessageText }] }
    ]);
  };

  const handleSummarize = async () => {
    if (status === 'streaming' || status === 'submitted') {
      stop();
    }

    const prompt = prompts.find(p => p.id === currentPromptId);
    if (!prompt || !pageContent || !settings) {
      console.warn('[ContentAppFrame] Missing prompt, content, or settings');
      return;
    }

    console.log('[ContentAppFrame] Triggering summarize...');

    const view = {
      textContent: pageContent.textContent,
      articleUrl: pageContent.articleUrl,
      summaryLanguage: settings.summaryLanguage,
      currentSelection: '',
    };

    const systemMessageText = Mustache.render(prompt.systemMessage, view);
    const userMessageText = Mustache.render(prompt.userMessage, view);

    setMessages([{ id: `system-${prompt.id}`, role: 'system', parts: [{ type: 'text', text: systemMessageText }] }]);
    await sendMessage({ text: userMessageText });
  };

  const handleMessageSubmit = async (message: PromptInputMessage) => {
    if (!message.text) return;
    
    initContextMessage();
    
    await sendMessage({ text: message.text });
    setInputText('');
  };

  const handleCopyMessages = async () => {
    try {
      const formattedMessages = messages.map(m => {
        let textContent = (m as any).content || '';
        // If content is empty but parts exist (e.g. system/user injected via parts), extract text from parts
        if (!textContent && m.parts) {
          textContent = (m.parts as any[])
            .filter(p => p.type === 'text')
            .map(p => p.text)
            .join('');
        }
        return {
          role: m.role,
          content: textContent
        };
      });
      await navigator.clipboard.writeText(JSON.stringify(formattedMessages, null, 2));
      toast.success('复制成功');
    } catch (err) {
      toast.error('复制失败');
      console.error('Failed to copy messages', err);
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white text-zinc-900 overflow-hidden relative pointer-events-auto">
      <Toaster
        position="bottom-right"
        duration={6000}
        richColors
        closeButton
        toastOptions={{
          style: {
            fontSize: '14px',
            padding: '16px',
          },
          className: 'min-h-[60px] text-sm'
        }}
      />
      {/* 顶部栏 / Top Bar */}
      <header className="px-1 py-1 bg-white border-b border-zinc-100 grid grid-cols-[1fr_auto_1fr] items-center cursor-move whitespace-nowrap gap-2" data-drag-handle>
        {/* ⬇️TODO: 这的改为flex特性的full-height */}
        <div className="flex items-stretch gap-1.5 justify-start overflow-hidden h-full">
          <img src={browser.runtime.getURL('/icon/32.png')} alt="icon" className="size-6 rounded-[3px] object-contain shrink-0 self-center" />

          <button
            className="flex items-center gap-1 px-1.5 bg-white border border-zinc-200 rounded text-xs hover:bg-emerald-50 shadow-sm text-zinc-700 shrink-0 transition-colors"
            onClick={handleSummarize}
            title={messages.length > 0 ? "重新总结" : "总结"}
          >
            {status === 'streaming' || status === 'submitted' ? (
              <RefreshCw size={14} strokeWidth={3.5} className="text-emerald-700 animate-spin" />
            ) : messages.length > 0 ? (
              <RefreshCw size={14} strokeWidth={3.5} className="text-emerald-700" />
            ) : (
              <Play size={14} strokeWidth={3.5} className="text-emerald-700 fill-emerald-700" />
            )}
            {messages.length === 0 && status !== 'streaming' && status !== 'submitted' ? (
              <span className="font-medium text-emerald-900 pr-0.5">总结</span>
            ) : null}
          </button>

          {error && (
            <button
              className="flex items-center justify-center text-red-500 hover:text-red-600 shrink-0 outline-none"
              title={error.message}
              onClick={() => toast.error(error.message || '发生未知错误，请重试')}
            >
              <Info size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-1.5 shrink-0">
          <div className="relative flex items-center">
            {(() => {
              const currentModel = models.find(m => m.id === currentModelId);
              if (currentModel) {
                const providerDef = getModelProviderDefinition(currentModel.providerId);
                return (
                  <img
                    src={browser.runtime.getURL(providerDef.iconPath)}
                    alt={providerDef.label}
                    className="absolute left-2 w-3.5 h-3.5 pointer-events-none object-contain z-10"
                  />
                );
              }
              return null;
            })()}
            <select
              className="appearance-none pl-7 pr-6 py-1 border border-zinc-200 rounded text-xs bg-white outline-none shadow-sm text-zinc-700 font-medium max-w-[120px] truncate"
              value={currentModelId}
              onChange={(e) => {
                setCurrentModelId(e.target.value);
                console.log('[ContentAppFrame] Switched model to', e.target.value);
              }}
            >
              {models.map(m =>
                <option key={m.id} value={m.id}>
                  {m.name}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              className="appearance-none pl-2 pr-6 py-1 border border-zinc-200 rounded text-xs bg-white outline-none shadow-sm text-zinc-700 font-medium max-w-[120px] truncate"
              value={currentPromptId}
              onChange={(e) => {
                setCurrentPromptId(e.target.value);
                console.log('[ContentAppFrame] Switched prompt to', e.target.value);
              }}
            >
              {prompts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-zinc-500 justify-end overflow-hidden h-full">
          <button className="flex items-center justify-center border  rounded size-6 hover:bg-zinc-50 shadow-sm shrink-0" title="Add" onClick={onAdd}>
            <PlusSquare size={14} />
          </button>
          {isMain && (
            <button
              className="flex items-center justify-center aspect-square border size-6  border-zinc-200 rounded hover:bg-zinc-50 shadow-sm shrink-0"
              title={mode === 'floating' ? 'Switch to Sidebar' : 'Switch to Floating'}
              onClick={() => setMode(mode === 'floating' ? 'sidebar' : 'floating')}
            >
              {mode === 'floating' ? <PanelRight size={14} /> : <PictureInPicture2  size={14}/>}
            </button>
          )}
          <button
            className="flex items-center justify-center size-6  border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm shrink-0"
            title="Settings"
            onClick={() => sendExtMessage('openOptionPage', '/options.html#/')}
          >
            <Settings size={14} />
          </button>
          <button className="flex items-center justify-center size-6  border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm text-zinc-500 hover:text-zinc-600 shrink-0" onClick={onClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </header>

      {/* 中间的对话列表 / Middle Chat List Placeholder */}
      <div className="flex-1 relative min-h-0">
        <div ref={scrollRef} className="absolute inset-0 overflow-auto p-0.5 cursor-auto">
        {/* ⬇️TODO: 下面这个固定到顶部, 随着对话列表scroll也会留在最上方 */}
        <div data-section="top-sticky-line" className="sticky top-1 w-full flex justify-end pr-1 flex-row gap-1 z-10  rounded-sm">
          <div className="flex items-center rounded-lg underline decoration-dashed text-nowrap text-xs font-light ml-2">
            <div title=" click the right eye button to View&Change">
              内容字符串长度: <span>{pageContent ? pageContent.textContent.length : 0}</span>
            </div>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-zinc-100 hover:text-zinc-900 w-6 h-6 text-zinc-500">
              <ScanEye size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="grow"></div>
          <button 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 w-6 h-6" 
            title="copy all"
            onClick={handleCopyMessages}
          >
            <Copy size={14} />
          </button>
        </div>
        <div data-section="conversation" className="flex-1 text-left text-xs text-zinc-600 rounded-lg px-1 overflow-auto">
          <pre className="whitespace-pre-wrap">{JSON.stringify(messages, null, 2)}</pre>
        </div>
        </div>
        
        {/* Scroll buttons anchored to the conversation area */}
        <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 z-10 pointer-events-none [&_button]:pointer-events-auto">
          <button 
            className="p-1.5 rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-600 shadow-sm bg-white/90 backdrop-blur"
            onClick={scrollToTop}
            title="Go to top"
          >
            <ArrowUpToLine size={14} />
          </button>
          <button 
            className="p-1.5 rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-600 shadow-sm bg-white/90 backdrop-blur"
            onClick={scrollToBottom}
            title="Go to bottom"
          >
            <ArrowDownToLine size={14} />
          </button>
        </div>
      </div>

      {/* 底部的对话输入 / Bottom Input Area */}
      {showBottom && (
        <div className="flex-none p-1  relative cursor-auto">
          <PromptInput onSubmit={handleMessageSubmit} className="mt-2">
            <PromptInputBody>
              <PromptInputTextarea
                onChange={(e) => setInputText(e.target.value)}
                value={inputText}
                placeholder="Type your message here... Enter to send, Shift+Enter to insert new line."
                className="bg-white min-h-[60px]"
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit disabled={!inputText && !status} status={status as any} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      )}

      {/* 底部折叠/展开按钮 (可关闭) / Bottom Collapse Toggle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full z-10 cursor-auto">
        <button
          onClick={() => setShowBottom(!showBottom)}
          className="bg-white border border-t-0 border-zinc-200 rounded-b-md px-3 py-0.5 text-zinc-400 hover:text-zinc-600 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center transition-colors pointer-events-auto"
          title={showBottom ? 'Close input' : 'Open input'}
        >
          {showBottom ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
  );
}
