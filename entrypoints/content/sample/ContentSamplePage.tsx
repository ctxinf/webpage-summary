import { FileSearch, X } from 'lucide-react';
import { type ComponentType, useState, useEffect } from 'react';
import { ContentAiDialogSample } from './ai-dialog/ContentAiDialogSample';
import { PageExtractionSample } from './page-extraction/PageExtractionSample';
import { FloatingBallSample } from './floating-ball/FloatingBallSample';
import { SidebarSample } from './sidebar/SidebarSample';
import { SidebarContainer, type SqueezeTarget } from '@/components/container/SidebarContainer';
import { SidebarSampleContent } from './sidebar/SidebarSampleContent';
import RightFloatingBallContainer from '@/components/container/RightFloatingBallContainer';

type ContentSampleKey = 'ai-dialog' | 'page-extraction' | 'floating-ball' | 'sidebar';

type ContentSampleItem = {
  key: ContentSampleKey;
  label: string;
  title: string;
  component: ComponentType<any>;
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
  {
    key: 'sidebar',
    label: 'Sidebar',
    title: 'Page-injected Sidebar',
    component: () => null, // Rendered specifically in tab panel
  },
];

export function ContentSamplesIndexPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSampleKey, setActiveSampleKey] =
    useState<ContentSampleKey>('ai-dialog');

  // Sidebar specific states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [squeezeTarget, setSqueezeTarget] = useState<SqueezeTarget>('html');
  const [transitionSpeed, setTransitionSpeed] = useState(0.3);

  // Automatically close sidebar if active sample is switched or launcher panel is closed
  useEffect(() => {
    if (activeSampleKey !== 'sidebar' || !isOpen) {
      setIsSidebarOpen(false);
    }
  }, [activeSampleKey, isOpen]);

  const activeSample =
    CONTENT_SAMPLE_ITEMS.find((item) => item.key === activeSampleKey) ??
    CONTENT_SAMPLE_ITEMS[0];
  const ActiveSample = activeSample.component;

  return (
    <>
      {!isOpen ? (
        <RightFloatingBallContainer
          storageKey="sample-page"
          onClose={() => {}}
        >
          <div
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center p-1.5 rounded-full border border-purple-200/80 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-300 transition-all duration-200 shadow-xs cursor-pointer group"
            title="Content samples"
          >
            <FileSearch size={24} className="text-purple-600" />
            <div className="absolute right-12 top-1/2 -translate-y-1/2 rounded bg-zinc-900/90 px-2 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-md">
              Content Samples
            </div>
          </div>
        </RightFloatingBallContainer>
      ) : (
        <section
          aria-label="Content samples"
          className="fixed right-4 top-4 grid max-h-[calc(100vh-32px)] w-[min(420px,calc(100vw-32px))] gap-3 overflow-auto rounded-lg border border-zinc-300 bg-white p-[14px] text-[13px] leading-[1.45] text-zinc-900 shadow-[0_18px_48px_rgba(23,23,23,0.22)] z-[2147483646]"
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
            {activeSampleKey === 'sidebar' ? (
              <SidebarSample
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                width={sidebarWidth}
                onWidthChange={setSidebarWidth}
                squeezeTarget={squeezeTarget}
                onSqueezeTargetChange={setSqueezeTarget}
                speed={transitionSpeed}
                onSpeedChange={setTransitionSpeed}
              />
            ) : (
              <ActiveSample />
            )}
          </div>
        </section>
      )}

      {/* Render the actual full-height sidebar panel outside the small floating card */}
      <SidebarContainer
        isOpen={isSidebarOpen && activeSampleKey === 'sidebar' && isOpen}
        width={sidebarWidth}
        squeezeTarget={squeezeTarget}
        speed={transitionSpeed}
      >
        <SidebarSampleContent onClose={() => setIsSidebarOpen(false)} />
      </SidebarContainer>
    </>
  );
}
