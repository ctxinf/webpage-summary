import { Settings2, Columns, HelpCircle } from 'lucide-react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

export type SqueezeTarget = 'html' | 'body' | 'both';

interface SidebarSampleProps {
  isOpen: boolean;
  onToggle: () => void;
  width: number;
  onWidthChange: (width: number) => void;
  squeezeTarget: SqueezeTarget;
  onSqueezeTargetChange: (target: SqueezeTarget) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export function SidebarSample({
  isOpen,
  onToggle,
  width,
  onWidthChange,
  squeezeTarget,
  onSqueezeTargetChange,
  speed,
  onSpeedChange,
}: SidebarSampleProps) {
  return (
    <div className="grid gap-4">
      {/* Sample Controls Card */}
      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4.5">
        <h4 className="m-0 text-sm font-semibold text-zinc-950 flex items-center gap-1.5">
          <Settings2 size={16} />
          Sidebar Config
        </h4>

        <div className="flex flex-col gap-3">
          {/* Toggle Display */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-700 font-medium">Activate Sidebar</span>
            <button
              onClick={onToggle}
              className="text-zinc-600 hover:text-zinc-950 transition-colors"
              type="button"
              aria-label="Toggle injected sidebar"
            >
              {isOpen ? (
                <ToggleRight className="text-emerald-600" size={36} strokeWidth={1.5} />
              ) : (
                <ToggleLeft className="text-zinc-400" size={36} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* Width slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-zinc-700 font-medium">
              <span className="flex items-center gap-1">Sidebar Width</span>
              <span className="text-zinc-950 font-semibold">{width}px</span>
            </div>
            <input
              type="range"
              min="280"
              max="600"
              step="10"
              value={width}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
          </div>

          {/* Squeeze Target selection */}
          <div className="flex flex-col gap-1.5">
            <span className="text-zinc-700 font-medium flex items-center gap-1">
              Squeeze Target Element
              <span className="text-zinc-400 cursor-help" title="Which element in the host page to apply width/margin styles to.">
                <HelpCircle size={14} />
              </span>
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(['html', 'body', 'both'] as SqueezeTarget[]).map((target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => onSqueezeTargetChange(target)}
                  className={`py-1 px-2 text-xs font-semibold rounded-md border transition-all ${
                    squeezeTarget === target
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {target.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Transition duration */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-zinc-700 font-medium">
              <span>Transition Speed</span>
              <span className="text-zinc-950 font-semibold">{speed}s</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
            />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-lg border border-zinc-100 bg-zinc-50/30 p-4.5 text-xs text-zinc-600 leading-relaxed">
        <p className="m-0 font-medium text-zinc-800 mb-1 flex items-center gap-1">
          <Columns size={14} className="text-indigo-500" />
          Squeezing Mechanism Details:
        </p>
        <p className="m-0 mb-2">
          This sample injects a sidebar directly into the parent webpage. To prevent the sidebar from covering existing page text/content:
        </p>
        <ul className="m-0 pl-4 list-disc space-y-1.5">
          <li>It dynamically modifies the host's <code>width</code> and <code>margin-right</code>.</li>
          <li>It inserts a transition stylesheet for smooth sliding animations.</li>
          <li>Styles are completely cleared and reset on closing/disabling the sidebar.</li>
        </ul>
      </div>
    </div>
  );
}
