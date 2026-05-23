import { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { SqueezeTarget } from './SidebarSample';
import { cn } from '@/lib/utils';

interface SidebarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  squeezeTarget: SqueezeTarget;
  speed: number;
}

export function SidebarPanel({
  isOpen,
  onClose,
  width,
  squeezeTarget,
  speed,
}: SidebarPanelProps) {

  // Handle Host Page CSS Injection and Class Toggling
  useEffect(() => {
    if (!isOpen) return;

    // 1. Create or get style element in host head
    let styleEl = document.getElementById('webpage-summary-sidebar-style') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'webpage-summary-sidebar-style';
      document.head.appendChild(styleEl);
    }

    // 2. Write dynamic squeezing css rules
    styleEl.textContent = `
      html.webpage-summary-sidebar-html {
        width: calc(100% - ${width}px) !important;
        margin-right: ${width}px !important;
      }
      body.webpage-summary-sidebar-body {
        width: calc(100% - ${width}px) !important;
        margin-right: ${width}px !important;
      }
      html.webpage-summary-sidebar-transition,
      body.webpage-summary-sidebar-transition {
        transition: width ${speed}s cubic-bezier(0.16, 1, 0.3, 1), 
                    margin-right ${speed}s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
    `;

    const html = document.documentElement;
    const body = document.body;

    // 3. Add transition classes
    html.classList.add('webpage-summary-sidebar-transition');
    body.classList.add('webpage-summary-sidebar-transition');

    // 4. Set classes with a tiny requestAnimationFrame delay to trigger layout transition
    const rafId = requestAnimationFrame(() => {
      if (squeezeTarget === 'html' || squeezeTarget === 'both') {
        html.classList.add('webpage-summary-sidebar-html');
      } else {
        html.classList.remove('webpage-summary-sidebar-html');
      }

      if (squeezeTarget === 'body' || squeezeTarget === 'both') {
        body.classList.add('webpage-summary-sidebar-body');
      } else {
        body.classList.remove('webpage-summary-sidebar-body');
      }
    });

    // Cleanup when configuration changes or panel closes
    return () => {
      cancelAnimationFrame(rafId);
      html.classList.remove('webpage-summary-sidebar-html');
      body.classList.remove('webpage-summary-sidebar-body');
      
      setTimeout(() => {
        // Only remove transition if sidebar hasn't been reopened in the meantime
        const activeStyle = document.getElementById('webpage-summary-sidebar-style');
        if (!activeStyle || !html.classList.contains('webpage-summary-sidebar-html')) {
          html.classList.remove('webpage-summary-sidebar-transition');
          body.classList.remove('webpage-summary-sidebar-transition');
        }
      }, speed * 1000);
    };
  }, [isOpen, width, squeezeTarget, speed]);

  // Cleanup style block completely when component destroys
  useEffect(() => {
    return () => {
      const styleEl = document.getElementById('webpage-summary-sidebar-style');
      if (styleEl) {
        styleEl.remove();
      }
      document.documentElement.classList.remove('webpage-summary-sidebar-html', 'webpage-summary-sidebar-transition');
      document.body.classList.remove('webpage-summary-sidebar-body', 'webpage-summary-sidebar-transition');
    };
  }, []);

  return (
    <div
      style={{
        width: `${width}px`,
        transition: `transform ${speed}s cubic-bezier(0.16, 1, 0.3, 1), opacity ${speed}s ease`,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        opacity: isOpen ? 1 : 0,
      }}
      className={cn(
        "fixed right-0 top-0 bottom-0 h-screen z-[2147483647]",
        "flex flex-col bg-zinc-950/95 backdrop-blur-xl text-zinc-100 border-l border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      )}
    >
      {/* Minimal Header */}
      <header className="flex items-center justify-between px-6 py-4.5 border-b border-zinc-800 bg-zinc-900/40">
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
    </div>
  );
}
