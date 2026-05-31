import React, { useRef, useState } from 'react';
import { browser } from 'wxt/browser';
import { usePanel } from '@/components/container/PanelContext';
import { sendMessage as sendExtMessage } from '@/lib/messaging';
import {
  Play,
  Settings,
  PlusSquare,
  PanelRight,
  PictureInPicture2,
  Copy,
  ArrowUpToLine,
  ArrowDownToLine,
  ChevronUp,
  ScanEye,
  X,
  RefreshCw,
  Info,
  PlusCircleIcon,
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';

import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';

import { TokenViewerModal } from '@/components/TokenViewerModal';
import { useContentApp } from './useContentApp';
import { UsageDisplay } from './UsageDisplay';
import { ModelPromptSelector } from './ModelPromptSelector';
import { getUiMessages } from '@/lib/i18n';

interface ContentAppFrameProps {
  onClose: () => void;
  isMain?: boolean;
  onAdd?: () => void;
}

export function ContentAppFrame({ onClose, isMain = true, onAdd }: ContentAppFrameProps) {
  const uiMessages = getUiMessages();
  const { mode, setMode } = usePanel();
  const [isTokenViewerOpen, setIsTokenViewerOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    status,
    error,
    models,
    prompts,
    currentModelId,
    setCurrentModelId,
    currentPromptId,
    setCurrentPromptId,
    currentModel,
    pageContent,
    pageContentTokenCount,
    inputText,
    setInputText,
    showBottom,
    setShowBottom,
    handleSummarize,
    handleMessageSubmit,
    handleCopyMessages,
  } = useContentApp();

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const isBusy = status === 'streaming' || status === 'submitted';

  return (
    <div className="flex flex-col w-full h-full bg-white text-zinc-900 overflow-hidden relative pointer-events-auto">
      <Toaster
        position="bottom-right"
        duration={6000}
        richColors
        closeButton
        toastOptions={{
          style: { fontSize: '14px', padding: '16px' },
          className: 'min-h-[60px] text-sm',
        }}
      />
      {/* 顶部栏 / Top Bar */}
      <header
        className="px-1 py-1 bg-white border-b border-zinc-300 grid grid-cols-[1fr_auto_1fr] items-center cursor-move whitespace-nowrap gap-2 select-none"
        data-drag-handle
      >
        <div className="flex items-stretch gap-1.5 justify-start overflow-hidden h-full">
          <img
            src={browser.runtime.getURL('/icon/32.png')}
            alt="icon"
            className="size-6 rounded-lg object-contain shrink-0 self-center"
          />

          <button
            className="flex items-center gap-1 px-1.5 bg-white border border-zinc-300 rounded-lg text-xs hover:bg-emerald-50 shadow-sm text-zinc-700 shrink-0 transition-colors"
            onClick={handleSummarize}
            title={messages.length > 0 ? '重新总结' : '总结'}
          >
            {isBusy ? (
              <RefreshCw size={14} strokeWidth={3.5} className="text-emerald-700 animate-spin" />
            ) : messages.length > 0 ? (
              <RefreshCw size={14} strokeWidth={3.5} className="text-emerald-700" />
            ) : (
              <Play size={14} strokeWidth={3.5} className="text-emerald-700 fill-emerald-700" />
            )}
            {messages.length === 0 && !isBusy ? (
              <span className="font-medium text-emerald-900 pr-0.5">{uiMessages.content.summary}</span>
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

        {mode !== 'sidebar' ? (
          <ModelPromptSelector
            models={models}
            prompts={prompts}
            currentModelId={currentModelId}
            currentPromptId={currentPromptId}
            onModelChange={setCurrentModelId}
            onPromptChange={setCurrentPromptId}
            variant="floating"
          />
        ) : (
          <div />
        )}

        <div className="flex items-center gap-0.5 text-zinc-500 justify-end overflow-hidden h-full">
          {mode !== 'sidebar' && (
            <button
              className="flex items-center justify-center border  rounded size-6 hover:bg-zinc-50 shadow-sm shrink-0"
              title="Add"
              onClick={onAdd}
            >
              <PlusSquare size={14} />
            </button>
          )}
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
          <button
            className="flex items-center justify-center size-6  border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm text-zinc-500 hover:text-zinc-600 shrink-0"
            onClick={onClose}
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </header>

      <div className="flex-1 relative min-h-0 flex flex-col">
        {/* 悬浮在右上角的工具栏 */}
        <div
          data-section="top-sticky-line"
          className="absolute top-1 left-1 right-3 flex justify-between flex-row z-10 pointer-events-none [&>*]:pointer-events-auto"
        >
          <div className="flex items-center rounded-lg underline decoration-dashed text-nowrap text-xs font-light bg-white/10 px-2 py-1 text-zinc-500">
            <div title="click the right eye button to View&Change">
              {uiMessages.content.contentTokenCount}{' '}
              <span>{pageContentTokenCount !== null ? pageContentTokenCount : '计算中...'}</span>
            </div>
            <button
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-zinc-100 hover:text-zinc-900 w-6 h-6 text-zinc-500 ml-1"
              onClick={() => setIsTokenViewerOpen(true)}
            >
              <ScanEye size={16} strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 pointer-events-none [&>*]:pointer-events-auto">
            {messages.length > 0 && !isBusy && (
              <div className="px-2 py-1 bg-zinc-300/80 backdrop-blur-md rounded-md text-xs text-zinc-600 font-mono tracking-tight flex items-center gap-1.5">
                <UsageDisplay messages={messages} currentModel={currentModel} />
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
              const reasoningParts = message.parts.filter((part) => part.type === 'reasoning');
              const reasoningText = reasoningParts.map((part) => part.text).join('\n\n');
              const hasReasoning = reasoningParts.length > 0;
              const lastPart = message.parts.at(-1);
              const isReasoningStreaming =
                isLastMessage && status === 'streaming' && lastPart?.type === 'reasoning';

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
                      if (part.type === 'text') {
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
            {status === 'submitted' && (
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
        <div
          className={cn(
            'absolute right-4 flex flex-col gap-1.5 z-10 pointer-events-none [&_button]:pointer-events-auto',
            showBottom ? 'bottom-4' : 'bottom-10',
          )}
        >
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

        {/* Dropdowns anchored to the bottom-left of the conversation area */}
        {mode === 'sidebar' && (
          <div
            className={cn(
              'absolute left-1 z-10 pointer-events-none [&_select]:pointer-events-auto',
              showBottom ? 'bottom-0' : 'bottom-6',
            )}
          >
            <ModelPromptSelector
              models={models}
              prompts={prompts}
              currentModelId={currentModelId}
              currentPromptId={currentPromptId}
              onModelChange={setCurrentModelId}
              onPromptChange={setCurrentPromptId}
              variant="sidebar"
            />
          </div>
        )}
      </div>

      {/* 底部折叠/展开按钮 (可关闭) / Bottom Collapse Toggle */}
      <div
        className={
          showBottom
            ? 'flex justify-center -my-3 translate-y-2 z-20 relative pointer-events-none'
            : 'absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none'
        }
      >
        <button
          onClick={() => setShowBottom(!showBottom)}
          className="bg-white/30 backdrop-blur-sm border border-zinc-200/50 rounded-full p-1 text-zinc-400/70 hover:bg-white/90 hover:border-zinc-300 hover:text-zinc-700 hover:shadow-md shadow-sm flex items-center justify-center transition-all pointer-events-auto"
          title={showBottom ? 'Close input' : 'Open input'}
        >
          {showBottom ? <ChevronUp size={14} /> : <PlusCircleIcon size={14} />}
        </button>
      </div>

      {/* 底部的对话输入 / Bottom Input Area */}
      {showBottom && (
        <div className="flex-none p-1  relative cursor-auto">
          <PromptInput onSubmit={handleMessageSubmit} className="mt-1">
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
          maxInputTokens={currentModel?.maxInputTokens ?? 0}
        />
      )}
    </div>
  );
}
