import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import useWxtStorage from '@/hooks/useWxtStorage';
import { cn } from '@/lib/utils';
import { type StorageItemKey } from '#imports';

interface RightFloatingBallContainerProps {
  /**
   * The storage suffix key to persist the vertical position.
   * e.g., 'page' will save as 'local:right-floating-ball-top-page'.
   */
  storageKey?: string;
  
  /**
   * Additional tailwind classes for the container.
   */
  className?: string;
  
  /**
   * Initial close button visibility behavior (if you want to override default).
   */
  initClosedBtnHidden?: boolean;
  
  /**
   * Fired when the close button is clicked.
   */
  onClose?: () => void;
  
  /**
   * Contents of the floating ball.
   */
  children?: React.ReactNode;
}

const THRESHOLD = 16; // Padding from the viewport edges

export default function RightFloatingBallContainer({
  storageKey = 'page',
  className,
  onClose,
  children,
}: RightFloatingBallContainerProps) {
  const floatingBallRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  
  // Storage key: local:right-floating-ball-top-[key]
  const storageKeyFull = `local:right-floating-ball-top-${storageKey}` as StorageItemKey;
  const [positionY, setPositionY, isLoaded] = useWxtStorage<string>(storageKeyFull, '75%');

  // Drag coordinates tracing refs
  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    elementLeft: 0,
    elementTop: 0,
  });

  // Position positioning style applying when storage loads
  useEffect(() => {
    if (isLoaded && floatingBallRef.current && !isDraggingRef.current) {
      floatingBallRef.current.style.top = positionY;
    }
  }, [isLoaded, positionY]);

  // Common drag start
  const handleDragStart = (clientX: number, clientY: number) => {
    const el = floatingBallRef.current;
    if (!el) return;

    isDraggingRef.current = true;
    setIsDragging(true);

    // Capture starting state
    dragStartRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      elementLeft: el.offsetLeft,
      elementTop: el.offsetTop,
    };

    // Ensure style properties are set in px for absolute movement
    el.style.left = `${el.offsetLeft}px`;
    el.style.right = 'auto';

    document.body.classList.add('select-none'); // Prevent text selection
  };

  // Common drag move
  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDraggingRef.current) return;
    const el = floatingBallRef.current;
    if (!el) return;

    const deltaX = clientX - dragStartRef.current.mouseX;
    const deltaY = clientY - dragStartRef.current.mouseY;

    let newX = dragStartRef.current.elementLeft + deltaX;
    let newY = dragStartRef.current.elementTop + deltaY;

    // Viewport dimensions
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const elW = el.offsetWidth;
    const elH = el.offsetHeight;

    // Boundary constraints
    newX = Math.max(THRESHOLD, Math.min(winW - elW - THRESHOLD, newX));
    newY = Math.max(THRESHOLD, Math.min(winH - elH - THRESHOLD, newY));

    // Update style directly for 60fps performance
    el.style.left = `${newX}px`;
    el.style.top = `${(100 * newY) / winH}%`;
  };

  // Common drag end
  const handleDragEnd = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    document.body.classList.remove('select-none');

    const el = floatingBallRef.current;
    if (!el) return;

    // Snap to the right edge smoothly
    el.style.left = '';
    el.style.right = `${THRESHOLD}px`;

    // Persist new vertical position
    setPositionY(el.style.top);
  };

  // Mouse drag events handlers
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag on left click
    if (e.button !== 0) return;
    // Don't drag if clicking the close button
    if ((e.target as HTMLElement).closest('[data-close-btn]')) return;

    handleDragStart(e.clientX, e.clientY);

    const handleMouseMove = (event: MouseEvent) => {
      handleDragMove(event.clientX, event.clientY);
    };

    const handleMouseUp = () => {
      handleDragEnd();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Touch drag events handlers (for mobile support)
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-close-btn]')) return;
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);

    const handleTouchMove = (event: TouchEvent) => {
      const t = event.touches[0];
      handleDragMove(t.clientX, t.clientY);
    };

    const handleTouchEnd = () => {
      handleDragEnd();
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (!isLoaded) return null;

  return (
    <div
      ref={floatingBallRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        right: `${THRESHOLD}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={cn(
        'fixed z-50 group flex items-center justify-center rounded-full select-none',
        // Enable smooth sliding transition when not actively dragging
        !isDragging && 'transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)',
        className
      )}
    >
      {/* Close button with premium hover animation */}
      <button
        data-close-btn
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        className="absolute -top-1 -left-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-zinc-800/90 hover:bg-zinc-950 text-white shadow-md backdrop-blur-xs transition-all duration-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100"
        title="Hide Floating Ball"
        type="button"
      >
        <X size={10} strokeWidth={3} />
      </button>

      {/* Embedded Floating Ball Content */}
      {children}
    </div>
  );
}
