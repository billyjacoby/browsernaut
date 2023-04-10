import React from 'react';

import reactLogo from './assets/react.svg';
import { Command } from '@tauri-apps/api/shell';
import { getCurrent } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';
import { PreferencesPage } from './preferences';

// import { getAllInstalledAppNames } from './main/utils/get-installed-app-names';

enum WindowLabelEnum {
  MAIN = 'menu_bar',
  PREFS = 'preferences_window',
}

const URL_EVENT_NAME = 'scheme-request-received';

function App() {
  const [appNames, setAppNames] = React.useState<string[]>([]);
  const [eventData, setEventData] = React.useState<string | undefined>(
    undefined
  );

  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;
  console.log('currentWindow', currentWindow);

  const getAppNames = async () => {
    const output = await new Command('findApps').execute();
    const newAppNames = output.stdout.trim().split('\n');
    console.log(newAppNames);
    setAppNames(newAppNames);
  };

  React.useEffect(() => {
    (async () => {
      const unlisten = await listen<string>(
        'scheme-request-received',
        (event) => {
          console.log('Received URL to open: ', event.payload);
          setEventData(event.payload);
        }
      );
      return () => unlisten();
    })();
  }, []);

  if (currentWindow === WindowLabelEnum.PREFS) {
    // return standalone prefs page.
    return <PreferencesPage />;
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
      <button onClick={getAppNames}>Get app names</button>
      {appNames?.length
        ? appNames.map((name) => {
            return <p>{name}</p>;
          })
        : null}
      {eventData ? <p>Event Data: {eventData}</p> : null}

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </div>
  );
}

export default App;
