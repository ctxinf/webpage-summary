export const INPUT_TOKEN_COUNT_MODEL = 'gpt-5';

import { sendMessage } from '@/lib/messaging';

export async function truncateByTokens(text: string, maxTokens: number): Promise<string> {
  return sendMessage('truncateByTokens', { text, maxTokens });
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
  return sendMessage('countInputTokens', { text: input });
}

export async function countInputTokensWithTiming(
  input: string,
): Promise<InputTokenCountResult> {
  return sendMessage('countInputTokensWithTiming', { text: input });
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
  return sendMessage('truncateByTokensWithTiming', { text: input, maxTokens });
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
  return sendMessage('splitTokensWithTiming', { text: input });
}
