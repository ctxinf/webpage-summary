import { browser } from 'wxt/browser';
import { ENABLE_SAMPLES } from '@/constants/flag';
import { seedDefaultPromptIfNeeded } from '@/lib/prompt-settings-storage';
import { registerAiSdkConnectBridge } from './ai-sdk-connect-bridge';
import { registerTokenCountMessages } from './token-count-bg';
import { registerBackgroundAiProviderSample } from './samples/background-ai-provider';
import { registerConnectChatTransportSample } from './samples/connect-chat-transport';
import { registerControlMessages, addContextMenus, initializeControlHandlers } from './control';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  function seedPromptLibrary() {
    seedDefaultPromptIfNeeded().catch((error) => {
      console.error('Failed to create initial prompt.', error);
    });
  }

  seedPromptLibrary();
  registerAiSdkConnectBridge();
  registerTokenCountMessages();
  registerControlMessages();
  addContextMenus().catch((err) => console.error('Failed to setup context menus:', err));
  initializeControlHandlers();

  console.log('ENABLE_SAMPLES', ENABLE_SAMPLES);
  if (ENABLE_SAMPLES) {
    registerBackgroundAiProviderSample();
    registerConnectChatTransportSample();
  }
});
