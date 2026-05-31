import { browser } from 'wxt/browser';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  getModelProviderDefinition,
  getModelDisplayIcon,
  type ModelConfigItem,
} from '@/constants/model-settings';
import type { PromptConfigItem } from '@/constants/prompt-settings';

interface ModelPromptSelectorProps {
  models: ModelConfigItem[];
  prompts: PromptConfigItem[];
  currentModelId: string;
  currentPromptId: string;
  onModelChange: (id: string) => void;
  onPromptChange: (id: string) => void;
  variant: 'floating' | 'sidebar';
}

export function ModelPromptSelector({
  models,
  prompts,
  currentModelId,
  currentPromptId,
  onModelChange,
  onPromptChange,
  variant,
}: ModelPromptSelectorProps) {
  const isFloating = variant === 'floating';
  const currentModel = models.find((m) => m.id === currentModelId);

  return (
    <div
      className={cn(
        'flex items-center shrink-0',
        isFloating ? 'justify-center gap-1.5' : 'gap-1.5 justify-start',
      )}
    >
      <div className="relative flex items-center">
        {currentModel && (() => {
          const providerDef = getModelProviderDefinition(currentModel.providerId);
          const iconUrl = getModelDisplayIcon(currentModel);
          const src =
            iconUrl.startsWith('http') || iconUrl.startsWith('data:')
              ? iconUrl
              : browser.runtime.getURL(iconUrl as any);

          return (
            <img
              src={src}
              alt={providerDef.label}
              className="absolute left-2 w-3.5 h-3.5 pointer-events-none object-contain z-10"
            />
          );
        })()}
        <select
          className={cn(
            'appearance-none pl-7 pr-6 py-1 outline-none font-medium max-w-[120px] truncate cursor-pointer transition-colors',
            isFloating
              ? 'border border-border rounded-lg text-xs bg-background shadow-sm text-foreground'
              : 'border border-border rounded-full text-xs bg-background/90 backdrop-blur shadow-sm hover:bg-muted text-foreground',
          )}
          value={currentModelId}
          onChange={(e) => {
            onModelChange(e.target.value);
            console.log('[ModelPromptSelector] Switched model to', e.target.value);
          }}
        >
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
      </div>
      <div className="relative">
        <select
          className={cn(
            'appearance-none pl-2 pr-6 py-1 outline-none font-medium max-w-[120px] truncate cursor-pointer transition-colors',
            isFloating
              ? 'border border-border rounded-lg text-xs bg-background shadow-sm text-foreground'
              : 'border border-border rounded-full text-xs bg-background/90 backdrop-blur shadow-sm hover:bg-muted text-foreground',
          )}
          value={currentPromptId}
          onChange={(e) => {
            onPromptChange(e.target.value);
            console.log('[ModelPromptSelector] Switched prompt to', e.target.value);
          }}
        >
          {prompts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={12}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
      </div>
    </div>
  );
}
