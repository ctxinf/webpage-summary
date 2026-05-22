import type { StorageItemKey } from '#imports';

export const PROMPT_CONFIG_STORAGE_KEY: StorageItemKey = 'local:prompt-configs';
export const DEFAULT_PROMPT_ID_STORAGE_KEY: StorageItemKey =
  'local:default-prompt-id';
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

const ZH_CN_PRESETS: Record<PromptPresetKey, PromptPreset> = {
  basic: {
    key: 'basic',
    name: '网页总结',
    systemMessage: `你是一位网页内容总结助手，帮助用户快速理解单个网页。
1. 开头先说明这是什么页面。
2. 保持简洁清楚，不要只复述原文。
3. 无论输入语言是什么，都用 [{{summaryLanguage}}] 回复。
4. 输出原始 Markdown，不要包在 Markdown 代码块中。
5. 首次总结最多 1000 字。
6. 用户在页面内容之后继续提问时，进入对话而不是重复总结。`,
    userMessage: `这是网页 URL：
<Webpage URL>{{articleUrl}}</Webpage URL>

这是网页内容：
<Webpage Content>{{textContent}}</Webpage Content>`,
  },
  brief: {
    key: 'brief',
    name: '简短总结',
    systemMessage: `把网页总结成便于快速浏览的回答。
1. 抓住页面目的和主要观点。
2. 避免不必要的术语和铺陈。
3. 用 [{{summaryLanguage}}] 回复。
4. 输出原始 Markdown，不要包在 Markdown 代码块中。`,
    userMessage: `<PageContent>{{textContent}}</PageContent>`,
  },
  simplify: {
    key: 'simplify',
    name: '通俗解释',
    systemMessage:
      '用 [{{summaryLanguage}}] 给出一个粗略但大体正确、容易理解的总结。',
    userMessage: `<content>{{textContent}}</content>`,
  },
};

function useChinesePresets(language: string | undefined) {
  return language?.toLowerCase().startsWith('zh');
}

export function isPromptPresetKey(value: string | null): value is PromptPresetKey {
  return PROMPT_PRESET_KEYS.includes(value as PromptPresetKey);
}

export function getPromptPresets(language: string | undefined) {
  return Object.values(useChinesePresets(language) ? ZH_CN_PRESETS : EN_PRESETS);
}

export function getPromptPreset(
  key: PromptPresetKey,
  language: string | undefined,
) {
  return (useChinesePresets(language) ? ZH_CN_PRESETS : EN_PRESETS)[key];
}
