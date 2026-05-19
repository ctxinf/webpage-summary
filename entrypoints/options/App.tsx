import { Check, FileText, PlugZap } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <main className="options-shell">
      <header className="options-header">
        <div>
          <p className="options-kicker">Options</p>
          <h1>Webpage Summary</h1>
        </div>
        <Button type="button" onClick={() => window.close()}>
          <Check />
          完成
        </Button>
      </header>

      <section className="options-grid" aria-label="基础状态">
        <article className="options-panel">
          <FileText size={20} />
          <div>
            <h2>Popup</h2>
            <p>已接入当前标签页状态读取。</p>
          </div>
        </article>
        <article className="options-panel">
          <PlugZap size={20} />
          <div>
            <h2>Content Script</h2>
            <p>已在普通网页注入右下角浮层。</p>
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
