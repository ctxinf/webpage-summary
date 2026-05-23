import { createAnthropic } from '@ai-sdk/anthropic';
import { createBrowserAI } from '@browser-ai/core';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { createOpenResponses } from '@ai-sdk/open-responses';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createOllama } from 'ollama-ai-provider';
import type { LanguageModel } from 'ai';
import type { ModelConfigItem } from '@/constants/model-settings';

type ProviderSettings = {
  apiKey?: string;
  baseURL?: string;
  fetch?: typeof fetch;
  headers?: Record<string, string>;
  name?: string;
};

export function createLanguageModelFromConfig(
  config: ModelConfigItem,
): LanguageModel {
  const settings = createProviderSettings(config);

  switch (config.providerId) {
    case 'openai': {
      if (config.apiMode === 'responses') {
        return createOpenAI(settings).responses(config.modelId);
      }

      return createOpenAI(settings).chat(config.modelId);
    }
    case 'open-responses':
      return createOpenResponses({
        apiKey: config.apiKey || undefined,
        fetch: settings.fetch,
        headers: config.headers,
        name: config.name || 'open-responses',
        url: config.baseURL,
      })(config.modelId);
    case 'openai-compatible': {
      return createOpenAICompatible({
        ...settings,
        baseURL: config.baseURL,
        name: config.name || 'openai-compatible',
      })(config.modelId);
    }
    case 'anthropic':
      return createAnthropic(settings).languageModel(config.modelId);
    case 'google':
      return createGoogleGenerativeAI(settings).languageModel(config.modelId);
    case 'openrouter':
      return createOpenRouter({
        ...settings,
        extraBody: config.extraBody,
      }).languageModel(config.modelId);
    case 'ollama':
      return createOllama(settings).languageModel(config.modelId) as unknown as LanguageModel;
    case 'browser-ai':
      return createBrowserAI().languageModel(config.modelId as 'text');
    default:
      throw new Error('Unsupported provider.');
  }
}

function createProviderSettings(config: ModelConfigItem): ProviderSettings {
  return {
    apiKey: config.apiKey || undefined,
    baseURL: config.baseURL || undefined,
    fetch: createFetchWithExtraBody(config.extraBody),
    headers: config.headers,
    name: config.providerId,
  };
}

function createFetchWithExtraBody(extraBody: Record<string, unknown>) {
  if (Object.keys(extraBody).length === 0) {
    return undefined;
  }

  return (input: RequestInfo | URL, init?: RequestInit) => {
    const body = init?.body;

    if (typeof body !== 'string') {
      return fetch(input, init);
    }

    try {
      const parsedBody = JSON.parse(body) as unknown;

      if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
        return fetch(input, init);
      }

      return fetch(input, {
        ...init,
        body: JSON.stringify({
          ...parsedBody,
          ...extraBody,
        }),
      });
    } catch {
      return fetch(input, init);
    }
  };
}
