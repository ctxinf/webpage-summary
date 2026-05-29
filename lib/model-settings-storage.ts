import { storage } from '#imports';
import { uid } from 'radash';
import {
  DEFAULT_MODEL_ID_V2_STORAGE_KEY,
  MODEL_CONFIGS_V2_STORAGE_KEY,
  createDefaultModelDraft,
  getModelProviderDefinition,
  isModelApiMode,
  isModelProviderId,
  type ModelConfigItem,
  type ModelDraft,
} from '@/constants/model-settings';

export type ModelSettings = {
  defaultModelId: string | null;
  models: ModelConfigItem[];
};

export type ModelMoveDirection = 'down' | 'up';

export type RemoteModelInfo = {
  id: string;
  label: string;
};

function cleanString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanHeaders(value: unknown): Record<string, string> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .map(([key, headerValue]) => [key.trim(), cleanString(headerValue)])
      .filter(([key, headerValue]) => key && headerValue),
  );
}

function cleanExtraBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function cleanNonNegativeNumber(value: unknown) {
  const numberValue =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim()
        ? Number(value)
        : 0;

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0;
}

function normalizeApiMode(value: unknown, providerId: ModelConfigItem['providerId']) {
  const provider = getModelProviderDefinition(providerId);

  if (providerId === 'open-responses') {
    return 'responses';
  }

  return provider.supportsApiMode && isModelApiMode(value) ? value : 'chat';
}

function isModelConfigItem(value: unknown): value is ModelConfigItem {
  if (!value || typeof value !== 'object') return false;

  const model = value as Record<string, unknown>;

  return (
    typeof model.id === 'string' &&
    typeof model.name === 'string' &&
    isModelProviderId(model.providerId) &&
    typeof model.modelId === 'string'
  );
}

function normalizeModel(value: ModelConfigItem): ModelConfigItem | null {
  const provider = getModelProviderDefinition(value.providerId);
  const name = cleanString(value.name);
  const modelId = cleanString(value.modelId);

  if (!value.id || !name || !modelId) {
    return null;
  }

  return {
    apiKey: cleanString(value.apiKey),
    apiMode: normalizeApiMode(value.apiMode, value.providerId),
    at: typeof value.at === 'number' ? value.at : Date.now(),
    baseURL: provider.supportsBaseURL
      ? cleanString(value.baseURL) || provider.defaultBaseURL
      : '',
    extraBody: cleanExtraBody(value.extraBody),
    headers: cleanHeaders(value.headers),
    iconPath: cleanString(value.iconPath),
    id: value.id,
    inputTokenPrice: cleanNonNegativeNumber(value.inputTokenPrice),
    maxInputTokens: cleanNonNegativeNumber(value.maxInputTokens),
    modelId,
    name,
    outputTokenPrice: cleanNonNegativeNumber(value.outputTokenPrice),
    priceUnit: cleanString(value.priceUnit) || '$',
    providerId: value.providerId,
  };
}

function parseModels(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isModelConfigItem)
    .map(normalizeModel)
    .filter((model): model is ModelConfigItem => model !== null);
}

function normalizeDefaultModelId(
  defaultModelId: unknown,
  models: ModelConfigItem[],
) {
  return typeof defaultModelId === 'string' &&
    models.some((model) => model.id === defaultModelId)
    ? defaultModelId
    : models[0]?.id ?? null;
}

function isDuplicateName(
  models: ModelConfigItem[],
  name: string,
  excludedId?: string,
) {
  return models.some(
    (model) =>
      model.id !== excludedId &&
      model.name.localeCompare(name, undefined, { sensitivity: 'accent' }) ===
        0,
  );
}

function validateDraft(draft: ModelDraft): ModelDraft {
  const provider = getModelProviderDefinition(draft.providerId);
  const name = cleanString(draft.name);
  const modelId = cleanString(draft.modelId);
  const baseURL = provider.supportsBaseURL
    ? cleanString(draft.baseURL) || provider.defaultBaseURL
    : '';

  if (!name || !modelId) {
    throw new Error('Model name and model id are required.');
  }

  if (provider.supportsBaseURL && !baseURL) {
    throw new Error('Base URL is required.');
  }

  return {
    apiKey: cleanString(draft.apiKey),
    apiMode: normalizeApiMode(draft.apiMode, draft.providerId),
    baseURL,
    extraBody: cleanExtraBody(draft.extraBody),
    headers: cleanHeaders(draft.headers),
    iconPath: cleanString(draft.iconPath),
    inputTokenPrice: cleanNonNegativeNumber(draft.inputTokenPrice),
    maxInputTokens: cleanNonNegativeNumber(draft.maxInputTokens),
    modelId,
    name,
    outputTokenPrice: cleanNonNegativeNumber(draft.outputTokenPrice),
    priceUnit: cleanString(draft.priceUnit) || '$',
    providerId: draft.providerId,
  };
}

async function writeModelSettings(settings: ModelSettings) {
  const models = parseModels(settings.models);
  const defaultModelId = normalizeDefaultModelId(settings.defaultModelId, models);

  await storage.setItems([
    {
      key: MODEL_CONFIGS_V2_STORAGE_KEY,
      value: models,
    },
    {
      key: DEFAULT_MODEL_ID_V2_STORAGE_KEY,
      value: defaultModelId,
    },
  ]);

  return { defaultModelId, models };
}

