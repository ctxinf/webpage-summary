import { BellRing, CircleCheck, CircleX } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function SonnerToastSample() {
  return (
    <section className="grid gap-4 rounded-lg border bg-background p-[18px]">
      <header className="grid grid-cols-[32px_1fr] gap-3">
        <BellRing className="mt-px text-primary" size={20} />
        <div>
          <h2 className="text-[16px] font-semibold">Sonner Toast</h2>
          <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
            Options sample notification surface
          </p>
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={() => toast('通知已发送')}>
          <BellRing />
          普通通知
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.success('保存成功')}
        >
          <CircleCheck />
          成功
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => toast.error('请求失败')}
        >
          <CircleX />
          失败
        </Button>
      </div>
    </section>
  );
}
