import { storage } from '#imports';
import {
  createDefaultGeneralSettings,
  getGeneralSettingEntries,
  type GeneralSettings,
} from '@/constants/general-settings';

export async function loadGeneralSettings(): Promise<GeneralSettings> {
  const defaults = createDefaultGeneralSettings();
  const definitions = getGeneralSettingEntries();
  const storedItems = await storage.getItems(
    definitions.map(([key, definition]) => ({
      key: definition.storageKey,
      options: { fallback: defaults[key] },
    })),
  );

  return Object.fromEntries(
    definitions.map(([key, definition], index) => [
      key,
      definition.parse(storedItems[index]?.value, defaults[key]),
    ]),
  ) as GeneralSettings;
}

export async function saveGeneralSettings(settings: GeneralSettings) {
  const defaults = createDefaultGeneralSettings();

  await storage.setItems(
    getGeneralSettingEntries().map(([key, definition]) => ({
      key: definition.storageKey,
      value: definition.parse(settings[key], defaults[key]),
    })),
  );
}
