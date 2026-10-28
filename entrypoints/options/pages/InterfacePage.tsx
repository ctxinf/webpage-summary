import { Brain, ChevronRight, ExternalLink, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  GENERAL_SETTING_DEFINITIONS,
  type GeneralSettingKey,
  type GeneralSettings,
} from '@/constants/general-settings';
import { getModelDisplayIcon } from '@/constants/model-settings';
import {
  loadGeneralSettings,
  saveGeneralSettings,
} from '@/lib/general-settings-storage';
import { getUiMessages } from '@/lib/i18n';
import {
  loadModelSettings,
  setDefaultModelConfig,
  type ModelSettings,
} from '@/lib/model-settings-storage';
import {
  loadPromptSettings,
  setDefaultPrompt,
  seedDefaultPromptIfNeeded,
  type PromptSettings,
} from '@/lib/prompt-settings-storage';
import { cn } from '@/lib/utils';
import { OptionsPageTitle } from './OptionsPageTitle';
import { useTheme } from '@/components/theme-provider';

function PanelPreview({ mode }: { mode: 'dialog' | 'sidebar' }) {
  return (
    <div className="relative h-32 w-48 max-w-full rounded-md border-0 bg-gray-100 p-2 shadow-sm flex overflow-hidden">
      {/* Browser chrome simulation */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gray-300 flex items-center px-1 space-x-1">
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
      </div>
      
      {/* Content simulation */}
      <div className="mt-4 flex-1 rounded-sm bg-white border border-gray-200 p-2">
        <div className="h-2 w-1/2 rounded bg-gray-300 mb-2" />
        <div className="h-2 w-3/4 rounded bg-gray-300" />
      </div>

      {mode === 'dialog' && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-24 rounded-md shadow-lg bg-white border border-gray-300 flex flex-col p-1 z-10 transition-all">
          <div className="h-1.5 w-8 rounded bg-gray-300 mb-1" />
          <div className="flex-1 rounded-sm bg-green-100 border border-green-200" />
        </div>
      )}

      {mode === 'sidebar' && (
        <div className="absolute top-4 bottom-0 right-0 w-16 bg-white border-l border-gray-400 shadow-sm flex flex-col p-1 z-10 transition-all">
          <div className="h-1.5 w-8 rounded bg-gray-300 mb-1" />
          <div className="flex-1 rounded-sm bg-green-100 border border-green-200" />
        </div>
      )}
    </div>
  );
}

