import {
  ArrowDown,
  ArrowUp,
  Edit3,
  FileText,
  Plus,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  getPromptPresets,
  type PromptConfigItem,
} from '@/constants/prompt-settings';
import { getUiMessages } from '@/lib/i18n';
import {
  deletePrompt,
  loadPromptSettings,
  movePrompt,
  seedDefaultPromptIfNeeded,
  setDefaultPrompt,
  type PromptSettings,
} from '@/lib/prompt-settings-storage';
import {
  loadGeneralSettings,
  saveGeneralSettings,
} from '@/lib/general-settings-storage';
import { GENERAL_SETTING_DEFINITIONS } from '@/constants/general-settings';
import { cn } from '@/lib/utils';
import { OptionsPageTitle } from '../OptionsPageTitle';

const TEMPLATE_VARIABLE_PATTERN = /(\{\{[^}]*\}\})/g;

function renderPromptMessage(message: string) {
  return message.split(TEMPLATE_VARIABLE_PATTERN).map((part, index) => {
    if (!part) return null;

    if (part.startsWith('{{') && part.endsWith('}}')) {
      return (
        <span className="font-bold text-black" key={`${part}-${index}`}>
          {part}
        </span>
      );
    }

    return part;
  });
}

function PromptMessagePreview({ message }: { message: string }) {
  return (
    <pre className="max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-md bg-muted/70 px-3 py-2 font-mono text-xs leading-5 text-muted-foreground">
      {renderPromptMessage(message)}
    </pre>
  );
}

