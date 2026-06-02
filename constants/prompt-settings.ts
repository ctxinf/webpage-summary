import type { StorageItemKey } from '#imports';

export const PROMPT_CONFIG_STORAGE_KEY: StorageItemKey = 'local:prompt-configs';
export const DEFAULT_PROMPT_ID_STORAGE_KEY: StorageItemKey =
  'local:default-prompt-id';
export const PROMPT_LIBRARY_SEEDED_STORAGE_KEY: StorageItemKey =
  'local:prompt-library-seeded';
export const SITE_PROMPT_RULES_STORAGE_KEY: StorageItemKey =
  'local:site-prompt-rules';

export type PromptConfigItem = {
  at: number;
  id: string;
  name: string;
  systemMessage: string;
  userMessage: string;
};

export type PromptDraft = Pick<
  PromptConfigItem,
  'name' | 'systemMessage' | 'userMessage'
>;

export type SitePromptRule = {
  at: number;
  enable: boolean;
  id: string;
  pattern: string;
  promptId: string;
};

export const PROMPT_TEMPLATE_VARIABLES = [
  {
    descriptionKey: 'summaryLanguage',
    key: 'summaryLanguage',
  },
  {
    descriptionKey: 'articleUrl',
    key: 'articleUrl',
  },
  {
    descriptionKey: 'textContent',
    key: 'textContent',
  },
  {
    descriptionKey: 'currentSelection',
    key: 'currentSelection',
  },
] as const;

export type PromptTemplateVariableDescriptionKey =
  (typeof PROMPT_TEMPLATE_VARIABLES)[number]['descriptionKey'];

export const PROMPT_PRESET_KEYS = ['basic', 'brief', 'simplify'] as const;

export type PromptPresetKey = (typeof PROMPT_PRESET_KEYS)[number];

export type PromptPreset = PromptDraft & {
  key: PromptPresetKey;
};

const EN_PRESETS: Record<PromptPresetKey, PromptPreset> = {
  basic: {
    key: 'basic',
    name: 'Page summary',
    systemMessage: `Provide a clear and concise summary of the webpage to help the user understand its content quickly.
1. Start with a brief overview of the page's main topic.
2. Synthesize the key information rather than simply repeating it.
3. Always reply in [{{summaryLanguage}}], regardless of the source language.
4. If the user asks follow-up questions, engage naturally instead of repeating the summary.`,
    userMessage: `Webpage URL:
<Webpage URL>{{articleUrl}}</Webpage URL>

Webpage content:
<Webpage Content>{{textContent}}</Webpage Content>`,
  },
  brief: {
    key: 'brief',
    name: 'Brief summary',
    systemMessage: `Provide a highly scannable summary of the webpage.
1. Highlight the main points and the overall purpose of the page.
2. Avoid unnecessary jargon or complex terminology.
3. Always reply in [{{summaryLanguage}}].`,
    userMessage: `<PageContent>{{textContent}}</PageContent>`,
  },
  simplify: {
    key: 'simplify',
    name: 'Simplify',
    systemMessage:
      'Provide a simplified and easy-to-understand summary of the content in [{{summaryLanguage}}], focusing on the core message.',
    userMessage: `<content>{{textContent}}</content>`,
  },
};

export function isPromptPresetKey(value: string | null): value is PromptPresetKey {
  return PROMPT_PRESET_KEYS.includes(value as PromptPresetKey);
}

export function getPromptPresets() {
  return Object.values(EN_PRESETS);
}

export function getPromptPreset(key: PromptPresetKey) {
  return EN_PRESETS[key];
}
