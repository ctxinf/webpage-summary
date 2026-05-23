import { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Sparkles, HelpCircle } from 'lucide-react';
import RightFloatingBallContainer from '@/components/container/RightFloatingBallContainer';
import { cn } from '@/lib/utils';

export function FloatingBallSample() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [bounceActive, setBounceActive] = useState(false);
  const [storageKey, setStorageKey] = useState('sample');
  const [clicks, setClicks] = useState(0);

  // Trigger temporary bounce animation
  const triggerBounce = () => {
    setBounceActive(true);
  };

  useEffect(() => {
    if (bounceActive) {
      const timer = setTimeout(() => setBounceActive(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [bounceActive]);

  // Try to use browser extension API to resolve the local icon path.
  // Fallback to WXT logo if not in extension context.
  let iconUrl = '';
  try {
    iconUrl = browser.runtime.getURL('icon/32.png' as any);
  } catch {
    iconUrl = 'https://wxt.dev/wxt.svg';
  }

  // Construct storage key dynamically with correct local prefix format
  const dynamicStorageKey = `local:right-floating-ball-top-${storageKey}` as const;

  return (
    <div className="grid gap-4">
      {/* Sample Controls Card */}
      <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4.5">
        <h4 className="m-0 text-sm font-semibold text-zinc-950">Floating Ball Controls</h4>
        
        <div className="flex flex-col gap-3">
          {/* Toggle Display */}
          <div className="flex items-center justify-between">
            <span className="text-zinc-700 font-medium">Enable Floating Ball</span>
            <button
              onClick={() => setIsEnabled(!isEnabled)}
              className="text-zinc-600 hover:text-zinc-950 transition-colors"
              type="button"
              aria-label="Toggle floating ball display"
            >
              {isEnabled ? (
                <ToggleRight className="text-emerald-600" size={36} strokeWidth={1.5} />
              ) : (
                <ToggleLeft className="text-zinc-400" size={36} strokeWidth={1.5} />
              )}
            </button>
          </div>

          {/* storageKey Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="storage-key-input" className="text-zinc-700 font-medium flex items-center gap-1">
              Storage Key Suffix
              <span className="text-zinc-400 cursor-help" title="Saves vertical position to WXT storage under local:right-floating-ball-top-[suffix]">
                <HelpCircle size={14} />
              </span>
            </label>
            <input
              id="storage-key-input"
              type="text"
              value={storageKey}
              onChange={(e) => setStorageKey(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
              placeholder="e.g. sample, page"
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs text-zinc-900 outline-hidden focus:border-zinc-900"
            />
          </div>

          {/* Trigger Animation */}
          {isEnabled && (
            <button
              onClick={triggerBounce}
              className="inline-flex min-h-[32px] items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-800 shadow-xs hover:bg-zinc-50 active:scale-98 transition-all"
              type="button"
            >
              <Sparkles size={14} className="text-amber-500" />
              Trigger Bounce Animation
            </button>
          )}
        </div>
      </div>

      {/* Floating Ball Usage Instructions */}
      <div className="rounded-lg border border-zinc-100 bg-zinc-50/30 p-4.5 text-xs text-zinc-600 leading-relaxed">
        <p className="m-0 font-medium text-zinc-800 mb-1">Interactive Features to Try:</p>
        <ul className="m-0 pl-4 list-disc space-y-1">
          <li><strong>Drag vertically:</strong> Grab the ball and move it up or down.</li>
          <li><strong>Auto-Snap:</strong> Release it anywhere; it will glide smoothly back to the right margin.</li>
          <li><strong>Hover effects:</strong> Hover over the ball to see the close button fade/scale in and show the tooltip.</li>
          <li><strong>Persistence:</strong> Reload the page to verify WXT storage remembers the position.</li>
        </ul>
        {clicks > 0 && (
          <p className="m-0 mt-3 pt-3 border-t border-zinc-200/60 text-zinc-500 font-medium">
            Ball Clicks Count: <span className="text-zinc-800">{clicks}</span>
          </p>
        )}
      </div>

      {/* Actual Floating Ball Render */}
      {isEnabled && (
        <RightFloatingBallContainer
          storageKey={storageKey}
          onClose={() => setIsEnabled(false)}
        >
          {/* Custom Floating Ball Content */}
          <div
            onClick={() => setClicks(c => c + 1)}
            className={cn(
              "relative flex items-center justify-center p-1.5 rounded-full border border-purple-200/80 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-300 transition-all duration-200 shadow-sm cursor-pointer",
              bounceActive && "animate-bounce duration-500"
            )}
          >
            <img
              src={iconUrl}
              alt="Logo"
              className="w-6 h-6 rounded-md select-none pointer-events-none"
              draggable={false}
            />

            {/* Custom elegant Tooltip on hover */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 rounded bg-zinc-900/90 px-2 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-md">
              Open summary panel
            </div>
          </div>
        </RightFloatingBallContainer>
      )}
    </div>
  );
}
