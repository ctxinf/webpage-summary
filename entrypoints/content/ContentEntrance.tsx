import React from 'react';
import RightFloatingBallContainer from '@/components/container/RightFloatingBallContainer';
import useWxtStorage from '@/hooks/useWxtStorage';
import { getUiMessages } from '@/lib/i18n';
import iconUrl from '@/assets/16.png';

export function ContentEntrance() {
  const [enableFloatingBall, setEnableFloatingBall] = useWxtStorage<boolean>(
    'local:enable-floating-ball',
    true
  );

  if (!enableFloatingBall) {
    return null;
  }

  const messages = getUiMessages();

  const handleOpenPanel = () => {
    console.log('[ContentEntrance] Floating ball clicked. Panel opening is not yet implemented.');
  };

  return (
    <RightFloatingBallContainer
      storageKey="page"
      onClose={() => setEnableFloatingBall(false)}
    >
      <div
        onClick={handleOpenPanel}
        className="relative flex items-center justify-center p-1.5 rounded-full border border-purple-200/80 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-300 transition-all duration-200 shadow-xs cursor-pointer"
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
  );
}
