import { StateCreator, create } from 'zustand';
import { PersistOptions, PersistStorage, persist } from 'zustand/middleware';

import { tauriPersistStorage } from '@lib/zustand-persist-tauri';
import { InstalledApp } from '@config/apps';

import {
  getInstalledApps as _getInstalledApps,
  updateHotCode as _updateHotCode,
  openURL as _openURL,
  updateURL as _updateURL,
  OpenURLActionParams,
} from './actions';

const app_data_key = 'appData';
const storageKey = '.settings.dat';

type TauriPersist = (
  config: StateCreator<AppDataStore>,
  options: PersistOptions<AppDataStore>
) => StateCreator<AppDataStore>;

export interface AppDataStore {
  prefsTab: PrefsTab;
  URL?: string;
  installedApps: InstalledApp[];
  // updateState: (state: Partial<Omit<AppDataStore, 'URL'>>) => void;
  updatePrefsTab: (tab: PrefsTab) => void;
  updateInstalledApps: (apps: InstalledApp[]) => void;
  updateHotCode: (name: string, hotCode: string | null) => void;
  getInstalledApps: () => void;
  updateURL: (URL: string) => void;
  resetAppData: () => void;
  openURL: (A: OpenURLActionParams) => void;
}

const resetAppData: Partial<AppDataStore> = {
  prefsTab: 'general',
  URL: undefined,
  installedApps: [],
};

export const useAppDataStore = create<AppDataStore>(
  (persist as TauriPersist)(
    (set, get) => ({
      prefsTab: 'general',
      URL: undefined,
      installedApps: [],
      updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
      getInstalledApps: () => _getInstalledApps(set),
      updateHotCode: (name, hotCode) => _updateHotCode(set, get, name, hotCode),
      updateInstalledApps: (apps: InstalledApp[]) =>
        set({ installedApps: apps }),
      updateURL: (URL: string) => _updateURL(set, URL),
      // updateState: (update: Partial<Omit<AppDataStore, 'URL'>>) => set(update),
      resetAppData: () => set({ ...resetAppData }),
      openURL: (args: OpenURLActionParams) => _openURL(set, get, args),
    }),
    {
      name: 'unique-name',
      storage: tauriPersistStorage<AppDataStore>({
        appDataKey: app_data_key,
        storeLocation: storageKey,
      }) as PersistStorage<AppDataStore>,
    }
  )
);
