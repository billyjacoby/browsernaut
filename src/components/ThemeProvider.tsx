import { useAppDataStore } from '@stores/appDataStore';
import React from 'react';

type ThemeProviderProps = { children: React.ReactNode };

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const getCurrentTheme = useAppDataStore((state) => state.getCurrentTheme);

  React.useLayoutEffect(() => {
    getCurrentTheme();
  }, []);

  return <>{children}</>;
};
