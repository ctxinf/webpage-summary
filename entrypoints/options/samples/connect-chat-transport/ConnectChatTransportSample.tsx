import { useChat } from '@ai-sdk/react';
import { Square } from 'lucide-react';
import { FormEvent, useRef, useState } from 'react';
import type { UIMessage } from 'ai';
import { Button } from '@/components/ui/button';
import { ConnectChatTransport } from './ConnectChatTransport';

export function ConnectChatTransportSample() {
  const [apiKey, setApiKey] = useState('');
  const [input, setInput] = useState('');
  const apiKeyRef = useRef(apiKey);
  apiKeyRef.current = apiKey;

  const transportRef = useRef<ConnectChatTransport | null>(null);

  if (!transportRef.current) {
    transportRef.current = new ConnectChatTransport({
      getApiKey: () => apiKeyRef.current,
    });
  }

  const { error, messages, sendMessage, status, stop } = useChat({
    transport: transportRef.current,
  });

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text || !apiKey.trim() || status !== 'ready') {
      return;
    }

    setInput('');
    await sendMessage({ text });
  }

  return (
    <section className="grid gap-4 rounded-lg border bg-background p-[18px]">
      <header className="grid gap-1">
        <h2 className="text-[16px] font-semibold">Connect Chat Transport</h2>
        <p className="text-[13px] leading-6 text-muted-foreground">
          AI SDK useChat over browser.runtime.connect
        </p>
      </header>

      <input
        className="h-9 rounded-md border bg-background px-3 text-sm"
        value={apiKey}
        placeholder="DashScope API Key"
        onChange={(event) => setApiKey(event.target.value)}
      />

      <div className="grid min-h-[180px] gap-3 rounded-md border bg-muted/40 p-3">
        {messages.length ? (
          messages.map((message) => (
            <article
              key={message.id}
              className="grid gap-1 rounded-md border bg-background p-3 text-sm"
            >
              <p className="text-[12px] font-medium uppercase text-muted-foreground">
                {message.role}
              </p>
              <MessageParts message={message} />
            </article>
          ))
        ) : (
          <p className="self-center text-[13px] text-muted-foreground">
            No messages yet.
          </p>
        )}
      </div>

      {error ? (
        <p className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-[13px] text-destructive">
          {error.message}
        </p>
      ) : null}

      <form className="grid gap-3" onSubmit={submitMessage}>
        <textarea
          className="min-h-[84px] resize-y rounded-md border bg-background px-3 py-2 text-sm"
          value={input}
          placeholder="Message"
          onChange={(event) => setInput(event.target.value)}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="submit"
            disabled={!apiKey.trim() || !input.trim() || status !== 'ready'}
          >
            Send
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={status !== 'submitted' && status !== 'streaming'}
            onClick={() => void stop()}
            title="Stop"
          >
            <Square />
            Stop
          </Button>
          <span className="text-[13px] text-muted-foreground">{status}</span>
        </div>
      </form>
    </section>
  );
}

function MessageParts({ message }: { message: UIMessage }) {
  return (
    <div className="grid gap-2">
      {message.parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <p
              className="whitespace-pre-wrap break-words leading-6"
              key={`${message.id}-text-${index}`}
            >
              {part.text}
            </p>
          );
        }

        if (part.type === 'reasoning') {
          return (
            <details
              className="group rounded-md border bg-muted/30 text-[13px] text-muted-foreground"
              key={`${message.id}-reasoning-${index}`}
              open={part.state === 'streaming' || undefined}
            >
              <summary className="cursor-pointer select-none px-3 py-2 font-medium text-foreground">
                Reasoning
                {part.state === 'streaming' ? (
                  <span className="ml-2 font-normal text-muted-foreground">
                    streaming
                  </span>
                ) : null}
              </summary>
              <p className="whitespace-pre-wrap break-words border-t px-3 py-2 leading-6">
                {part.text}
              </p>
            </details>
          );
        }

        return null;
      })}
    </div>
  );
}
