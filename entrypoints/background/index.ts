import { browser } from 'wxt/browser';
import { ENABLE_SAMPLES } from '@/constants/flag';
import { registerBackgroundAiProviderSample } from './sample/background-ai-provider';
import { registerConnectChatTransportSample } from './sample/connect-chat-transport';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  console.log('ENABLE_SAMPLES',ENABLE_SAMPLES)
  if (ENABLE_SAMPLES) {
    registerBackgroundAiProviderSample();
    registerConnectChatTransportSample();
  }
});
