import { ExternalLink, FileText, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type PageSnapshot = {
  ok: boolean;
  title: string;
  url: string;
  textLength: number;
};

function App() {
  const [snapshot, setSnapshot] = useState<PageSnapshot | null>(null);
  const [status, setStatus] = useState('正在连接当前页面');

  useEffect(() => {
    let cancelled = false;

    async function loadActivePage() {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        setStatus('没有可用的当前标签页');
        return;
      }

      try {
        const result = (await browser.tabs.sendMessage(tab.id, {
          type: 'WEBPAGE_SUMMARY_PING',
        })) as PageSnapshot;

        if (!cancelled) {
          setSnapshot(result);
          setStatus(result.ok ? '页面注入已连接' : '页面注入未就绪');
        }
      } catch {
        if (!cancelled) {
          setStatus('当前页面暂不支持注入');
        }
      }
    }

    loadActivePage();

    return () => {
      cancelled = true;
    };
  }, []);

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
        aria-label="当前页面"
      >
        <div className="truncate text-sm font-semibold text-foreground">
          {snapshot?.title || '当前页面'}
        </div>
        <div className="truncate text-xs text-muted-foreground">
          {snapshot?.url || '打开任意网页后查看注入状态'}
        </div>
        <dl className="grid grid-cols-2 gap-2">
          <div className="rounded-md bg-muted p-2.5">
            <dt className="text-[11px] text-muted-foreground">文本长度</dt>
            <dd className="mt-1 text-[13px] font-semibold">
              {snapshot ? snapshot.textLength.toLocaleString() : '-'}
            </dd>
          </div>
          <div className="rounded-md bg-muted p-2.5">
            <dt className="text-[11px] text-muted-foreground">注入状态</dt>
            <dd className="mt-1 text-[13px] font-semibold">
              {snapshot?.ok ? '已连接' : '等待中'}
            </dd>
          </div>
        </dl>
      </section>

      <div className="flex justify-end gap-2">
        <Button type="button" onClick={() => browser.runtime.openOptionsPage()}>
          <Settings />
          设置
        </Button>
        {snapshot?.url ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => browser.tabs.create({ url: snapshot.url })}
          >
            <ExternalLink />
            打开
          </Button>
        ) : null}
      </div>
    </main>
  );
}

export default App;
