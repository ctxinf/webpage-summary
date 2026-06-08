import { ChevronDown, Globe, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  DEFAULT_BLACKLIST,
  DEFAULT_SITE_CUSTOMIZATION,
  DEFAULT_WHITELIST,
  type BlackList,
  type SiteCustomizationItem,
  type WhiteList,
} from '@/constants/site-rules';
import { getUiMessages } from '@/lib/i18n';
import {
  loadSiteRules,
  saveBlacklist,
  saveSiteCustomization,
  saveWhitelist,
} from '@/lib/site-rules-storage';
import { cn } from '@/lib/utils';
import { OptionsPageTitle } from './OptionsPageTitle';

type DraftState = {
  whitelist: WhiteList;
  blacklist: BlackList;
  customization: SiteCustomizationItem[];
};

function createEmptyCustomization(): SiteCustomizationItem {
  return {
    enable: true,
    pattern: '',
    selectors: [],
    useShadowRoot: false,
    shadowRootSelectors: [],
  };
}

function textToList(value: string) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function listToText(list: string[] | undefined) {
  return (list ?? []).join('\n');
}

function rulesEqual(a: DraftState, b: DraftState) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function SiteCustomizationPage() {
  const messages = getUiMessages();
  const m = messages.siteCustomization;

  const [draft, setDraft] = useState<DraftState | null>(null);
  const [saved, setSaved] = useState<DraftState | null>(null);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { whitelist, blacklist, siteCustomization } = await loadSiteRules();
        if (!active) return;
        const initial: DraftState = {
          whitelist,
          blacklist,
          customization: siteCustomization,
        };
        setDraft(initial);
        setSaved(initial);
        setExpanded(new Set(siteCustomization.map((_, i) => i)));
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Failed to load site rules.',
        );
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const isDirty = useMemo(
    () => draft !== null && saved !== null && !rulesEqual(draft, saved),
    [draft, saved],
  );

  const updateWhitelist = useCallback(
    (next: { enable: boolean; patterns: string[] }) =>
      setDraft((d) => (d ? { ...d, whitelist: next } : d)),
    [],
  );
  const updateBlacklist = useCallback(
    (next: { enable: boolean; patterns: string[] }) =>
      setDraft((d) => (d ? { ...d, blacklist: next } : d)),
    [],
  );

  const updateCustomization = useCallback(
    (index: number, next: SiteCustomizationItem) =>
      setDraft((d) => {
        if (!d) return d;
        const customization = [...d.customization];
        customization[index] = next;
        return { ...d, customization };
      }),
    [],
  );

  const removeCustomization = useCallback((index: number) => {
    setDraft((d) => {
      if (!d) return d;
      const customization = d.customization.filter((_, i) => i !== index);
      return { ...d, customization };
    });
    setExpanded((prev) => {
      const next = new Set<number>();
      prev.forEach((value) => {
        if (value < index) next.add(value);
        else if (value > index) next.add(value - 1);
      });
      return next;
    });
  }, []);

  const addCustomization = useCallback(() => {
    setDraft((d) => {
      if (!d) return d;
      const customization = [...d.customization, createEmptyCustomization()];
      setExpanded((prev) => new Set(prev).add(customization.length - 1));
      return { ...d, customization };
    });
  }, []);

  function resetDraftToDefaults() {
    setDraft({
      whitelist: { ...DEFAULT_WHITELIST },
      blacklist: { ...DEFAULT_BLACKLIST },
      customization: [...DEFAULT_SITE_CUSTOMIZATION],
    });
    setExpanded(new Set());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !isDirty) return;
    setIsSaving(true);
    try {
      const sanitizedCustomization = draft.customization.map((item) => ({
        ...item,
        pattern: item.pattern.trim(),
      }));
      await Promise.all([
        saveWhitelist(draft.whitelist),
        saveBlacklist(draft.blacklist),
        saveSiteCustomization(sanitizedCustomization),
      ]);
      const next: DraftState = { ...draft, customization: sanitizedCustomization };
      setDraft(next);
      setSaved(next);
      toast.success(messages.common.saved);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save site rules.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (loadError) {
    return (
      <>
        <OptionsPageTitle>{messages.pageTitles.siteCustomization}</OptionsPageTitle>
        <div className="max-w-2xl rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      </>
    );
  }

  if (!draft) {
    return (
      <>
        <OptionsPageTitle>{messages.pageTitles.siteCustomization}</OptionsPageTitle>
        <div className="text-sm text-muted-foreground">
          {messages.common.loadingSettings}
        </div>
      </>
    );
  }

  return (
    <form className="grid max-w-5xl pb-24" onSubmit={handleSubmit}>
      <OptionsPageTitle>{messages.pageTitles.siteCustomization}</OptionsPageTitle>

      <div className="my-6 grid grid-cols-[auto,1fr] items-baseline gap-y-2 rounded-xl bg-gradient-to-r from-lime-100 to-blue-200 p-4 dark:from-lime-900/30 dark:to-blue-900/30">
        <h2 className="col-span-2 mb-2 border-b border-black/10 pb-2 text-sm font-semibold dark:border-white/10">
          {m.examplesTitle}
        </h2>
        {m.examples.map((variable) => (
          <div className="col-span-2 grid grid-cols-[auto,1fr] gap-4" key={variable.key}>
            <span className="font-mono text-sm font-medium">{variable.key}</span>
            <span className="text-sm text-foreground/80">{variable.description}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <details
          className="group overflow-hidden rounded-lg border bg-card shadow-sm open:pb-4"
          open
        >
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-transparent p-4 transition-colors hover:bg-muted/50 group-open:border-border [&::-webkit-details-marker]:hidden">
            <div className="flex items-center gap-3">
              <Switch
                checked={draft.whitelist.enable}
                onCheckedChange={(checked) => {
                  const enable = Boolean(checked);
                  updateWhitelist({ ...draft.whitelist, enable });
                  if (enable) updateBlacklist({ ...draft.blacklist, enable: false });
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="font-semibold">{m.whitelist}</span>
            </div>
            <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid gap-4 px-4 pt-4">
            <label className="text-sm text-muted-foreground">{m.whitelistDescription}</label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">
                {m.patternsLabel} ({m.onePerLine})
              </span>
              <Textarea
                className="font-mono text-sm leading-6"
                onChange={(e) =>
                  updateWhitelist({ ...draft.whitelist, patterns: textToList(e.currentTarget.value) })
                }
                placeholder={m.whitelistPlaceholder}
                rows={8}
                spellCheck={false}
                value={listToText(draft.whitelist.patterns)}
              />
            </label>
          </div>
        </details>

        <details
          className="group overflow-hidden rounded-lg border bg-card shadow-sm open:pb-4"
          open
        >
          <summary className="flex cursor-pointer list-none items-center justify-between border-b border-transparent p-4 transition-colors hover:bg-muted/50 group-open:border-border [&::-webkit-details-marker]:hidden">
            <div className="flex items-center gap-3">
              <Switch
                checked={draft.blacklist.enable}
                onCheckedChange={(checked) => {
                  const enable = Boolean(checked);
                  updateBlacklist({ ...draft.blacklist, enable });
                  if (enable) updateWhitelist({ ...draft.whitelist, enable: false });
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="font-semibold">{m.blacklist}</span>
            </div>
            <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid gap-4 px-4 pt-4">
            <label className="text-sm text-muted-foreground">{m.blacklistDescription}</label>
            <label className="grid gap-2">
              <span className="text-sm font-medium text-foreground">
                {m.patternsLabel} ({m.onePerLine})
              </span>
              <Textarea
                className="font-mono text-sm leading-6"
                onChange={(e) =>
                  updateBlacklist({ ...draft.blacklist, patterns: textToList(e.currentTarget.value) })
                }
                placeholder={m.blacklistPlaceholder}
                rows={8}
                spellCheck={false}
                value={listToText(draft.blacklist.patterns)}
              />
            </label>
          </div>
        </details>
      </div>

      <details
        className="group mt-6 overflow-hidden rounded-lg border bg-card shadow-sm open:pb-4"
        open
      >
        <summary className="flex cursor-pointer list-none items-center justify-between border-b border-transparent p-4 transition-colors hover:bg-muted/50 group-open:border-border [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{m.customizationTitle}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addCustomization();
              }}
              size="sm"
              type="button"
              className="h-8 gap-1"
            >
              <Plus className="size-4" />
              {m.addRule}
            </Button>
            <ChevronDown className="size-5 text-muted-foreground transition-transform group-open:rotate-180" />
          </div>
        </summary>

        <div className="grid gap-4 px-4 pt-4">
          <p className="text-sm text-muted-foreground">{m.customizationDescription}</p>

          {draft.customization.length === 0 ? (
            <div className="grid place-items-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
              <Globe className="size-6 text-muted-foreground" />
              <p className="text-sm font-medium">{m.noRules}</p>
              <p className="max-w-md text-xs text-muted-foreground">{m.noRulesDescription}</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {draft.customization.map((item, index) => (
                <details
                  className="group/rule overflow-hidden rounded-md border bg-muted/30 open:pb-4"
                  key={index}
                  open={expanded.has(index)}
                  onToggle={(e) => {
                    const isOpen = e.currentTarget.open;
                    setExpanded((prev) => {
                      const next = new Set(prev);
                      if (isOpen) next.add(index);
                      else next.delete(index);
                      return next;
                    });
                  }}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between border-b border-transparent p-3 transition-colors hover:bg-muted/50 group-open/rule:border-border [&::-webkit-details-marker]:hidden">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Switch
                        checked={item.enable}
                        onCheckedChange={(checked) =>
                          updateCustomization(index, { ...item, enable: Boolean(checked) })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span
                        className={cn(
                          'truncate font-medium',
                          !item.pattern && 'text-muted-foreground',
                        )}
                      >
                        {item.pattern || m.newRuleFallback}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeCustomization(index);
                        }}
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                      <ChevronDown className="size-5 text-muted-foreground transition-transform group-open/rule:rotate-180" />
                    </div>
                  </summary>

                  <div className="grid gap-4 px-4 pt-4">
                    <div className="flex flex-wrap items-end gap-4 lg:flex-nowrap">
                      <div className="flex-1">
                        <label className="grid gap-2">
                          <span className="text-sm font-medium">{m.matchPattern}</span>
                          <Input
                            className="font-mono"
                            onChange={(e) =>
                              updateCustomization(index, { ...item, pattern: e.currentTarget.value })
                            }
                            placeholder={m.matchPatternPlaceholder}
                            spellCheck={false}
                            value={item.pattern}
                          />
                        </label>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 pb-2">
                        <Switch
                          checked={Boolean(item.useShadowRoot)}
                          onCheckedChange={(checked) =>
                            updateCustomization(index, { ...item, useShadowRoot: Boolean(checked) })
                          }
                          id={`shadow-switch-${index}`}
                        />
                        <label
                          className="cursor-pointer text-sm font-medium text-foreground"
                          htmlFor={`shadow-switch-${index}`}
                        >
                          {m.useShadowRoot}
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                      <label className="grid gap-2">
                        <span className="text-sm font-medium">
                          {item.useShadowRoot ? m.selectorsHost : m.selectorsNormal} ({m.onePerLine})
                        </span>
                        <Textarea
                          className="font-mono text-sm leading-6"
                          onChange={(e) =>
                            updateCustomization(index, {
                              ...item,
                              selectors: textToList(e.currentTarget.value),
                            })
                          }
                          placeholder={
                            item.useShadowRoot
                              ? m.selectorsPlaceholderHost
                              : m.selectorsPlaceholderNormal
                          }
                          rows={5}
                          spellCheck={false}
                          value={listToText(item.selectors)}
                        />
                      </label>

                      {item.useShadowRoot && (
                        <label className="grid gap-2">
                          <span className="text-sm font-medium">
                            {m.shadowRootSelectors} ({m.onePerLine})
                          </span>
                          <Textarea
                            className="font-mono text-sm leading-6"
                            onChange={(e) =>
                              updateCustomization(index, {
                                ...item,
                                shadowRootSelectors: textToList(e.currentTarget.value),
                              })
                            }
                            placeholder={m.shadowRootSelectorsPlaceholder}
                            rows={5}
                            spellCheck={false}
                            value={listToText(item.shadowRootSelectors)}
                          />
                          <span className="text-xs text-muted-foreground">{m.shadowRootTip}</span>
                        </label>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </details>

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
            <RotateCcw className="mr-2 size-4" />
            {messages.general.restoreDefaults}
          </Button>
          <Button disabled={!isDirty || isSaving} type="submit">
            <Save className="mr-2 size-4" />
            {isSaving ? messages.common.saving : messages.common.save}
          </Button>
        </div>
      </footer>
    </form>
  );
}
