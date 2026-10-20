import { useEffect, useState } from 'react';
import type { UIMessage } from 'ai';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { MessageAction, MessageActions } from '@/components/ai-elements/message';
import { getUiMessages } from '@/lib/i18n';

export function ChatMessageActions({ message, isBusy, onRetry }: {
  message: UIMessage;
  isBusy: boolean;
  onRetry: (messageId: string) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const text = message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('\n\n');

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      toast.error(getUiMessages().popup.copyFailed);
    }
  };

  return (
    <MessageActions
      className={message.role === 'user'
        ? 'justify-end invisible group-hover:visible group-focus-within:visible'
        : undefined}
    >
      <MessageAction
        tooltip={copied ? 'Copied' : 'Copy message'}
        className="size-7 p-0 text-muted-foreground"
        disabled={!text}
        onClick={() => void copy()}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </MessageAction>
      {message.role === 'assistant' && (
        <MessageAction
          tooltip="Retry from this message (replaces later messages)"
          className="size-7 p-0 text-muted-foreground"
          disabled={isBusy}
          onClick={() => void onRetry(message.id)}
        >
          <RefreshCw size={14} />
        </MessageAction>
      )}
    </MessageActions>
  );
}
