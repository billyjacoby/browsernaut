import { useAppDataStore } from '@stores/appDataStore';
import React from 'react';

export const useIsDarkMode = () => {
  const isDarkMode = useAppDataStore((state) => state.isDarkMode);
  React.useEffect(() => {
    // TODO: add effect to watch for system appearance toggle
    if (
      isDarkMode ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  return null;
};
