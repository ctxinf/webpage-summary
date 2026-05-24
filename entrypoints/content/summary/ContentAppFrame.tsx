import React, { useState } from 'react';
import { browser } from 'wxt/browser';
import { usePanel } from '@/components/container/PanelContext';
import { sendMessage } from '@/lib/messaging';
import { Play, Settings, PlusSquare, PanelRight, PictureInPicture2, Copy, Send, ArrowUpToLine, ArrowDownToLine, ChevronUp, ChevronDown, Eye, X } from 'lucide-react';

interface ContentAppFrameProps {
  onClose: () => void;
  isMain?: boolean;
  onAdd?: () => void;
}

export function ContentAppFrame({ onClose, isMain = true, onAdd }: ContentAppFrameProps) {
  const { mode, setMode } = usePanel();
  const [showBottom, setShowBottom] = useState(true);
  
  return (
    <div className="flex flex-col w-full h-full bg-white text-zinc-900 overflow-hidden relative pointer-events-auto">
      {/* 顶部栏 / Top Bar */}
      <header className="px-1 py-1 bg-white border-b border-zinc-100 grid grid-cols-[1fr_auto_1fr] items-center cursor-move whitespace-nowrap gap-2" data-drag-handle>
        <div className="flex items-center gap-1.5 justify-start overflow-hidden">
          <img src={browser.runtime.getURL('/icon/32.png')} alt="icon" className="size-6 rounded-[3px] object-contain shrink-0" />
          <button className="flex items-center gap-1 px-2 py-1 bg-white border border-zinc-200 rounded text-xs hover:bg-zinc-50 shadow-sm text-zinc-700 shrink-0">
            <Play size={12} className="text-emerald-500" />
            <span>总结</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1.5 shrink-0">
          <div className="relative">
            <select className="appearance-none pl-2 pr-6 py-1 border border-zinc-200 rounded text-xs bg-white outline-none shadow-sm text-zinc-700 font-medium">
              <option>moonshot...</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none pl-2 pr-6 py-1 border border-zinc-200 rounded text-xs bg-white outline-none shadow-sm text-zinc-700 font-medium">
              <option>Sample</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-zinc-500 justify-end overflow-hidden">
          <button className="p-0.5 border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm shrink-0" title="Add" onClick={onAdd}>
            <PlusSquare size={14} />
          </button>
          {isMain && (
            <button 
              className="p-0.5 border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm shrink-0" 
              title={mode === 'floating' ? 'Switch to Sidebar' : 'Switch to Floating'}
              onClick={() => setMode(mode === 'floating' ? 'sidebar' : 'floating')}
            >
              {mode === 'floating' ? <PanelRight size={14} /> : <PictureInPicture2 size={14} />}
            </button>
          )}
          <button 
            className="p-0.5 border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm shrink-0" 
            title="Settings"
            onClick={() => sendMessage('openOptionPage', '/options.html#/')}
          >
            <Settings size={14} />
          </button>
          <button className="p-0.5 border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm ml-1 text-zinc-400 hover:text-zinc-600 shrink-0" onClick={onClose} title="Close">
            <X size={14} />
          </button>
        </div>
      </header>
      
      {/* 中间的对话列表 / Middle Chat List Placeholder */}
      <div className="flex-1 overflow-auto p-4 bg-white flex flex-col cursor-auto">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-zinc-800">
            <span>内容字符串长度: <span className="underline decoration-zinc-300 underline-offset-2">54</span></span>
            <Eye size={14} className="text-zinc-400" />
          </div>
          <button className="p-1.5 border border-zinc-200 rounded hover:bg-zinc-50 shadow-sm text-zinc-600">
            <Copy size={14} />
          </button>
        </div>
        <div className="mt-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 rounded-lg p-8">
          （中间的对话列表 - 现成方案占位）
        </div>
      </div>
      
      {/* 底部的对话输入 / Bottom Input Area Placeholder */}
      {showBottom && (
        <div className="flex-none p-3 bg-white border-t border-zinc-100 relative cursor-auto">
          {/* Mock scroll/action buttons above input */}
          <div className="absolute right-4 -top-12 flex flex-col gap-1.5">
             <button className="p-1.5 rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-600 shadow-sm bg-white/90 backdrop-blur">
              <ArrowUpToLine size={14} />
            </button>
            <button className="p-1.5 rounded-full border border-zinc-200 text-zinc-400 hover:text-zinc-600 shadow-sm bg-white/90 backdrop-blur">
              <ArrowDownToLine size={14} />
            </button>
          </div>
          
          <div className="relative mt-2">
            <div className="w-full min-h-[60px] p-3 pr-12 border border-zinc-200 rounded-lg text-[13px] text-zinc-400 bg-white">
              Type your message here... Enter to send, Shift+Enter to insert new line.
            </div>
            <button className="absolute right-2 bottom-2 p-1.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors shadow-sm">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 底部折叠/展开按钮 (可关闭) / Bottom Collapse Toggle */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full z-10 cursor-auto">
        <button 
          onClick={() => setShowBottom(!showBottom)}
          className="bg-white border border-t-0 border-zinc-200 rounded-b-md px-3 py-0.5 text-zinc-400 hover:text-zinc-600 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center justify-center transition-colors pointer-events-auto"
          title={showBottom ? 'Close input' : 'Open input'}
        >
          {showBottom ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
  );
}
