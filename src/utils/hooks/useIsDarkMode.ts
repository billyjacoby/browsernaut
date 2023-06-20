import { useAppDataStore } from '@stores/appDataStore';
import React from 'react';

import { appWindow } from '@tauri-apps/api/window';

const _systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

export const useIsDarkMode = () => {
  const appTheme = useAppDataStore((state) => state.appTheme);

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
    if (
      appTheme === 'dark' ||
      (appTheme === 'system' && systemTheme === 'dark')
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appTheme, systemTheme]);

  return null;
};
