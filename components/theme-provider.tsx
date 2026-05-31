import React, { createContext, useContext, useEffect } from 'react';
import useWxtStorage from '@/hooks/useWxtStorage';
import type { StorageItemKey } from '#imports';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  container?: HTMLElement | null;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'local:theme',
  container,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useWxtStorage<Theme>(storageKey as StorageItemKey, defaultTheme);

  const [resolvedTheme, setResolvedTheme] = React.useState<Theme>('light');

  useEffect(() => {
    // If container is explicitly provided as null, we might be waiting for it.
    // If container is undefined, we default to document.documentElement.
    const root = container !== undefined ? container : window.document.documentElement;
    
    console.log('[ThemeProvider] effect triggered. theme:', theme, 'container:', container, 'root:', root);

    if (!root) {
      console.log('[ThemeProvider] No root found. Bailing out.');
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      console.log('[ThemeProvider] applyTheme called. Current classes before remove:', root.className);
      root.classList.remove('light', 'dark');

      let currentTheme = theme;
      if (theme === 'system') {
        currentTheme = mediaQuery.matches ? 'dark' : 'light';
        console.log('[ThemeProvider] System theme is', currentTheme);
      } else {
        console.log('[ThemeProvider] Applying manual theme:', currentTheme);
      }

      root.classList.add(currentTheme);
      setResolvedTheme(currentTheme);
      console.log('[ThemeProvider] Classes after apply:', root.className);
    };

    applyTheme();

    const handler = () => {
      console.log('[ThemeProvider] System media query changed. New match:', mediaQuery.matches);
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme, container]);

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
      <div className={resolvedTheme} style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
