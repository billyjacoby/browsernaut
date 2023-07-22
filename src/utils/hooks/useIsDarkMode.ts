import { useAppDataStore } from '@stores/appDataStore';
import React from 'react';

import { appWindow } from '@tauri-apps/api/window';
import { useSetCustomTheme } from './useSetCustomTheme';

const _systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

export const useIsDarkMode = () => {
  const appTheme = useAppDataStore((state) => state.appTheme);
  const { setCustomTheme } = useSetCustomTheme();

  const [systemTheme, setSystemTheme] = React.useState<'dark' | 'light'>(
    _systemTheme
  );

  React.useEffect(() => {
    (async () => {
      const unlisten = await appWindow.onThemeChanged(({ payload: theme }) => {
        setSystemTheme(theme);
      });

      return () => {
        unlisten();
      };
    })();
  }, []);

  React.useEffect(() => {
    if (appTheme === 'custom') {
      setCustomTheme();
      // Set the theme as active here and update the css based on whats in local
    } else {
      document.documentElement.classList.remove('custom');
      if (
        appTheme === 'dark' ||
        (appTheme === 'system' && systemTheme === 'dark')
      ) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [appTheme, systemTheme]);

  return null;
};
