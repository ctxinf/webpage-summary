import { ChevronDown, Copy, Play, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  getModelDisplayIcon,
  getModelProviderDefinition,
  type ModelConfigItem,
} from '@/constants/model-settings';
import type { PromptConfigItem } from '@/constants/prompt-settings';
import {
  loadModelSettings,
  setDefaultModelConfig,
} from '@/lib/model-settings-storage';
import {
  loadPromptSettings,
  seedDefaultPromptIfNeeded,
  setDefaultPrompt,
} from '@/lib/prompt-settings-storage';
import { sendMessage as sendExtMessage } from '@/lib/messaging';
import { getUiMessages } from '@/lib/i18n';

type ExtractResult =
  | { ok: true; title: string; url: string; text: string }
  | { ok: false; error?: string };

function App() {
  const manifest = browser.runtime.getManifest();
  const messages = getUiMessages();
  const [models, setModels] = useState<ModelConfigItem[]>([]);
  const [prompts, setPrompts] = useState<PromptConfigItem[]>([]);
  const [currentModelId, setCurrentModelId] = useState('');
  const [currentPromptId, setCurrentPromptId] = useState('');
  const [copying, setCopying] = useState(false);
  const [activeTabId, setActiveTabId] = useState<number | null>(null);
  const [isContentPage, setIsContentPage] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      await seedDefaultPromptIfNeeded();
      const [modelSettings, promptSettings] = await Promise.all([
        loadModelSettings(),
        loadPromptSettings(),
      ]);
      if (!active) return;
      setModels(modelSettings.models);
      setPrompts(promptSettings.prompts);
      setCurrentModelId(
        modelSettings.defaultModelId || modelSettings.models[0]?.id || '',
      );
      setCurrentPromptId(
        promptSettings.defaultPromptId || promptSettings.prompts[0]?.id || '',
      );
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [tab] = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (!active || !tab?.id) return;
        setActiveTabId(tab.id);
        try {
          await browser.tabs.sendMessage(tab.id, {
            type: 'WEBPAGE_SUMMARY_PING',
          });
          if (active) setIsContentPage(true);
        } catch {
          if (active) setIsContentPage(false);
        }
      } catch (e) {
        console.warn('[popup] failed to query active tab', e);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const handleModelChange = async (id: string) => {
    setCurrentModelId(id);
    await setDefaultModelConfig(id);
  };

  const handlePromptChange = async (id: string) => {
    setCurrentPromptId(id);
    await setDefaultPrompt(id);
  };

  const handleCopyPage = async () => {
    console.log('[popup] handleCopyPage clicked', { copying, activeTabId, isContentPage });
    if (copying) {
      console.log('[popup] already copying, skip');
      return;
    }
    if (!activeTabId) {
      console.warn('[popup] no active tab id');
      toast.error(messages.popup.noActiveTab);
      return;
    }
    setCopying(true);
    try {
      console.log('[popup] sending WEBPAGE_SUMMARY_EXTRACT_TEXT to tab', activeTabId);
      const result = (await browser.tabs.sendMessage(activeTabId, {
        type: 'WEBPAGE_SUMMARY_EXTRACT_TEXT',
      })) as ExtractResult | undefined;
      console.log('[popup] extract result', result);

      if (!result?.ok || !('text' in result) || !result.text) {
        console.warn('[popup] extract returned no text', result);
        toast.error(messages.popup.extractFailed);
        return;
      }
      console.log('[popup] writing to clipboard, length=', result.text.length);
      await navigator.clipboard.writeText(result.text);
      console.log('[popup] clipboard write success');
      toast.success(messages.popup.copySuccess);
    } catch (e) {
      console.error('[popup] copy page failed', e);
      toast.error(`${messages.popup.copyFailed}: ${(e as Error)?.message ?? e}`);
    } finally {
      setCopying(false);
    }
  };

  const handleSummarize = async () => {
    if (!activeTabId) return;
    try {
      await sendExtMessage(
        'invokeSummary',
        { beginSummary: true },
        { tabId: activeTabId },
      );
      window.close();
    } catch (e) {
      console.error('[popup] invoke summary failed', e);
      toast.error(messages.popup.invokeSummaryFailed);
    }
  };

  const currentModel = models.find((m) => m.id === currentModelId);

  return (
    <main className="grid max-w-3xl gap-1 px-2 py-1">
      <header className="flex items-center gap-1">
        <img
          src={browser.runtime.getURL('/icon/32.png')}
          alt="icon"
          className="aspect-square shrink-0 rounded-lg object-contain"
        />
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <h1 className="truncate  font-semibold leading-tight">
            {manifest.name}
          </h1>
          <span className="shrink-0 rounded-full bg-zinc-100 px-1 py-0.5 font-mono font-medium text-zinc-500">
            v{manifest.version}
          </span>
        </div>
        <button
          type="button"
          onClick={() => browser.runtime.openOptionsPage()}
          title={messages.popup.openOptions}
          className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-zinc-50 hover:text-foreground"
        >
          <Settings size={18} />
        </button>
      </header>

      <section className="grid gap-1.5">
        <SelectRow
          label={messages.popup.model}
          value={currentModelId}
          onChange={handleModelChange}
          options={models.map((m) => ({ value: m.id, label: m.name }))}
          icon={currentModel ? <ModelIcon model={currentModel} /> : undefined}
        />
        <SelectRow
          label={messages.popup.prompt}
          value={currentPromptId}
          onChange={handlePromptChange}
          options={prompts.map((p) => ({ value: p.id, label: p.name }))}
        />
      </section>

      <section className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          {isContentPage && (
            <button
              type="button"
              onClick={handleSummarize}
              title={messages.popup.openPanelAndStartSummary}
              className="flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 shadow-sm transition-colors hover:bg-emerald-100"
            >
              <Play size={13} className="fill-emerald-700 text-emerald-700" />
              <span>{messages.popup.summary}</span>
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopyPage}
          disabled={copying || !isContentPage}
          title={messages.popup.copyPageContentToClipboard}
          className={cn(
            'flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-zinc-50',
            (copying || !isContentPage) && 'cursor-not-allowed opacity-60',
          )}
        >
          <Copy size={14} />
          <span>{messages.popup.page}</span>
        </button>
      </section>
    </main>
  );
}

function ModelIcon({ model }: { model: ModelConfigItem }) {
  const providerDef = getModelProviderDefinition(model.providerId);
  const iconUrl = getModelDisplayIcon(model);
  const src =
    iconUrl.startsWith('http') || iconUrl.startsWith('data:')
      ? iconUrl
      : browser.runtime.getURL(iconUrl as any);
  return (
    <img
      src={src}
      alt={providerDef.label}
      className="pointer-events-none size-3.5 object-contain"
    />
  );
}

interface SelectRowProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  icon?: React.ReactNode;
}

function SelectRow({ label, value, onChange, options, icon }: SelectRowProps) {
  return (
    <label className="grid grid-cols-[56px_1fr] items-center gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-2 z-10 flex items-center">
            {icon}
          </span>
        )}
        <select
          className={cn(
            'w-full appearance-none truncate rounded-md border border-border bg-background py-1.5 pr-7 text-sm text-muted-foreground shadow-sm outline-none transition-colors hover:bg-zinc-50',
            icon ? 'pl-7' : 'pl-2.5',
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.length === 0 && <option value="">-</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2 text-zinc-400"
        />
      </div>
    </label>
  );
}

export default App;
