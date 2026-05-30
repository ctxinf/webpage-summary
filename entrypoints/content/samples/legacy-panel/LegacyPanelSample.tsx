import React, { useState } from 'react';
import { X, Minimize2, CopyPlus, MessageCirclePlus, ChevronUp } from 'lucide-react';
import { PanelContainer } from '@/components/container/PanelContainer';
import { Button } from '@/components/ui/button';

function StatusButton() {
  return (
    <Button variant="outline" size="sm" className="h-6 text-xs px-2 rounded-full border-green-500 text-green-600 bg-green-50 hover:bg-green-100">
      Ready
    </Button>
  );
}

function LegacyPanelContent() {
  const [expandChat, setExpandChat] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white text-zinc-900 rounded-xl overflow-hidden shadow-2xl relative">
      {/* Header */}
      <header className="px-3 py-2 bg-zinc-100 border-b border-zinc-200 cursor-move flex items-center justify-between" data-drag-handle>
        <div className="flex items-center gap-2">
          <StatusButton />
          <div className="flex items-center gap-1 border border-zinc-200 rounded px-2 py-0.5 bg-white text-xs">
            <span className="font-semibold text-zinc-700">Model:</span>
            <span className="text-zinc-600 truncate max-w-[80px]">GPT-4o</span>
          </div>
          <div className="flex items-center gap-1 border border-zinc-200 rounded px-2 py-0.5 bg-white text-xs">
            <span className="font-semibold text-zinc-700">Prompt:</span>
            <span className="text-zinc-600 truncate max-w-[80px]">Default</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-zinc-500 hover:text-zinc-700">
            <CopyPlus size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-zinc-500 hover:text-zinc-700">
            <Minimize2 size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-zinc-500 hover:text-zinc-700">
            <X size={14} />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4 relative">
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
              Length: 1200 / 4000
            </div>
            <div className="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
              0 Tokens ($0.000)
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-6 text-xs text-zinc-500">
            Clear
          </Button>
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col gap-3">
          <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-lg text-sm text-zinc-700">
            This is a mock response replicating the legacy UI.
            You can type your messages below or click the chat button to expand the chat input box.
          </div>
        </div>
      </div>

      {/* Chat Input Box Toggle */}
      <div className="absolute top-[3.5em] right-0 flex flex-row gap-1 z-10">
        {!expandChat && (
          <Button 
            onClick={() => setExpandChat(true)}
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-none rounded-l-md bg-zinc-100 border border-r-0 border-zinc-200 text-purple-600 shadow-sm"
          >
            <MessageCirclePlus size={16} />
          </Button>
        )}
      </div>

      {/* Chat Input Box */}
      {expandChat && (
        <div className="relative border-t border-zinc-200 bg-white">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <Button 
              onClick={() => setExpandChat(false)}
              variant="ghost" 
              size="icon" 
              className="h-6 w-8 rounded-t-md rounded-b-none bg-zinc-100 border border-b-0 border-zinc-200 text-zinc-500 hover:text-zinc-700 shadow-sm"
            >
              <ChevronUp size={14} />
            </Button>
          </div>
          <div className="p-3 bg-zinc-50">
            <textarea 
              className="w-full min-h-[60px] p-2 text-sm border border-zinc-300 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none bg-white"
              placeholder="Ask anything..."
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white px-4">
                Send
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function LegacyPanelSample() {
  return (
    <PanelContainer defaultMode="floating">
      <LegacyPanelContent />
    </PanelContainer>
  );
}
