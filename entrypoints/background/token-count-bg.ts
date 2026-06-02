import { onMessage } from '@/lib/messaging';

import { createLogger } from '@/lib/logger';

const logger = createLogger('background:token-count-bg');

export const INPUT_TOKEN_COUNT_MODEL = 'gpt-5';

type Gpt5Tokenizer = typeof import('gpt-tokenizer/model/gpt-5');

let tokenizerPromise: Promise<Gpt5Tokenizer> | null = null;

function nowMs() {
  return globalThis.performance?.now() ?? Date.now();
}

function loadTokenizer() {
  tokenizerPromise ??= import('gpt-tokenizer/model/gpt-5');
  return tokenizerPromise;
}

export async function truncateByTokens(text: string, maxTokens: number): Promise<string> {
  const tokenizer = await loadTokenizer();
  const tokens = tokenizer.encode(text);
  const originalLength = text.length;
  const originalTokens = tokens.length;

  if (originalTokens <= maxTokens) {
    logger.info(`[TokenCount] No truncation needed: String length ${originalLength}, Tokens ${originalTokens}`);
    return text;
  }

  const truncatedText = tokenizer.decode(tokens.slice(0, maxTokens));
  const truncatedLength = truncatedText.length;

  logger.info(`[TokenCount] Truncated: String length ${originalLength} -> ${truncatedLength}, Tokens ${originalTokens} -> ${maxTokens}`);

  return truncatedText;
}

export type InputTokenCountTiming = {
  calculateMs: number;
  loadMs: number;
};

export type InputTokenCountResult = {
  model: typeof INPUT_TOKEN_COUNT_MODEL;
  tokenCount: number;
  timing: InputTokenCountTiming;
};

export async function countInputTokens(input: string): Promise<number> {
  const tokenizer = await loadTokenizer();
  return tokenizer.countTokens(input);
}

export async function countInputTokensWithTiming(
  input: string,
): Promise<InputTokenCountResult> {
  const loadStart = nowMs();
  const tokenizer = await loadTokenizer();
  const loadMs = nowMs() - loadStart;

  const calculateStart = nowMs();
  const tokenCount = tokenizer.countTokens(input);
  const calculateMs = nowMs() - calculateStart;

  return {
    model: INPUT_TOKEN_COUNT_MODEL,
    tokenCount,
    timing: {
      calculateMs,
      loadMs,
    },
  };
}

export type TruncateByTokensResult = {
  model: typeof INPUT_TOKEN_COUNT_MODEL;
  truncatedText: string;
  originalTokenCount: number;
  truncatedTokenCount: number;
  timing: InputTokenCountTiming;
};

export async function truncateByTokensWithTiming(
  input: string,
  maxTokens: number,
): Promise<TruncateByTokensResult> {
  const loadStart = nowMs();
  const tokenizer = await loadTokenizer();
  const loadMs = nowMs() - loadStart;

  const calculateStart = nowMs();
  const tokens = tokenizer.encode(input);
  const originalTokenCount = tokens.length;
  let truncatedText = input;
  let truncatedTokenCount = originalTokenCount;

  if (tokens.length > maxTokens) {
    const slicedTokens = tokens.slice(0, maxTokens);
    truncatedText = tokenizer.decode(slicedTokens);
    truncatedTokenCount = maxTokens;
  }
  const calculateMs = nowMs() - calculateStart;

  return {
    model: INPUT_TOKEN_COUNT_MODEL,
    truncatedText,
    originalTokenCount,
    truncatedTokenCount,
    timing: {
      calculateMs,
      loadMs,
    },
  };
}

export type TokenPiece = {
  id: number;
  text: string;
};

export type SplitTokensResult = {
  model: typeof INPUT_TOKEN_COUNT_MODEL;
  pieces: TokenPiece[];
  timing: InputTokenCountTiming;
};

export async function splitTokensWithTiming(
  input: string,
): Promise<SplitTokensResult> {
  const loadStart = nowMs();
  const tokenizer = await loadTokenizer();
  const loadMs = nowMs() - loadStart;

  const calculateStart = nowMs();
  const ids = tokenizer.encode(input);
  const pieces = ids.map((id) => ({
    id,
    text: tokenizer.decode([id]),
  }));
  const calculateMs = nowMs() - calculateStart;

  return {
    model: INPUT_TOKEN_COUNT_MODEL,
    pieces,
    timing: {
      calculateMs,
      loadMs,
    },
  };
}

export function registerTokenCountMessages() {
  onMessage('countInputTokens', async (msg) => countInputTokens(msg.data.text));
  onMessage('countInputTokensWithTiming', async (msg) => countInputTokensWithTiming(msg.data.text));
  onMessage('truncateByTokens', async (msg) => truncateByTokens(msg.data.text, msg.data.maxTokens));
  onMessage('truncateByTokensWithTiming', async (msg) => truncateByTokensWithTiming(msg.data.text, msg.data.maxTokens));
  onMessage('splitTokensWithTiming', async (msg) => splitTokensWithTiming(msg.data.text));
}
