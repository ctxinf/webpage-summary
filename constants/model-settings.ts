import type { StorageItemKey } from '#imports';

export const MODEL_CONFIGS_V2_STORAGE_KEY: StorageItemKey =
  'local:react-model-configs-v2';
export const DEFAULT_MODEL_ID_V2_STORAGE_KEY: StorageItemKey =
  'local:react-default-model-id-v2';

export const MODEL_API_MODES = ['chat', 'responses'] as const;
export type ModelApiMode = (typeof MODEL_API_MODES)[number];

export const AVAILABLE_ICONS = [
  '/llm-icons/aliyun.svg',
  '/llm-icons/anthropic.svg',
  '/llm-icons/baidu.svg',
  '/llm-icons/byteplus.svg',
  '/llm-icons/cerebras.svg',
  '/llm-icons/cohere.svg',
  '/llm-icons/deepinfra.svg',
  '/llm-icons/deepseek.svg',
  '/llm-icons/fireworks.svg',
  '/llm-icons/gemini.svg',
  '/llm-icons/google.svg',
  '/llm-icons/groq.svg',
  '/llm-icons/huggingface.svg',
  '/llm-icons/kilocode.svg',
  '/llm-icons/kimi-web.svg',
  '/llm-icons/lmstudio.svg',
  '/llm-icons/minimax.svg',
  '/llm-icons/mistral.svg',
  '/llm-icons/nvidia.svg',
  '/llm-icons/ollama.svg',
  '/llm-icons/openai-comp.svg',
  '/llm-icons/openai.svg',
  '/llm-icons/openresponses.svg',
  '/llm-icons/openrouter.svg',
  '/llm-icons/perplexity.svg',
  '/llm-icons/qwen.svg',
  '/llm-icons/siliconflow.svg',
  '/llm-icons/stepfun.svg',
  '/llm-icons/together.svg',
  '/llm-icons/venice.svg',
  '/llm-icons/vercel.svg',
  '/llm-icons/volcengine.svg',
  '/llm-icons/xAI.svg',
  '/llm-icons/xiaomimimo.svg',
  '/llm-icons/zai.svg',
  '/llm-icons/zhipu.svg',
];

export type BaseURLPreset = {
  label: string;
  url: string;
  iconPath?: string;
};

