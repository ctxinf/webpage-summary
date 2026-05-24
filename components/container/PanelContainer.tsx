import React from 'react';
import { PanelProvider, usePanel, PanelMode } from './PanelContext';
import { FloatingPanel } from './FloatingPanel';
import { SidebarPanel } from './SidebarPanel';

interface PanelContainerProps {
  children: React.ReactNode;
  defaultMode?: PanelMode;
  storageKey?: string | null;
}

/**
 * A unified container that can seamlessly transition between a floating draggable/resizable panel
 * and a right-anchored sidebar that squeezes the page content.
 */
function PanelRenderer({ children, storageKey }: { children: React.ReactNode, storageKey?: string | null }) {
  const { mode } = usePanel();

  if (mode === 'sidebar') {
    return (
      <SidebarPanel storageKey={storageKey}>
        {children}
      </SidebarPanel>
    );
  }

  return (
    <FloatingPanel storageKey={storageKey}>
      {children}
    </FloatingPanel>
  );
}

export function PanelContainer({ children, defaultMode = 'floating', storageKey}: PanelContainerProps) {
  return (
    <PanelProvider defaultMode={defaultMode}>
      <PanelRenderer storageKey={storageKey}>
        {children}
      </PanelRenderer>
    </PanelProvider>
  );
}
