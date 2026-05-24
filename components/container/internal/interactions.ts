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
  modifyLeftOnResize?: boolean;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

export function useResizable<T extends HTMLElement>({ 
  targetRef, 
  enabled = true,
  modifyLeftOnResize = true,
  onResizeStart,
  onResizeEnd
}: UseResizableProps<T>) {
  const isResizingRef = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startDim = useRef({ width: 0, height: 0, left: 0, top: 0 });
  const resizeDir = useRef<ResizeDirection>('bottomRight');

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

    if (onResizeStart) onResizeStart();

    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };

  const resize = (event: MouseEvent) => {
    if (!isResizingRef.current || !targetRef.current) return;
    const el = targetRef.current;
    
    const diffX = event.clientX - startMouse.current.x;
    const diffY = event.clientY - startMouse.current.y;
    const dir = resizeDir.current;

    if (dir === 'right' || dir === 'bottomRight' || dir === 'topRight') {
      el.style.width = `${startDim.current.width + diffX}px`;
    }
    if (dir === 'left' || dir === 'bottomLeft' || dir === 'topLeft') {
      el.style.width = `${startDim.current.width - diffX}px`;
      if (modifyLeftOnResize) {
        el.style.left = `${startDim.current.left + diffX}px`;
      }
    }
    if (dir === 'bottom' || dir === 'bottomRight' || dir === 'bottomLeft') {
      el.style.height = `${startDim.current.height + diffY}px`;
    }
    if (dir === 'top' || dir === 'topRight' || dir === 'topLeft') {
      el.style.height = `${startDim.current.height - diffY}px`;
      el.style.top = `${startDim.current.top + diffY}px`;
    }
  };

  const stopResize = () => {
    isResizingRef.current = false;
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
}

export function useDraggable<T extends HTMLElement>({ targetRef, enabled = true }: UseDraggableProps<T>) {
  const isDraggingRef = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const THRESHOLD = 10;

  const startDrag = (event: React.MouseEvent<HTMLElement>) => {
    if (!enabled || !targetRef.current || event.button !== 0) return;

    // Only drag when clicking the header area (or specifically marked handle)
    const target = event.target as HTMLElement;
    const dragHandle = target.closest('[data-drag-handle]');
    if (!dragHandle) return;

    // Do not drag when clicking controls inside the header
    const controlEl = target.closest('button, select, input, textarea, a');
    if (controlEl) return;

    startMouse.current = { x: event.clientX, y: event.clientY };
    isDraggingRef.current = true;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
  };

  const drag = (event: MouseEvent) => {
    if (!isDraggingRef.current || !targetRef.current) return;
    const el = targetRef.current;
    
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const elementWidth = el.clientWidth;
    
    let newX = el.offsetLeft + (event.clientX - startMouse.current.x);
    let newY = el.offsetTop + (event.clientY - startMouse.current.y);

    if (newX < 0) newX = 0;
    else if (newX + elementWidth + THRESHOLD > clientWidth) {
      newX = clientWidth - elementWidth - THRESHOLD;
    }

    if (newY < 0) newY = 0;
    else if (newY + THRESHOLD > clientHeight) {
      newY = clientHeight - THRESHOLD;
    }

    el.style.left = `${newX}px`;
    el.style.top = `${newY}px`;
    el.style.right = 'auto';
    el.style.bottom = 'auto';
    el.style.transform = 'none'; // Clear any transform centering if present

    startMouse.current = { x: event.clientX, y: event.clientY };
  };

  const endDrag = () => {
    isDraggingRef.current = false;
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
