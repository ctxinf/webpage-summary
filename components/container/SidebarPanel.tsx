import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useResizable } from './internal/interactions';
import useWxtStorage from '@/hooks/useWxtStorage';
import { type StorageItemKey } from '#imports';

export type SqueezeTarget = 'html' | 'body' | 'both' | 'none';

interface SidebarPanelProps {
  children: React.ReactNode;
  className?: string;
  storageKey?: string | null;
  squeezeTarget?: SqueezeTarget;
  speed?: number;
}

export function SidebarPanel({ 
  children, 
  className,
  storageKey,
  squeezeTarget = 'html',
  speed = 0.3
}: SidebarPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const stateKey = storageKey ? (`local:${storageKey}-sidebar-width` as StorageItemKey) : null;
  const [savedWidth, setSavedWidth, isLoaded] = useWxtStorage<number | null>(stateKey, null);

  const isResizingRef = useRef(false);

  // Helper to update the injected style without touching HTML attributes
  const updateHostSqueeze = (width: number, disableTransition: boolean = false) => {
    let styleEl = document.getElementById('wps-sidebar-squeeze-style') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'wps-sidebar-squeeze-style';
      document.head.appendChild(styleEl);
    }
    
    const transitionRule = disableTransition 
      ? 'transition: none !important;' 
      : `transition: width ${speed}s cubic-bezier(0.16, 1, 0.3, 1), margin-right ${speed}s cubic-bezier(0.16, 1, 0.3, 1) !important;`;

    const cssRules = [];
    if (squeezeTarget === 'html' || squeezeTarget === 'both') {
      cssRules.push(`
        html { 
          width: calc(100% - ${width}px) !important; 
          margin-right: ${width}px !important; 
          ${transitionRule}
        }
      `);
    }
    if (squeezeTarget === 'body' || squeezeTarget === 'both') {
      cssRules.push(`
        body { 
          width: calc(100% - ${width}px) !important; 
          margin-right: ${width}px !important; 
          ${transitionRule}
        }
      `);
    }
    
    styleEl.textContent = cssRules.join('\\n');
  };

  const { startResize } = useResizable({ 
    targetRef: containerRef,
    // @ts-ignore
    modifyLeftOnResize: false, // Prevents setting style.left which conflicts with right-0
    onResizeStart: () => {
      isResizingRef.current = true;
      if (containerRef.current) {
        containerRef.current.style.transition = 'none';
      }
    },
    onResizeEnd: () => {
      isResizingRef.current = false;
      if (containerRef.current) {
        containerRef.current.style.transition = '';
        const finalWidth = containerRef.current.offsetWidth;
        updateHostSqueeze(finalWidth, false);
        setSavedWidth(finalWidth);
      }
    }
  });

  useEffect(() => {
    const targetWidth = savedWidth || containerRef.current?.offsetWidth || 0;
    updateHostSqueeze(targetWidth, false);

    return () => {
      const styleEl = document.getElementById('wps-sidebar-squeeze-style');
      if (styleEl) styleEl.remove();
    };
  }, [squeezeTarget, speed, savedWidth]);

  // Sync resized width to the CSS variable for smooth squeezing
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (isResizingRef.current) return; // Pause squeeze during active drag to prevent host page layout thrashing
      for (const entry of entries) {
        updateHostSqueeze(entry.contentRect.width, false);
      }
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Cleanup completely on unmount handled by other effects

  if (!isLoaded) return null;

  return (
    <div
      ref={containerRef}
      style={savedWidth !== null ? { width: `${savedWidth}px` } : undefined}
      className={cn(
        "fixed right-0 top-0 bottom-0 h-screen flex flex-col z-[2147483647]",
        "bg-background/95 backdrop-blur-xl border-l border-zinc-200 shadow-2xl text-zinc-950",
        // Animation
        "animate-in slide-in-from-right duration-300",
        className
      )}
    >
      {/* Left Resize Handle */}
      <div 
        className="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-50 hover:bg-zinc-900/10 transition-colors" 
        onMouseDown={(e) => startResize(e, 'left')} 
      />
      
      {children}
    </div>
  );
}
