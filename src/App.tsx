import React from 'react';
import { getCurrent } from '@tauri-apps/api/window';
import { PreferencesView, MenuView, AppPicker } from '@views/index';
import { Store } from 'tauri-plugin-store-api';
import { useAppDataStore } from '@stores/appDataStore';

// https://google.com

export enum WindowLabelEnum {
  MAIN = 'menu_bar',
  PREFS = 'preferences_window',
  PICKER = 'picker_window',
}

function App() {
  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;
  const store = new Store('.settings.dat');

  const updateUrl = useAppDataStore((state) => state.updateURL);

  const storedInstalledApps = useAppDataStore((state) => state.installedApps);
  const getInstalledApps = useAppDataStore((state) => state.getInstalledApps);

  React.useEffect(() => {
    (async () => {
      const storedURL: string | null = await store.get('URL');
      if (storedURL) {
        updateUrl(storedURL);
      }
    })();
  }, [store]);

  React.useEffect(() => {
    if (!storedInstalledApps.length) {
      getInstalledApps();
    }
  }, [getInstalledApps, storedInstalledApps]);

  if (currentWindow === WindowLabelEnum.PREFS) {
    return <PreferencesView />;
  }
  if (currentWindow === WindowLabelEnum.PICKER) {
    return <AppPicker />;
  }

  return <MenuView />;
}

export default App;
