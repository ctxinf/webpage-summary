import { browser } from 'wxt/browser';
import { ENABLE_SAMPLES } from '@/constants/flag';
import { seedDefaultPromptIfNeeded } from '@/lib/prompt-settings-storage';
import { registerAiSdkConnectBridge } from './ai-sdk-connect-bridge';
import { registerTokenCountMessages } from './token-count-bg';
import { setupOnInstallHook } from './onInstall';
import { registerControlMessages, addContextMenus, initializeControlHandlers } from './control';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  function seedPromptLibrary() {
    seedDefaultPromptIfNeeded().catch((error) => {
      console.error('Failed to create initial prompt.', error);
    });
  }

  setupOnInstallHook();
  seedPromptLibrary();
  registerAiSdkConnectBridge();
  registerTokenCountMessages();
  registerControlMessages();
  addContextMenus().catch((err) => console.error('Failed to setup context menus:', err));
  initializeControlHandlers();

  if (ENABLE_SAMPLES) {
    Promise.all([
      import('./sample/background-ai-provider').then((m) => m.registerBackgroundAiProviderSample()),
      import('./sample/connect-chat-transport').then((m) => m.registerConnectChatTransportSample()),
    ]).catch((err) => console.error('Failed to load samples:', err));
  }
});
