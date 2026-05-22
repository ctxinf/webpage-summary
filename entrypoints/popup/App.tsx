import { ExternalLink, FileText, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getUiMessages } from '@/lib/i18n';

type PageSnapshot = {
  ok: boolean;
  title: string;
  url: string;
  textLength: number;
};

function App() {
  const messages = getUiMessages();
  const [snapshot, setSnapshot] = useState<PageSnapshot | null>(null);
  const [status, setStatus] = useState(messages.popup.connectingCurrentPage);

  useEffect(() => {
    let cancelled = false;

    async function loadActivePage() {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        setStatus(messages.popup.noActiveTab);
        return;
      }

      try {
        const result = (await browser.tabs.sendMessage(tab.id, {
          type: 'WEBPAGE_SUMMARY_PING',
        })) as PageSnapshot;

        if (!cancelled) {
          setSnapshot(result);
          setStatus(
            result.ok ? messages.popup.connected : messages.popup.injectionPending,
          );
        }
      } catch {
        if (!cancelled) {
          setStatus(messages.popup.unsupportedPage);
        }
      }
    }

    loadActivePage();

    return () => {
      cancelled = true;
    };
  }, [messages.popup]);

  return (
    <main className="grid min-w-[360px] gap-3.5 p-4">
      <header className="grid grid-cols-[40px_1fr] items-center gap-3">
        <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
          <FileText size={18} />
        </div>
        <div>
          <h1 className="text-[17px] font-semibold leading-tight">Webpage Summary</h1>
          <p className="mt-1 text-xs text-muted-foreground">{status}</p>
        </div>
      </header>

      <section
        className="grid gap-2.5 rounded-lg border bg-card p-3"
        aria-label={messages.popup.pageSectionLabel}
      >
        <div className="truncate text-sm font-semibold text-foreground">
          {snapshot?.title || messages.popup.pageFallback}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {snapshot?.url || messages.popup.pageUrlFallback}
        </div>
        <dl className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2.5">
            <dt className="text-[11px] text-muted-foreground">
              {messages.popup.textLength}
            </dt>
            <dd className="mt-1 text-[13px] font-semibold">
              {snapshot ? snapshot.textLength.toLocaleString() : '-'}
            </dd>
          </div>
          <div className="rounded-md bg-muted p-2.5">
            <dt className="text-[11px] text-muted-foreground">
              {messages.popup.injectionStatus}
            </dt>
            <dd className="mt-1 text-[13px] font-semibold">
              {snapshot?.ok
                ? messages.popup.connected
                : messages.popup.injectionPending}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={() => browser.runtime.openOptionsPage()}>
          <Settings />
          {messages.popup.openOptions}
        </Button>
        {snapshot?.url ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => browser.tabs.create({ url: snapshot.url })}
          >
            <ExternalLink />
            {messages.popup.open}
          </Button>
        ) : null}
      </div>
    </main>
  );
}

export default App;
