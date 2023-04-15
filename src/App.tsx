import React from 'react';
import { invoke } from '@tauri-apps/api';
import { WebviewWindow, getCurrent } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';
import { PreferencesView } from './views/Preferences/index';
import { AppPicker } from './views/AppPicker';
import { useAppDataStore } from './stores/appDataStore';
import { URL_EVENT_NAME } from './constants';
import { MenuView } from './views/Menu/Menu';

// https://google.com

export enum WindowLabelEnum {
  MAIN = 'menu_bar',
  PREFS = 'preferences_window',
  PICKER = 'picker_window',
}

function App() {
  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;

  const updateURL = useAppDataStore((state) => state.updateURL);
  const URL = useAppDataStore((state) => state.URL);
  console.log('app.tsx URL', URL);

  React.useEffect(() => {
    (async () => {
      const unlisten = await listen<string>(URL_EVENT_NAME, (event) => {
        console.log('Received URL to open: ', event.payload);
        // Open picker window
        if (event?.payload) {
          console.log('event?.payload', event?.payload);
          updateURL(event.payload);
        } else {
          return;
        }
        const existingWindow = WebviewWindow.getByLabel(WindowLabelEnum.PICKER);
        const currentWindow = getCurrent();
        if (
          !existingWindow &&
          currentWindow.label !== WindowLabelEnum.PICKER &&
          event?.payload
        ) {
          //? No matter what in dev mode this will cause more than one window to open sometimes
          //? https://github.com/FabianLars/tauri-plugin-deep-link#macos
          invoke('open_picker_window');
        }
      });
      return () => unlisten();
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
