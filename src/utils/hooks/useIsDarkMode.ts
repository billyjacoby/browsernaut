import { useAppDataStore } from '@stores/appDataStore';
import React from 'react';

import { appWindow } from '@tauri-apps/api/window';

export const useIsDarkMode = () => {
  const isDarkMode = useAppDataStore((state) => state.isDarkMode);

  //? This value isn't actually used, instead it's change is tracked in the useEffect that updates the dark class
  const [systemTheme, setSystemTheme] = React.useState<'dark' | 'light'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  React.useEffect(() => {
    (async () => {
      // TODO: the docs say this should be awaited, but when it is it stops working
      //? https://tauri.app/v1/api/js/window/#onthemechanged
      appWindow.onThemeChanged(({ payload: theme }) => {
        setSystemTheme(theme);
      });
    })();
  }, []);

  React.useEffect(() => {
    //TODO: There's a race condition here if this function is called too quickly, maybe related to the above issue.
    // adding a setTimeout here didn't change anything either
    if (
      isDarkMode ||
      (typeof isDarkMode === 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, systemTheme]);

  return null;
};
