import { storage } from '#imports';
import { uid } from 'radash';
import {
  DEFAULT_PROMPT_ID_STORAGE_KEY,
  getPromptPreset,
  PROMPT_CONFIG_STORAGE_KEY,
  PROMPT_LIBRARY_SEEDED_STORAGE_KEY,
  SITE_PROMPT_RULES_STORAGE_KEY,
  type PromptConfigItem,
  type PromptDraft,
  type SitePromptRule,
} from '@/constants/prompt-settings';

export type PromptSettings = {
  defaultPromptId: string | null;
  prompts: PromptConfigItem[];
};

type PromptMoveDirection = 'down' | 'up';

function cleanMessage(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanName(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isPromptConfigItem(value: unknown): value is PromptConfigItem {
  if (!value || typeof value !== 'object') return false;

  const prompt = value as Record<string, unknown>;

  return (
    typeof prompt.id === 'string' &&
    typeof prompt.name === 'string' &&
    typeof prompt.systemMessage === 'string' &&
    typeof prompt.userMessage === 'string'
  );
}

function normalizePrompt(value: PromptConfigItem): PromptConfigItem | null {
  const name = cleanName(value.name);
  const systemMessage = cleanMessage(value.systemMessage);
  const userMessage = cleanMessage(value.userMessage);

  if (!value.id || !name || !systemMessage || !userMessage) {
    return null;
  }

  return {
    at: typeof value.at === 'number' ? value.at : Date.now(),
    id: value.id,
    name,
    systemMessage,
    userMessage,
  };
}

function parsePrompts(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isPromptConfigItem)
    .map(normalizePrompt)
    .filter((prompt): prompt is PromptConfigItem => prompt !== null);
}

function normalizeDraft(draft: PromptDraft): PromptDraft {
  return {
    name: cleanName(draft.name),
    systemMessage: cleanMessage(draft.systemMessage),
    userMessage: cleanMessage(draft.userMessage),
  };
}

function validateDraft(draft: PromptDraft) {
  const normalizedDraft = normalizeDraft(draft);

  if (
    !normalizedDraft.name ||
    !normalizedDraft.systemMessage ||
    !normalizedDraft.userMessage
  ) {
    throw new Error('Prompt name, system message, and user message are required.');
  }

  return normalizedDraft;
}

function isDuplicateName(
  prompts: PromptConfigItem[],
  name: string,
  excludedId?: string,
) {
  return prompts.some(
    (prompt) =>
      prompt.id !== excludedId &&
      prompt.name.localeCompare(name, undefined, { sensitivity: 'accent' }) ===
        0,
  );
}

function getUniqueName(prompts: PromptConfigItem[], name: string) {
  if (!isDuplicateName(prompts, name)) return name;

  let suffix = 2;
  let nextName = `${name} ${suffix}`;

  while (isDuplicateName(prompts, nextName)) {
    suffix += 1;
    nextName = `${name} ${suffix}`;
  }

  return nextName;
}

function normalizeDefaultPromptId(
  defaultPromptId: unknown,
  prompts: PromptConfigItem[],
) {
  return typeof defaultPromptId === 'string' &&
    prompts.some((prompt) => prompt.id === defaultPromptId)
    ? defaultPromptId
    : prompts[0]?.id ?? null;
}

async function writePromptSettings(settings: PromptSettings) {
  const prompts = parsePrompts(settings.prompts);
  const defaultPromptId = normalizeDefaultPromptId(
    settings.defaultPromptId,
    prompts,
  );

  await storage.setItems([
    {
      key: PROMPT_CONFIG_STORAGE_KEY,
      value: prompts,
    },
    {
      key: DEFAULT_PROMPT_ID_STORAGE_KEY,
      value: defaultPromptId,
    },
  ]);

  return { defaultPromptId, prompts };
}

export async function loadPromptSettings(): Promise<PromptSettings> {
  const [promptItem, defaultPromptItem] = await storage.getItems([
    {
      key: PROMPT_CONFIG_STORAGE_KEY,
      options: { fallback: [] },
    },
    {
      key: DEFAULT_PROMPT_ID_STORAGE_KEY,
      options: { fallback: null },
    },
  ]);
  const prompts = parsePrompts(promptItem?.value);

  return {
    defaultPromptId: normalizeDefaultPromptId(defaultPromptItem?.value, prompts),
    prompts,
  };
}

export async function createPrompt(draft: PromptDraft) {
  const settings = await loadPromptSettings();
  const normalizedDraft = validateDraft(draft);
  const prompt: PromptConfigItem = {
    ...normalizedDraft,
    at: Date.now(),
    id: uid(16),
    name: getUniqueName(settings.prompts, normalizedDraft.name),
  };

  settings.prompts.push(prompt);

  await writePromptSettings({
    defaultPromptId: settings.defaultPromptId ?? prompt.id,
    prompts: settings.prompts,
  });

  return prompt;
}

export async function updatePrompt(id: string, draft: PromptDraft) {
  const settings = await loadPromptSettings();
  const index = settings.prompts.findIndex((prompt) => prompt.id === id);

  if (index === -1) {
    throw new Error('Prompt not found.');
  }

  const normalizedDraft = validateDraft(draft);

  if (isDuplicateName(settings.prompts, normalizedDraft.name, id)) {
    throw new Error('Prompt name already exists.');
  }

  settings.prompts[index] = {
    ...settings.prompts[index],
    ...normalizedDraft,
  };

  await writePromptSettings(settings);

  return settings.prompts[index];
}

export async function deletePrompt(id: string) {
  const settings = await loadPromptSettings();
  const prompts = settings.prompts.filter((prompt) => prompt.id !== id);

  if (prompts.length === settings.prompts.length) {
    return false;
  }

  await writePromptSettings({
    defaultPromptId:
      settings.defaultPromptId === id ? prompts[0]?.id ?? null : settings.defaultPromptId,
    prompts,
  });

  return true;
}

export async function movePrompt(id: string, direction: PromptMoveDirection) {
  const settings = await loadPromptSettings();
  const index = settings.prompts.findIndex((prompt) => prompt.id === id);
  const nextIndex = direction === 'up' ? index - 1 : index + 1;

  if (
    index === -1 ||
    nextIndex < 0 ||
    nextIndex >= settings.prompts.length
  ) {
    return false;
  }

  const prompts = [...settings.prompts];
  [prompts[index], prompts[nextIndex]] = [prompts[nextIndex], prompts[index]];

  await writePromptSettings({
    defaultPromptId: settings.defaultPromptId,
    prompts,
  });

  return true;
}

export async function setDefaultPrompt(id: string) {
  const settings = await loadPromptSettings();

  if (!settings.prompts.some((prompt) => prompt.id === id)) {
    return false;
  }

  await writePromptSettings({
    defaultPromptId: id,
    prompts: settings.prompts,
  });

  return true;
}

export async function ensureSamplePrompt() {
  const settings = await loadPromptSettings();

  if (settings.prompts.length > 0) {
    return settings.prompts[0];
  }

  const preset = getPromptPreset('basic');

  return createPrompt({
    ...preset,
    name: 'Sample',
  });
}

export async function seedDefaultPromptIfNeeded() {
  const hasSeededLibrary = await storage.getItem<boolean>(
    PROMPT_LIBRARY_SEEDED_STORAGE_KEY,
    { fallback: false },
  );

  if (hasSeededLibrary) {
    return null;
  }

  const settings = await loadPromptSettings();
  const prompt = settings.prompts[0] ?? (await ensureSamplePrompt());

  await storage.setItem(PROMPT_LIBRARY_SEEDED_STORAGE_KEY, true);

  return prompt;
}

function isSitePromptRule(value: unknown): value is SitePromptRule {
  if (!value || typeof value !== 'object') return false;

  const rule = value as Record<string, unknown>;

  return (
    typeof rule.id === 'string' &&
    typeof rule.enable === 'boolean' &&
    typeof rule.pattern === 'string' &&
    typeof rule.promptId === 'string'
  );
}

function parseSitePromptRules(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value.filter(isSitePromptRule).map((rule) => ({
    at: typeof rule.at === 'number' ? rule.at : Date.now(),
    enable: rule.enable,
    id: rule.id,
    pattern: rule.pattern.trim(),
    promptId: rule.promptId,
  }));
}

export async function loadSitePromptRules() {
  const item = await storage.getItem<unknown>(SITE_PROMPT_RULES_STORAGE_KEY, {
    fallback: [],
  });

  return parseSitePromptRules(item);
}

export async function saveSitePromptRules(rules: SitePromptRule[]) {
  await storage.setItem(SITE_PROMPT_RULES_STORAGE_KEY, parseSitePromptRules(rules));
}
