import { browser } from 'wxt/browser';
import { ENABLE_SAMPLES } from '@/constants/flag';
import { ensureSamplePrompt } from '@/lib/prompt-settings-storage';
import { registerBackgroundAiProviderSample } from './sample/background-ai-provider';
import { registerConnectChatTransportSample } from './sample/connect-chat-transport';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.runtime.onInstalled.addListener(() => {
    ensureSamplePrompt(browser.i18n.getUILanguage()).catch((error) => {
      console.error('Failed to create initial prompt.', error);
    });
  });

  console.log('ENABLE_SAMPLES', ENABLE_SAMPLES);
  if (ENABLE_SAMPLES) {
    registerBackgroundAiProviderSample();
    registerConnectChatTransportSample();
  }
});
