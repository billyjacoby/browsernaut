import React from 'react';

import reactLogo from '../../assets/react.svg';

export const MenuView = () => {
  React.useEffect(() => {
    document.body.classList.add('arrow');
    return () => document.body.classList.remove('arrow');
  }, []);

  return (
    <div className="container arrow">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://tauri.app" target="_blank" rel="noopener noreferrer">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
    </div>
  );
};
