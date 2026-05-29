import type { StorageItemKey } from '#imports';
import {
  isPageTextExtractMethod,
  type PageTextExtractMethod,
} from './page-extraction';

type GeneralSettingDefinition<T> = {
  defaultValue: T | (() => T);
  parse: (value: unknown, fallback: T) => T;
  storageKey: StorageItemKey;
};

function booleanSetting(
  storageKey: StorageItemKey,
  defaultValue: boolean,
): GeneralSettingDefinition<boolean> {
  return {
    defaultValue,
    parse: (value, fallback) =>
      typeof value === 'boolean' ? value : fallback,
    storageKey,
  };
}

function stringSetting(
  storageKey: StorageItemKey,
  defaultValue: string | (() => string),
): GeneralSettingDefinition<string> {
  return {
    defaultValue,
    parse: (value, fallback) => (typeof value === 'string' ? value : fallback),
    storageKey,
  };
}

function pageTextExtractMethodSetting(
  storageKey: StorageItemKey,
  defaultValue: PageTextExtractMethod,
): GeneralSettingDefinition<PageTextExtractMethod> {
  return {
    defaultValue,
    parse: (value, fallback) =>
      isPageTextExtractMethod(value) ? value : fallback,
    storageKey,
  };
}

export const GENERAL_SETTING_DEFINITIONS = {
  summaryLanguage: stringSetting('local:summary-lang', () =>
    browser.i18n.getUILanguage(),
  ),
  pageTextExtractMethod: pageTextExtractMethodSetting(
    'local:page-text-extract-method',
    'readability',
  ),
  enableChatInputBox: booleanSetting('local:enable-chat-input-box', true),
  enableFloatingBall: booleanSetting('local:enable-floating-ball', true),
  enableSummaryWindowDefault: booleanSetting(
    'local:enable-summary-window-default',
    false,
  ),
  enableAutoBeginSummary: booleanSetting(
    'local:enable-auto-begin-summary',
    false,
  ),
  enableAutoBeginSummaryByActionOrContextTrigger: booleanSetting(
    'local:enable-auto-begin-summary-by-action-or-context-trigger',
    true,
  ),
  enableAutoBeginChatForAddSelectionToChat: booleanSetting(
    'local:enable-auto-begin-chat-for-add-selection-to-chat',
    false,
  ),
  enableTokenUsageView: booleanSetting(
    // Keep the reference project's storage key spelling for migration compatibility.
    'local:enable-tokan-usage-view',
    true,
  ),
  enableCreateNewPanelButton: booleanSetting(
    'local:enable-create-new-panel-button',
    true,
  ),
  enableContextMenuSummarizeThisPage: booleanSetting(
    'local:enable-context-menu-summarize-this-page',
    true,
  ),
  enableContextMenuAddSelectionToChat: booleanSetting(
    'local:context-menu-add-selection-to-chat',
    true,
  ),
  panelLayoutMode: stringSetting('local:panel-layout-mode', 'dialog'),
} as const;

type GeneralSettingDefinitionMap = typeof GENERAL_SETTING_DEFINITIONS;

type SettingValue<TDefinition> =
  TDefinition extends GeneralSettingDefinition<infer TValue> ? TValue : never;

export type GeneralSettings = {
  [Key in keyof GeneralSettingDefinitionMap]: SettingValue<
    GeneralSettingDefinitionMap[Key]
  >;
};

export type GeneralSettingKey = keyof GeneralSettings;

export function getGeneralSettingEntries() {
  return Object.entries(GENERAL_SETTING_DEFINITIONS) as Array<
    [GeneralSettingKey, GeneralSettingDefinition<GeneralSettings[GeneralSettingKey]>]
  >;
}

function getDefaultValue<T>(definition: GeneralSettingDefinition<T>) {
  return typeof definition.defaultValue === 'function'
    ? (definition.defaultValue as () => T)()
    : definition.defaultValue;
}

export function createDefaultGeneralSettings(): GeneralSettings {
  return Object.fromEntries(
    getGeneralSettingEntries().map(([key, definition]) => [
      key,
      getDefaultValue(definition),
    ]),
  ) as GeneralSettings;
}
