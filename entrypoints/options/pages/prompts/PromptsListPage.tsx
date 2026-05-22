import {
  ArrowDown,
  ArrowUp,
  Edit3,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
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
  setDefaultPrompt,
  type PromptSettings,
} from '@/lib/prompt-settings-storage';
import { OptionsPageTitle } from '../OptionsPageTitle';

function PromptMessagePreview({ message }: { message: string }) {
  return (
    <pre className="max-h-24 overflow-hidden whitespace-pre-wrap break-words rounded-md bg-muted/70 px-3 py-2 font-mono text-xs leading-5 text-muted-foreground">
      {message}
    </pre>
  );
}

export function PromptsListPage() {
  const messages = getUiMessages();
  const presets = getPromptPresets(browser.i18n.getUILanguage());
  const [settings, setSettings] = useState<PromptSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyPromptId, setBusyPromptId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const loadedSettings = await loadPromptSettings();

        if (!active) return;

        setSettings(loadedSettings);
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

      <section className="grid gap-4 border-b pb-7">
        <header className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">
                {messages.prompts.libraryTitle}
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                {messages.prompts.libraryDescription}
              </p>
            </div>
            <Button asChild>
              <Link to="/prompts/create">
                <Plus />
                {messages.prompts.create}
              </Link>
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {messages.prompts.createFromPreset}
          </span>
          {presets.map((preset) => (
            <Button asChild key={preset.key} size="sm" variant="outline">
              <Link to={`/prompts/create?preset=${preset.key}`}>
                <Sparkles />
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
              <article
                className="grid gap-4 rounded-md border p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto]"
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

                <div className="flex flex-wrap items-start gap-2 sm:w-[90px] sm:justify-end">
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
              </article>
            );
          })}
        </section>
      ) : null}
    </div>
  );
}
