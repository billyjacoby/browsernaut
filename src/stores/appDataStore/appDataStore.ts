import { StateCreator, create } from 'zustand';
import { PersistOptions, PersistStorage, persist } from 'zustand/middleware';

import { tauriPersistStorage } from '@lib/zustand-persist-tauri';
import { InstalledApp } from '@config/apps';
import { getInstalledAppNames } from '@utils/get-installed-app-names';

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
  getInstalledApps: () => void;
  updateURL: (URL: string) => void;
  resetAppData: () => void;
}

const resetAppData: Partial<AppDataStore> = {
  prefsTab: 'general',
  URL: undefined,
  installedApps: [],
};

export const useAppDataStore = create<AppDataStore>(
  (persist as TauriPersist)(
    (set) => ({
      prefsTab: 'general',
      URL: undefined,
      installedApps: [],
      updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
      getInstalledApps: async () => {
        const installedAppNames = await getInstalledAppNames();
        const newApps: InstalledApp[] = installedAppNames.map((name) => ({
          name,
          hotCode: null,
        }));
        //TODO: make it so that installed app objects can be merged
        set({ installedApps: newApps });
      },
      updateInstalledApps: (apps: InstalledApp[]) =>
        set({ installedApps: apps }),
      updateURL: (URL: string) => set({ URL }),
      updateState: (update: Partial<AppDataStore>) => set(update),
      resetAppData: () => set({ ...resetAppData }),
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
