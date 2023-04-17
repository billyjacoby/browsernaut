import React from 'react';
import { getCurrent } from '@tauri-apps/api/window';
import { PreferencesView } from './views/Preferences/index';
import { AppPicker } from './views/AppPicker';
import { useAppDataStore } from './stores/appDataStore';
import { MenuView } from './views/Menu/Menu';
import { Store } from 'tauri-plugin-store-api';

// https://google.com

export enum WindowLabelEnum {
  MAIN = 'menu_bar',
  PREFS = 'preferences_window',
  PICKER = 'picker_window',
}

function App() {
  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;

  const store = new Store('.settings.dat');

  React.useEffect(() => {
    (async () => {
      const storeData = await store.entries();
    })();
  }, []);

  if (currentWindow === WindowLabelEnum.PREFS) {
    // return standalone prefs page.
    return <PreferencesView />;
  }
  if (currentWindow === WindowLabelEnum.PICKER) {
    // return standalone prefs page.
    return <AppPicker />;
  }

  return <MenuView />;
}

export default App;