function FloatingBallPreview() {
  return (
    <div className="relative h-32 w-48 max-w-full rounded-md border-0 bg-gray-100 p-2 shadow-sm flex overflow-hidden">
      {/* Browser chrome simulation */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gray-300 flex items-center px-1 space-x-1">
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
      </div>
      
      {/* Content simulation */}
      <div className="mt-4 flex-1 rounded-sm bg-white border border-gray-200 p-2">
        <div className="h-2 w-full rounded bg-gray-300 mb-2" />
        <div className="h-2 w-5/6 rounded bg-gray-300 mb-2" />
        <div className="h-2 w-4/5 rounded bg-gray-300" />
      </div>
      
      {/* Floating Ball */}
      <div className="absolute bottom-3 right-3 size-6 rounded-full bg-white shadow-md border border-gray-300 flex items-center justify-center z-10">
        <div className="size-3 rounded-full bg-green-600" />
      </div>
    </div>
  );
}

function ChatInputPreview() {
  return (
    <div className="relative h-32 w-48 max-w-full rounded-md border-0 bg-gray-100 p-2 shadow-sm flex overflow-hidden">
      {/* Browser chrome simulation */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gray-300 flex items-center px-1 space-x-1">
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
      </div>
      
      {/* Content simulation */}
      <div className="mt-4 flex-1 rounded-sm bg-white border border-gray-200 p-2 relative">
        <div className="h-2 w-full rounded bg-gray-300 mb-2" />
        <div className="h-2 w-5/6 rounded bg-gray-300 mb-2" />
        <div className="h-2 w-4/5 rounded bg-gray-300" />
      </div>

      {/* The Dialog Panel simulation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-28 rounded-md shadow-lg bg-white border border-gray-300 flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="h-3 bg-gray-100 border-b border-gray-200 flex items-center px-1.5">
          <div className="h-1 w-8 rounded bg-gray-300" />
        </div>
        
        {/* Conversations */}
        <div className="flex-1 flex flex-col gap-1.5 p-1.5 bg-green-50/50">
          <div className="h-1.5 w-16 bg-green-200 rounded-sm self-end" />
          <div className="h-1.5 w-20 bg-gray-200 rounded-sm self-start" />
        </div>

        {/* Input with send button */}
        <div className="h-5 border-t border-gray-200 bg-white flex items-center px-1 gap-1">
          <div className="h-3 flex-1 bg-gray-100 border border-green-500 rounded-sm" />
          <div className="size-3 bg-green-600 rounded-sm flex items-center justify-center shrink-0">
            <div className="size-1 bg-white rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryBehaviorPreview({ thinking = false }: { thinking?: boolean }) {
  return (
    <div aria-hidden="true" className="relative flex h-32 w-48 max-w-full overflow-hidden rounded-md bg-gray-100 p-2 shadow-sm">
      <div className="absolute inset-x-0 top-0 flex h-4 items-center gap-1 bg-gray-300 px-1">
        {[0, 1, 2].map((dot) => <div key={dot} className="size-1.5 rounded-full bg-gray-500" />)}
      </div>
      <div className="mt-4 flex-1 rounded-sm border border-gray-200 bg-white p-2">
        <div className="mb-2 h-2 w-full rounded bg-gray-300" />
        <div className="h-2 w-4/5 rounded bg-gray-300" />
      </div>
      <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-28 -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-md border border-gray-300 bg-white shadow-lg">
        <div className="flex h-4 shrink-0 items-center justify-between border-b border-gray-200 bg-gray-100 px-1.5">
          <div className="h-1 w-8 rounded bg-gray-300" />
          {!thinking && <Zap className="size-2.5 fill-green-500 text-green-600" />}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-1.5">
          {thinking ? (
            <div className="flex items-center gap-1 rounded border border-green-200 bg-green-50 px-1 py-1 text-green-700">
              <Brain className="size-2.5 shrink-0" />
              <div className="h-1 w-12 rounded bg-green-400" />
              <ChevronRight className="ml-auto size-2.5 shrink-0" />
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-700">
              <Zap className="size-2.5 shrink-0" />
              <div className="h-1 w-14 rounded bg-green-300" />
            </div>
          )}
          <div className="h-1 w-full rounded bg-gray-200" />
          <div className="h-1 w-3/4 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function TokenUsagePreview() {
  return (
    <div className="relative h-32 w-48 max-w-full rounded-md border-0 bg-gray-100 p-2 shadow-sm flex overflow-hidden">
      {/* Browser chrome simulation */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gray-300 flex items-center px-1 space-x-1">
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
        <div className="size-1.5 rounded-full bg-gray-500" />
      </div>
      
      {/* Content simulation */}
      <div className="mt-4 flex-1 rounded-sm bg-white border border-gray-200 p-2 relative">
        <div className="h-2 w-full rounded bg-gray-300 mb-2" />
        <div className="h-2 w-5/6 rounded bg-gray-300 mb-2" />
        <div className="h-2 w-4/5 rounded bg-gray-300" />
      </div>

      {/* The Dialog Panel simulation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-28 rounded-md shadow-lg bg-white border border-gray-300 flex flex-col overflow-hidden z-10">
        {/* Header */}
        <div className="h-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between px-1.5">
          <div className="h-1.5 w-6 rounded bg-gray-400" />
          {/* Token Usage Badge */}
          <div className="flex items-center gap-0.5 px-1 py-[1px] rounded-[2px] bg-blue-50 border border-blue-200">
            <div className="size-1 rounded-full bg-blue-500" />
            <div className="h-1 w-3 rounded bg-blue-600/70" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col gap-1 p-1.5 bg-white">
          <div className="h-1 w-full bg-gray-200 rounded-sm" />
          <div className="h-1 w-3/4 bg-gray-200 rounded-sm" />
          <div className="h-1 w-5/6 bg-gray-200 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function InterfacePage() {
  const messages = getUiMessages();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<GeneralSettings | null>(null);
  const [modelSettings, setModelSettings] = useState<ModelSettings | null>(null);
  const [promptSettings, setPromptSettings] = useState<PromptSettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        await seedDefaultPromptIfNeeded();
        const [loadedSettings, loadedModels, loadedPrompts] = await Promise.all([
          loadGeneralSettings(),
          loadModelSettings(),
          loadPromptSettings(),
        ]);

        if (!active) return;

        setSettings(loadedSettings);
        setModelSettings(loadedModels);
        setPromptSettings(loadedPrompts);
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

  async function updateSetting<Key extends GeneralSettingKey>(
    key: Key,
    value: GeneralSettings[Key],
  ) {
    if (!settings) return;

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await saveGeneralSettings(newSettings);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : messages.general.saveFailed,
      );
      // Revert optimistic update on failure
      setSettings(settings);
    }
  }

  if (loadError) {
    return (
      <>
        <OptionsPageTitle>{messages.interface.title}</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  if (!settings) {
    return (
      <>
        <OptionsPageTitle>{messages.interface.title}</OptionsPageTitle>
        <div className="text-sm text-muted-foreground">
          {messages.common.loadingSettings}
        </div>
      </>
    );
  }

  return (
    <div className="pb-24">
      <OptionsPageTitle>{messages.interface.title}</OptionsPageTitle>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] xl:gap-8">
        {/* Left: Main Settings */}
        <div className="min-w-0 space-y-8">
          
          <div className="flex flex-col gap-6">

            {/* Panel Layout Mode */}
            <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
              <header className="mb-6">
                <h2 className="text-base font-semibold text-foreground w-fit flex items-center gap-2" title={GENERAL_SETTING_DEFINITIONS.panelLayoutMode.storageKey}>
                  {messages.interface.panelLayout.title}
                  
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {messages.interface.panelLayout.description}
                </p>
              </header>

            <RadioGroup
              className="grid gap-6 sm:grid-cols-2"
              onValueChange={(value) => updateSetting('panelLayoutMode', value)}
              value={settings.panelLayoutMode}
            >
              <label
                className={cn(
                  'cursor-pointer rounded-lg border-2 p-4 transition-colors',
                  settings.panelLayoutMode === 'dialog'
                    ? 'border-green-500 bg-green-500/10 text-green-800'
                    : 'border-transparent bg-muted/50 hover:bg-muted',
                )}
              >
                <div className="mb-4 flex justify-center">
                  <PanelPreview mode="dialog" />
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="dialog" id="dialog" />
                  <span className="font-medium">
                    {messages.interface.panelLayout.dialog}
                  </span>
                </div>
              </label>

              <label
                className={cn(
                  'cursor-pointer rounded-lg border-2 p-4 transition-colors',
                  settings.panelLayoutMode === 'sidebar'
                    ? 'border-green-500 bg-green-500/10 text-green-800'
                    : 'border-transparent bg-muted/50 hover:bg-muted',
                )}
              >
                <div className="mb-4 flex justify-center">
                  <PanelPreview mode="sidebar" />
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="sidebar" id="sidebar" />
                  <span className="font-medium">
                    {messages.interface.panelLayout.sidebar}
                  </span>
                </div>
              </label>
            </RadioGroup>
          </section>

          {/* Floating Ball */}
            <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex justify-center">
                <FloatingBallPreview />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-[1_1_12rem]">
                  <h2 className="text-base font-semibold text-foreground w-fit" title={GENERAL_SETTING_DEFINITIONS.enableFloatingBall.storageKey}>
                    {messages.interface.floatingBall.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {messages.interface.floatingBall.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    (Default: <input type="checkbox" checked={GENERAL_SETTING_DEFINITIONS.enableFloatingBall.defaultValue as boolean} disabled readOnly className="size-3.5 cursor-not-allowed ml-0.5" />)
                  </span>
                  <Switch
                    checked={settings.enableFloatingBall}
                    onCheckedChange={(checked) =>
                      updateSetting('enableFloatingBall', checked)
                    }
                  />
                </div>
              </div>
            </section>

            {/* Chat Input Box */}
            <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex justify-center">
                <ChatInputPreview />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-[1_1_12rem]">
                  <h2 className="text-base font-semibold text-foreground w-fit" title={GENERAL_SETTING_DEFINITIONS.enableChatInputBox.storageKey}>
                    {messages.interface.chatInputBox.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {messages.interface.chatInputBox.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    (Default: <input type="checkbox" checked={GENERAL_SETTING_DEFINITIONS.enableChatInputBox.defaultValue as boolean} disabled readOnly className="size-3.5 cursor-not-allowed ml-0.5" />)
                  </span>
                  <Switch
                    checked={settings.enableChatInputBox}
                    onCheckedChange={(checked) =>
                      updateSetting('enableChatInputBox', checked)
                    }
                  />
                </div>
              </div>
            </section>

            {/* Create New Panel Button */}
            <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-[1_1_12rem]">
                  <h2 className="text-base font-semibold text-foreground w-fit" title={GENERAL_SETTING_DEFINITIONS.enableCreateNewPanelButton.storageKey}>
                    {messages.general.settings.enableCreateNewPanelButton.label}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {messages.general.settings.enableCreateNewPanelButton.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    (Default: <input type="checkbox" checked={GENERAL_SETTING_DEFINITIONS.enableCreateNewPanelButton.defaultValue as boolean} disabled readOnly className="size-3.5 cursor-not-allowed ml-0.5" />)
                  </span>
                  <Switch
                    checked={settings.enableCreateNewPanelButton}
                    onCheckedChange={(checked) =>
                      updateSetting('enableCreateNewPanelButton', checked)
                    }
                  />
                </div>
              </div>
            </section>

          </div>

        </div>

        {/* Right: Sidebar Shortcuts */}
        <aside className="min-w-0 space-y-6 xl:border-l xl:border-border xl:pl-6">
          
          <div className="w-full max-w-[300px] space-y-4">
            {/* Theme Selection */}
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-foreground">
                Theme Appearance:
              </span>
              <RadioGroup
                className="flex gap-2"
                onValueChange={(value) => setTheme(value as any)}
                value={theme}
              >
                <label className={cn('cursor-pointer flex-1 flex items-center justify-center rounded-md border p-1.5 transition-colors', theme === 'light' ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' : 'border-border bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground')}>
                  <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                  <span className="text-xs font-medium">Light</span>
                </label>
                <label className={cn('cursor-pointer flex-1 flex items-center justify-center rounded-md border p-1.5 transition-colors', theme === 'dark' ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' : 'border-border bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground')}>
                  <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                  <span className="text-xs font-medium">Dark</span>
                </label>
                <label className={cn('cursor-pointer flex-1 flex items-center justify-center rounded-md border p-1.5 transition-colors', theme === 'system' ? 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400' : 'border-border bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground')}>
                  <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                  <span className="text-xs font-medium">System</span>
                </label>
              </RadioGroup>
            </div>

            <hr className="border-border" />

            {/* Model Shortcut */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground shrink-0">
                {messages.interface.shortcuts.model}:
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                {modelSettings ? (
                  <Select
                    value={modelSettings.defaultModelId ?? undefined}
                    onValueChange={async (value) => {
                      if (value) {
                        await setDefaultModelConfig(value);
                        setModelSettings(await loadModelSettings());
                      }
                    }}
                  >
                    <SelectTrigger className="w-full max-w-[180px] min-w-0 h-8 text-xs bg-transparent shadow-sm">
                      <SelectValue placeholder={`-- ${messages.options.header.defaultModel} --`} />
                    </SelectTrigger>
                    <SelectContent>
                      {modelSettings.models.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                            <img
                              alt=""
                              className="size-4 shrink-0 object-contain"
                              src={getModelDisplayIcon(m)}
                            />
                            <span className="truncate">{m.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-8 w-full max-w-[180px] min-w-0 rounded-md bg-muted animate-pulse" />
                )}
                <Link
                  to="/models"
                  title={messages.interface.shortcuts.model}
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="size-4" />
                </Link>
              </div>
            </div>

            <hr className="border-border" />

            {/* Prompt Shortcut */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground shrink-0">
                {messages.interface.shortcuts.prompt}:
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                {promptSettings ? (
                  <Select
                    value={promptSettings.defaultPromptId ?? undefined}
                    onValueChange={async (value) => {
                      if (value) {
                        await setDefaultPrompt(value);
                        setPromptSettings(await loadPromptSettings());
                      }
                    }}
                  >
                    <SelectTrigger className="w-full max-w-[180px] min-w-0 h-8 text-xs bg-transparent shadow-sm">
                      <SelectValue placeholder={`-- ${messages.options.header.defaultPrompt} --`} />
                    </SelectTrigger>
                    <SelectContent>
                      {promptSettings.prompts.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          <span className="truncate">{p.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="h-8 w-full max-w-[180px] min-w-0 rounded-md bg-muted animate-pulse" />
                )}
                <Link
                  to="/prompts"
                  title={messages.interface.shortcuts.prompt}
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="size-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Token Usage View */}
          <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex justify-center">
              <TokenUsagePreview />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0 flex-[1_1_12rem]">
                <h2 className="text-base font-semibold text-foreground w-fit" title={GENERAL_SETTING_DEFINITIONS.enableTokenUsageView.storageKey}>
                  {messages.general.settings.enableTokenUsageView.label}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {messages.general.settings.enableTokenUsageView.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  (Default: <input type="checkbox" checked={GENERAL_SETTING_DEFINITIONS.enableTokenUsageView.defaultValue as boolean} disabled readOnly className="size-3.5 cursor-not-allowed ml-0.5" />)
                </span>
                <Switch
                  checked={settings.enableTokenUsageView}
                  onCheckedChange={(checked) =>
                    updateSetting('enableTokenUsageView', checked)
                  }
                />
              </div>
            </div>
          </section>

          {/* Auto Begin Summary */}
          <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex justify-center">
              <SummaryBehaviorPreview />
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-[1_1_12rem]">
                <h2 id="auto-summary-label" className="text-base font-semibold text-foreground" title={GENERAL_SETTING_DEFINITIONS.enableAutoBeginSummary.storageKey}>
                  {messages.general.settings.enableAutoBeginSummary.label}
                </h2>
                {messages.general.settings.enableAutoBeginSummary.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {messages.general.settings.enableAutoBeginSummary.description}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3 pt-1">
                <span className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-muted-foreground">
                  (Default: <input type="checkbox" checked={GENERAL_SETTING_DEFINITIONS.enableAutoBeginSummary.defaultValue as boolean} disabled readOnly className="ml-0.5 size-3.5 cursor-not-allowed" />)
                </span>
                <Switch
                  aria-labelledby="auto-summary-label"
                  checked={settings.enableAutoBeginSummary}
                  onCheckedChange={(checked) => updateSetting('enableAutoBeginSummary', checked)}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-6 flex justify-center">
              <SummaryBehaviorPreview thinking />
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-[1_1_12rem]">
                <h2 id="collapse-reasoning-label" className="text-base font-semibold text-foreground" title={GENERAL_SETTING_DEFINITIONS.collapseReasoningWhileThinking.storageKey}>
                  {messages.general.settings.collapseReasoningWhileThinking.label}
                </h2>
                <p id="collapse-reasoning-description" className="mt-1 text-sm text-muted-foreground">
                  {messages.general.settings.collapseReasoningWhileThinking.description}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 pt-1">
                <span className="flex items-center gap-1 whitespace-nowrap text-xs text-muted-foreground font-medium">
                  (Default: <input type="checkbox" checked={GENERAL_SETTING_DEFINITIONS.collapseReasoningWhileThinking.defaultValue as boolean} disabled readOnly className="size-3.5 cursor-not-allowed ml-0.5" />)
                </span>
                <Switch
                  aria-labelledby="collapse-reasoning-label"
                  aria-describedby="collapse-reasoning-description"
                  checked={settings.collapseReasoningWhileThinking}
                  onCheckedChange={(checked) => updateSetting('collapseReasoningWhileThinking', checked)}
                />
              </div>
            </div>
          </section>


        </aside>
      </div>
    </div>
  );
}
