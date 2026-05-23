import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCcw,
  Save,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  MODEL_PROVIDER_DEFINITIONS,
  createDefaultModelDraft,
  getModelProviderDefinition,
  type ModelDraft,
  type ModelProviderId,
} from '@/constants/model-settings';
import {
  fetchRemoteModels,
  type RemoteModelInfo,
} from '@/lib/model-settings-storage';
import { cn } from '@/lib/utils';

type ModelEditorProps = {
  initialDraft: ModelDraft;
  isSaving: boolean;
  onSubmit: (draft: ModelDraft) => void | Promise<void>;
  submitLabel: string;
};

function stringifyJson(value: Record<string, unknown> | Record<string, string>) {
  return Object.keys(value).length ? JSON.stringify(value, null, 2) : '';
}

function parseJsonObject(value: string, label: string) {
  const text = value.trim();

  if (!text) return {};

  const parsed = JSON.parse(text) as unknown;

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON object.`);
  }

  return parsed as Record<string, unknown>;
}

function parseNumberInput(value: string) {
  const numberValue = Number(value);

  return Number.isFinite(numberValue) && numberValue > 0 ? numberValue : 0;
}

function numberInputValue(value: number) {
  return value > 0 ? value : '';
}

export function ModelEditor({
  initialDraft,
  isSaving,
  onSubmit,
  submitLabel,
}: ModelEditorProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [headersText, setHeadersText] = useState(stringifyJson(initialDraft.headers));
  const [extraBodyText, setExtraBodyText] = useState(
    stringifyJson(initialDraft.extraBody),
  );
  const [remoteModels, setRemoteModels] = useState<RemoteModelInfo[]>([]);
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [areBaseURLPresetsExpanded, setAreBaseURLPresetsExpanded] =
    useState(false);

  const provider = useMemo(
    () => getModelProviderDefinition(draft.providerId),
    [draft.providerId],
  );

  useEffect(() => {
    setDraft(initialDraft);
    setHeadersText(stringifyJson(initialDraft.headers));
    setExtraBodyText(stringifyJson(initialDraft.extraBody));
    setRemoteModels([]);
    setIsModelPickerOpen(false);
    setAreBaseURLPresetsExpanded(false);
  }, [initialDraft]);

  function updateDraft<Key extends keyof ModelDraft>(
    key: Key,
    value: ModelDraft[Key],
  ) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [key]: value,
    }));
  }

  function updateProvider(providerId: ModelProviderId) {
    const nextDefaults = createDefaultModelDraft(providerId);

    setDraft((currentDraft) => ({
      ...currentDraft,
      apiMode: nextDefaults.apiMode,
      baseURL: nextDefaults.baseURL,
      modelId: nextDefaults.modelId,
      name:
        currentDraft.name ===
        getModelProviderDefinition(currentDraft.providerId).label
          ? nextDefaults.name
          : currentDraft.name,
      providerId,
    }));
    setRemoteModels([]);
    setIsModelPickerOpen(false);
    setAreBaseURLPresetsExpanded(false);
  }

  async function loadRemoteModels() {
    setIsLoadingModels(true);

    try {
      const models = await fetchRemoteModels({
        ...draft,
        extraBody: parseJsonObject(extraBodyText, 'Extra body'),
        headers: parseJsonObject(headersText, 'Headers') as Record<string, string>,
      });

      setRemoteModels(models);

      if (models.length === 0) {
        toast.error('No models returned.');
        return;
      }

      setIsModelPickerOpen(true);
      toast.success('Models loaded.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Models failed to load.');
    } finally {
      setIsLoadingModels(false);
    }
  }

  function selectRemoteModel(modelId: string) {
    updateDraft('modelId', modelId);
    setIsModelPickerOpen(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await onSubmit({
        ...draft,
        extraBody: parseJsonObject(extraBodyText, 'Extra body'),
        headers: parseJsonObject(headersText, 'Headers') as Record<string, string>,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Model failed to save.');
    }
  }

  const shouldCollapseBaseURLPresets = provider.baseURLPresets.length > 8;
  const areBaseURLPresetsCollapsed =
    shouldCollapseBaseURLPresets && !areBaseURLPresetsExpanded;

  return (
    <>
      <form className="grid max-w-4xl gap-8 pb-24" onSubmit={handleSubmit}>
        <section className="grid gap-3 border-b pb-8">
          <fieldset className="grid gap-3">
            <legend className="text-sm font-medium">
              <FieldLabel required>Provider</FieldLabel>
            </legend>
            <div className="flex flex-wrap gap-2">
              {MODEL_PROVIDER_DEFINITIONS.map((providerDefinition) => {
                const isSelected = draft.providerId === providerDefinition.id;

                return (
                  <button
                    className={cn(
                      'inline-flex min-h-11 w-[210px] items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'bg-background',
                    )}
                    key={providerDefinition.id}
                    onClick={() => updateProvider(providerDefinition.id)}
                    title={providerDefinition.desc}
                    type="button"
                  >
                    <img
                      alt=""
                      className="size-5 shrink-0 object-contain"
                      src={providerDefinition.iconPath}
                      title={providerDefinition.desc}
                    />
                    <span className="min-w-0 whitespace-nowrap font-medium leading-5">
                      {providerDefinition.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        <section className="grid gap-5 border-b pb-7">
          <div className="grid max-w-2xl gap-1">
            <div className="flex items-center gap-2">
              <img
                alt=""
                className="max-h-7 max-w-24 shrink-0 object-contain"
                src={provider.iconPath}
                title={provider.desc}
              />
              <span className="min-w-0 text-lg font-semibold leading-7">
                {provider.label}
              </span>
              <a
                aria-label={`Open ${provider.label} AI SDK provider docs`}
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                href={provider.docsUrl}
                rel="noreferrer"
                target="_blank"
                title="Open AI SDK provider docs"
              >
                <ExternalLink className="size-4" />
              </a>
            </div>
            <p className="text-muted-foreground">{provider.desc}</p>
          </div>

          <label className="grid max-w-2xl gap-2" htmlFor="model-name">
            <FieldLabel required>Config Name</FieldLabel>
            <input
              autoFocus
              className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              id="model-name"
              onChange={(event) => updateDraft('name', event.currentTarget.value)}
              placeholder="DashScope Qwen"
              required
              spellCheck={false}
              value={draft.name}
            />
          </label>
        </section>

        <section className="grid gap-4 border-b pb-7">
          {provider.supportsBaseURL ? (
            <div className="grid max-w-2xl gap-2">
              <label className="text-sm font-medium" htmlFor="model-base-url">
                <FieldLabel required>Base URL</FieldLabel>
              </label>
              <input
                className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                id="model-base-url"
                onChange={(event) =>
                  updateDraft('baseURL', event.currentTarget.value)
                }
                placeholder={provider.defaultBaseURL}
                spellCheck={false}
                value={draft.baseURL}
              />
              {provider.baseURLPresets.length > 0 ? (
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      'flex min-w-0 flex-1 flex-wrap gap-2',
                      areBaseURLPresetsCollapsed && 'max-h-8 overflow-hidden',
                    )}
                  >
                    {provider.baseURLPresets.map((preset) => (
                      <button
                        className={cn(
                          'shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs transition-colors hover:bg-accent',
                          draft.baseURL === preset.url
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'bg-background text-muted-foreground',
                        )}
                        key={`${provider.id}-${preset.url}`}
                        onClick={() => updateDraft('baseURL', preset.url)}
                        type="button"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  {shouldCollapseBaseURLPresets ? (
                    <Button
                      aria-expanded={areBaseURLPresetsExpanded}
                      className="h-8 shrink-0 px-2.5 text-xs"
                      onClick={() =>
                        setAreBaseURLPresetsExpanded((value) => !value)
                      }
                      title={
                        areBaseURLPresetsExpanded
                          ? 'Collapse Base URL presets'
                          : 'Show more Base URL presets'
                      }
                      type="button"
                      variant="outline"
                    >
                      {areBaseURLPresetsExpanded ? (
                        <>
                          <ChevronUp className="size-3.5" />
                          收起
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-3.5" />
                          更多...
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}

          {provider.supportsApiMode ? (
            <fieldset className="grid max-w-2xl gap-2">
              <legend className="text-sm font-medium">
                <FieldLabel required>API Mode</FieldLabel>
              </legend>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm">
                  <input
                    checked={draft.apiMode === 'chat'}
                    className="size-4 accent-primary"
                    name="model-api-mode"
                    onChange={() => updateDraft('apiMode', 'chat')}
                    type="radio"
                    value="chat"
                  />
                  <span>Chat Completions</span>
                </label>
                <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm">
                  <input
                    checked={draft.apiMode === 'responses'}
                    className="size-4 accent-primary"
                    name="model-api-mode"
                    onChange={() => updateDraft('apiMode', 'responses')}
                    type="radio"
                    value="responses"
                  />
                  <span>Responses</span>
                </label>
              </div>
            </fieldset>
          ) : null}

          <div className="grid max-w-2xl gap-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium" htmlFor="model-id">
                <FieldLabel required>Model Name</FieldLabel>
              </label>
              <Button
                className="h-7 px-2"
                disabled={!provider.supportsModelFetch || isLoadingModels}
                onClick={() => void loadRemoteModels()}
                size="sm"
                title="Fetch models"
                type="button"
                variant="outline"
              >
                <RefreshCcw />
                {isLoadingModels ? 'Fetching' : 'Fetch'}
              </Button>
            </div>
            <input
              className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              id="model-id"
              onChange={(event) =>
                updateDraft('modelId', event.currentTarget.value)
              }
              required
              spellCheck={false}
              value={draft.modelId}
            />
          </div>

          {provider.requiresApiKey ? (
            <div className="grid max-w-2xl gap-2">
              <label className="text-sm font-medium" htmlFor="model-api-key">
                <FieldLabel optional>API Key</FieldLabel>
              </label>
              <div className="flex rounded-md border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
                <input
                  className="h-9 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
                  id="model-api-key"
                  onChange={(event) =>
                    updateDraft('apiKey', event.currentTarget.value)
                  }
                  spellCheck={false}
                  type={isApiKeyVisible ? 'text' : 'password'}
                  value={draft.apiKey}
                />
                <Button
                  aria-label={isApiKeyVisible ? 'Hide API key' : 'Show API key'}
                  onClick={() => setIsApiKeyVisible((value) => !value)}
                  size="icon"
                  title={isApiKeyVisible ? 'Hide API key' : 'Show API key'}
                  type="button"
                  variant="ghost"
                >
                  {isApiKeyVisible ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="grid max-w-2xl gap-2 border-b pb-7">
          <NumberField
            label="Max input tokens"
            optional
            onChange={(value) => updateDraft('maxInputTokens', value)}
            value={draft.maxInputTokens}
          />
        </section>

        {draft.providerId !== 'browser-ai' ? (
          <section className="grid max-w-2xl gap-3 border-b pb-7">
            <JsonDetails
              id="model-extra-body"
              label="Extra Body JSON"
              optional
              onChange={setExtraBodyText}
              placeholder={'{\n  "enable_search": true\n}'}
              value={extraBodyText}
            />

            <JsonDetails
              id="model-headers"
              label="Custom Headers JSON"
              optional
              onChange={setHeadersText}
              placeholder={'{\n  "HTTP-Referer": "https://example.com"\n}'}
              value={headersText}
            />
          </section>
        ) : null}

        <details className="grid max-w-2xl rounded-md border px-3 py-2">
          <summary className="cursor-pointer select-none text-base font-semibold">
            Limits and Pricing
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <NumberField
              label="Input price / 1M tokens"
              optional
              onChange={(value) => updateDraft('inputTokenPrice', value)}
              step="0.000001"
              value={draft.inputTokenPrice}
            />
            <NumberField
              label="Output price / 1M tokens"
              optional
              onChange={(value) => updateDraft('outputTokenPrice', value)}
              step="0.000001"
              value={draft.outputTokenPrice}
            />
            <label className="grid gap-2" htmlFor="model-price-unit">
              <FieldLabel optional>Price Unit</FieldLabel>
              <input
                className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                id="model-price-unit"
                onChange={(event) =>
                  updateDraft('priceUnit', event.currentTarget.value)
                }
                placeholder="$"
                value={draft.priceUnit}
              />
            </label>
          </div>
        </details>

        <footer className="sticky bottom-0 flex items-center gap-3 border-t bg-background/95 py-4 backdrop-blur">
          <Button disabled={isSaving} type="submit">
            <Save />
            {isSaving ? 'Saving' : submitLabel}
          </Button>
        </footer>
      </form>

      {isModelPickerOpen ? (
        <ModelPickerModal
          models={remoteModels}
          onClose={() => setIsModelPickerOpen(false)}
          onSelect={selectRemoteModel}
          selectedModelId={draft.modelId}
        />
      ) : null}
    </>
  );
}

function JsonDetails({
  id,
  label,
  optional = false,
  onChange,
  placeholder,
  value,
}: {
  id: string;
  label: string;
  optional?: boolean;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <details className="grid rounded-md border px-3 py-2">
      <summary className="cursor-pointer select-none text-sm font-medium">
        <FieldLabel optional={optional}>{label}</FieldLabel>
      </summary>
      <textarea
        className="mt-3 min-h-36 w-full resize-y rounded-md border bg-background px-3 py-2 font-mono text-sm leading-6 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        id={id}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={placeholder}
        spellCheck={false}
        value={value}
      />
    </details>
  );
}

function NumberField({
  label,
  onChange,
  optional = false,
  step = '1',
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  optional?: boolean;
  step?: string;
  value: number;
}) {
  return (
    <label className="grid gap-2">
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <input
        className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
        min="0"
        onChange={(event) => onChange(parseNumberInput(event.currentTarget.value))}
        placeholder="Default"
        step={step}
        type="number"
        value={numberInputValue(value)}
      />
    </label>
  );
}

function FieldLabel({
  children,
  optional = false,
  required = false,
}: {
  children: string;
  optional?: boolean;
  required?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium">
      <span>{children}</span>
      {required ? <span className="text-destructive">*</span> : null}
      {optional ? (
        <span className="text-xs font-normal text-muted-foreground">optional</span>
      ) : null}
    </span>
  );
}

function ModelPickerModal({
  models,
  onClose,
  onSelect,
  selectedModelId,
}: {
  models: RemoteModelInfo[];
  onClose: () => void;
  onSelect: (modelId: string) => void;
  selectedModelId: string;
}) {
  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4"
      role="dialog"
    >
      <section className="grid max-h-[min(680px,90vh)] w-full max-w-2xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-md border bg-background shadow-xl">
        <header className="flex items-center gap-3 border-b px-4 py-3">
          <h2 className="text-base font-semibold">Select Model</h2>
          <div className="grow" />
          <Button
            aria-label="Close"
            onClick={onClose}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X />
          </Button>
        </header>
        <div className="grid min-h-0 gap-2 overflow-auto p-3">
          {models.map((model) => (
            <button
              className={cn(
                'grid gap-1 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                selectedModelId === model.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'bg-background',
              )}
              key={model.id}
              onClick={() => onSelect(model.id)}
              type="button"
            >
              <span className="break-words font-medium">{model.id}</span>
              {model.label !== model.id ? (
                <span className="break-words text-xs text-muted-foreground">
                  {model.label}
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
