import { z } from 'zod';
import { getModelProviderDefinition, type ModelDraft } from '@/constants/model-settings';

const catalogSchema = z.record(z.object({
  api: z.string().optional(),
  models: z.record(z.object({
    cost: z.object({
      input: z.number().finite().nonnegative().optional(),
      output: z.number().finite().nonnegative().optional(),
    }).optional(),
  })),
}));

function hostname(url: string | undefined) {
  try { return new URL(url || '').hostname; } catch { return ''; }
}

export function resolveModelPricing(data: unknown, draft: ModelDraft) {
  const catalog = catalogSchema.parse(data);
  const modelId = draft.modelId.trim();
  const host = hostname(draft.baseURL.trim() || getModelProviderDefinition(draft.providerId).defaultBaseURL);
  const nativeHosts: Record<string, string> = {
    'api.openai.com': 'openai',
    'api.anthropic.com': 'anthropic',
    'generativelanguage.googleapis.com': 'google',
    'openrouter.ai': 'openrouter',
  };
  const providers = Object.entries(catalog);
  const matchedProviders = providers.filter(([id, provider]) =>
    nativeHosts[host] === id || (host && hostname(provider.api) === host),
  );
  const candidates = (matchedProviders.length ? matchedProviders : providers)
    .flatMap(([id, provider]) => {
      const cost = provider.models[modelId]?.cost;
      return cost?.input !== undefined && cost.output !== undefined
        ? [{ provider: id, input: cost.input, output: cost.output }]
        : [];
    });

  if (!candidates.length) throw new Error(`No complete pricing found for "${modelId}" on models.dev.`);
  const first = candidates[0];
  if (candidates.some((candidate) => candidate.input !== first.input || candidate.output !== first.output)) {
    throw new Error('Multiple providers have different prices for this model. Set a matching Base URL or enter prices manually.');
  }

  return first;
}

export async function fetchModelPricing(draft: ModelDraft, signal: AbortSignal) {
  if (!draft.modelId.trim()) throw new Error('Model ID is required.');
  const response = await fetch('https://models.dev/api.json', { signal });
  if (!response.ok) throw new Error(`models.dev returned HTTP ${response.status}.`);
  return resolveModelPricing(await response.json(), draft);
}
