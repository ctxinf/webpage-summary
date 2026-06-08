import React from 'react';
import { PanelContainer } from '@/components/container/PanelContainer';
import { usePanel } from '@/components/container/PanelContext';

function PanelContent() {
  const { mode, setMode } = usePanel();

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 rounded-xl overflow-hidden">
      <header className="px-4 py-3 bg-zinc-100 border-b border-zinc-200 cursor-move flex items-center justify-between" data-drag-handle>
        <h3 className="font-medium text-sm m-0">OmniPanel Sample</h3>
        <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider bg-zinc-200/50 px-2 py-0.5 rounded-full">
          {mode} Mode
        </span>
      </header>
      <div className="p-5 flex-1 overflow-auto flex flex-col gap-4">
        <p className="text-sm text-zinc-600 m-0">
          This panel combines dragging, resizing, and seamless transitions into a sidebar. 
          Grab the edges to resize, or click the button below to switch modes!
        </p>
        
        <div className="mt-4 p-4 rounded-lg bg-zinc-50 border border-zinc-100">
          <h4 className="text-xs font-semibold text-zinc-800 mb-2 uppercase tracking-wider">Controls</h4>
          <button 
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm rounded-md transition-colors shadow-sm"
            onClick={() => setMode(mode === 'floating' ? 'sidebar' : 'floating')}
          >
            Switch to {mode === 'floating' ? 'Sidebar' : 'Floating'} Mode
          </button>
        </div>
      </div>
    </div>
  );
}

export function OmniPanelSample() {
  return (
    <PanelContainer defaultMode="floating" storageKey="sample-panel">
      <PanelContent />
    </PanelContainer>
  );
}
