import {
  ChevronDown,
  ChevronRight,
  Globe,
  Layers,
  Plus,
  RotateCcw,
  Save,
  Shield,
  ShieldOff,
  Trash2,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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

type PatternListEditorProps = {
  description: string;
  enable: boolean;
  Icon: typeof Shield;
  onChange: (next: { enable: boolean; patterns: string[] }) => void;
  patterns: string[];
  placeholder?: string;
  title: string;
  tone: 'positive' | 'negative';
};

function PatternListEditor({
  description,
  enable,
  Icon,
  onChange,
  patterns,
  placeholder,
  title,
  tone,
}: PatternListEditorProps) {
  const accent =
    tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400'
      : 'text-rose-600 dark:text-rose-400';

  return (
    <section
      className={cn(
        'rounded-lg border bg-card p-5 shadow-sm transition-opacity',
        !enable && 'opacity-70',
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 inline-flex size-9 items-center justify-center rounded-md border bg-background',
              accent,
            )}
          >
            <Icon className="size-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        <Switch
          checked={enable}
          onCheckedChange={(checked) =>
            onChange({ enable: Boolean(checked), patterns })
          }
        />
      </header>

      <Textarea
        className="mt-4 font-mono text-xs leading-6"
        disabled={!enable}
        onChange={(event) =>
          onChange({ enable, patterns: textToList(event.currentTarget.value) })
        }
        placeholder={
          placeholder ??
          'one pattern per line, e.g.\nwww.reddit.com\n*.reddit.com\nexample.com/blog/**'
        }
        rows={5}
        spellCheck={false}
        value={listToText(patterns)}
      />
    </section>
  );
}

type CustomizationCardProps = {
  expanded: boolean;
  index: number;
  item: SiteCustomizationItem;
  onChange: (next: SiteCustomizationItem) => void;
  onRemove: () => void;
  onToggleExpanded: () => void;
};

function CustomizationCard({
  expanded,
  index,
  item,
  onChange,
  onRemove,
  onToggleExpanded,
}: CustomizationCardProps) {
  const headerLabel = item.pattern.trim() || `Rule #${index + 1}`;

  return (
    <article
      className={cn(
        'rounded-lg border bg-card shadow-sm',
        !item.enable && 'opacity-70',
      )}
    >
      <header className="flex items-center gap-2 border-b px-4 py-2.5">
        <button
          aria-label={expanded ? 'Collapse rule' : 'Expand rule'}
          className="grid size-6 place-items-center rounded text-muted-foreground hover:text-foreground"
          onClick={onToggleExpanded}
          type="button"
        >
          {expanded ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </button>
        <span className="truncate font-mono text-sm font-medium">
          {headerLabel}
        </span>
        <span className="ml-auto inline-flex items-center gap-2">
          <Switch
            checked={item.enable}
            onCheckedChange={(checked) =>
              onChange({ ...item, enable: Boolean(checked) })
            }
          />
          <Button
            aria-label="Remove rule"
            onClick={onRemove}
            size="icon"
            type="button"
            variant="ghost"
          >
            <Trash2 className="size-4" />
          </Button>
        </span>
      </header>

      {expanded ? (
        <div className="grid gap-4 p-4">
          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              URL pattern
            </span>
            <Input
              className="font-mono"
              onChange={(event) =>
                onChange({ ...item, pattern: event.currentTarget.value })
              }
              placeholder="e.g. www.reddit.com, *.reddit.com, example.com/blog/**"
              spellCheck={false}
              value={item.pattern}
            />
            <span className="text-xs text-muted-foreground">
              Matches against <code>hostname</code> and{' '}
              <code>hostname + pathname</code>. Uses modern glob syntax
              (picomatch).
            </span>
          </label>

          <label className="grid gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              CSS selectors
            </span>
            <Textarea
              className="font-mono text-xs leading-6"
              onChange={(event) =>
                onChange({
                  ...item,
                  selectors: textToList(event.currentTarget.value),
                })
              }
              placeholder={'one selector per line, e.g.\n.article-body\n#main-content'}
              rows={3}
              spellCheck={false}
              value={listToText(item.selectors)}
            />
          </label>

          <div className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2">
            <div className="flex items-center gap-2 text-sm">
              <Layers className="size-4 text-muted-foreground" />
              <span>Drill into Shadow DOM</span>
            </div>
            <Switch
              checked={Boolean(item.useShadowRoot)}
              onCheckedChange={(checked) =>
                onChange({ ...item, useShadowRoot: Boolean(checked) })
              }
            />
          </div>

          {item.useShadowRoot ? (
            <label className="grid gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Shadow root selectors
              </span>
              <Textarea
                className="font-mono text-xs leading-6"
                onChange={(event) =>
                  onChange({
                    ...item,
                    shadowRootSelectors: textToList(event.currentTarget.value),
                  })
                }
                placeholder={
                  'selectors applied inside each host\'s shadow root, one per line'
                }
                rows={3}
                spellCheck={false}
                value={listToText(item.shadowRootSelectors)}
              />
              <span className="text-xs text-muted-foreground">
                For each element matched by the CSS selectors above, these
                selectors are queried inside <code>element.shadowRoot</code>.
              </span>
            </label>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export function SiteCustomizationPage() {
  const messages = getUiMessages();

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

  const toggleExpanded = useCallback((index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
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
      toast.success('Site rules saved.');
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
    <form className="grid max-w-4xl gap-7 pb-24" onSubmit={handleSubmit}>
      <OptionsPageTitle>{messages.pageTitles.siteCustomization}</OptionsPageTitle>

      <section className="grid gap-3">
        <header className="border-b pb-2">
          <h2 className="text-xl font-extrabold text-primary">Site filters</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            Control where the extension auto-injects. Whitelist takes
            precedence when both are enabled. Patterns are matched against{' '}
            <code>hostname</code> and <code>hostname + pathname</code>.
          </p>
        </header>

        <div className="grid gap-4">
          <PatternListEditor
            description="Only run on sites whose hostname or path matches a pattern."
            enable={draft.whitelist.enable}
            Icon={Shield}
            onChange={updateWhitelist}
            patterns={draft.whitelist.patterns}
            title="Whitelist"
            tone="positive"
          />
          <PatternListEditor
            description="Block the extension on sites whose hostname or path matches a pattern."
            enable={draft.blacklist.enable}
            Icon={ShieldOff}
            onChange={updateBlacklist}
            patterns={draft.blacklist.patterns}
            title="Blacklist"
            tone="negative"
          />
        </div>
      </section>

      <section className="grid gap-3">
        <header className="flex flex-wrap items-end justify-between gap-2 border-b pb-2">
          <div>
            <h2 className="text-xl font-extrabold text-primary">
              Selector overrides
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              For sites where the default extractor fails, pin the page content
              to specific CSS selectors. Each rule binds a URL pattern to a list
              of selectors (with optional Shadow DOM drill-down).
            </p>
          </div>
          <Button
            onClick={addCustomization}
            size="sm"
            type="button"
            variant="outline"
          >
            <Plus className="size-4" />
            Add rule
          </Button>
        </header>

        {draft.customization.length === 0 ? (
          <div className="grid place-items-center gap-2 rounded-lg border border-dashed bg-muted/20 px-6 py-10 text-center">
            <Globe className="size-6 text-muted-foreground" />
            <p className="text-sm font-medium">No selector overrides yet</p>
            <p className="max-w-md text-xs text-muted-foreground">
              Add a rule when a site's content lives inside unusual structures
              (e.g. Shadow DOM, framework runtimes) that the default extractor
              can't read cleanly.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {draft.customization.map((item, index) => (
              <CustomizationCard
                expanded={expanded.has(index)}
                index={index}
                item={item}
                key={index}
                onChange={(next) => updateCustomization(index, next)}
                onRemove={() => removeCustomization(index)}
                onToggleExpanded={() => toggleExpanded(index)}
              />
            ))}
          </div>
        )}
      </section>

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
            <RotateCcw />
            {messages.general.restoreDefaults}
          </Button>
          <Button disabled={!isDirty || isSaving} type="submit">
            <Save />
            {isSaving ? messages.common.saving : messages.common.save}
          </Button>
        </div>
      </footer>
    </form>
  );
}
