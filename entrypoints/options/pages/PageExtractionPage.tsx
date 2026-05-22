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
import { getUiMessages } from '@/lib/i18n';
import type { PageTextExtractMethod } from '@/lib/page-extraction';
import { OptionsPageTitle } from './OptionsPageTitle';

const EXTRACT_METHOD_OPTIONS: PageTextExtractMethod[] = [
  'readability',
  'dom-heuristic',
];

export function PageExtractionPage() {
  const messages = getUiMessages();
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
            : messages.pageExtraction.loadFailed,
        );
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [messages.pageExtraction.loadFailed]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!settings || settings.pageTextExtractMethod === savedMethod) {
      return;
    }

    setIsSaving(true);

    try {
      await saveGeneralSettings(settings);
      setSavedMethod(settings.pageTextExtractMethod);
      toast.success(messages.pageExtraction.savedToast);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : messages.pageExtraction.saveFailed,
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
        <OptionsPageTitle>{messages.pageExtraction.title}</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <OptionsPageTitle>{messages.pageExtraction.title}</OptionsPageTitle>
        <div className="text-sm text-muted-foreground">
          {messages.common.loadingSettings}
        </div>
      </>
    );
  }

  const isDirty = settings.pageTextExtractMethod !== savedMethod;

  return (
    <form className="grid max-w-4xl gap-7 pb-24" onSubmit={handleSubmit}>
      <OptionsPageTitle>{messages.pageExtraction.title}</OptionsPageTitle>

      <section className="grid gap-3 border-b pb-7">
        <header>
          <h2 className="text-base font-semibold">
            {messages.pageExtraction.method.title}
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {messages.pageExtraction.method.description}
          </p>
        </header>

        <div className="grid max-w-2xl gap-3">
          {EXTRACT_METHOD_OPTIONS.map((method) => {
            const methodMessage = messages.pageExtraction.methods[method];

            return (
              <label
                className="grid cursor-pointer grid-cols-[16px_minmax(0,1fr)] gap-3 rounded-md border p-4 transition-colors has-[:checked]:border-primary has-[:checked]:bg-muted/60"
                key={method}
              >
                <input
                  checked={settings.pageTextExtractMethod === method}
                  className="mt-1 size-4 accent-primary"
                  name="page-text-extract-method"
                  onChange={() => updateMethod(method)}
                  type="radio"
                  value={method}
                />
                <span>
                  <span className="block text-sm font-medium">
                    {methodMessage.label}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {methodMessage.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <div className="sticky bottom-0 flex flex-wrap items-center gap-2 border-t bg-background py-4">
        <Button disabled={!isDirty || isSaving} type="submit">
          <Save />
          {messages.common.save}
        </Button>
        <Button
          disabled={isSaving}
          onClick={resetDraftToDefault}
          type="button"
          variant="outline"
        >
          <RotateCcw />
          {messages.pageExtraction.defaultReadability}
        </Button>
        <span className="text-sm text-muted-foreground">
          {isDirty ? messages.common.unsavedChanges : messages.common.saved}
        </span>
      </div>
    </form>
  );
}