export const MODEL_PROVIDER_DEFINITIONS: {
  baseURLPresets: BaseURLPreset[];
  defaultBaseURL: string;
  defaultModelId: string;
  desc: string;
  docsUrl: string;
  iconPath: string;
  id: string;
  label: string;
  modelsPath: string;
  requiresApiKey: boolean;
  supportsApiMode: boolean;
  supportsBaseURL: boolean;
  supportsModelFetch: boolean;
}[] = [
  {
    baseURLPresets: [
      { label: 'OpenRouter', url: 'https://openrouter.ai/api/v1', iconPath: '/llm-icons/openrouter.svg' },
      { label: 'Vercel AI Gateway', url: 'https://ai-gateway.vercel.sh/v1', iconPath: '/llm-icons/vercel.svg' },
      { label: 'DeepSeek', url: 'https://api.deepseek.com', iconPath: '/llm-icons/deepseek.svg' },
      { label: 'xAI Grok', url: 'https://api.x.ai/v1', iconPath: '/llm-icons/xAI.svg' },
      
      {
        label: 'DashScope',
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        iconPath: '/llm-icons/aliyun.svg'
      },
      {
        label: 'DashScope Intl',
        url: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1',
        iconPath: '/llm-icons/aliyun.svg'
      },
      { label: 'Z.AI GLM', url: 'https://api.z.ai/api/paas/v4', iconPath: '/llm-icons/zai.svg' },
      { label: 'Zhipu BigModel', url: 'https://open.bigmodel.cn/api/paas/v4', iconPath: '/llm-icons/zhipu.svg' },
      { label: 'Kimi Global', url: 'https://api.moonshot.ai/v1', iconPath: '/llm-icons/kimi-web.svg' },
      { label: 'Kimi China', url: 'https://api.moonshot.cn/v1', iconPath: '/llm-icons/kimi-web.svg' },
      { label: 'MiniMax Global', url: 'https://api.minimax.io/v1', iconPath: '/llm-icons/minimax.svg' },
      { label: 'MiniMax China', url: 'https://api.minimaxi.com/v1', iconPath: '/llm-icons/minimax.svg' },
      { label: 'StepFun', url: 'https://api.stepfun.ai/v1', iconPath: '/llm-icons/stepfun.svg' },
      { label: 'Xiaomi MiMo', url: 'https://api.xiaomimimo.com/v1', iconPath: '/llm-icons/xiaomimimo.svg' },
      {
        label: 'BytePlus ModelArk',
        url: 'https://ark.ap-southeast.bytepluses.com/api/v3',
        iconPath: '/llm-icons/byteplus.svg'
      },
      { label: 'Volcengine Ark', url: 'https://ark.cn-beijing.volces.com/api/v3', iconPath: '/llm-icons/volcengine.svg' },
      { label: 'Qianfan', url: 'https://qianfan.baidubce.com/v2', iconPath: '/llm-icons/baidu.svg' },
      { label: 'SiliconFlow', url: 'https://api.siliconflow.cn/v1', iconPath: '/llm-icons/siliconflow.svg' },
      { label: 'NVIDIA NIM', url: 'https://integrate.api.nvidia.com/v1', iconPath: '/llm-icons/nvidia.svg' },
      { label: 'Groq', url: 'https://api.groq.com/openai/v1', iconPath: '/llm-icons/groq.svg' },
      { label: 'Perplexity', url: 'https://api.perplexity.ai/v1', iconPath: '/llm-icons/perplexity.svg' },
      { label: 'DeepInfra', url: 'https://api.deepinfra.com/v1/openai', iconPath: '/llm-icons/deepinfra.svg' },
      { label: 'Mistral', url: 'https://api.mistral.ai/v1', iconPath: '/llm-icons/mistral.svg' },
      { label: 'Cerebras', url: 'https://api.cerebras.ai/v1', iconPath: '/llm-icons/cerebras.svg' },
      { label: 'Hugging Face', url: 'https://router.huggingface.co/v1', iconPath: '/llm-icons/huggingface.svg' },
      { label: 'Fireworks', url: 'https://api.fireworks.ai/inference/v1', iconPath: '/llm-icons/fireworks.svg' },
      { label: 'Together AI', url: 'https://api.together.xyz/v1', iconPath: '/llm-icons/together.svg' },
      { label: 'Venice AI', url: 'https://api.venice.ai/api/v1', iconPath: '/llm-icons/venice.svg' },
      { label: 'Kilo Gateway', url: 'https://api.kilo.ai/api/gateway', iconPath: '/llm-icons/kilocode.svg' },
      { label: 'LM Studio', url: 'http://localhost:1234/v1', iconPath: '/llm-icons/lmstudio.svg' },
      { label: 'Ollama OpenAI', url: 'http://localhost:11434/v1', iconPath: '/llm-icons/ollama.svg' },
    ],
    defaultBaseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    defaultModelId: 'qwen-plus',
    desc: 'Generic OpenAI-compatible Chat Completions provider for compatible /v1 APIs such as DashScope, SiliconFlow, OpenRouter, LM Studio, or local proxies.',
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
      { label: 'OpenAI', url: 'https://api.openai.com/v1', iconPath: '/llm-icons/openai.svg' },
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
      { label: 'Anthropic', url: 'https://api.anthropic.com/v1', iconPath: '/llm-icons/anthropic.svg' },
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
        iconPath: '/llm-icons/google.svg'
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
      { label: 'Ollama Native', url: 'http://localhost:11434/api', iconPath: '/llm-icons/ollama.svg' },
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
  iconPath?: string;
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
    iconPath: '',
    inputTokenPrice: 0,
    maxInputTokens: 0,
    modelId: provider.defaultModelId,
    name: provider.label,
    outputTokenPrice: 0,
    priceUnit: '$',
    providerId,
  };
}

export function getModelDisplayIcon(model: Pick<ModelConfigItem, 'iconPath' | 'baseURL' | 'providerId'>): string {
  if (model.iconPath) {
    return model.iconPath;
  }

  const provider = getModelProviderDefinition(model.providerId);
  const preset = provider.baseURLPresets?.find((p) => p.url === model.baseURL);
  
  if (preset?.iconPath) {
    return preset.iconPath;
  }

  return provider.iconPath;
}
