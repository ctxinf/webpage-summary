import React, { useState, useEffect } from 'react';
import RightFloatingBallContainer from '@/components/container/RightFloatingBallContainer';
import useWxtStorage from '@/hooks/useWxtStorage';
import { getUiMessages } from '@/lib/i18n';
import { onMessage } from '@/lib/messaging';
import { PanelContainer } from '@/components/container/PanelContainer';
import { ContentAppFrame } from '@/entrypoints/content/summary/ContentAppFrame';
// import { useSummaryChatController } from '@/hooks/useSummaryChatController';
import { loadGeneralSettings } from '@/lib/general-settings-storage';
import iconUrl from '@/assets/16.png';
import { ThemeProvider } from '@/components/theme-provider';
import { iso } from 'zod/v4-mini';

import { createLogger } from '@/lib/logger';

const logger = createLogger('content:ContentEntrance');

export function ContentEntrance() {
  const [enableFloatingBall, setEnableFloatingBall] = useWxtStorage<boolean>(
    'local:enable-floating-ball',
    true
  );

  const [panelLayoutMode] = useWxtStorage<string>(
    'local:panel-layout-mode',
    'dialog'
  );

  const [enableSummaryWindowDefault] = useWxtStorage<boolean>(
    'local:enable-summary-window-default',
    false
  );

  const defaultMode = panelLayoutMode === 'sidebar' ? 'sidebar' : 'floating';

  const [mainPanelOpen, setMainPanelOpen] = useState(false);
  const [copies, setCopies] = useState<string[]>([]);

  const handleAddCopy = () => {
    setCopies(prev => [...prev, Date.now().toString()]);
  };

  const handleCloseCopy = (idToRemove: string) => {
    setCopies(prev => prev.filter(id => id !== idToRemove));
  };

  const messages = getUiMessages();

  useEffect(() => {
    if (enableSummaryWindowDefault) {
      setMainPanelOpen(true);
    }
  }, [enableSummaryWindowDefault]);

  useEffect(() => {
    const unbindInvoke = onMessage('invokeSummary', (msg) => {
      setMainPanelOpen(true);
      if (msg.data?.beginSummary) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('WEBPAGE_SUMMARY_BEGIN'));
        }, 150);
      }
    });

    const unbindAdd = onMessage('addContentToChatDialog', (msg) => {
      setMainPanelOpen(true);
      // Delay the event slightly to ensure ContentAppFrame has mounted and registered its event listener
      if (msg.data) {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('WEBPAGE_SUMMARY_ADD_TEXT', { detail: msg.data }));
        }, 150);
      }
    });

    return () => {
      unbindInvoke();
      unbindAdd();
    };
  }, []);

  const shadowHost = typeof document !== 'undefined' ? document.querySelector('webpage-summary-entrance') as HTMLElement | null : null;
  // logger.info('[ContentEntrance] document.querySelector("webpage-summary-entrance"):', shadowHost);

  return (
    <ThemeProvider container={shadowHost}>
      {/* Switchable summary panel layout — controller is shared from parent */}
      {
        mainPanelOpen && (
          <PanelContainer defaultMode={defaultMode} storageKey="main-panel">
            <ContentAppFrame 
              isMain={true} 
              onClose={() => setMainPanelOpen(false)} 
              onAdd={handleAddCopy}
            />
          </PanelContainer>
        )
      }

      {/* Render dynamic floating panel copies */}
      {copies.map((copyId, index) => {
        const step = (index % 10) + 1;
        return (
          <PanelContainer 
            key={copyId} 
            defaultMode="floating" 
            storageKey={null}
            initialOffset={{ x: step * 20, y: -step * 20 }}
          >
            <ContentAppFrame 
              isMain={false} 
              onClose={() => handleCloseCopy(copyId)} 
              onAdd={handleAddCopy}
            />
          </PanelContainer>
        );
      })}

      {/* Floating Ball Trigger — shown only when main panel is closed */}
      {enableFloatingBall && !mainPanelOpen && (
        <RightFloatingBallContainer
          storageKey="page"
          onClose={() => setEnableFloatingBall(false)}
        >
          <div
            onClick={() => setMainPanelOpen(true)}
            className="relative flex items-center justify-center p-1.5 rounded-full border border-purple-200/80 bg-purple-50/20 hover:bg-purple-100/70 hover:border-purple-300 transition-all duration-200 shadow-xs cursor-pointer group"
            title={messages.content.badgeLabel}
          >
            <img
              src={iconUrl}
              alt="Logo"
              className="w-6 h-6 rounded-md select-none pointer-events-none"
              draggable={false}
            />

            {/* Premium Tooltip on hover */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 rounded bg-zinc-900/90 px-2 py-1 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-md">
              {messages.content.badgeLabel}
            </div>
          </div>
        </RightFloatingBallContainer>
      )}
    </ThemeProvider>
  );
}
