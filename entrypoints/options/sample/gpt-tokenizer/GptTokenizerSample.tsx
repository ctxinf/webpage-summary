import { Calculator, Hash, Scissors, List } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  countInputTokensWithTiming,
  truncateByTokensWithTiming,
  splitTokensWithTiming,
  INPUT_TOKEN_COUNT_MODEL,
  type InputTokenCountTiming,
  type TruncateByTokensResult,
  type SplitTokensResult,
} from '@/lib/token-count';

function formatMs(value: number) {
  return `${value.toFixed(2)} ms`;
}

function TokenCountSection() {
  const [input, setInput] = useState('');
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const [timing, setTiming] = useState<InputTokenCountTiming | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  async function calculateTokens(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsCalculating(true);
    try {
      const result = await countInputTokensWithTiming(input);
      setTokenCount(result.tokenCount);
      setTiming(result.timing);
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <section className="grid gap-4 rounded-lg border bg-background p-[18px]">
      <header className="grid grid-cols-[32px_1fr] gap-3">
        <Hash className="mt-px text-primary" size={20} />
        <div>
          <h2 className="text-[16px] font-semibold">GPT Tokenizer Count</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
            Model: {INPUT_TOKEN_COUNT_MODEL}
          </p>
        </div>
      </header>

      <form className="grid gap-3" onSubmit={calculateTokens}>
        <label className="grid gap-1.5 text-[13px] font-medium">
          Input
          <textarea
            className="min-h-[120px] resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal leading-6 outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={input}
            placeholder="Paste text here..."
            onChange={(event) => setInput(event.target.value)}
          />
        </label>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid gap-1 text-[13px] text-muted-foreground">
            {tokenCount === null ? 'Token count not calculated' : null}
            {tokenCount !== null ? (
              <span>
                Tokens: <strong className="text-foreground">{tokenCount}</strong>
              </span>
            ) : null}
            {timing ? (
              <span>
                加载时间: {formatMs(timing.loadMs)} / 计算时间:{' '}
                {formatMs(timing.calculateMs)}
              </span>
            ) : null}
          </div>

          <Button type="submit" disabled={isCalculating}>
            <Calculator />
            {isCalculating ? '计算中' : '计算'}
          </Button>
        </div>
      </form>
    </section>
  );
}

function TokenTruncateSection() {
  const [input, setInput] = useState('');
  const [maxTokens, setMaxTokens] = useState<number>(100);
  const [result, setResult] = useState<TruncateByTokensResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  async function calculateTruncate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsCalculating(true);
    try {
      const res = await truncateByTokensWithTiming(input, maxTokens);
      setResult(res);
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <section className="grid gap-4 rounded-lg border bg-background p-[18px]">
      <header className="grid grid-cols-[32px_1fr] gap-3">
        <Scissors className="mt-px text-primary" size={20} />
        <div>
          <h2 className="text-[16px] font-semibold">GPT Tokenizer Truncate</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
            Model: {INPUT_TOKEN_COUNT_MODEL}
          </p>
        </div>
      </header>

      <form className="grid gap-3" onSubmit={calculateTruncate}>
        <div className="grid grid-cols-[1fr] gap-3">
          <label className="grid gap-1.5 text-[13px] font-medium">
            Max Tokens Count
            <input
              type="number"
              className="rounded-md border bg-background px-3 py-2 text-sm font-normal outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={maxTokens}
              onChange={(event) => setMaxTokens(parseInt(event.target.value) || 0)}
              min={1}
            />
          </label>
        </div>
        
        <label className="grid gap-1.5 text-[13px] font-medium">
          Input
          <textarea
            className="min-h-[120px] resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal leading-6 outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={input}
            placeholder="Paste text here..."
            onChange={(event) => setInput(event.target.value)}
          />
        </label>

        {result && (
          <label className="grid gap-1.5 text-[13px] font-medium">
            Truncated Output
            <textarea
              className="min-h-[120px] resize-y rounded-md border bg-muted px-3 py-2 text-sm font-normal leading-6 outline-none"
              value={result.truncatedText}
              readOnly
            />
          </label>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid gap-1 text-[13px] text-muted-foreground">
            {result === null ? 'Not truncated yet' : null}
            {result !== null ? (
              <span>
                Original Tokens: <strong className="text-foreground">{result.originalTokenCount}</strong> / 
                Truncated Tokens: <strong className="text-foreground">{result.truncatedTokenCount}</strong>
              </span>
            ) : null}
            {result?.timing ? (
              <span>
                加载时间: {formatMs(result.timing.loadMs)} / 计算时间:{' '}
                {formatMs(result.timing.calculateMs)}
              </span>
            ) : null}
          </div>

          <Button type="submit" disabled={isCalculating}>
            <Scissors />
            {isCalculating ? '截断中' : '截断'}
          </Button>
        </div>
      </form>
    </section>
  );
}

function TokenSplitSection() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<SplitTokensResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  async function calculateSplit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsCalculating(true);
    try {
      const res = await splitTokensWithTiming(input);
      setResult(res);
    } finally {
      setIsCalculating(false);
    }
  }

  return (
    <section className="grid gap-4 rounded-lg border bg-background p-[18px]">
      <header className="grid grid-cols-[32px_1fr] gap-3">
        <List className="mt-px text-primary" size={20} />
        <div>
          <h2 className="text-[16px] font-semibold">GPT Tokenizer Split</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
            Model: {INPUT_TOKEN_COUNT_MODEL}
          </p>
        </div>
      </header>

      <form className="grid gap-3" onSubmit={calculateSplit}>
        <label className="grid gap-1.5 text-[13px] font-medium">
          Input
          <textarea
            className="min-h-[120px] resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal leading-6 outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={input}
            placeholder="Paste text here..."
            onChange={(event) => setInput(event.target.value)}
          />
        </label>

        {result && (
          <label className="grid gap-1.5 text-[13px] font-medium">
            Pieces Output
            <div className="max-h-[300px] overflow-y-auto rounded-md border bg-muted p-3 text-sm">
              {result.pieces.map((piece, index) => (
                <div key={index} className="mb-1 flex gap-2">
                  <span className="inline-block w-20 text-muted-foreground">[{piece.id}]</span>
                  <span className="whitespace-pre-wrap font-mono">{piece.text}</span>
                </div>
              ))}
            </div>
          </label>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="grid gap-1 text-[13px] text-muted-foreground">
            {result === null ? 'Not split yet' : null}
            {result !== null ? (
              <span>
                Total Pieces: <strong className="text-foreground">{result.pieces.length}</strong>
              </span>
            ) : null}
            {result?.timing ? (
              <span>
                加载时间: {formatMs(result.timing.loadMs)} / 计算时间:{' '}
                {formatMs(result.timing.calculateMs)}
              </span>
            ) : null}
          </div>

          <Button type="submit" disabled={isCalculating}>
            <List />
            {isCalculating ? '拆分中' : '拆分'}
          </Button>
        </div>
      </form>
    </section>
  );
}

export function GptTokenizerSample() {
  return (
    <div className="grid gap-[18px]">
      <TokenCountSection />
      <TokenTruncateSection />
      <TokenSplitSection />
    </div>
  );
}
