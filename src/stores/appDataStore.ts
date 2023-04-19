import { StateCreator, create } from 'zustand';
import { PersistOptions, PersistStorage, persist } from 'zustand/middleware';

import { tauriPersistStorage } from 'zustand-tauri-storage/src/index';

const app_data_key = 'appData';
const storageKey = '.settings.dat';

type TauriPersist = (
  config: StateCreator<AppDataStore>,
  options: PersistOptions<AppDataStore>
) => StateCreator<AppDataStore>;

interface AppDataStore {
  prefsTab: PrefsTab;
  URL?: string;
  updateState: (state: Partial<AppDataStore>) => void;
  updatePrefsTab: (tab: PrefsTab) => void;
  updateURL: (URL: string) => void;
}

export const useAppDataStore = create<AppDataStore>(
  (persist as TauriPersist)(
    (set) => ({
      prefsTab: 'general',
      URL: undefined,
      updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
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
