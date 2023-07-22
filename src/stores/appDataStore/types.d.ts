import { StateCreator } from 'zustand';
import { PersistOptions } from 'zustand/middleware';

import { AppDataStore } from './appDataStore';
import { ThemeDataSlice } from '@stores/themeDataSlice';

declare global {
  type TauriPersist = (
    config: StateCreator<WholeDataStore>,
    options: PersistOptions<WholeDataStore>
  ) => StateCreator<WholeDataStore>;

  type WholeDataStore = AppDataStore & ThemeDataSlice;

  interface OpenURLActionParams {
    app?: InstalledApp;
    URL?: string;
    shiftPressed?: boolean;
    altPressed?: boolean;
    onSuccess?: () => void;
    onError?: (message?: string) => void;
  }
}
