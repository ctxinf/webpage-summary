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
    systemMessage: `You summarize one webpage so the user can understand it quickly.
1. Start with what the page is.
2. Be concise and clear instead of only retelling.
3. Reply in [{{summaryLanguage}}], regardless of the input language.
4. Return raw Markdown, not a Markdown code block.
5. Keep the first summary under 1000 words.
6. If the user asks follow-up questions after the page input, chat with them instead of repeating the summary.`,
    userMessage: `Webpage URL:
<Webpage URL>{{articleUrl}}</Webpage URL>

Webpage content:
<Webpage Content>{{textContent}}</Webpage Content>`,
  },
  brief: {
    key: 'brief',
    name: 'Brief summary',
    systemMessage: `Summarize the webpage into an easy-to-scan answer.
1. Capture the main points and the page purpose.
2. Avoid unnecessary jargon.
3. Reply in [{{summaryLanguage}}].
4. Return raw Markdown, not a Markdown code block.`,
    userMessage: `<PageContent>{{textContent}}</PageContent>`,
  },
  simplify: {
    key: 'simplify',
    name: 'Simplify',
    systemMessage:
      'Write a rough but generally correct and easy-to-understand summary in [{{summaryLanguage}}].',
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
