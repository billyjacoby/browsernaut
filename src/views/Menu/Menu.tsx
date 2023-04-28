import React from 'react';
import clsx from 'clsx';
import { invoke } from '@tauri-apps/api';
import { useAppDataStore } from '@stores/appDataStore';

export const MenuView = () => {
  const url = useAppDataStore((state) => state.URL);

  React.useEffect(() => {
    document.body.classList.add('arrow');
    return () => document.body.classList.remove('arrow');
  }, []);

  return (
    <div
      className="container flex-1 flex flex-col text-center"
      style={{ padding: '1rem' }}
    >
      <h1 className={clsx('mb-2 text-lg font-semibold')}>
        Welcome to Browsernaut!
      </h1>
      <button
        className={clsx('bg-zinc-600 mt-2 mb-1', 'disabled:opacity-25')}
        disabled={!url}
        onClick={() => invoke('open_picker_window')}
      >
        Reopen last URL
      </button>
      <button
        className={clsx('bg-zinc-600 my-1')}
        onClick={() => invoke('open_preferences_window')}
      >
        Open preferences
      </button>
    </div>
  );
};
