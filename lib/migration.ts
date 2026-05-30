import { MODEL_PROVIDER_DEFINITIONS } from '@/constants/model-settings';

export function migrateModelConfigs(models: any[]): { models: any[], updated: boolean } {
  let updated = false;

  const migratedModels = models.map((model) => {
    // V1 to V2 mapping
    if (model.providerType) {
      model.providerId = model.providerType;
      delete model.providerType;
      updated = true;
    }
    if (model.modelName) {
      model.modelId = model.modelName;
      delete model.modelName;
      updated = true;
    }
    
    // Fill in required V2 fields
    const defaultFields: Partial<any> = {
      apiMode: 'chat',
      apiKey: '',
      extraBody: {},
      headers: {},
      inputTokenPrice: 0,
      outputTokenPrice: 0,
      maxInputTokens: 0,
      priceUnit: '$',
      baseURL: model.baseURL || ''
    };
    
    for (const [key, value] of Object.entries(defaultFields)) {
      if (typeof model[key] === 'undefined') {
        model[key] = value;
        updated = true;
      }
    }

    const provider = MODEL_PROVIDER_DEFINITIONS.find((p) => p.id === model.providerId);
    if (provider) {
      if (!model.baseURL && provider.supportsBaseURL) {
        model.baseURL = provider.defaultBaseURL;
        updated = true;
      }
      
      // Find if this model matches one of the provider's presets exactly on baseURL
      // and if it's lacking an icon or needs other fields updated, we can merge them.
      const preset = provider.baseURLPresets.find(p => p.url === model.baseURL || p.label === model.name);
      
      if (preset) {
        // If the model name matches a preset but the preset's URL was updated in the new version
        if (model.name === preset.label && model.baseURL !== preset.url) {
          model.baseURL = preset.url;
          updated = true;
        }
        // If the preset has an icon and the model doesn't
        if (preset.iconPath && !model.iconPath) {
          model.iconPath = preset.iconPath;
          updated = true;
        }
      } else if (model.baseURL === provider.defaultBaseURL && !model.iconPath) {
        model.iconPath = provider.iconPath;
        updated = true;
      }
    }
    return model;
  });

  return { models: migratedModels, updated };
}

export async function runFullMigration(): Promise<string[]> {
  const { browser } = await import('wxt/browser');
  const logs: string[] = [];
  
  try {
    const data = await browser.storage.local.get(null);
    logs.push(`Found ${Object.keys(data).length} raw configuration keys in storage.`);

    const KEY_MAPPING: Record<string, string> = {
      'default-model-id': 'react-default-model-id-v2',
      'default-prompt-id': 'default-prompt-id',
      'expand-chat-input-box': 'enable-chat-input-box',
      'is-first-install': 'is-first-install',
      'model-configs': 'react-model-configs-v2',
      'prompt-configs': 'prompt-configs',
      'site-customization-list': 'site-customization-list',
      'site-filter-blacklist': 'site-filter-blacklist',
      'site-filter-whitelist': 'site-filter-whitelist',
    };

    const migratedData: Record<string, any> = {};
    const keysToRemove: string[] = [];

    for (const [oldKey, value] of Object.entries(data)) {
      if (oldKey === 'local:content-samples-position' || oldKey === 'content-samples-position') {
        keysToRemove.push(oldKey);
        continue;
      }

      const newKey = KEY_MAPPING[oldKey] || oldKey;
      
      if (newKey === 'react-model-configs-v2' && Array.isArray(value)) {
        logs.push(`Applying model auto-conversion for key: ${oldKey} -> ${newKey}`);
        const { models: migratedModels, updated } = migrateModelConfigs(value);
        migratedData[newKey] = migratedModels;
        if (updated) {
           logs.push(`Successfully upgraded model configurations.`);
        } else {
           logs.push(`No model updates needed.`);
        }
      } else if (oldKey !== newKey) {
        logs.push(`Mapped key: ${oldKey} -> ${newKey}`);
        migratedData[newKey] = value;
        keysToRemove.push(oldKey);
      } else {
        migratedData[newKey] = value;
      }
    }

    if (keysToRemove.length > 0) {
      await browser.storage.local.remove(keysToRemove);
      logs.push(`Cleaned up old keys: ${keysToRemove.join(', ')}`);
    }

    await browser.storage.local.set(migratedData);
    
    const recognizedKeys = Object.keys(migratedData);
    logs.push(`Successfully prepared and saved keys: ${recognizedKeys.join(', ')}`);
    
  } catch (error) {
    logs.push(`Migration error: ${String(error)}`);
    console.error('Migration error:', error);
  }

  return logs;
}
