import { useRef } from 'react';
import { DraggableContainer } from '@/components/container/DraggableContainer';
import { ResizableContainer } from '@/components/container/ResizableContainer';

export function DraggableSample() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4">
      <DraggableContainer 
        ref={containerRef} 
        className="w-64 h-48 shadow-lg bg-white border border-gray-300 flex flex-col"
      >
        <ResizableContainer 
          targetRef={containerRef} 
          className="border-none !static w-full h-full flex flex-col"
        >
          <header className="bg-gray-100 cursor-move p-2 border-b border-gray-300 select-none">
            Drag & Resize Me
          </header>
          <div className="p-4 flex-1 overflow-auto text-gray-700">
            Simple draggable and resizable box.
          </div>
        </ResizableContainer>
      </DraggableContainer>
    </div>
  );
}

