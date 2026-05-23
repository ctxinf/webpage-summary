import { browser } from 'wxt/browser';
import { ENABLE_SAMPLES } from '@/constants/flag';
import { seedDefaultPromptIfNeeded } from '@/lib/prompt-settings-storage';
import { registerAiSdkConnectBridge } from './ai-sdk-connect-bridge';
import { registerBackgroundAiProviderSample } from './sample/background-ai-provider';
import { registerConnectChatTransportSample } from './sample/connect-chat-transport';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  function seedPromptLibrary() {
    seedDefaultPromptIfNeeded().catch((error) => {
      console.error('Failed to create initial prompt.', error);
    });
  }

  seedPromptLibrary();
  registerAiSdkConnectBridge();

  console.log('ENABLE_SAMPLES', ENABLE_SAMPLES);
  if (ENABLE_SAMPLES) {
    registerBackgroundAiProviderSample();
    registerConnectChatTransportSample();
  }
});
