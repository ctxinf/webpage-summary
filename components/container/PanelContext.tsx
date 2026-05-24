import { createContext, useContext, useState, type ReactNode } from 'react';

export type PanelMode = 'floating' | 'sidebar';

export interface PanelContextType {
  mode: PanelMode;
  setMode: (mode: PanelMode) => void;
}

const PanelContext = createContext<PanelContextType | null>(null);

export interface PanelProviderProps {
  children: ReactNode;
  defaultMode?: PanelMode;
}

export function PanelProvider({ children, defaultMode = 'floating' }: PanelProviderProps) {
  const [mode, setMode] = useState<PanelMode>(defaultMode);

  return (
    <PanelContext.Provider value={{ mode, setMode }}>
      {children}
    </PanelContext.Provider>
  );
}

export function usePanel() {
  const context = useContext(PanelContext);
  if (!context) {
    throw new Error('usePanel must be used within a PanelProvider');
  }
  return context;
}
