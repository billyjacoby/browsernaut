import React from 'react';
import reactLogo from './assets/react.svg';
import { Command } from '@tauri-apps/api/shell';
import './App.css';

import { getAllInstalledAppNames } from './main/utils/get-installed-app-names';

function App() {
  const [appNames, setAppNames] = React.useState<string[]>([]);
  const getAppNames = async () => {
    console.log('running chell command');
    const output = await new Command('findApps').execute();
    const newAppNames = output.stdout.trim().split('\n');
    console.log(newAppNames);
    setAppNames(newAppNames);
    // getAllInstalledAppNames();
  };

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

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

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </div>
  );
}

export default App;
