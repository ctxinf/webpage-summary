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
import { cn } from '@/lib/utils';
import { OptionsPageTitle } from './OptionsPageTitle';

type BooleanSettingKey = Exclude<
  GeneralSettingKey,
  'pageTextExtractMethod' | 'summaryLanguage'
>;

type GeneralSettingSection = {
  title: string;
  description: string;
  fields: Array<{
    key: BooleanSettingKey;
    label: string;
    description: string;
    caution?: string;
  }>;
};

const BOOLEAN_SETTING_SECTIONS: GeneralSettingSection[] = [
  {
    title: 'Panel',
    description: 'Choose how summary controls appear inside the page.',
    fields: [
      {
        key: 'enableChatInputBox',
        label: 'Chat input box',
        description: 'Show the chat input inside the summary panel.',
      },
      {
        key: 'enableFloatingBall',
        label: 'Floating button',
        description: 'Show a page control for opening the summary panel.',
      },
      {
        key: 'enablePopupClickTrigger',
        label: 'Popup click opens summary',
        description:
          'Use the extension action click as a summary trigger instead of the popup panel.',
      },
      {
        key: 'enableSummaryWindowDefault',
        label: 'Open panel on new pages',
        description: 'Open the summary panel as a page starts.',
        caution: 'This changes the default behavior on every matching page.',
      },
    ],
  },
  {
    title: 'Triggers',
    description: 'Control when an open panel starts work automatically.',
    fields: [
      {
        key: 'enableAutoBeginSummary',
        label: 'Start summary after panel opens',
        description: 'Begin summarizing as soon as the summary panel opens.',
      },
      {
        key: 'enableAutoBeginSummaryByActionOrContextTrigger',
        label: 'Start after action or context trigger',
        description:
          'Begin summarizing when the extension action or a context menu opens the panel.',
      },
      {
        key: 'enableAutoBeginChatForAddSelectionToChat',
        label: 'Send selected text after adding it',
        description:
          'Start chat automatically after selected page text is added to the conversation.',
      },
    ],
  },
  {
    title: 'Display',
    description: 'Keep the summary panel focused on the controls you use.',
    fields: [
      {
        key: 'enableTokenUsageView',
        label: 'Token usage',
        description: 'Show token usage information in the panel header.',
      },
      {
        key: 'enableCreateNewPanelButton',
        label: 'New panel button',
        description: 'Show the control for creating another summary panel.',
      },
    ],
  },
  {
    title: 'Context Menu',
    description: 'Choose which page menu entries the extension exposes.',
    fields: [
      {
        key: 'enableContextMenuSummarizeThisPage',
        label: 'Summarize this page',
        description: 'Show the context menu item for summarizing the page.',
      },
      {
        key: 'enableContextMenuAddSelectionToChat',
        label: 'Add selection to chat',
        description:
          'Show the context menu item for adding selected text to chat.',
      },
    ],
  },
];

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
};

function SettingRow({
  checked,
  caution,
  description,
  label,
  onChange,
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
        <span>{checked ? 'On' : 'Off'}</span>
      </span>
    </label>
  );
}

export function GeneralPage() {
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
        console.log('error',error)
        setLoadError(
          error instanceof Error ? error.message : 'General settings failed to load.',
        );
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

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
      toast.success('General settings saved.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'General settings failed to save.',
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
        <OptionsPageTitle>General Setting</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <OptionsPageTitle>General Setting</OptionsPageTitle>
        <div className="text-sm text-muted-foreground">Loading settings...</div>
      </>
    );
  }

  return (
    <form className="grid max-w-4xl gap-7 pb-24" onSubmit={handleSubmit}>
      <OptionsPageTitle>General Setting</OptionsPageTitle>

      <section className="grid gap-3 border-b pb-7">
        <label className="grid gap-2" htmlFor="summary-language">
          <span className="text-base font-semibold">Summary Language</span>
          <span className="max-w-2xl text-sm leading-6 text-muted-foreground">
            Language tag or locale used for generated summaries.
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

      {BOOLEAN_SETTING_SECTIONS.map((section) => (
        <section key={section.title} aria-label={section.title}>
          <header className="mb-1">
            <h2 className="text-base font-semibold">{section.title}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {section.description}
            </p>
          </header>

          {section.fields.map((field) => (
            <SettingRow
              checked={settings[field.key]}
              caution={field.caution}
              description={field.description}
              key={field.key}
              label={field.label}
              onChange={(checked) => updateSetting(field.key, checked)}
            />
          ))}
        </section>
      ))}

      <footer
        className={cn(
          'sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border bg-background/95 px-4 py-3 shadow-[0_-12px_30px_-28px_rgba(0,0,0,0.55)] backdrop-blur',
          isDirty ? 'border-primary/20' : 'border-border',
        )}
      >
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {isDirty ? 'Unsaved changes.' : 'All changes are saved.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={isSaving}
            onClick={resetDraftToDefaults}
            type="button"
            variant="outline"
          >
            <RotateCcw />
            Restore defaults
          </Button>
          <Button disabled={!isDirty || isSaving} type="submit">
            <Save />
            {isSaving ? 'Saving' : 'Save'}
          </Button>
        </div>
      </footer>
    </form>
  );
}
