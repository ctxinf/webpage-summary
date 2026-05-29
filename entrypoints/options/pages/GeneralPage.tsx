import { RotateCcw, Save } from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  createDefaultGeneralSettings,
  type GeneralSettingKey,
  type GeneralSettings,
} from '@/constants/general-settings';
import {
  loadGeneralSettings,
  saveGeneralSettings,
} from '@/lib/general-settings-storage';
import { getUiMessages } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { OptionsPageTitle } from './OptionsPageTitle';

type BooleanSettingKey = Exclude<
  GeneralSettingKey,
  'pageTextExtractMethod' | 'summaryLanguage'
>;

const BOOLEAN_SETTING_SECTIONS = [
  {
    fields: [
      'enablePopupClickTrigger',
      'enableSummaryWindowDefault',
    ],
    key: 'panel',
  },
  {
    fields: [
      'enableAutoBeginSummaryByActionOrContextTrigger',
      'enableAutoBeginChatForAddSelectionToChat',
    ],
    key: 'triggers',
  },
  {
    fields: ['enableCreateNewPanelButton'],
    key: 'display',
  },
  {
    fields: [
      'enableContextMenuSummarizeThisPage',
      'enableContextMenuAddSelectionToChat',
    ],
    key: 'contextMenu',
  },
] satisfies Array<{
  fields: BooleanSettingKey[];
  key: 'contextMenu' | 'display' | 'panel' | 'triggers';
}>;

function settingsMatch(left: GeneralSettings, right: GeneralSettings) {
  return (Object.keys(left) as GeneralSettingKey[]).every(
    (key) => left[key] === right[key],
  );
}

type SettingRowProps = {
  checked: boolean;
  caution?: string;
  description: string;
  label: string;
  onChange: (checked: boolean) => void;
  statusLabels: {
    off: string;
    on: string;
  };
};

function SettingRow({
  checked,
  caution,
  description,
  label,
  onChange,
  statusLabels,
}: SettingRowProps) {
  return (
    <label className="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b py-4 last:border-b-0 max-sm:grid-cols-1">
      <span className="min-w-0">
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </span>
        {caution ? (
          <span className="mt-2 block border-l-2 border-amber-500 bg-amber-50 px-2 py-1 text-xs leading-5 text-amber-950">
            {caution}
          </span>
        ) : null}
      </span>

      <span className="inline-flex items-center gap-2 text-sm font-medium max-sm:justify-self-start">
        <input
          checked={checked}
          className="size-4 accent-primary"
          onChange={(event) => onChange(event.currentTarget.checked)}
          type="checkbox"
        />
        <span>{checked ? statusLabels.on : statusLabels.off}</span>
      </span>
    </label>
  );
}

export function GeneralPage() {
  const messages = getUiMessages();
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [savedSettings, setSavedSettings] = useState<GeneralSettings | null>(
    null,
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const loadedSettings = await loadGeneralSettings();

        if (!active) return;

        setSettings(loadedSettings);
        setSavedSettings(loadedSettings);
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error ? error.message : messages.general.loadFailed,
        );
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [messages.general.loadFailed]);

  const isDirty = useMemo(
    () =>
      settings !== null &&
      savedSettings !== null &&
      !settingsMatch(settings, savedSettings),
    [savedSettings, settings],
  );

  function updateSetting<Key extends GeneralSettingKey>(
    key: Key,
    value: GeneralSettings[Key],
  ) {
    setSettings((currentSettings) =>
      currentSettings ? { ...currentSettings, [key]: value } : currentSettings,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings || !isDirty) return;

    setIsSaving(true);

    try {
      await saveGeneralSettings(settings);
      setSavedSettings(settings);
      toast.success(messages.general.savedToast);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.general.saveFailed,
      );
    } finally {
      setIsSaving(false);
    }
  }

  function resetDraftToDefaults() {
    setSettings(createDefaultGeneralSettings());
  }

  if (loadError) {
    return (
      <>
        <OptionsPageTitle>{messages.general.title}</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <OptionsPageTitle>{messages.general.title}</OptionsPageTitle>
        <div className="text-sm text-muted-foreground">
          {messages.common.loadingSettings}
        </div>
      </>
    );
  }

  return (
    <form className="grid max-w-4xl gap-7 pb-24" onSubmit={handleSubmit}>
      <OptionsPageTitle>{messages.general.title}</OptionsPageTitle>

      <section className="grid gap-3 border-b pb-7">
        <label className="grid gap-2" htmlFor="summary-language">
          <span className="text-base font-semibold">
            {messages.general.summaryLanguage.label}
          </span>
          <span className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {messages.general.summaryLanguage.description}
          </span>
          <input
            className="h-9 w-full max-w-sm rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            id="summary-language"
            onChange={(event) =>
              updateSetting('summaryLanguage', event.currentTarget.value)
            }
            spellCheck={false}
            value={settings.summaryLanguage}
          />
        </label>
      </section>

      {BOOLEAN_SETTING_SECTIONS.map((section) => {
        const sectionMessage = messages.general.sections[section.key];

        return (
          <section key={section.key} aria-label={sectionMessage.title}>
            <header className="mb-1">
              <h2 className="text-base font-semibold">
                {sectionMessage.title}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                {sectionMessage.description}
              </p>
            </header>

            {section.fields.map((field) => {
              const fieldMessage = messages.general.settings[field];

              return (
                <SettingRow
                  checked={settings[field]}
                  caution={fieldMessage.caution}
                  description={fieldMessage.description}
                  key={field}
                  label={fieldMessage.label}
                  onChange={(checked) => updateSetting(field, checked)}
                  statusLabels={messages.common}
                />
              );
            })}
          </section>
        );
      })}

      <footer
        className={cn(
          'sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border bg-background/95 px-4 py-3 shadow-[0_-12px_30px_-28px_rgba(0,0,0,0.55)] backdrop-blur',
          isDirty ? 'border-primary/20' : 'border-border',
        )}
      >
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {isDirty
            ? messages.common.unsavedChanges
            : messages.common.allChangesSaved}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isSaving}
            onClick={resetDraftToDefaults}
            type="button"
            variant="outline"
          >
            <RotateCcw />
            {messages.general.restoreDefaults}
          </Button>
          <Button disabled={!isDirty || isSaving} type="submit">
            <Save />
            {isSaving ? messages.common.saving : messages.common.save}
          </Button>
        </div>
      </footer>
    </form>
  );
}
