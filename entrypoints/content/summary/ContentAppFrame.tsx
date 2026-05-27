import React, { useEffect, useMemo, useRef, useState } from 'react';
import { browser } from 'wxt/browser';
import { usePanel } from '@/components/container/PanelContext';
import { sendMessage as sendExtMessage } from '@/lib/messaging';
import { Play, Settings, PlusSquare, PanelRight, PictureInPicture2, Copy, ArrowUpToLine, ArrowDownToLine, ChevronUp, ChevronDown, Eye, ScanEye, X, RefreshCw, Info } from 'lucide-react';
import Mustache from 'mustache';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';

import { useChat } from '@ai-sdk/react';
import { AiSdkConnectTransport } from '@/lib/ai-sdk-connect-transport';
import { loadModelSettings } from '@/lib/model-settings-storage';
import { loadPromptSettings, seedDefaultPromptIfNeeded } from '@/lib/prompt-settings-storage';
import { loadGeneralSettings } from '@/lib/general-settings-storage';
import { parsePageContent, type WebpageContent } from '@/lib/page-extraction';
import { getModelProviderDefinition, getModelDisplayIcon, type ModelConfigItem } from '@/constants/model-settings';
import type { PromptConfigItem } from '@/constants/prompt-settings';
import type { GeneralSettings } from '@/constants/general-settings';
import { countInputTokens, truncateByTokens } from '@/lib/token-count';
// import {
//   Conversation,
//   ConversationContent,
//   ConversationScrollButton,
// } from "@/components/ai-elements/conversation";

// import {
//   Message,
//   MessageContent,
//   MessageResponse,
// } from "@/components/ai-elements/message";
// console.log('Conversation', Conversation, ConversationContent, MessageContent)
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

import { TokenViewerModal } from '@/components/TokenViewerModal';


interface ContentAppFrameProps {
  onClose: () => void;
  isMain?: boolean;
  onAdd?: () => void;
}

