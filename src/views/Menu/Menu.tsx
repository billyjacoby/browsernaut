import React from 'react';

import { getCurrent } from '@tauri-apps/api/window';
import { WindowLabelEnum } from '../../App';
import reactLogo from '../../assets/react.svg';

export const MenuView = () => {
  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;

  React.useEffect(() => {
    document.body.classList.add('arrow');
    return () => document.body.classList.remove('arrow');
  }, []);

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

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </div>
  );
};
