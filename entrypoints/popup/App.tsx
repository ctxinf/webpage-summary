import { ExternalLink, FileText, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import './App.css';

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
    <main className="popup-shell">
      <header className="popup-header">
        <div className="popup-icon">
          <FileText size={18} />
        </div>
        <div>
          <h1>Webpage Summary</h1>
          <p>{status}</p>
        </div>
      </header>

      <section className="popup-panel" aria-label="当前页面">
        <div className="page-title">{snapshot?.title || '当前页面'}</div>
        <div className="page-url">{snapshot?.url || '打开任意网页后查看注入状态'}</div>
        <dl className="page-meta">
          <div>
            <dt>文本长度</dt>
            <dd>{snapshot ? snapshot.textLength.toLocaleString() : '-'}</dd>
          </div>
          <div>
            <dt>注入状态</dt>
            <dd>{snapshot?.ok ? '已连接' : '等待中'}</dd>
          </div>
        </dl>
      </section>

      <div className="popup-actions">
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
