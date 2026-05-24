import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { useResizable, useDraggable } from './internal/interactions';

interface FloatingPanelProps {
  children: React.ReactNode;
  className?: string;
  defaultWidth?: number;
  defaultHeight?: number;
}

export function FloatingPanel({ 
  children, 
  className,
  defaultWidth = 320,
  defaultHeight = 450
}: FloatingPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { startResize } = useResizable({ targetRef: containerRef });
  const { startDrag } = useDraggable({ targetRef: containerRef });

  return (
    <div
      ref={containerRef}
      style={{ width: defaultWidth, height: defaultHeight }}
      onMouseDown={startDrag}
      className={cn(
        "fixed top-[4em] right-[4em] bg-white rounded-xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] border border-zinc-200/60 flex flex-col z-[2147483647]",
        className
      )}
    >
      {/* Edge handles */}
      <div className="absolute top-0 left-0 w-full h-1.5 cursor-ns-resize z-50" onMouseDown={(e) => startResize(e, 'top')} />
      <div className="absolute top-0 right-0 w-1.5 h-full cursor-ew-resize z-50" onMouseDown={(e) => startResize(e, 'right')} />
      <div className="absolute bottom-0 left-0 w-full h-1.5 cursor-ns-resize z-50" onMouseDown={(e) => startResize(e, 'bottom')} />
      <div className="absolute top-0 left-0 w-1.5 h-full cursor-ew-resize z-50" onMouseDown={(e) => startResize(e, 'left')} />
      {/* Corner handles */}
      <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50" onMouseDown={(e) => startResize(e, 'topLeft')} />
      <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50" onMouseDown={(e) => startResize(e, 'topRight')} />
      <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50" onMouseDown={(e) => startResize(e, 'bottomLeft')} />
      <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50" onMouseDown={(e) => startResize(e, 'bottomRight')} />
      
      {children}
    </div>
  );
}
