import { StateCreator, create } from 'zustand';
import { PersistOptions, PersistStorage, persist } from 'zustand/middleware';

import { tauriPersistStorage } from 'zustand-tauri-storage/src/index';
import { InstalledApp } from '../config/apps';

const app_data_key = 'appData';
const storageKey = '.settings.dat';

type TauriPersist = (
  config: StateCreator<AppDataStore>,
  options: PersistOptions<AppDataStore>
) => StateCreator<AppDataStore>;

interface AppDataStore {
  prefsTab: PrefsTab;
  URL?: string;
  installedApps: InstalledApp[];
  updateState: (state: Partial<AppDataStore>) => void;
  updatePrefsTab: (tab: PrefsTab) => void;
  updateInstalledApps: (apps: InstalledApp[]) => void;
  updateURL: (URL: string) => void;
}

export const useAppDataStore = create<AppDataStore>(
  (persist as TauriPersist)(
    (set) => ({
      prefsTab: 'general',
      URL: undefined,
      installedApps: [],
      updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
      updateInstalledApps: (apps: InstalledApp[]) =>
        set({ installedApps: apps }),
      updateURL: (URL: string) => set({ URL }),
      updateState: (update: Partial<AppDataStore>) => set(update),
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
