import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useResizable, useDraggable } from './internal/interactions';
import useWxtStorage from '@/hooks/useWxtStorage';
import { type StorageItemKey } from '#imports';

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
  storageKey?: string | null;
}

type FloatingState = { width: number; height: number; left: string; top: string; right: string; bottom: string };

export function FloatingPanel({ 
  children, 
  className,
  storageKey,
}: FloatingPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateKey = storageKey ? (`local:${storageKey}-floating-state` as StorageItemKey) : null;
  const [savedState, setSavedState, isLoaded] = useWxtStorage<FloatingState | null>(stateKey, null);

  const saveState = () => {
    if (containerRef.current) {
      const el = containerRef.current;
      setSavedState({
        width: el.offsetWidth,
        height: el.offsetHeight,
        left: el.style.left,
        top: el.style.top,
        right: el.style.right,
        bottom: el.style.bottom,
      });
    }
  };

  const { startResize } = useResizable({ targetRef: containerRef, onResizeEnd: saveState });
  const { startDrag } = useDraggable({ targetRef: containerRef, onDragEnd: saveState });

  useEffect(() => {
    if (isLoaded && savedState && containerRef.current) {
      const el = containerRef.current;
      el.style.width = `${savedState.width}px`;
      el.style.height = `${savedState.height}px`;
      if (savedState.left) el.style.left = savedState.left;
      if (savedState.top) el.style.top = savedState.top;
      if (savedState.right) el.style.right = savedState.right;
      if (savedState.bottom) el.style.bottom = savedState.bottom;
      el.style.transform = 'none';
    }
  }, [isLoaded]); // Empty dependency logic intentional: only restore once on mount/load

  if (!isLoaded) return null;

  return (
    <div
      ref={containerRef}
      style={savedState ? { 
        width: `${savedState.width}px`, 
        height: `${savedState.height}px`,
        left: savedState.left || undefined,
        top: savedState.top || undefined,
        right: savedState.right || undefined,
        bottom: savedState.bottom || undefined,
      } : undefined}
      onMouseDown={startDrag}
      className={cn(
        "fixed top-[4em] right-[4em] bg-white rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-zinc-200/60 flex flex-col z-[2147483647] max-w-[100vw] max-h-[100vh]",
        className
      )}
    >
      {/* Edge handles */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize z-50" onMouseDown={(e) => startResize(e, 'bottom')} />
      <div className="absolute top-0 left-0 w-1.5 h-full cursor-ew-resize z-50" onMouseDown={(e) => startResize(e, 'left')} />
      {/* Corner handle */}
      <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50" onMouseDown={(e) => startResize(e, 'bottomLeft')} />
      
      {children}
    </div>
  );
}
