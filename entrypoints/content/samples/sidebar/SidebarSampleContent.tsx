import { X, Sparkles } from 'lucide-react';

interface SidebarSampleContentProps {
  onClose: () => void;
}

export function SidebarSampleContent({ onClose }: SidebarSampleContentProps) {
  return (
    <>
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-800 bg-zinc-900/40 text-zinc-100">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-purple-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-zinc-300">
            Sidebar Sample Panel (Blank)
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800/80 transition-all active:scale-95 cursor-pointer"
          aria-label="Close sidebar"
          type="button"
        >
          <X size={15} />
        </button>
      </header>

      {/* Blank Workspace */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-zinc-500">
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 max-w-[80%]">
          <p className="m-0 text-xs font-medium text-zinc-400">Blank Workspace</p>
          <p className="m-0 mt-1 text-[11px] leading-relaxed">
            This sidebar is injected inside the page, dynamically shifting the original HTML layout.
          </p>
        </div>
      </div>
    </>
  );
}
