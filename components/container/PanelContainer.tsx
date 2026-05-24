import React from 'react';
import { PanelProvider, usePanel, PanelMode } from './PanelContext';
import { FloatingPanel } from './FloatingPanel';
import { SidebarPanel } from './SidebarPanel';

interface PanelContainerProps {
  children: React.ReactNode;
  defaultMode?: PanelMode;
}

/**
 * route sub component by panel mode
 */
function PanelRenderer({ children }: { children: React.ReactNode }) {
  const { mode } = usePanel();

  if (mode === 'sidebar') {
    return (
      <SidebarPanel>
        {children}
      </SidebarPanel>
    );
  }

  return (
    <FloatingPanel>
      {children}
    </FloatingPanel>
  );
}

export function PanelContainer({ children, defaultMode = 'floating' }: PanelContainerProps) {
  return (
    <PanelProvider defaultMode={defaultMode}>
      <PanelRenderer>
        {children}
      </PanelRenderer>
    </PanelProvider>
  );
}
