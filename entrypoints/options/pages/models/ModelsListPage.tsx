import { Edit3, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  getModelProviderDefinition,
  type ModelConfigItem,
} from '@/constants/model-settings';
import { getUiMessages } from '@/lib/i18n';
import {
  deleteModelConfig,
  loadModelSettings,
  setDefaultModelConfig,
  type ModelSettings,
} from '@/lib/model-settings-storage';
import { OptionsPageTitle } from '../OptionsPageTitle';

export function ModelsListPage() {
  const messages = getUiMessages();
  const [settings, setSettings] = useState<ModelSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyModelId, setBusyModelId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const loadedSettings = await loadModelSettings();

        if (!active) return;

        setSettings(loadedSettings);
      } catch (error) {
        if (!active) return;

        setLoadError(
          error instanceof Error ? error.message : 'Model settings failed to load.',
        );
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  async function reloadSettings() {
    setSettings(await loadModelSettings());
  }

  async function runModelAction(
    modelId: string,
    action: () => Promise<boolean>,
    errorMessage: string,
  ) {
    setBusyModelId(modelId);

    try {
      const succeeded = await action();

      if (!succeeded) {
        throw new Error(errorMessage);
      }

      await reloadSettings();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : errorMessage);
    } finally {
      setBusyModelId(null);
    }
  }

  function handleDelete(model: ModelConfigItem) {
    if (!window.confirm(`Delete "${model.name}"?`)) {
      return;
    }

    runModelAction(
      model.id,
      async () => {
        const deleted = await deleteModelConfig(model.id);

        if (deleted) {
          toast.success('Model deleted.');
        }

        return deleted;
      },
      'Model could not be deleted.',
    );
  }

  if (loadError) {
    return (
      <>
        <OptionsPageTitle>{messages.pageTitles.models}</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  return (
    <div className="grid max-w-5xl gap-7 pb-16">
      <OptionsPageTitle>{messages.pageTitles.models}</OptionsPageTitle>

      <section className="flex flex-wrap items-end justify-between gap-3 border-b pb-7">
        <Button asChild>
          <Link to="/models/create">
            <Plus />
            Create model
          </Link>
        </Button>
      </section>

      {!settings ? (
        <div className="text-sm text-muted-foreground">
          {messages.common.loadingSettings}
        </div>
      ) : null}

      {settings && settings.models.length === 0 ? (
        <section className="grid max-w-2xl gap-3 rounded-md border border-dashed p-6">
          <h2 className="text-base font-semibold">No model configs yet</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Create one model config before the background bridge can call a provider.
          </p>
          <Button asChild className="justify-self-start">
            <Link to="/models/create">
              <Plus />
              Create model
            </Link>
          </Button>
        </section>
      ) : null}

      {settings && settings.models.length > 0 ? (
        <section className="grid gap-3" aria-label="Model configs">
          {settings.models.map((model) => {
            const provider = getModelProviderDefinition(model.providerId);
            const isDefault = settings.defaultModelId === model.id;
            const isBusy = busyModelId === model.id;

            return (
              <article
                className="grid gap-4 rounded-md border p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto]"
                key={model.id}
              >
                <div className="min-w-0">
                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <input
                      aria-label={`Use ${model.name} by default`}
                      checked={isDefault}
                      className="size-4 accent-primary"
                      disabled={isBusy}
                      name="default-model"
                      onChange={() =>
                        runModelAction(
                          model.id,
                          () => setDefaultModelConfig(model.id),
                          'Default model could not be changed.',
                        )
                      }
                      type="radio"
                    />
                    <span className="min-w-0 text-base font-semibold">
                      {model.name}
                    </span>
                    {isDefault ? (
                      <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                        Default
                      </span>
                    ) : null}
                  </label>

                  <dl className="mt-4 grid gap-3 text-sm lg:grid-cols-2">
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase text-muted-foreground">
                        Provider
                      </dt>
                      <dd className="mt-1 break-words">{provider.label}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase text-muted-foreground">
                        Model
                      </dt>
                      <dd className="mt-1 break-words font-mono text-xs">
                        {model.modelId}
                      </dd>
                    </div>
                    {provider.supportsBaseURL ? (
                      <div className="min-w-0 lg:col-span-2">
                        <dt className="text-xs font-medium uppercase text-muted-foreground">
                          Base URL
                        </dt>
                        <dd className="mt-1 break-words font-mono text-xs">
                          {model.baseURL}
                        </dd>
                      </div>
                    ) : null}
                    {provider.supportsApiMode ? (
                      <div className="min-w-0">
                        <dt className="text-xs font-medium uppercase text-muted-foreground">
                          API Mode
                        </dt>
                        <dd className="mt-1">{model.apiMode}</dd>
                      </div>
                    ) : null}
                    {model.maxInputTokens ? (
                      <div className="min-w-0">
                        <dt className="text-xs font-medium uppercase text-muted-foreground">
                          Max Input Tokens
                        </dt>
                        <dd className="mt-1">{model.maxInputTokens}</dd>
                      </div>
                    ) : null}
                    {model.inputTokenPrice || model.outputTokenPrice ? (
                      <div className="min-w-0">
                        <dt className="text-xs font-medium uppercase text-muted-foreground">
                          Price
                        </dt>
                        <dd className="mt-1">
                          {model.priceUnit} {model.inputTokenPrice || 0}/M input
                          {' / '}
                          {model.priceUnit} {model.outputTokenPrice || 0}/M output
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>

                <div className="flex flex-wrap items-start gap-2 sm:w-[90px] sm:justify-end">
                  <Button
                    aria-label={`Edit ${model.name}`}
                    asChild
                    disabled={isBusy}
                    size="icon"
                    title={`Edit ${model.name}`}
                    variant="outline"
                  >
                    <Link to={`/models/edit?id=${model.id}`}>
                      <Edit3 />
                    </Link>
                  </Button>
                  <Button
                    aria-label={`Delete ${model.name}`}
                    disabled={isBusy}
                    onClick={() => handleDelete(model)}
                    size="icon"
                    title={`Delete ${model.name}`}
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
