import { MODEL_PROVIDER_DEFINITIONS } from '@/constants/model-settings';

import { createLogger } from '@/lib/logger';

const logger = createLogger('lib:migration');

export function migrateModelConfigs(models: any[]): { models: any[], updated: boolean } {
  let updated = false;

  const migratedModels = models.map((model) => {
    // V1 to V2 mapping
    if (model.providerType) {
      let type = model.providerType;
      let iconToAssign: string | undefined = undefined;

      // Fix typos or legacy names
      if (type === 'google geneative' || type === 'google generative' || type === 'google-generative') {
        type = 'google';
      } else if (type === 'openai-compitable') {
        type = 'openai-compatible';
      }

      // If it's not a standard provider, map to openai-compatible
      const standardProviders = ['openai', 'anthropic', 'google', 'ollama', 'browser-ai', 'open-responses', 'openai-compatible'];
      if (!standardProviders.includes(type)) {
        let urlToAssign: string | undefined = undefined;

        // Use the original type to determine icon before overwriting
        const lowerType = type.toLowerCase();
        if (lowerType.includes('deepseek')) { iconToAssign = '/llm-icons/deepseek.svg'; urlToAssign = 'https://api.deepseek.com'; }
        else if (lowerType.includes('moonshot') || lowerType.includes('kimi')) { iconToAssign = '/llm-icons/kimi-web.svg'; urlToAssign = 'https://api.moonshot.ai/v1'; }
        else if (lowerType.includes('xai')) { iconToAssign = '/llm-icons/xAI.svg'; urlToAssign = 'https://api.x.ai/v1'; }
        else if (lowerType.includes('openrouter')) { iconToAssign = '/llm-icons/openrouter.svg'; urlToAssign = 'https://openrouter.ai/api/v1'; }
        else if (lowerType.includes('perplexity')) { iconToAssign = '/llm-icons/perplexity.svg'; urlToAssign = 'https://api.perplexity.ai/v1'; }
        else if (lowerType.includes('siliconflow')) { iconToAssign = '/llm-icons/siliconflow.svg'; urlToAssign = 'https://api.siliconflow.cn/v1'; }
        else if (lowerType.includes('together')) { iconToAssign = '/llm-icons/together.svg'; urlToAssign = 'https://api.together.xyz/v1'; }
        else if (lowerType.includes('cohere')) { iconToAssign = '/llm-icons/cohere.svg'; urlToAssign = 'https://api.cohere.com/v1'; }
        else if (lowerType.includes('deepinfra')) { iconToAssign = '/llm-icons/deepinfra.svg'; urlToAssign = 'https://api.deepinfra.com/v1/openai'; }
        else if (lowerType.includes('groq')) { iconToAssign = '/llm-icons/groq.svg'; urlToAssign = 'https://api.groq.com/openai/v1'; }
        else if (lowerType.includes('zhipu') || lowerType.includes('glm')) { iconToAssign = '/llm-icons/zhipu.svg'; urlToAssign = 'https://open.bigmodel.cn/api/paas/v4'; }
        else if (lowerType.includes('minimax')) { iconToAssign = '/llm-icons/minimax.svg'; urlToAssign = 'https://api.minimax.io/v1'; }
        else if (lowerType.includes('mistral')) { iconToAssign = '/llm-icons/mistral.svg'; urlToAssign = 'https://api.mistral.ai/v1'; }
        else if (lowerType.includes('qwen') || lowerType.includes('aliyun') || lowerType.includes('dashscope')) { iconToAssign = '/llm-icons/aliyun.svg'; urlToAssign = 'https://dashscope.aliyuncs.com/compatible-mode/v1'; }
        else if (lowerType.includes('baidu') || lowerType.includes('qianfan')) { iconToAssign = '/llm-icons/baidu.svg'; urlToAssign = 'https://qianfan.baidubce.com/v2'; }
        else if (lowerType.includes('byteplus')) { iconToAssign = '/llm-icons/byteplus.svg'; urlToAssign = 'https://ark.ap-southeast.bytepluses.com/api/v3'; }
        else if (lowerType.includes('volcengine') || lowerType.includes('ark')) { iconToAssign = '/llm-icons/volcengine.svg'; urlToAssign = 'https://ark.cn-beijing.volces.com/api/v3'; }
        else if (lowerType.includes('cerebras')) { iconToAssign = '/llm-icons/cerebras.svg'; urlToAssign = 'https://api.cerebras.ai/v1'; }

        if (urlToAssign && !model.baseURL) {
          model.baseURL = urlToAssign;
        }

        type = 'openai-compatible';
      }

      model.providerId = type;
      if (iconToAssign && !model.iconPath) {
        model.iconPath = iconToAssign;
      }
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
      'default-model-id': 'default-model-id',
      'default-prompt-id': 'default-prompt-id',
      'expand-chat-input-box': 'enable-chat-input-box',
      'is-first-install': 'is-first-install',
      'model-configs': 'model-configs',
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
      
      if (newKey === 'model-configs' && Array.isArray(value)) {
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
    logger.error('Migration error:', error);
  }

  return logs;
}