export function PromptsListPage() {
  const messages = getUiMessages();
  const presets = getPromptPresets();
  const [settings, setSettings] = useState<PromptSettings | null>(null);
  const [summaryLang, setSummaryLang] = useState<string>('');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyPromptId, setBusyPromptId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        await seedDefaultPromptIfNeeded();
        const loadedSettings = await loadPromptSettings();
        const generalSettings = await loadGeneralSettings();

        if (!active) return;

        setSettings(loadedSettings);
        setSummaryLang(generalSettings.summaryLanguage);
      } catch (error) {
        if (!active) return;

        setLoadError(
          error instanceof Error ? error.message : messages.prompts.loadFailed,
        );
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [messages.prompts.loadFailed]);

  async function reloadSettings() {
    setSettings(await loadPromptSettings());
  }

  async function runPromptAction(
    promptId: string,
    action: () => Promise<boolean>,
    errorMessage: string,
  ) {
    setBusyPromptId(promptId);

    try {
      const succeeded = await action();

      if (!succeeded) {
        throw new Error(errorMessage);
      }

      await reloadSettings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : errorMessage);
    } finally {
      setBusyPromptId(null);
    }
  }

  async function handleUpdateSummaryLang(value: string) {
    try {
      const gs = await loadGeneralSettings();
      if (gs.summaryLanguage === value) return;
      gs.summaryLanguage = value;
      await saveGeneralSettings(gs);
      setSummaryLang(value);
      toast.success(messages.common.saved);
    } catch (e) {
      toast.error(messages.general.saveFailed);
    }
  }

  function handleDelete(prompt: PromptConfigItem) {
    if (!window.confirm(messages.prompts.deleteConfirm(prompt.name))) {
      return;
    }

    runPromptAction(
      prompt.id,
      async () => {
        const deleted = await deletePrompt(prompt.id);

        if (deleted) {
          toast.success(messages.prompts.deletedToast);
        }

        return deleted;
      },
      messages.prompts.deleteFailed,
    );
  }

  if (loadError) {
    return (
      <>
        <OptionsPageTitle>{messages.pageTitles.prompts}</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  return (
    <div className="grid max-w-5xl gap-7 pb-16">
      <OptionsPageTitle>{messages.pageTitles.prompts}</OptionsPageTitle>

      {summaryLang !== undefined ? (
        <section className="flex items-center justify-between gap-4 border-b pb-5">
          <label className="flex items-baseline gap-2 min-w-0" htmlFor="summary-language">
            <span 
              className="text-sm font-semibold whitespace-nowrap"
              title={GENERAL_SETTING_DEFINITIONS.summaryLanguage.storageKey}
            >
              {messages.general.summaryLanguage.label}
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider whitespace-nowrap">
              (Default: Browser Lang)
            </span>
            <span className="text-xs text-muted-foreground truncate">
              ({messages.general.summaryLanguage.description})
            </span>
          </label>
          <input
            className="h-8 w-40 shrink-0 rounded-md border bg-background px-2.5 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
            id="summary-language"
            value={summaryLang}
            onChange={(e) => setSummaryLang(e.target.value)}
            onBlur={(e) => handleUpdateSummaryLang(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
            }}
            spellCheck={false}
          />
        </section>
      ) : null}

      <section className="flex flex-wrap items-center justify-between gap-3 border-b pb-7">
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link to="/prompts/create">
              <Plus />
              {messages.prompts.create}
            </Link>
          </Button>
          {settings?.defaultPromptId ? (() => {
            const defaultPrompt = settings.prompts.find(p => p.id === settings.defaultPromptId);
            return defaultPrompt ? (
              <div className="text-sm font-bold text-primary">
                Default: {defaultPrompt.name}
              </div>
            ) : null;
          })() : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground">
            {messages.prompts.createFromPreset}
          </span>
          {presets.map((preset) => (
            <Button asChild key={preset.key} size="sm" variant="outline">
              <Link to={`/prompts/create?preset=${preset.key}`}>
                <FileText />
                {preset.name}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      {!settings ? (
        <div className="text-sm text-muted-foreground">
          {messages.common.loadingSettings}
        </div>
      ) : null}

      {settings && settings.prompts.length === 0 ? (
        <section className="grid max-w-2xl gap-3 rounded-md border border-dashed p-6">
          <h2 className="text-base font-semibold">{messages.prompts.emptyTitle}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {messages.prompts.emptyDescription}
          </p>
          <Button asChild className="justify-self-start">
            <Link to="/prompts/create?preset=basic">
              <Plus />
              {messages.prompts.create}
            </Link>
          </Button>
        </section>
      ) : null}

      {settings && settings.prompts.length > 0 ? (
        <section className="grid gap-3" aria-label={messages.prompts.libraryTitle}>
          {settings.prompts.map((prompt, index) => {
            const isDefault = settings.defaultPromptId === prompt.id;
            const isBusy = busyPromptId === prompt.id;

            return (
              <motion.article
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "grid gap-4 rounded-md border p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto] transition-colors",
                  isDefault ? "border-primary/30 bg-primary/5" : "bg-card"
                )}
                key={prompt.id}
              >
                <div className="min-w-0">
                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <input
                      aria-label={messages.prompts.makeDefault(prompt.name)}
                      checked={isDefault}
                      className="size-4 accent-primary"
                      disabled={isBusy}
                      name="default-prompt"
                      onChange={() =>
                        runPromptAction(
                          prompt.id,
                          () => setDefaultPrompt(prompt.id),
                          messages.prompts.selectDefaultFailed,
                        )
                      }
                      type="radio"
                    />
                    <span className="min-w-0 text-base font-semibold">
                      {prompt.name}
                    </span>
                    {isDefault ? (
                      <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        {messages.prompts.defaultBadge}
                      </span>
                    ) : null}
                  </label>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="grid min-w-0 gap-1">
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {messages.prompts.systemMessage}
                      </span>
                      <PromptMessagePreview message={prompt.systemMessage} />
                    </div>
                    <div className="grid min-w-0 gap-1">
                      <span className="text-xs font-medium uppercase text-muted-foreground">
                        {messages.prompts.userMessage}
                      </span>
                      <PromptMessagePreview message={prompt.userMessage} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 sm:justify-end">
                  <Button
                    aria-label={messages.prompts.moveUp(prompt.name)}
                    disabled={isBusy || index === 0}
                    onClick={() =>
                      runPromptAction(
                        prompt.id,
                        () => movePrompt(prompt.id, 'up'),
                        messages.prompts.moveFailed,
                      )
                    }
                    size="icon"
                    title={messages.prompts.moveUp(prompt.name)}
                    type="button"
                    variant="outline"
                  >
                    <ArrowUp />
                  </Button>
                  <Button
                    aria-label={messages.prompts.moveDown(prompt.name)}
                    disabled={isBusy || index === settings.prompts.length - 1}
                    onClick={() =>
                      runPromptAction(
                        prompt.id,
                        () => movePrompt(prompt.id, 'down'),
                        messages.prompts.moveFailed,
                      )
                    }
                    size="icon"
                    title={messages.prompts.moveDown(prompt.name)}
                    type="button"
                    variant="outline"
                  >
                    <ArrowDown />
                  </Button>
                  <Button
                    aria-label={messages.prompts.edit(prompt.name)}
                    asChild
                    disabled={isBusy}
                    size="icon"
                    title={messages.prompts.edit(prompt.name)}
                    variant="outline"
                  >
                    <Link to={`/prompts/edit?id=${prompt.id}`}>
                      <Edit3 />
                    </Link>
                  </Button>
                  <Button
                    aria-label={messages.prompts.delete(prompt.name)}
                    disabled={isBusy}
                    onClick={() => handleDelete(prompt)}
                    size="icon"
                    title={messages.prompts.delete(prompt.name)}
                    type="button"
                    variant="destructive"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </motion.article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
