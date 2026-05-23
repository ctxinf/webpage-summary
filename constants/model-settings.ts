import type { StorageItemKey } from '#imports';

export const MODEL_CONFIGS_V2_STORAGE_KEY: StorageItemKey =
  'local:react-model-configs-v2';
export const DEFAULT_MODEL_ID_V2_STORAGE_KEY: StorageItemKey =
  'local:react-default-model-id-v2';

export const MODEL_API_MODES = ['chat', 'responses'] as const;
export type ModelApiMode = (typeof MODEL_API_MODES)[number];

export const MODEL_PROVIDER_DEFINITIONS = [
  {
    baseURLPresets: [
      { label: 'OpenAI', url: 'https://api.openai.com/v1' },
    ],
    defaultBaseURL: 'https://api.openai.com/v1',
    defaultModelId: 'gpt-4.1-mini',
    desc: 'Official OpenAI provider. Supports Chat Completions and OpenAI Responses through the AI SDK OpenAI package.',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/openai',
    iconPath: '/llm-icons/openai.svg',
    id: 'openai',
    label: 'OpenAI',
    modelsPath: '/models',
    requiresApiKey: true,
    supportsApiMode: true,
    supportsBaseURL: true,
    supportsModelFetch: true,
  },

  {
    baseURLPresets: [
      {
        label: 'DashScope',
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      },
      {
        label: 'DashScope Intl',
        url: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
      },
      { label: 'SiliconFlow', url: 'https://api.siliconflow.cn/v1' },
      { label: 'LM Studio', url: 'http://localhost:1234/v1' },
      { label: 'Ollama OpenAI', url: 'http://localhost:11434/v1' },
    ],
    defaultBaseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModelId: 'qwen-plus',
    desc: 'Generic OpenAI-compatible Chat Completions provider for compatible /v1 APIs such as DashScope, SiliconFlow, LM Studio, or local proxies.',
    docsUrl: 'https://ai-sdk.dev/providers/openai-compatible-providers',
    iconPath: '/llm-icons/openai-comp.svg',
    id: 'openai-compatible',
    label: 'OpenAI Compatible',
    modelsPath: '/models',
    requiresApiKey: true,
    supportsApiMode: false,
    supportsBaseURL: true,
    supportsModelFetch: true,
  },
  {
    baseURLPresets: [
      { label: 'Anthropic', url: 'https://api.anthropic.com/v1' },
    ],
    defaultBaseURL: 'https://api.anthropic.com/v1',
    defaultModelId: 'claude-3-5-sonnet-latest',
    desc: 'Anthropic Claude provider through the official AI SDK Anthropic package.',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/anthropic',
    iconPath: '/llm-icons/anthropic.svg',
    id: 'anthropic',
    label: 'Anthropic',
    modelsPath: '',
    requiresApiKey: true,
    supportsApiMode: false,
    supportsBaseURL: true,
    supportsModelFetch: false,
  },
  {
    baseURLPresets: [
      {
        label: 'Google',
        url: 'https://generativelanguage.googleapis.com/v1beta',
      },
    ],
    defaultBaseURL: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModelId: 'gemini-2.0-flash',
    desc: 'Google Generative AI provider for Gemini models.',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai',
    iconPath: '/llm-icons/google.svg',
    id: 'google',
    label: 'Google Generative AI',
    modelsPath: '',
    requiresApiKey: true,
    supportsApiMode: false,
    supportsBaseURL: true,
    supportsModelFetch: false,
  },
  {
    baseURLPresets: [
      { label: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
    ],
    defaultBaseURL: 'https://openrouter.ai/api/v1',
    defaultModelId: 'openai/gpt-4.1-mini',
    desc: 'OpenRouter provider with model routing and provider-specific extra body support.',
    docsUrl: 'https://ai-sdk.dev/providers/community-providers/openrouter',
    iconPath: '/llm-icons/openrouter.svg',
    id: 'openrouter',
    label: 'OpenRouter',
    modelsPath: '/models',
    requiresApiKey: true,
    supportsApiMode: false,
    supportsBaseURL: true,
    supportsModelFetch: true,
  },
  {
    baseURLPresets: [
      { label: 'Ollama Native', url: 'http://localhost:11434/api' },
    ],
    defaultBaseURL: 'http://localhost:11434/api',
    defaultModelId: 'llama3.2',
    desc: 'Local Ollama native API provider.',
    docsUrl: 'https://ai-sdk.dev/providers/community-providers/ollama',
    iconPath: '/llm-icons/ollama.svg',
    id: 'ollama',
    label: 'Ollama',
    modelsPath: '/tags',
    requiresApiKey: false,
    supportsApiMode: false,
    supportsBaseURL: true,
    supportsModelFetch: true,
  },
  {
    baseURLPresets: [],
    defaultBaseURL: '',
    defaultModelId: 'text',
    desc: 'Browser AI provider for local browser-backed AI features. It does not use API key, Base URL, headers, or extra body.',
    docsUrl: 'https://ai-sdk.dev/providers/community-providers/browser-ai',
    iconPath: '/llm-icons/gemini.svg',
    id: 'browser-ai',
    label: 'Browser AI',
    modelsPath: '',
    requiresApiKey: false,
    supportsApiMode: false,
    supportsBaseURL: false,
    supportsModelFetch: false,
  },
  {
    baseURLPresets: [
      // { label: 'OpenAI', url: 'https://api.openai.com/v1/responses' },
    ],
    defaultBaseURL: '',
    defaultModelId: '',
    desc: 'Open Responses provider. This is a Responses API POST endpoint only, not a Chat Completions provider.',
    docsUrl: 'https://ai-sdk.dev/providers/ai-sdk-providers/open-responses',
    iconPath: '/llm-icons/openresponses.svg',
    id: 'open-responses',
    label: 'Open Responses',
    modelsPath: '',
    requiresApiKey: true,
    supportsApiMode: false,
    supportsBaseURL: true,
    supportsModelFetch: false,
  },
] as const;

export type ModelProviderId = (typeof MODEL_PROVIDER_DEFINITIONS)[number]['id'];

export type ModelProviderDefinition = Extract<
  (typeof MODEL_PROVIDER_DEFINITIONS)[number],
  { id: ModelProviderId }
>;

export type ModelConfigItem = {
  apiKey: string;
  apiMode: ModelApiMode;
  at: number;
  baseURL: string;
  extraBody: Record<string, unknown>;
  headers: Record<string, string>;
  id: string;
  inputTokenPrice: number;
  maxInputTokens: number;
  modelId: string;
  name: string;
  outputTokenPrice: number;
  priceUnit: string;
  providerId: ModelProviderId;
};

export type ModelDraft = Omit<ModelConfigItem, 'at' | 'id'>;

export function getModelProviderDefinition(providerId: ModelProviderId) {
  return (
    MODEL_PROVIDER_DEFINITIONS.find((provider) => provider.id === providerId) ??
    MODEL_PROVIDER_DEFINITIONS[0]
  );
}

export function isModelProviderId(value: unknown): value is ModelProviderId {
  return MODEL_PROVIDER_DEFINITIONS.some((provider) => provider.id === value);
}

export function isModelApiMode(value: unknown): value is ModelApiMode {
  return MODEL_API_MODES.includes(value as ModelApiMode);
}

export function createDefaultModelDraft(
  providerId: ModelProviderId = 'openai-compatible',
): ModelDraft {
  const provider = getModelProviderDefinition(providerId);

  return {
    apiKey: '',
    apiMode: provider.id === 'open-responses' ? 'responses' : 'chat',
    baseURL: provider.defaultBaseURL,
    extraBody: {},
    headers: {},
    inputTokenPrice: 0,
    maxInputTokens: 0,
    modelId: provider.defaultModelId,
    name: provider.label,
    outputTokenPrice: 0,
    priceUnit: '$',
    providerId,
  };
}
