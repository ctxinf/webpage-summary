import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { PanelProvider, usePanel, PanelMode } from './PanelContext';
import { useResizable, useDraggable } from './internal/interactions';
import useWxtStorage from '@/hooks/useWxtStorage';
import { type StorageItemKey } from '#imports';

interface PanelContainerProps {
  children: React.ReactNode;
  defaultMode?: PanelMode;
  storageKey?: string | null;
  initialOffset?: { x: number; y: number };
}

type FloatingState = { width: number; height: number; left: string; top: string; right: string; bottom: string };

function UnifiedPanelRenderer({ children, storageKey, initialOffset }: { children: React.ReactNode, storageKey?: string | null, initialOffset?: { x: number; y: number } }) {
  const { mode } = usePanel();
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  const floatingStateKey = storageKey ? (`local:${storageKey}-floating-state` as StorageItemKey) : null;
  const sidebarStateKey = storageKey ? (`local:${storageKey}-sidebar-width` as StorageItemKey) : null;
  
  const [floatingState, setFloatingState, isFloatingLoaded] = useWxtStorage<FloatingState | null>(floatingStateKey, null);
  const [sidebarWidth, setSidebarWidth, isSidebarLoaded] = useWxtStorage<number | null>(sidebarStateKey, null);

  const saveFloatingState = () => {
    if (mode === 'floating' && containerRef.current) {
      const el = containerRef.current;
      setFloatingState({
        width: el.offsetWidth,
        height: el.offsetHeight,
        left: el.style.left,
        top: el.style.top,
        right: el.style.right,
        bottom: el.style.bottom,
      });
    }
  };

  const { startDrag } = useDraggable({ 
    targetRef: containerRef, 
    enabled: mode === 'floating',
    onDragEnd: saveFloatingState 
  });

  const { startResize: startFloatingResize } = useResizable({ 
    targetRef: containerRef, 
    enabled: mode === 'floating',
    onResizeEnd: saveFloatingState 
  });

  const { startResize: startSidebarResize } = useResizable({ 
    targetRef: containerRef,
    enabled: mode === 'sidebar',
    // @ts-ignore
    modifyLeftOnResize: false,
    onResizeStart: () => {
      isResizingRef.current = true;
      if (containerRef.current) containerRef.current.style.transition = 'none';
    },
    onResizeEnd: () => {
      isResizingRef.current = false;
      if (containerRef.current) {
        containerRef.current.style.transition = '';
        const finalWidth = containerRef.current.offsetWidth;
        updateHostSqueeze(finalWidth, false);
        setSidebarWidth(finalWidth);
      }
    }
  });

  const speed = 0.3;
  
  const updateHostSqueeze = (width: number, disableTransition: boolean = false) => {
    let styleEl = document.getElementById('wps-sidebar-squeeze-style') as HTMLStyleElement;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'wps-sidebar-squeeze-style';
      document.head.appendChild(styleEl);
    }
    
    if (mode !== 'sidebar') {
      styleEl.textContent = '';
      return;
    }

    const transitionRule = disableTransition 
      ? 'transition: none !important;' 
      : `transition: width ${speed}s cubic-bezier(0.16, 1, 0.3, 1), margin-right ${speed}s cubic-bezier(0.16, 1, 0.3, 1) !important;`;

    styleEl.textContent = `
      html { 
        width: calc(100% - ${width}px) !important; 
        margin-right: ${width}px !important; 
        ${transitionRule}
      }
    `;
  };

  useEffect(() => {
    const targetWidth = sidebarWidth || containerRef.current?.offsetWidth || 0;
    updateHostSqueeze(targetWidth, false);
    
    return () => {
      const styleEl = document.getElementById('wps-sidebar-squeeze-style');
      if (styleEl) styleEl.textContent = '';
    };
  }, [mode, sidebarWidth]);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (mode !== 'sidebar' || isResizingRef.current) return;
      for (const entry of entries) {
        updateHostSqueeze(entry.contentRect.width, false);
      }
    });
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mode]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (mode === 'floating' && isFloatingLoaded) {
      if (floatingState) {
        el.style.width = `${floatingState.width}px`;
        el.style.height = `${floatingState.height}px`;
        el.style.left = floatingState.left || '';
        el.style.top = floatingState.top || '';
        el.style.right = floatingState.right || '';
        el.style.bottom = floatingState.bottom || '';
      } else {
        el.style.width = 'var(--webpage-summary-panel-width)';
        el.style.height = 'var(--webpage-summary-panel-height)';
        el.style.left = '';
        if (initialOffset) {
          el.style.top = `clamp(16px, calc(var(--webpage-summary-panel-top) + ${initialOffset.y}px), calc(100vh - 37 * var(--webpage-summary-panel-srem)))`;
          el.style.right = `clamp(16px, calc(var(--webpage-summary-panel-right) + ${initialOffset.x}px), calc(100vw - 31 * var(--webpage-summary-panel-srem)))`;
        } else {
          el.style.top = 'var(--webpage-summary-panel-top)';
          el.style.right = 'var(--webpage-summary-panel-right)';
        }
        el.style.bottom = '';
      }
      el.style.transform = 'none';
    } else if (mode === 'sidebar' && isSidebarLoaded) {
      if (sidebarWidth) {
        el.style.width = `${sidebarWidth}px`;
      } else {
        el.style.width = 'var(--webpage-summary-panel-sidebar-width)';
      }
      el.style.height = '';
      el.style.left = '';
      el.style.top = '';
      el.style.right = '';
      el.style.bottom = '';
      el.style.transform = '';
    }
  }, [mode, isFloatingLoaded, floatingState, isSidebarLoaded, sidebarWidth]);

  if (!isFloatingLoaded || !isSidebarLoaded) return null;

  const isFloating = mode === 'floating';

  return (
    <div
      ref={containerRef}
      onMouseDown={isFloating ? startDrag : undefined}
      className={cn(
        "flex flex-col z-[2147483647]",
        isFloating 
          ? "fixed bg-background rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-zinc-200/60 max-w-[100vw] max-h-[100vh] min-w-[calc(24*var(--webpage-summary-panel-srem))] min-h-[calc(14*var(--webpage-summary-panel-srem))]"
          : "fixed right-0 top-0 bottom-0 h-screen bg-background/95 backdrop-blur-xl border-l border-zinc-200 shadow-2xl text-zinc-950 min-w-[calc(20*var(--webpage-summary-panel-srem))]"
      )}
    >
      {isFloating ? (
        <>
          <div className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize z-50" onMouseDown={(e) => startFloatingResize(e, 'bottom')} />
          <div className="absolute top-0 left-0 w-1.5 h-full cursor-ew-resize z-50" onMouseDown={(e) => startFloatingResize(e, 'left')} />
          <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50" onMouseDown={(e) => startFloatingResize(e, 'bottomLeft')} />
        </>
      ) : (
        <div 
          className="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-50 hover:bg-zinc-900/10 transition-colors" 
          onMouseDown={(e) => startSidebarResize(e, 'left')} 
        />
      )}
      
      {children}
    </div>
  );
}

export function PanelContainer({ children, defaultMode = 'floating', storageKey, initialOffset }: PanelContainerProps) {
  return (
    <PanelProvider defaultMode={defaultMode}>
      <UnifiedPanelRenderer storageKey={storageKey} initialOffset={initialOffset}>
        {children}
      </UnifiedPanelRenderer>
    </PanelProvider>
  );
}
