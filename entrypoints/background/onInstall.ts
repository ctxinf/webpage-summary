import { browser } from 'wxt/browser';
import { storage } from '#imports';
import { MODEL_CONFIGS_V2_STORAGE_KEY, MODEL_PROVIDER_DEFINITIONS } from '@/constants/model-settings';
import { migrateModelConfigs, runFullMigration } from '@/lib/migration';

import { createLogger } from '@/lib/logger';

const logger = createLogger('background:onInstall');

export function setupOnInstallHook() {
  browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
      // First install logic if needed
    } else if (details.reason === 'update') {
      await handleExtensionUpdate(details.previousVersion);
    }
  });
}

async function handleExtensionUpdate(previousVersion?: string) {
  try {
    const logs = await runFullMigration();
    logger.info('Migration during extension update completed:', logs);
  } catch (err) {
    logger.error('Failed to run migration during update:', err);
  }
}
