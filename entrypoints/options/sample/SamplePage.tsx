import { ArrowLeft, Bot, ChevronRight, FlaskConical } from 'lucide-react';
import type { ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { AliyunAiApiSample } from './aliyun-ai-api/AliyunAiApiSample';
import { BackgroundAiProviderSample } from './background-ai-provider/BackgroundAiProviderSample';

type SampleKey = 'aliyun-ai-api' | 'background-ai-provider';

type SampleItem = {
  key: SampleKey;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  component: ComponentType;
};

const SAMPLE_ITEMS: SampleItem[] = [
  {
    key: 'aliyun-ai-api',
    title: '阿里云 AI API 直连',
    description: 'DashScope OpenAI-compatible chat completions',
    icon: Bot,
    component: AliyunAiApiSample,
  },
  {
    key: 'background-ai-provider',
    title: 'Background AI Provider',
    description: 'Options button -> background -> AI SDK provider',
    icon: Bot,
    component: BackgroundAiProviderSample,
  },
];

const SAMPLE_RENDERERS: Record<SampleKey, ComponentType> = {
  'aliyun-ai-api': AliyunAiApiSample,
  'background-ai-provider': BackgroundAiProviderSample,
};

type SamplePageProps = {
  sampleKey: string;
};

function isSampleKey(sampleKey: string): sampleKey is SampleKey {
  return sampleKey in SAMPLE_RENDERERS;
}

function goOptionsHome() {
  window.location.assign(window.location.pathname);
}

function goSamplesHome() {
  window.location.assign(`${window.location.pathname}?samples=1`);
}

export function SamplesNavPage() {
  return (
    <main className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto grid w-full max-w-[880px] gap-[18px]">
        <header className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
          <div>
            <p className="mb-1 text-[13px] text-muted-foreground">Samples</p>
            <h1 className="text-[28px] font-semibold leading-tight">
              示例导航
            </h1>
          </div>
          <Button type="button" variant="outline" onClick={goOptionsHome}>
            <ArrowLeft />
            返回
          </Button>
        </header>

        <section className="grid gap-3" aria-label="Samples">
          {SAMPLE_ITEMS.map((sample) => {
            const Icon = sample.icon;

            return (
              <a
                key={sample.key}
                className="grid grid-cols-[32px_1fr_24px] items-center gap-3 rounded-lg border bg-background p-[18px] transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                href={`?sample=${sample.key}`}
              >
                <Icon className="text-primary" size={20} />
                <span>
                  <span className="block text-[15px] font-semibold">
                    {sample.title}
                  </span>
                  <span className="mt-1.5 block text-[13px] leading-6 text-muted-foreground">
                    {sample.description}
                  </span>
                </span>
                <ChevronRight className="text-muted-foreground" size={18} />
              </a>
            );
          })}
        </section>
      </div>
    </main>
  );
}

export function SamplePage({ sampleKey }: SamplePageProps) {
  const Sample = isSampleKey(sampleKey) ? SAMPLE_RENDERERS[sampleKey] : null;

  return (
    <main className="min-h-screen bg-muted px-4 py-8">
      <div className="mx-auto grid w-full max-w-[880px] gap-[18px]">
        <header className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
          <div>
            <p className="mb-1 text-[13px] text-muted-foreground">Sample</p>
            <h1 className="text-[28px] font-semibold leading-tight">
              {sampleKey}
            </h1>
          </div>
          <Button type="button" variant="outline" onClick={goSamplesHome}>
            <ArrowLeft />
            返回
          </Button>
        </header>

        {Sample ? (
          <Sample />
        ) : (
          <section
            className="grid grid-cols-[32px_1fr] gap-3 rounded-lg border bg-background p-[18px]"
            role="status"
          >
            <FlaskConical className="mt-px text-muted-foreground" size={20} />
            <div>
              <h2 className="text-[16px] font-semibold">示例不可用</h2>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                当前 sample 未配置。
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
