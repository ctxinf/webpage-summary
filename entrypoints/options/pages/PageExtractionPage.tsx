import { RotateCcw, Save } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  createDefaultGeneralSettings,
  type GeneralSettings,
} from '@/constants/general-settings';
import {
  loadGeneralSettings,
  saveGeneralSettings,
} from '@/lib/general-settings-storage';
import type { PageTextExtractMethod } from '@/lib/page-extraction';
import { OptionsPageTitle } from './OptionsPageTitle';

type ExtractMethodOption = {
  description: string;
  label: string;
  value: PageTextExtractMethod;
};

const EXTRACT_METHOD_OPTIONS: ExtractMethodOption[] = [
  {
    description:
      'Reader-mode extraction for articles. This remains the default input path.',
    label: 'Readability',
    value: 'readability',
  },
  {
    description:
      'Scores semantic DOM containers to keep long visible content such as documentation callouts and notes.',
    label: 'DOM heuristic',
    value: 'dom-heuristic',
  },
];

export function PageExtractionPage() {
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [savedMethod, setSavedMethod] =
    useState<PageTextExtractMethod>('readability');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const loadedSettings = await loadGeneralSettings();

        if (!active) return;

        setSettings(loadedSettings);
        setSavedMethod(loadedSettings.pageTextExtractMethod);
      } catch (error) {
        if (!active) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Page extraction settings failed to load.',
        );
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings || settings.pageTextExtractMethod === savedMethod) {
      return;
    }

    setIsSaving(true);

    try {
      await saveGeneralSettings(settings);
      setSavedMethod(settings.pageTextExtractMethod);
      toast.success('Page extraction settings saved.');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Page extraction settings failed to save.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  function updateMethod(pageTextExtractMethod: PageTextExtractMethod) {
    setSettings((currentSettings) =>
      currentSettings
        ? { ...currentSettings, pageTextExtractMethod }
        : currentSettings,
    );
  }

  function resetDraftToDefault() {
    updateMethod(createDefaultGeneralSettings().pageTextExtractMethod);
  }

  if (loadError) {
    return (
      <>
        <OptionsPageTitle>Page Extraction</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <OptionsPageTitle>Page Extraction</OptionsPageTitle>
        <div className="text-sm text-muted-foreground">
          Loading settings...
        </div>
      </>
    );
  }

  const isDirty = settings.pageTextExtractMethod !== savedMethod;

  return (
    <form className="grid max-w-4xl gap-7 pb-24" onSubmit={handleSubmit}>
      <OptionsPageTitle>Page Extraction</OptionsPageTitle>

      <section className="grid gap-3 border-b pb-7">
        <header>
          <h2 className="text-base font-semibold">Text Extraction Method</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Select the general extraction path used before summary input is
            assembled.
          </p>
        </header>

        <div className="grid max-w-2xl gap-3">
          {EXTRACT_METHOD_OPTIONS.map((option) => (
            <label
              className="grid cursor-pointer grid-cols-[16px_minmax(0,1fr)] gap-3 rounded-md border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-muted/60"
              key={option.value}
            >
              <input
                checked={settings.pageTextExtractMethod === option.value}
                className="mt-1 size-4 accent-primary"
                name="page-text-extract-method"
                onChange={() => updateMethod(option.value)}
                type="radio"
                value={option.value}
              />
              <span>
                <span className="block text-sm font-medium">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {option.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-2 border-t bg-background py-4">
        <Button disabled={!isDirty || isSaving} type="submit">
          <Save />
          Save
        </Button>
        <Button
          disabled={isSaving}
          onClick={resetDraftToDefault}
          type="button"
          variant="outline"
        >
          <RotateCcw />
          Default readability
        </Button>
        <span className="text-sm text-muted-foreground">
          {isDirty ? 'Unsaved changes' : 'Saved'}
        </span>
      </div>
    </form>
  );
}
