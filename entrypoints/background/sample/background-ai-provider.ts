import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import { browser } from 'wxt/browser';

export function registerBackgroundAiProviderSample() {
  browser.runtime.onMessage.addListener(
    (message: { type?: string; apiKey?: string }) => {
      if (message.type !== 'RUN_BACKGROUND_AI_PROVIDER_SAMPLE') {
        return;
      }

      return requestBackgroundAiProviderSample(message.apiKey ?? '');
    },
  );
  console.log("registerBackgroundAiProviderSample done.")
}

async function requestBackgroundAiProviderSample(apiKey: string) {
  const dashscope = createOpenAICompatible({
    name: 'dashscope',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey,
  });

  const { text } = await generateText({
    model: dashscope('qwen3.6-plus'),
    prompt: '请用一句话确认这次请求由浏览器扩展 background 中的 AI provider 发起。',
  });

  return text;
}
