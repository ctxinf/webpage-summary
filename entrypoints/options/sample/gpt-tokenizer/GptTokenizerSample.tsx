import { Calculator, Hash } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  countInputTokensWithTiming,
  INPUT_TOKEN_COUNT_MODEL,
  type InputTokenCountTiming,
} from '@/lib/token-count';

function formatMs(value: number) {
  return `${value.toFixed(2)} ms`;
}

export function GptTokenizerSample() {
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
          <h2 className="text-[16px] font-semibold">GPT Tokenizer</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
            Model: {INPUT_TOKEN_COUNT_MODEL}
          </p>
        </div>
      </header>

      <form className="grid gap-3" onSubmit={calculateTokens}>
        <label className="grid gap-1.5 text-[13px] font-medium">
          Input
          <textarea
            className="min-h-[180px] resize-y rounded-md border bg-background px-3 py-2 text-sm font-normal leading-6 outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
