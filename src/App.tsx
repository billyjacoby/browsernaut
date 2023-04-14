import React from 'react';

import reactLogo from './assets/react.svg';
import { Command } from '@tauri-apps/api/shell';
import { WebviewWindow, getCurrent } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';
import { PreferencesPage } from './views/PreferencesView/index';
import { AppPicker } from './views/AppPickerView';
import { useAppDataStore } from './stores/appDataStore';
import { URL_EVENT_NAME } from './constants';

// https://google.com

export enum WindowLabelEnum {
  MAIN = 'menu_bar',
  PREFS = 'preferences_window',
  PICKER = 'picker_window',
}

function App() {
  const [eventData, setEventData] = React.useState<string | undefined>(
    undefined
  );

  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;
  console.log('currentWindow', currentWindow);

  const updateURL = useAppDataStore((state) => state.updateURL);

  React.useEffect(() => {
    (async () => {
      const unlisten = await listen<string>(URL_EVENT_NAME, (event) => {
        console.log('Received URL to open: ', event.payload);
        setEventData(event.payload);
        // Open picker window
        if (event?.payload) {
          console.log('event?.payload', event?.payload);
          updateURL(event.payload);
        } else {
          return;
        }
        const existingWindow = WebviewWindow.getByLabel(WindowLabelEnum.PICKER);
        console.log('existingWindow', existingWindow);
        const currentWindow = getCurrent();
        if (
          !existingWindow &&
          currentWindow.label !== WindowLabelEnum.PICKER &&
          event?.payload
        ) {
          //? No matter what in dev mode this will cause more than one window to open sometimes
          //? https://github.com/FabianLars/tauri-plugin-deep-link#macos
          const webview = new WebviewWindow(WindowLabelEnum.PICKER, {
            focus: true,
            titleBarStyle: 'overlay',
          });
          webview.show();
        }
      });
      return () => unlisten();
    })();
  }, []);

  if (currentWindow === WindowLabelEnum.PREFS) {
    // return standalone prefs page.
    return <PreferencesPage />;
  }
  if (currentWindow === WindowLabelEnum.PICKER) {
    // return standalone prefs page.
    return <AppPicker />;
  }

  return (
    <div className="container arrow">
      <h1>Welcome to Tauri!</h1>
      <h3>
        Currently in the <code>{currentWindow}</code> window
      </h3>

      <div className="row">
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {/* <button onClick={getAppNames}>Get app names</button>
      {appNames?.length
        ? appNames.map((name) => {
            return <p>{name}</p>;
          })
        : null} */}
      {eventData ? <p>Received URL Data: {eventData}</p> : null}

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </div>
  );
}

export default App;