export async function loadModelSettings(): Promise<ModelSettings> {
  const [modelsItem, defaultModelItem] = await storage.getItems([
    {
      key: MODEL_CONFIGS_V2_STORAGE_KEY,
      options: { fallback: [] },
    },
    {
      key: DEFAULT_MODEL_ID_V2_STORAGE_KEY,
      options: { fallback: null },
    },
  ]);
  const models = parseModels(modelsItem?.value);

  return {
    defaultModelId: normalizeDefaultModelId(defaultModelItem?.value, models),
    models,
  };
}

export async function getDefaultModelConfig() {
  const settings = await loadModelSettings();

  return (
    settings.models.find((model) => model.id === settings.defaultModelId) ??
    settings.models[0] ??
    null
  );
}

export async function getModelConfigById(id: string | null | undefined) {
  const settings = await loadModelSettings();

  if (!id) {
    return (
      settings.models.find((model) => model.id === settings.defaultModelId) ??
      settings.models[0] ??
      null
    );
  }

  return settings.models.find((model) => model.id === id) ?? null;
}

export async function createModelConfig(draft: ModelDraft) {
  const settings = await loadModelSettings();
  const normalizedDraft = validateDraft(draft);

  if (isDuplicateName(settings.models, normalizedDraft.name)) {
    throw new Error('Model name already exists.');
  }

  const model: ModelConfigItem = {
    ...normalizedDraft,
    at: Date.now(),
    id: uid(16),
  };

  settings.models.push(model);

  await writeModelSettings({
    defaultModelId: settings.defaultModelId ?? model.id,
    models: settings.models,
  });

  return model;
}

export async function updateModelConfig(id: string, draft: ModelDraft) {
  const settings = await loadModelSettings();
  const index = settings.models.findIndex((model) => model.id === id);

  if (index === -1) {
    throw new Error('Model not found.');
  }

  const normalizedDraft = validateDraft(draft);

  if (isDuplicateName(settings.models, normalizedDraft.name, id)) {
    throw new Error('Model name already exists.');
  }

  settings.models[index] = {
    ...settings.models[index],
    ...normalizedDraft,
  };

  await writeModelSettings(settings);

  return settings.models[index];
}

export async function deleteModelConfig(id: string) {
  const settings = await loadModelSettings();
  const models = settings.models.filter((model) => model.id !== id);

  if (models.length === settings.models.length) {
    return false;
  }

  await writeModelSettings({
    defaultModelId:
      settings.defaultModelId === id ? models[0]?.id ?? null : settings.defaultModelId,
    models,
  });

  return true;
}

export async function moveModelConfig(id: string, direction: ModelMoveDirection) {
  const settings = await loadModelSettings();
  const index = settings.models.findIndex((model) => model.id === id);
  const nextIndex = direction === 'up' ? index - 1 : index + 1;

  if (
    index === -1 ||
    nextIndex < 0 ||
    nextIndex >= settings.models.length
  ) {
    return false;
  }

  const models = [...settings.models];
  [models[index], models[nextIndex]] = [models[nextIndex], models[index]];

  await writeModelSettings({
    defaultModelId: settings.defaultModelId,
    models,
  });

  return true;
}

export async function setDefaultModelConfig(id: string) {
  const settings = await loadModelSettings();

  if (!settings.models.some((model) => model.id === id)) {
    return false;
  }

  await writeModelSettings({
    defaultModelId: id,
    models: settings.models,
  });

  return true;
}

export function createEmptyModelDraft() {
  return createDefaultModelDraft('openai-compatible');
}

export async function fetchRemoteModels(
  draft: ModelDraft,
): Promise<RemoteModelInfo[]> {
  const normalizedDraft = validateDraft(draft);
  const provider = getModelProviderDefinition(normalizedDraft.providerId);

  if (!provider.supportsModelFetch || !provider.modelsPath) {
    throw new Error('This provider does not expose a configured models endpoint.');
  }

  const endpoint = new URL(
    provider.modelsPath.replace(/^\/+/, ''),
    normalizedDraft.baseURL.endsWith('/')
      ? normalizedDraft.baseURL
      : `${normalizedDraft.baseURL}/`,
  );
  const headers: Record<string, string> = {
    ...normalizedDraft.headers,
  };

  if (normalizedDraft.apiKey) {
    headers.Authorization = headers.Authorization || `Bearer ${normalizedDraft.apiKey}`;
  }

  const response = await fetch(endpoint, { headers });
  const payload = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error(extractErrorMessage(payload) || `${response.status} ${response.statusText}`);
  }

  return extractRemoteModels(payload);
}

function extractErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object') return '';

  const data = payload as Record<string, unknown>;
  const error = data.error;

  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const message = (error as Record<string, unknown>).message;

    if (typeof message === 'string') return message;
  }

  return '';
}

function extractRemoteModels(payload: unknown): RemoteModelInfo[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = payload as Record<string, unknown>;
  const list = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.models)
      ? data.models
      : Array.isArray(payload)
        ? payload
        : [];

  return list
    .map((item) => {
      if (typeof item === 'string') {
        return { id: item, label: item };
      }

      if (!item || typeof item !== 'object') {
        return null;
      }

      const model = item as Record<string, unknown>;
      const id = cleanString(model.id) || cleanString(model.name) || cleanString(model.model);

      if (!id) {
        return null;
      }

      return {
        id,
        label: cleanString(model.name) || id,
      };
    })
    .filter((model): model is RemoteModelInfo => model !== null);
}
