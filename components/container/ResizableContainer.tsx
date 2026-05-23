import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResizableContainerProps {
  className?: string;
  enableTopResize?: boolean;
  enableRightResize?: boolean;
  enableBottomResize?: boolean;
  enableLeftResize?: boolean;
  children?: React.ReactNode;
}

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

export function ResizableContainer({
  className,
  enableTopResize = true,
  enableRightResize = true,
  enableBottomResize = true,
  enableLeftResize = true,
  children,
}: ResizableContainerProps) {
  const resizableContainerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);

  const startX = useRef(0);
  const startY = useRef(0);
  const startWidth = useRef(0);
  const startHeight = useRef(0);
  const resizeDirection = useRef<ResizeDirection>('bottomRight');

  const startResize = (event: React.MouseEvent, direction: ResizeDirection) => {
    event.stopPropagation();
    event.preventDefault();

    isResizingRef.current = true;
    setIsResizing(true);

    startX.current = event.clientX;
    startY.current = event.clientY;

    if (resizableContainerRef.current) {
      startWidth.current = resizableContainerRef.current.offsetWidth;
      startHeight.current = resizableContainerRef.current.offsetHeight;
    }
    
    resizeDirection.current = direction;

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  const resize = (event: MouseEvent) => {
    if (!isResizingRef.current || !resizableContainerRef.current) return;

    const el = resizableContainerRef.current;
    const diffX = event.clientX - startX.current;
    const diffY = event.clientY - startY.current;

    const dir = resizeDirection.current;

    if (dir === 'right' || dir === 'bottomRight' || dir === 'topRight') {
      el.style.width = `${startWidth.current + diffX}px`;
    }
    if (dir === 'left' || dir === 'bottomLeft' || dir === 'topLeft') {
      el.style.width = `${startWidth.current - diffX}px`;
      el.style.left = `${el.offsetLeft + diffX}px`;
    }
    if (dir === 'bottom' || dir === 'bottomRight' || dir === 'bottomLeft') {
      el.style.height = `${startHeight.current + diffY}px`;
    }
    if (dir === 'top' || dir === 'topRight' || dir === 'topLeft') {
      el.style.height = `${startHeight.current - diffY}px`;
      el.style.top = `${el.offsetTop + diffY}px`;
    }
  };

  const stopResize = () => {
    if (isResizingRef.current) {
      isResizingRef.current = false;
      setIsResizing(false);
    }
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);

  return (
    <div
      ref={resizableContainerRef}
      className={cn('relative border', className)}
    >
      {enableTopResize && (
        <div
          className="absolute top-0 left-0 w-full h-2 bg-transparent cursor-ns-resize z-50"
          onMouseDown={(e) => startResize(e, 'top')}
        />
      )}
      {enableRightResize && (
        <div
          className="absolute top-0 right-0 w-2 h-full bg-transparent cursor-ew-resize z-50"
          onMouseDown={(e) => startResize(e, 'right')}
        />
      )}
      {enableBottomResize && (
        <div
          className="absolute bottom-0 left-0 w-full h-2 bg-transparent cursor-ns-resize z-50"
          onMouseDown={(e) => startResize(e, 'bottom')}
        />
      )}
      {enableLeftResize && (
        <div
          className="absolute top-0 left-0 w-2 h-full bg-transparent cursor-ew-resize z-50"
          onMouseDown={(e) => startResize(e, 'left')}
        />
      )}
      {/* Corner Resizing Handles */}
      {enableBottomResize && enableRightResize && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-transparent cursor-se-resize z-50"
          onMouseDown={(e) => startResize(e, 'bottomRight')}
        />
      )}
      {enableBottomResize && enableLeftResize && (
        <div
          className="absolute bottom-0 left-0 w-3 h-3 bg-transparent cursor-sw-resize z-50"
          onMouseDown={(e) => startResize(e, 'bottomLeft')}
        />
      )}
      {enableTopResize && enableRightResize && (
        <div
          className="absolute top-0 right-0 w-3 h-3 bg-transparent cursor-ne-resize z-50"
          onMouseDown={(e) => startResize(e, 'topRight')}
        />
      )}
      {enableTopResize && enableLeftResize && (
        <div
          className="absolute top-0 left-0 w-3 h-3 bg-transparent cursor-nw-resize z-50"
          onMouseDown={(e) => startResize(e, 'topLeft')}
        />
      )}
      {children}
    </div>
  );
}