function UsageDisplay({ messages, currentModel }: { messages: any[], currentModel?: ModelConfigItem }) {
  const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
  const usage = (lastAssistantMessage?.metadata as any)?.usage;
  
  if (!usage) return <span>Ready</span>;
  
  const input = usage.inputTokens ?? usage.promptTokens ?? 0;
  const output = usage.outputTokens ?? usage.completionTokens ?? 0;
  const cached = usage.cachedInputTokens ?? usage.promptTokensDetails?.cachedTokens ?? usage.cachedTokens ?? 0;
  
  const billedInput = input - cached + (cached / 10);
  
  const priceUnit = currentModel?.priceUnit || '$';
  const inputCost = currentModel ? (billedInput * currentModel.inputTokenPrice) / 1_000_000 : 0;
  const outputCost = currentModel ? (output * currentModel.outputTokenPrice) / 1_000_000 : 0;

  const formatCost = (cost: number) => {
    if (!cost) return '';
    if (cost < 0.00001) return ` <${priceUnit}0.00001`;
    return ` ${priceUnit}${parseFloat(cost.toPrecision(3))}`;
  };
  
  return (
    <>
      <span title={`Raw Input: ${input}, Cached: ${cached}`}>
        ↑{Math.ceil(billedInput)}{formatCost(inputCost)}
      </span>
      <span title={`Output: ${output}`}>
        ↓{output}{formatCost(outputCost)}
      </span>
    </>
  );
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
  const [pageContentTokenCount, setPageContentTokenCount] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTokenViewerOpen, setIsTokenViewerOpen] = useState(false);
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
      setShowBottom(generalSettings.enableChatInputBox);

      console.log('[ContentAppFrame] Extracting page content...');
      const extracted = parsePageContent(generalSettings.pageTextExtractMethod, document);
      if (extracted) {

        // TODO: 在这里根据model的maxoutputTokens,进行截断, 
        setPageContent(extracted);
        countInputTokens(extracted.textContent).then(count => {
          if (active) setPageContentTokenCount(count);
        }).catch(e => console.error('Failed to count tokens', e));

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

  const getContextMessageTexts = async () => {
    const prompt = prompts.find(p => p.id === currentPromptId);
    if (!prompt || !pageContent || !settings) return null;

    let textContent = pageContent.textContent;
    const currentModel = models.find(m => m.id === currentModelId);
    
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
      userMessageText: Mustache.render(prompt.userMessage, view)
    };
  };

  const initContextMessage = async () => {
    if (messages.length > 0) return;

    const texts = await getContextMessageTexts();
    if (!texts) return;

    setMessages([
      { id: `system-${texts.prompt.id}`, role: 'system', parts: [{ type: 'text', text: texts.systemMessageText }] },
      { id: `context-${texts.prompt.id}`, role: 'user', parts: [{ type: 'text', text: texts.userMessageText }] }
    ]);
  };

  const handleSummarize = async () => {
    if (status === 'streaming' || status === 'submitted') {
      stop();
    }

    const texts = await getContextMessageTexts();
    if (!texts) {
      console.warn('[ContentAppFrame] Missing prompt, content, or settings');
      return;
    }

    console.log('[ContentAppFrame] Triggering summarize...');

    setMessages([{ id: `system-${texts.prompt.id}`, role: 'system', parts: [{ type: 'text', text: texts.systemMessageText }] }]);
    await sendMessage({ text: texts.userMessageText });
  };

  const handleMessageSubmit = async (message: PromptInputMessage) => {
    if (!message.text) return;

    await initContextMessage();

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

  const renderDropdowns = () => (
    <div className={cn("flex items-center gap-1.5 shrink-0", mode === 'sidebar' ? "w-full justify-between px-6" : "justify-center")}>
      <div className="relative flex items-center">
        {(() => {
          const currentModel = models.find(m => m.id === currentModelId);
            if (currentModel) {
              const providerDef = getModelProviderDefinition(currentModel.providerId);
              const iconUrl = getModelDisplayIcon(currentModel);
              const src = iconUrl.startsWith('http') || iconUrl.startsWith('data:') 
                ? iconUrl 
                : browser.runtime.getURL(iconUrl as any);

              return (
                <img
                  src={src}
                  alt={providerDef.label}
                  className="absolute left-2 w-3.5 h-3.5 pointer-events-none object-contain z-10"
                />
              );
            }
          return null;
        })()}
        <select
          className="appearance-none pl-7 pr-6 py-1 border border-zinc-300 rounded-lg text-xs bg-white outline-none shadow-sm text-zinc-700 font-medium max-w-[120px] truncate"
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
          className="appearance-none pl-2 pr-6 py-1 border border-zinc-300 rounded-lg text-xs bg-white outline-none shadow-sm text-zinc-700 font-medium max-w-[120px] truncate"
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
  );

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
      <header className="px-1 py-1 bg-white border-b border-zinc-300 grid grid-cols-[1fr_auto_1fr] items-center cursor-move whitespace-nowrap gap-2 select-none" data-drag-handle>
        {/* ⬇️TODO: 这的改为flex特性的full-height */}
        <div className="flex items-stretch gap-1.5 justify-start overflow-hidden h-full">
          <img src={browser.runtime.getURL('/icon/32.png')} alt="icon" className="size-6 rounded-lg object-contain shrink-0 self-center" />

          <button
            className="flex items-center gap-1 px-1.5 bg-white border border-zinc-300 rounded-lg text-xs hover:bg-emerald-50 shadow-sm text-zinc-700 shrink-0 transition-colors"
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


        {mode !== 'sidebar' ? renderDropdowns() : <div />}

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
              {mode === 'floating' ? <PanelRight size={14} /> : <PictureInPicture2 size={14} />}
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

      {/* 侧边栏模式下的次级栏 / Secondary Bar for Sidebar Mode */}
      {mode === 'sidebar' && (
        <div className="px-2 py-1.5 bg-zinc-50 border-b border-zinc-200 flex w-full items-center shrink-0">
          {renderDropdowns()}
        </div>
      )}

      <div className="flex-1 relative min-h-0 flex flex-col">
        {/* 悬浮在右上角的工具栏 */}
        <div data-section="top-sticky-line" className="absolute top-1 left-1 right-3 flex justify-between flex-row z-10 pointer-events-none [&>*]:pointer-events-auto">
          <div className="flex items-center rounded-lg underline decoration-dashed text-nowrap text-xs font-light bg-white/10 px-2 py-1 text-zinc-500">
            <div title="click the right eye button to View&Change">
              内容 Token 数: <span>{pageContentTokenCount !== null ? pageContentTokenCount : '计算中...'}</span>
            </div>
            <button 
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-zinc-100 hover:text-zinc-900 w-6 h-6 text-zinc-500 ml-1"
              onClick={() => setIsTokenViewerOpen(true)}
            >
              <ScanEye size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 pointer-events-none [&>*]:pointer-events-auto">
            {messages.length > 0 && status !== 'streaming' && status !== 'submitted' && (
              <div className="px-2 py-1 bg-zinc-300/80 backdrop-blur-md rounded-md text-xs text-zinc-600 font-mono tracking-tight flex items-center gap-1.5">
                <UsageDisplay messages={messages} currentModel={models.find(m => m.id === currentModelId)} />
              </div>
            )}
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-white/80 backdrop-blur-sm border border-zinc-200 hover:bg-zinc-50 text-zinc-700 w-8 h-8"
              title="copy all"
              onClick={handleCopyMessages}
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        <Conversation className="relative size-full">
          <ConversationContent>
            {messages.slice(2).map((message, index) => {
              const displayMessages = messages.slice(2);
              const isLastMessage = index === displayMessages.length - 1;
              const reasoningParts = message.parts.filter((part) => part.type === "reasoning");
              const reasoningText = reasoningParts.map((part) => part.text).join("\n\n");
              const hasReasoning = reasoningParts.length > 0;
              const lastPart = message.parts.at(-1);
              const isReasoningStreaming = isLastMessage && status === "streaming" && lastPart?.type === "reasoning";

              return (
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {hasReasoning && (
                      <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
                        <ReasoningTrigger />
                        <ReasoningContent>{reasoningText}</ReasoningContent>
                      </Reasoning>
                    )}
                    {message.parts.map((part, i) => {
                      if (part.type === "text") {
                        return (
                          <MessageResponse key={`${message.id}-${i}`}>
                            {part.text}
                          </MessageResponse>
                        );
                      }
                      return null;
                    })}
                  </MessageContent>
                </Message>
              );
            })}
            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-2">
                    <div className="size-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
                    <span className="text-sm text-zinc-500">Thinking...</span>
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
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

      {/* 底部折叠/展开按钮 (可关闭) / Bottom Collapse Toggle */}
      <div className={showBottom ? "flex justify-center -my-3 z-20 relative pointer-events-none" : "absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"}>
        <button
          onClick={() => setShowBottom(!showBottom)}
          className="bg-white/90 backdrop-blur-sm border border-zinc-200 rounded-full p-1 text-zinc-400 hover:text-zinc-600 shadow-sm flex items-center justify-center transition-colors pointer-events-auto"
          title={showBottom ? 'Close input' : 'Open input'}
        >
          {showBottom ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
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

      {pageContent && (
        <TokenViewerModal 
          isOpen={isTokenViewerOpen}
          onClose={() => setIsTokenViewerOpen(false)}
          textContent={pageContent.textContent}
          maxInputTokens={models.find(m => m.id === currentModelId)?.maxInputTokens ?? 0}
        />
      )}
    </div>
  );
}
