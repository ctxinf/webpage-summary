import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useResizable } from './internal/interactions';

export type SqueezeTarget = 'html' | 'body' | 'both' | 'none';

interface SidebarPanelProps {
  children: React.ReactNode;
  className?: string;
  defaultWidth?: number;
  squeezeTarget?: SqueezeTarget;
  speed?: number;
}

export function SidebarPanel({ 
  children, 
  className,
  defaultWidth = 350,
  squeezeTarget = 'html',
  speed = 0.3
}: SidebarPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { startResize } = useResizable({ 
    targetRef: containerRef,
    modifyLeftOnResize: false, // Prevents setting style.left which conflicts with right-0
    onResizeStart: () => {
      // Disable CSS transitions during active resizing to prevent massive lag
      document.documentElement.classList.remove('webpage-summary-sidebar-transition');
      document.body.classList.remove('webpage-summary-sidebar-transition');
    },
    onResizeEnd: () => {
      // Re-enable transitions after user releases the mouse
      requestAnimationFrame(() => {
        document.documentElement.classList.add('webpage-summary-sidebar-transition');
        document.body.classList.add('webpage-summary-sidebar-transition');
      });
    }
  });

  useEffect(() => {
    let styleEl = document.getElementById('webpage-summary-sidebar-style') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'webpage-summary-sidebar-style';
      document.head.appendChild(styleEl);
    }

    // We use a CSS variable to pass width to the host page dynamically.
    // That way, during resizing, we only need to update the inline style variable on html, 
    // instead of recreating the stylesheet.
    styleEl.textContent = `
      :root {
        --wps-sidebar-width: ${defaultWidth}px;
      }
      html.webpage-summary-sidebar-html {
        width: calc(100% - var(--wps-sidebar-width)) !important;
        margin-right: var(--wps-sidebar-width) !important;
      }
      body.webpage-summary-sidebar-body {
        width: calc(100% - var(--wps-sidebar-width)) !important;
        margin-right: var(--wps-sidebar-width) !important;
      }
      html.webpage-summary-sidebar-transition,
      body.webpage-summary-sidebar-transition {
        transition: width ${speed}s cubic-bezier(0.16, 1, 0.3, 1), 
                    margin-right ${speed}s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
    `;

    const html = document.documentElement;
    const body = document.body;

    html.classList.add('webpage-summary-sidebar-transition');
    body.classList.add('webpage-summary-sidebar-transition');

    const rafId = requestAnimationFrame(() => {
      if (squeezeTarget === 'html' || squeezeTarget === 'both') {
        html.classList.add('webpage-summary-sidebar-html');
      }
      if (squeezeTarget === 'body' || squeezeTarget === 'both') {
        body.classList.add('webpage-summary-sidebar-body');
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      html.classList.remove('webpage-summary-sidebar-html');
      body.classList.remove('webpage-summary-sidebar-body');
      
      setTimeout(() => {
        const activeStyle = document.getElementById('webpage-summary-sidebar-style');
        if (!activeStyle || !html.classList.contains('webpage-summary-sidebar-html')) {
          html.classList.remove('webpage-summary-sidebar-transition');
          body.classList.remove('webpage-summary-sidebar-transition');
        }
      }, speed * 1000);
    };
  }, [squeezeTarget, speed, defaultWidth]);

  // Sync resized width to the CSS variable for smooth squeezing
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        document.documentElement.style.setProperty('--wps-sidebar-width', `${entry.contentRect.width}px`);
      }
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--wps-sidebar-width');
    };
  }, []);

  // Cleanup completely on unmount
  useEffect(() => {
    return () => {
      const styleEl = document.getElementById('webpage-summary-sidebar-style');
      if (styleEl) styleEl.remove();
      document.documentElement.classList.remove('webpage-summary-sidebar-html', 'webpage-summary-sidebar-transition');
      document.body.classList.remove('webpage-summary-sidebar-body', 'webpage-summary-sidebar-transition');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: defaultWidth }}
      className={cn(
        "fixed right-0 top-0 bottom-0 h-screen flex flex-col z-[2147483647]",
        "bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-zinc-100",
        // Animation
        "animate-in slide-in-from-right duration-300",
        className
      )}
    >
      {/* Left Resize Handle */}
      <div 
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-50 hover:bg-white/10 transition-colors" 
        onMouseDown={(e) => startResize(e, 'left')} 
      />
      
      {children}
    </div>
  );
}
