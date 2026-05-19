import { Check, FileText, PlugZap } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <main className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto grid w-full max-w-[880px] gap-[18px]">
        <header className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
          <div>
            <p className="mb-1 text-[13px] text-muted-foreground">Options</p>
            <h1 className="text-[28px] font-semibold leading-tight">
              Webpage Summary
            </h1>
          </div>
          <Button type="button" onClick={() => window.close()}>
            <Check />
            完成
          </Button>
        </header>

        <section
          className="grid grid-cols-2 gap-3 max-sm:grid-cols-1"
          aria-label="基础状态"
        >
          <article className="grid grid-cols-[32px_1fr] gap-3 rounded-lg border bg-background p-[18px]">
            <FileText className="mt-px text-primary" size={20} />
            <div>
              <h2 className="text-[15px] font-semibold">Popup</h2>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                已接入当前标签页状态读取。
              </p>
            </div>
          </article>
          <article className="grid grid-cols-[32px_1fr] gap-3 rounded-lg border bg-background p-[18px]">
            <PlugZap className="mt-px text-primary" size={20} />
            <div>
              <h2 className="text-[15px] font-semibold">Content Script</h2>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                已在普通网页注入右下角浮层。
              </p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}

export default App;
