import { browser } from 'wxt/browser';
import { storage } from '#imports';
import { MODEL_CONFIGS_V2_STORAGE_KEY, MODEL_PROVIDER_DEFINITIONS } from '@/constants/model-settings';
import { migrateModelConfigs, runFullMigration } from '@/lib/migration';

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
    console.log('Migration during extension update completed:', logs);
  } catch (err) {
    console.error('Failed to run migration during update:', err);
  }
}
