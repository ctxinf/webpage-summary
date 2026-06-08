import React, { RefObject, useEffect, useRef } from 'react';

type ResizeDirection =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topRight'
  | 'bottomRight'
  | 'bottomLeft'
  | 'topLeft';

interface UseResizableProps<T extends HTMLElement> {
  targetRef: RefObject<T | null>;
  enabled?: boolean;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

export function useResizable<T extends HTMLElement>({ 
  targetRef, 
  enabled = true,
  onResizeStart,
  onResizeEnd
}: UseResizableProps<T>) {
  const isResizingRef = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startDim = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const resizeDir = useRef<ResizeDirection>('bottomRight');
  const limits = useRef({ minW: 0, maxW: Infinity, minH: 0, maxH: Infinity });

  const startResize = (event: React.MouseEvent, direction: ResizeDirection) => {
    if (!enabled || !targetRef.current) return;
    event.stopPropagation();
    event.preventDefault();

    isResizingRef.current = true;
    startMouse.current = { x: event.clientX, y: event.clientY };
    
    const el = targetRef.current;

    startDim.current = {
      width: el.offsetWidth,
      height: el.offsetHeight,
      left: el.offsetLeft,
      top: el.offsetTop,
    };
    resizeDir.current = direction;

    const computed = window.getComputedStyle(el);
    limits.current = {
      minW: parseFloat(computed.minWidth) || 0,
      maxW: parseFloat(computed.maxWidth) || Infinity,
      minH: parseFloat(computed.minHeight) || 0,
      maxH: parseFloat(computed.maxHeight) || Infinity,
    };

    if (onResizeStart) onResizeStart();

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  const rafRef = useRef<number | null>(null);

  const resize = (event: MouseEvent) => {
    if (!isResizingRef.current || !targetRef.current) return;
    
    // Calculate new dimensions immediately to avoid stale event data
    const diffX = event.clientX - startMouse.current.x;
    const diffY = event.clientY - startMouse.current.y;
    const dir = resizeDir.current;
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const el = targetRef.current;
      if (!el) return;

      const { minW, maxW, minH, maxH } = limits.current;

      let newW = startDim.current.width;
      let newH = startDim.current.height;
      let widthChanged = false;
      let heightChanged = false;

      if (dir === 'right' || dir === 'bottomRight' || dir === 'topRight') {
        newW = startDim.current.width + diffX;
        newW = Math.max(minW, Math.min(newW, maxW));
        el.style.width = `${newW}px`;
        widthChanged = true;
      }
      if (dir === 'left' || dir === 'bottomLeft' || dir === 'topLeft') {
        newW = startDim.current.width - diffX;
        newW = Math.max(minW, Math.min(newW, maxW));
        el.style.width = `${newW}px`;
        widthChanged = true;
      }
      if (dir === 'bottom' || dir === 'bottomRight' || dir === 'bottomLeft') {
        newH = startDim.current.height + diffY;
        newH = Math.max(minH, Math.min(newH, maxH));
        el.style.height = `${newH}px`;
        heightChanged = false; // We don't apply dynamic constraint to height
      }
      if (dir === 'top' || dir === 'topRight' || dir === 'topLeft') {
        newH = startDim.current.height - diffY;
        newH = Math.max(minH, Math.min(newH, maxH));
        el.style.height = `${newH}px`;
        heightChanged = false;
      }

      // Dynamic Content Constraint: physically stop shrinking if children are overflowing
      if (widthChanged) {
        const content = el.lastElementChild as HTMLElement;
        if (content && content.scrollWidth > Math.ceil(content.clientWidth)) {
          el.style.width = `${content.scrollWidth + (el.offsetWidth - el.clientWidth)}px`;
        }
      }
    });
  };

  const stopResize = () => {
    isResizingRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (onResizeEnd) onResizeEnd();
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, []);

  return { startResize };
}

interface UseDraggableProps<T extends HTMLElement> {
  targetRef: RefObject<T | null>;
  enabled?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function useDraggable<T extends HTMLElement>({ 
  targetRef, 
  enabled = true,
  onDragStart,
  onDragEnd
}: UseDraggableProps<T>) {
  const isDraggingRef = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ left: 0, top: 0 });
  const THRESHOLD = 10;

  const startDrag = (event: React.MouseEvent<HTMLElement>) => {
    if (!enabled || !targetRef.current || event.button !== 0) return;

    const target = event.target as HTMLElement;
    const dragHandle = target.closest('[data-drag-handle]');
    if (!dragHandle) return;

    const controlEl = target.closest('button, select, input, textarea, a');
    if (controlEl) return;

    startMouse.current = { x: event.clientX, y: event.clientY };
    const rect = targetRef.current.getBoundingClientRect();
    startPos.current = { left: rect.left, top: rect.top };
    isDraggingRef.current = true;

    if (onDragStart) onDragStart();

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
  };

  const drag = (event: MouseEvent) => {
    if (!isDraggingRef.current || !targetRef.current) return;
    const el = targetRef.current;
    
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const elementWidth = el.clientWidth;
    
    let newX = startPos.current.left + (event.clientX - startMouse.current.x);
    let newY = startPos.current.top + (event.clientY - startMouse.current.y);

    if (newX < 0) newX = 0;
    else if (newX + elementWidth + THRESHOLD > clientWidth) {
      newX = clientWidth - elementWidth - THRESHOLD;
    }

    const HEADER_HEIGHT = 50; // Ensure header is visible
    if (newY < 0) newY = 0;
    else if (newY + HEADER_HEIGHT > clientHeight) {
      newY = clientHeight - HEADER_HEIGHT;
    }

    const newRight = clientWidth - (newX + elementWidth);

    el.style.right = `${newRight}px`;
    el.style.top = `${newY}px`;
    el.style.left = 'auto';
    el.style.bottom = 'auto';
    el.style.transform = 'none';
  };

  const endDrag = () => {
    isDraggingRef.current = false;
    if (onDragEnd) onDragEnd();
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', endDrag);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', endDrag);
    };
  }, []);

  return { startDrag };
}
