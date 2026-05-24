import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type SqueezeTarget = 'html' | 'body' | 'both' | 'none';

export interface SidebarContainerProps {
  isOpen: boolean;
  width?: number;
  squeezeTarget?: SqueezeTarget;
  speed?: number;
  className?: string;
  children?: ReactNode;
  zIndex?: number;
}

export function SidebarContainer({
  isOpen,
  width = 350,
  squeezeTarget = 'html',
  speed = 0.3,
  className,
  children,
  zIndex = 2147483647,
}: SidebarContainerProps) {
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
        zIndex,
      }}
      className={cn(
        "fixed right-0 top-0 bottom-0 h-screen",
        "flex flex-col bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-zinc-100",
        className
      )}
    >
      {children}
    </div>
  );
}
