import type { UIMessage } from 'ai';
import {
  FileText,
  MessageSquareText,
  RefreshCcw,
  RotateCcw,
  Square,
  X,
} from 'lucide-react';
import type { ReactNode } from 'react';
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Button } from '@/components/ui/button';
import type { SummaryChatController } from '@/hooks/useSummaryChatController';
import { cn } from '@/lib/utils';

type SummaryChatPanelProps = {
  className?: string;
  controller: SummaryChatController;
  hideChatInput?: boolean;
  onClose?: () => void;
  runtimeNotice?: ReactNode;
  title: string;
  variant?: 'floating' | 'popup' | 'sidebar';
};

export function SummaryChatPanel({
  className,
  controller,
  hideChatInput = false,
  onClose,
  runtimeNotice,
  title,
  variant = 'floating',
}: SummaryChatPanelProps) {
  const errorMessage = controller.actionError ?? controller.error?.message;
  const compact = variant === 'popup';

  async function handleSubmit(message: PromptInputMessage) {
    controller.setDraft(message.text);
    await controller.sendDraft();
  }

  return (
    <section
      aria-label={title}
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-md border border-zinc-200 bg-white text-zinc-950 shadow-[0_18px_48px_rgba(24,24,27,0.18)]',
        compact ? 'h-full' : 'h-[min(720px,calc(100vh-32px))]',
        className,
      )}
    >
      <header className="grid gap-3 border-b border-zinc-200 px-3 py-3">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-zinc-900 text-white">
              <FileText size={16} />
            </span>
            <div className="min-w-0">
              <h2 className="m-0 truncate text-sm font-semibold leading-5">
                {title}
              </h2>
              <p className="m-0 truncate text-xs text-zinc-500">
                {controller.selectedModel?.name ?? 'No model'} /{' '}
                {controller.selectedPrompt?.name ?? 'No prompt'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button
              aria-label="Reset conversation"
              className="size-8"
              onClick={controller.reset}
              size="icon"
              title="Reset conversation"
              type="button"
              variant="ghost"
            >
              <RotateCcw size={15} />
            </Button>
            {onClose ? (
              <Button
                aria-label="Close panel"
                className="size-8"
                onClick={onClose}
                size="icon"
                title="Close panel"
                type="button"
                variant="ghost"
              >
                <X size={15} />
              </Button>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            'grid gap-2',
            compact ? 'grid-cols-1' : 'grid-cols-[minmax(0,1fr)_minmax(0,1fr)]',
          )}
        >
          <label className="grid gap-1 text-xs font-medium text-zinc-600">
            Model
            <select
              className="h-8 min-w-0 rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-950 outline-none focus:border-zinc-900"
              disabled={controller.isBusy || controller.models.length === 0}
              onChange={(event) =>
                controller.setSelectedModelId(event.currentTarget.value)
              }
              value={controller.selectedModelId ?? ''}
            >
              {controller.models.length ? null : (
                <option value="">No model configs</option>
              )}
              {controller.models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs font-medium text-zinc-600">
            Prompt
            <select
              className="h-8 min-w-0 rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-950 outline-none focus:border-zinc-900"
              disabled={controller.isBusy || controller.prompts.length === 0}
              onChange={(event) =>
                controller.setSelectedPromptId(event.currentTarget.value)
              }
              value={controller.selectedPromptId ?? ''}
            >
              {controller.prompts.length ? null : (
                <option value="">No prompt templates</option>
              )}
              {controller.prompts.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {runtimeNotice ? (
          <div className="border-l-2 border-zinc-300 bg-zinc-50 px-3 py-2 text-xs leading-5 text-zinc-600">
            {runtimeNotice}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            disabled={!controller.isReady}
            onClick={() => void controller.beginSummary()}
            size={compact ? 'sm' : 'default'}
            type="button"
          >
            <RefreshCcw size={15} />
            {controller.messages.length ? 'Resummarize' : 'Start summary'}
          </Button>
          <Button
            disabled={!controller.isBusy}
            onClick={controller.stop}
            size={compact ? 'sm' : 'default'}
            type="button"
            variant="outline"
          >
            <Square size={15} />
            Stop
          </Button>
          <span className="text-xs font-medium text-zinc-500">
            {controller.status}
          </span>
        </div>
      </header>

      {controller.loadError || errorMessage ? (
        <div className="border-b border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800">
          {controller.loadError ?? errorMessage}
        </div>
      ) : null}

      <Conversation className="min-h-0 flex-1 px-3 py-3">
        <ConversationContent
          className="h-full"
          data-summary-conversation
        >
          {controller.messages.length ? (
            controller.messages.map((message, index) => (
              <Message from={message.role} key={message.id}>
                <MessageContent>
                  <MessageParts
                    isLastMessage={index === controller.messages.length - 1}
                    isStreaming={controller.status === 'streaming'}
                    message={message}
                  />
                </MessageContent>
              </Message>
            ))
          ) : (
            <ConversationEmptyState
              description="Choose a model and prompt, then start a page summary."
              icon={<MessageSquareText className="size-8" />}
              title="No summary yet"
            />
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {!hideChatInput ? (
        <div className="border-t border-zinc-200 p-3">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                disabled={!controller.selectedModel || !controller.selectedPrompt}
                onChange={(event) =>
                  controller.setDraft(event.currentTarget.value)
                }
                placeholder="Ask about this page..."
                value={controller.draft}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <span className="text-xs font-medium text-zinc-500">
                  Enter to send
                </span>
              </PromptInputTools>
              <PromptInputSubmit
                disabled={!controller.canSend}
                onStop={controller.stop}
                status={controller.status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      ) : null}
    </section>
  );
}

function MessageParts({
  isLastMessage,
  isStreaming,
  message,
}: {
  isLastMessage: boolean;
  isStreaming: boolean;
  message: UIMessage;
}) {
  const reasoningParts = message.parts.filter(
    (part) => part.type === 'reasoning',
  );
  const reasoningText = reasoningParts.map((part) => part.text).join('\n\n');
  const lastPart = message.parts.at(-1);
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === 'reasoning';

  return (
    <div className="grid gap-2">
      {reasoningText ? (
        <Reasoning isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      ) : null}

      {message.parts.map((part, index) => {
        if (part.type !== 'text') return null;

        return (
          <MessageResponse key={`${message.id}-text-${index}`}>
            {part.text}
          </MessageResponse>
        );
      })}
    </div>
  );
}
