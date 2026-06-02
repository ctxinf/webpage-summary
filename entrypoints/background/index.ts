import { browser } from 'wxt/browser';
import { ENABLE_SAMPLES } from '@/constants/flag';
import { seedDefaultPromptIfNeeded } from '@/lib/prompt-settings-storage';
import { registerAiSdkConnectBridge } from './ai-sdk-connect-bridge';
import { registerTokenCountMessages } from './token-count-bg';
import { setupOnInstallHook } from './onInstall';
import { registerControlMessages, addContextMenus, initializeControlHandlers } from './control';
import { setupCorsFixRule } from './cors-fix';

import { createLogger } from '@/lib/logger';

const logger = createLogger('background:index');

export default defineBackground(() => {
  logger.info('Hello background!', { id: browser.runtime.id });

  function seedPromptLibrary() {
    seedDefaultPromptIfNeeded().catch((error) => {
      logger.error('Failed to create initial prompt.', error);
    });
  }

  setupOnInstallHook();
  seedPromptLibrary();
  setupCorsFixRule().catch((err) => logger.error('Failed to setup CORS fix rule:', err));
  registerAiSdkConnectBridge();
  registerTokenCountMessages();
  registerControlMessages();
  addContextMenus().catch((err) => logger.error('Failed to setup context menus:', err));
  initializeControlHandlers();

  if (ENABLE_SAMPLES) {
    Promise.all([
      import('./sample/background-ai-provider').then((m) => m.registerBackgroundAiProviderSample()),
      import('./sample/connect-chat-transport').then((m) => m.registerConnectChatTransportSample()),
    ]).catch((err) => logger.error('Failed to load samples:', err));
  }
});
