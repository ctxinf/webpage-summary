import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import { Bot, Send, Square } from 'lucide-react';
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import type { ModelConfigItem } from '@/constants/model-settings';
import type { PromptConfigItem } from '@/constants/prompt-settings';
import { AiSdkConnectTransport } from '@/lib/ai-sdk-connect-transport';
import { getDefaultModelConfig } from '@/lib/model-settings-storage';
import {
  loadPromptSettings,
  seedDefaultPromptIfNeeded,
} from '@/lib/prompt-settings-storage';

type LoadedConfig = {
  model: ModelConfigItem | null;
  prompt: PromptConfigItem | null;
};

export function ContentAiDialogSample() {
  const [config, setConfig] = useState<LoadedConfig | null>(null);
  const [input, setInput] = useState(
    '请用一句话确认 content dialog 已经连到 background AI。',
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const modelConfigIdRef = useRef<string | null>(null);

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
    let active = true;

    async function loadConfig() {
      try {
        await seedDefaultPromptIfNeeded();

        const [promptSettings, model] = await Promise.all([
          loadPromptSettings(),
          getDefaultModelConfig(),
        ]);

        if (!active) return;

        const prompt =
          promptSettings.prompts.find(
            (item) => item.id === promptSettings.defaultPromptId,
          ) ??
          promptSettings.prompts[0] ??
          null;

        modelConfigIdRef.current = model?.id ?? null;
        setConfig({ model, prompt });

        if (prompt) {
          setMessages([toSystemMessage(prompt)]);
        }
      } catch (loadConfigError) {
        if (!active) return;

        setLoadError(
          loadConfigError instanceof Error
            ? loadConfigError.message
            : 'AI dialog sample config failed to load.',
        );
      }
    }

    loadConfig();

    return () => {
      active = false;
    };
  }, []);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();

    if (!text || !config?.model || !config.prompt || status !== 'ready') {
      return;
    }

    setInput('');
    await sendMessage({ text });
  }

  const canSend =
    Boolean(input.trim() && config?.model && config.prompt) && status === 'ready';

  return (
    <div className="grid gap-3">
      <div className="flex items-start gap-[10px]">
        <Bot className="mt-[3px] shrink-0" size={16} />
        <div className="min-w-0">
          <h3 className="m-0 mt-px text-[15px] font-semibold leading-tight text-zinc-950">
            Content AI Dialog
          </h3>
          <p className="m-0 break-words text-zinc-600">
            dialog - bridge - background AI fetch
          </p>
        </div>
      </div>

      {loadError ? (
        <p className="m-0 rounded-md border border-red-300 bg-red-50 px-[10px] py-2 text-red-800">
          {loadError}
        </p>
      ) : null}

      <dl className="m-0 grid grid-cols-2 gap-2">
        <ConfigStat label="Model" value={config?.model?.name ?? 'Not set'} />
        <ConfigStat label="Prompt" value={config?.prompt?.name ?? 'Not set'} />
      </dl>

      {error ? (
        <p className="m-0 rounded-md border border-red-300 bg-red-50 px-[10px] py-2 text-red-800">
          {error.message}
        </p>
      ) : null}

      <div className="grid min-h-[180px] gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-[10px]">
        {messages.length ? (
          messages.map((message) => (
            <article
              className="grid gap-1 rounded-md border border-zinc-200 bg-white p-[10px]"
              key={message.id}
            >
              <p className="m-0 text-[12px] font-semibold uppercase text-zinc-500">
                {message.role}
              </p>
              <MessageParts message={message} />
            </article>
          ))
        ) : (
          <p className="m-0 self-center text-zinc-600">
            No dialog messages yet.
          </p>
        )}
      </div>

      <form className="grid gap-2" onSubmit={submitMessage}>
        <textarea
          className="min-h-[76px] resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-[13px] text-zinc-950 outline-none focus:border-zinc-900"
          onChange={(event) => setInput(event.currentTarget.value)}
          placeholder="Message"
          value={input}
        />
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="inline-flex min-h-[34px] items-center justify-center gap-[7px] rounded-md border border-zinc-900 bg-zinc-900 px-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSend}
            type="submit"
          >
            <Send size={15} />
            Send
          </button>
          <button
            className="inline-flex min-h-[34px] items-center justify-center gap-[7px] rounded-md border border-zinc-300 bg-white px-[11px] font-semibold text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={status !== 'submitted' && status !== 'streaming'}
            onClick={() => void stop()}
            type="button"
          >
            <Square size={15} />
            Stop
          </button>
          <span className="text-zinc-600">{status}</span>
        </div>
      </form>
    </div>
  );
}

function ConfigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-zinc-200 bg-zinc-50 p-2">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="m-0 mt-0.5 truncate font-semibold text-zinc-950">
        {value}
      </dd>
    </div>
  );
}

function MessageParts({ message }: { message: UIMessage }) {
  return (
    <div className="grid gap-2">
      {message.parts.map((part, index) => {
        if (part.type === 'text') {
          return (
            <p
              className="m-0 whitespace-pre-wrap break-words leading-6 text-zinc-800"
              key={`${message.id}-text-${index}`}
            >
              {part.text}
            </p>
          );
        }

        if (part.type === 'reasoning') {
          return (
            <details
              className="rounded-md border border-zinc-200 bg-zinc-50 text-zinc-600"
              key={`${message.id}-reasoning-${index}`}
              open={part.state === 'streaming' || undefined}
            >
              <summary className="cursor-pointer select-none px-3 py-2 font-medium text-zinc-950">
                Reasoning
              </summary>
              <p className="m-0 whitespace-pre-wrap break-words border-t border-zinc-200 px-3 py-2 leading-6">
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

function toSystemMessage(prompt: PromptConfigItem): UIMessage {
  return {
    id: `system-${prompt.id}`,
    parts: [
      {
        text: prompt.systemMessage,
        type: 'text',
      },
    ],
    role: 'system',
  };
}
