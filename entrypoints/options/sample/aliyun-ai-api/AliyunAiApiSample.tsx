import { Bot, Eye, EyeOff, Loader2, Play, RotateCcw } from 'lucide-react';
import { FormEvent, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ALIYUN_AI_API_SAMPLE } from './config';
import { requestAliyunChat, type AliyunChatResult } from './request';

type EndpointOption = {
  label: string;
  value: string;
};

const endpointOptions: EndpointOption[] = [
  {
    label: '中国大陆（北京）',
    value: ALIYUN_AI_API_SAMPLE.endpoint,
  },
  {
    label: '国际（新加坡）',
    value: ALIYUN_AI_API_SAMPLE.intlEndpoint,
  },
];

export function AliyunAiApiSample() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [endpoint, setEndpoint] = useState<string>(
    ALIYUN_AI_API_SAMPLE.endpoint,
  );
  const [model, setModel] = useState<string>(ALIYUN_AI_API_SAMPLE.model);
  const [prompt, setPrompt] = useState<string>(
    ALIYUN_AI_API_SAMPLE.defaultPrompt,
  );
  const [result, setResult] = useState<AliyunChatResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(
    () => apiKey.trim().length > 0 && prompt.trim().length > 0 && !isLoading,
    [apiKey, prompt, isLoading],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await requestAliyunChat({
        apiKey: apiKey.trim(),
        endpoint,
        model: model.trim(),
        prompt: prompt.trim(),
      });

      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : '请求失败',
      );
    } finally {
      setIsLoading(false);
    }
  }

  function resetRequestFields() {
    setApiKey('');
    setShowApiKey(false);
    setEndpoint(ALIYUN_AI_API_SAMPLE.endpoint);
    setModel(ALIYUN_AI_API_SAMPLE.model);
    setPrompt(ALIYUN_AI_API_SAMPLE.defaultPrompt);
    setResult(null);
    setError('');
  }

  return (
    <section className="grid gap-4 rounded-lg border bg-background p-[18px]">
      <header className="grid grid-cols-[32px_1fr] gap-3">
        <Bot className="mt-px text-primary" size={20} />
        <div>
          <h2 className="text-[16px] font-semibold">阿里云 AI API 直连</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
            API Key 仅保存在当前页面状态中，刷新或关闭页面后丢失。
          </p>
        </div>
      </header>

      <form className="grid gap-3" onSubmit={submit}>
        <label className="grid gap-1.5 text-[13px] font-medium">
          API Key
          <div className="grid grid-cols-[1fr_36px] gap-2">
            <input
              className="h-9 rounded-md border bg-background px-3 text-sm font-normal outline-none focus-visible:ring-1 focus-visible:ring-ring"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              autoComplete="off"
              placeholder="sk-..."
              onChange={(event) => setApiKey(event.target.value)}
            />
            <Button
              aria-label={showApiKey ? '隐藏 API Key' : '显示 API Key'}
              title={showApiKey ? '隐藏 API Key' : '显示 API Key'}
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setShowApiKey((current) => !current)}
            >
              {showApiKey ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </label>

        <div className="grid grid-cols-[1fr_180px] gap-3 max-sm:grid-cols-1">
          <label className="grid gap-1.5 text-[13px] font-medium">
            Endpoint
            <select
              className="h-9 rounded-md border bg-background px-3 text-sm font-normal outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={endpoint}
              onChange={(event) => setEndpoint(event.target.value)}
            >
              {endpointOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 text-[13px] font-medium">
            Model
            <input
              className="h-9 rounded-md border bg-background px-3 text-sm font-normal outline-none focus-visible:ring-1 focus-visible:ring-ring"
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
            />
          </label>
        </div>

        <label className="grid gap-1.5 text-[13px] font-medium">
          Prompt
          <textarea
            className="min-h-[112px] resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal leading-6 outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={resetRequestFields}>
            <RotateCcw />
            重置
          </Button>
          <Button type="submit" disabled={!canSubmit}>
            {isLoading ? <Loader2 className="animate-spin" /> : <Play />}
            发送请求
          </Button>
        </div>
      </form>

      {error ? (
        <div
          className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-[13px] leading-6 text-destructive"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="grid gap-3 rounded-md bg-muted p-3">
          <div className="whitespace-pre-wrap text-[13px] leading-6">
            {result.content}
          </div>
          {result.usage ? (
            <dl className="grid grid-cols-3 gap-2 text-[12px] max-sm:grid-cols-1">
              <div className="rounded-md bg-background p-2">
                <dt className="text-muted-foreground">Prompt</dt>
                <dd className="mt-1 font-semibold">
                  {result.usage.prompt_tokens ?? '-'}
                </dd>
              </div>
              <div className="rounded-md bg-background p-2">
                <dt className="text-muted-foreground">Completion</dt>
                <dd className="mt-1 font-semibold">
                  {result.usage.completion_tokens ?? '-'}
                </dd>
              </div>
              <div className="rounded-md bg-background p-2">
                <dt className="text-muted-foreground">Total</dt>
                <dd className="mt-1 font-semibold">
                  {result.usage.total_tokens ?? '-'}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
