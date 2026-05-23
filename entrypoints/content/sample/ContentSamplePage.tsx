import { FileSearch, X } from 'lucide-react';
import { type ComponentType, useState } from 'react';
import { ContentAiDialogSample } from './ai-dialog/ContentAiDialogSample';
import { PageExtractionSample } from './page-extraction/PageExtractionSample';
import { FloatingBallSample } from './floating-ball/FloatingBallSample';

type ContentSampleKey = 'ai-dialog' | 'page-extraction' | 'floating-ball';

type ContentSampleItem = {
  key: ContentSampleKey;
  label: string;
  title: string;
  component: ComponentType;
};

const CONTENT_SAMPLE_ITEMS: ContentSampleItem[] = [
  {
    key: 'ai-dialog',
    label: 'AI Dialog',
    title: 'Content AI Dialog',
    component: ContentAiDialogSample,
  },
  {
    key: 'page-extraction',
    label: 'Page Extraction',
    title: 'Page Extraction',
    component: PageExtractionSample,
  },
  {
    key: 'floating-ball',
    label: 'Floating Ball',
    title: 'Floating Ball',
    component: FloatingBallSample,
  },
];

export function ContentSamplesIndexPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeSampleKey, setActiveSampleKey] =
    useState<ContentSampleKey>('ai-dialog');
  const activeSample =
    CONTENT_SAMPLE_ITEMS.find((item) => item.key === activeSampleKey) ??
    CONTENT_SAMPLE_ITEMS[0];
  const ActiveSample = activeSample.component;

  if (!isOpen) {
    return (
      <button
        className="fixed right-4 top-4 inline-flex min-h-[34px] items-center justify-center gap-[7px] rounded-md border border-zinc-300 bg-white px-[11px] text-[13px] font-semibold text-zinc-900 shadow-[0_10px_28px_rgba(23,23,23,0.16)]"
        onClick={() => setIsOpen(true)}
        title="Content samples"
        type="button"
      >
        <FileSearch size={16} />
        Samples
      </button>
    );
  }

  return (
    <section
      aria-label="Content samples"
      className="fixed right-4 top-4 grid max-h-[calc(100vh-32px)] w-[min(420px,calc(100vw-32px))] gap-3 overflow-auto rounded-lg border border-zinc-300 bg-white p-[14px] text-[13px] leading-[1.45] text-zinc-900 shadow-[0_18px_48px_rgba(23,23,23,0.22)]"
    >
      <header className="flex items-start justify-between gap-[10px] border-b border-zinc-200 pb-[10px]">
        <div>
          <p className="m-0 text-zinc-600">Content Samples</p>
          <h2 className="m-0 mt-px text-[15px] font-semibold leading-tight text-zinc-950">
            {activeSample.title}
          </h2>
        </div>
        <button
          aria-label="Close content samples"
          className="grid h-[30px] w-[30px] place-items-center rounded-md border border-zinc-300 bg-white text-zinc-900"
          onClick={() => setIsOpen(false)}
          title="Close"
          type="button"
        >
          <X size={16} />
        </button>
      </header>

      <nav
        aria-label="Content sample pages"
        className="flex flex-wrap gap-1.5"
        role="tablist"
      >
        {CONTENT_SAMPLE_ITEMS.map((item) => (
          <button
            aria-selected={activeSampleKey === item.key}
            className="min-h-[30px] rounded-md border border-zinc-300 bg-white px-[10px] text-zinc-900 aria-selected:border-zinc-900 aria-selected:bg-zinc-900 aria-selected:text-white"
            key={item.key}
            onClick={() => setActiveSampleKey(item.key)}
            role="tab"
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div role="tabpanel">
        <ActiveSample />
      </div>
    </section>
  );
}
