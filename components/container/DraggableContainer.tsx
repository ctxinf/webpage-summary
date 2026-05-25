
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DraggableContainerProps {
  className?: string;
  children?: React.ReactNode;
}
/**
 * @deprecated only used in sample
 */
export const DraggableContainer = React.forwardRef<HTMLDivElement, DraggableContainerProps>(({
  className,
  children,
}, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const dragContainerRef = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  
  const initialMousePosition = useRef({ x: 0, y: 0 });
  const initialElementPosition = useRef({ left: 0, top: 0 });
  const THRESHOLD = 10;

  const startDrag = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only drag on left click
    if (event.button !== 0) return;

    const target = event.target as HTMLElement;
    
    // Only drag when clicking the header area
    const headerEl = target.closest('header');
    if (!headerEl) return;

    // Do not drag when clicking controls inside the header
    const controlEl = target.closest('button, select, input, textarea, a');
    if (controlEl) return;

    initialMousePosition.current = { x: event.clientX, y: event.clientY };
    initialElementPosition.current = { left: dragContainerRef.current?.offsetLeft || 0, top: dragContainerRef.current?.offsetTop || 0 };
    isDraggingRef.current = true;
    setIsDragging(true);

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
  };

    const drag = (event: MouseEvent) => {
      if (!isDraggingRef.current || !dragContainerRef.current) return;

      const el = dragContainerRef.current;
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;

      const elementWidth = el.clientWidth;

      let newX = initialElementPosition.current.left + (event.clientX - initialMousePosition.current.x);
      let newY = initialElementPosition.current.top + (event.clientY - initialMousePosition.current.y);

      // Keep within bounds
      if (newX < 0) {
        newX = 0;
      } else if (newX + elementWidth + THRESHOLD > clientWidth) {
        newX = clientWidth - elementWidth - THRESHOLD;
      }

      if (newY < 0) {
        newY = 0;
      } else if (newY + THRESHOLD > clientHeight) {
        newY = clientHeight - THRESHOLD;
      }

      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    };

  const endDrag = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);

      const el = dragContainerRef.current;
      if (el) {
        const clientWidth = document.documentElement.clientWidth || 1;
        const clientHeight = document.documentElement.clientHeight || 1;
        el.style.left = `${(100 * el.offsetLeft) / clientWidth}%`;
        el.style.top = `${(100 * el.offsetTop) / clientHeight}%`;
      }
    }

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', endDrag);
    };
  }, []);

  return (
    <div
      ref={dragContainerRef}
      onMouseDown={startDrag}
      className={cn(
        'fixed top-[4em] right-[4em] w-fit z-[2147483646]',
        isDragging && 'select-none',
        className
      )}
    >
      {children}
    </div>
  );
});
