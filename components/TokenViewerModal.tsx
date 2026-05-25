import React, { useEffect, useState } from 'react';
import { X, Info } from 'lucide-react';
import { sendMessage } from '@/lib/messaging';
import type { TokenPiece } from '@/lib/token-count';

const TOKEN_COLORS = [
  'bg-red-200', 'bg-orange-200', 'bg-amber-200', 'bg-yellow-200', 
  'bg-lime-200', 'bg-green-200', 'bg-emerald-200', 'bg-teal-200', 
  'bg-cyan-200', 'bg-sky-200', 'bg-blue-200', 'bg-indigo-200', 
  'bg-violet-200', 'bg-purple-200', 'bg-fuchsia-200', 'bg-pink-200', 'bg-rose-200'
];

interface TokenViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  textContent: string;
  maxInputTokens: number;
}

export function TokenViewerModal({ isOpen, onClose, textContent, maxInputTokens }: TokenViewerModalProps) {
  const [pieces, setPieces] = useState<TokenPiece[]>([]);
  const [loading, setLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(maxInputTokens);
  
  useEffect(() => {
    if (!isOpen) return;
    
    let active = true;
    setLoading(true);
    sendMessage('splitTokensWithTiming', { text: textContent })
      .then((res) => {
        if (!active) return;
        setPieces(res.pieces);
        const realTokens = res.pieces.length;
        setSliderValue(maxInputTokens === 0 ? realTokens : Math.min(realTokens, maxInputTokens));
        setLoading(false);
      })
      .catch(e => {
        console.error('Failed to split tokens:', e);
        if (active) setLoading(false);
      });
      
    return () => { active = false; };
  }, [isOpen, textContent, maxInputTokens]);

  if (!isOpen) return null;

  const realTokens = pieces.length;
  const maxSlider = Math.max(realTokens, maxInputTokens);

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col pointer-events-auto rounded-[inherit] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100 bg-white shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-700">
          <span>Token Preview</span>
          <div className="group relative flex items-center justify-center">
            <Info size={14} className="text-zinc-400 cursor-help" />
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-60 p-2 bg-zinc-800 text-zinc-100 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 text-center font-normal leading-relaxed before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-b-zinc-800">
              此界面仅用于可视化分词效果。在此处的拖动调节不会改变实际发送给大语言模型的文本内容。
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 transition-colors"
          title="Close"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 leading-[1.6] whitespace-pre-wrap font-mono text-sm text-zinc-800 break-words bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <div className="animate-pulse">Loading tokens...</div>
          </div>
        ) : (
          pieces.map((p, i) => {
            const isExcluded = i >= sliderValue;
            const colorClass = TOKEN_COLORS[p.id % TOKEN_COLORS.length];
            return (
              <span 
                key={i} 
                className={`relative px-[0.5px] rounded-[1px] transition-colors duration-150 ${isExcluded ? 'bg-zinc-100 text-zinc-300' : colorClass}`}
                title={`Token ID: ${p.id}`}
              >
                {p.text}
              </span>
            );
          })
        )}
      </div>

      {/* Footer / Slider */}
      <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <label className="text-xs font-medium text-zinc-600 flex-1">
            Tokens: <span className="text-emerald-700 font-bold text-sm">{sliderValue}</span> / {realTokens}
          </label>
          <span className="text-xs text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
            Max Input Limit: {maxInputTokens === 0 ? '∞' : maxInputTokens}
          </span>
        </div>
        <div className="relative flex items-center h-4">
          <input 
            type="range" 
            min={0} 
            max={maxSlider} 
            value={sliderValue} 
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 outline-none hover:bg-zinc-300 transition-colors focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>
    </div>
  );
}
