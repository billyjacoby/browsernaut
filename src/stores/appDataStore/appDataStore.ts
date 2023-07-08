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
import {
  AppTheme,
  ThemeDataSlice,
  useThemeDataSlice,
} from '@stores/themeDataSlice';

const app_data_key = 'appData';
const storageKey = '.settings.dat';

type TauriPersist = (
  config: StateCreator<WholeDataStore>,
  options: PersistOptions<WholeDataStore>
) => StateCreator<WholeDataStore>;

export interface AppDataStore {
  prefsTab: PrefsTab;
  URL?: string;
  installedApps: InstalledApp[];
  hasSeenWelcomeMessage: boolean;

  clearWelcomeMessage: () => void;
  updatePrefsTab: (tab: PrefsTab) => void;
  updateInstalledApps: (apps: InstalledApp[]) => void;
  updateHotCode: (name: string, hotCode: string | null) => void;
  getInstalledApps: () => void;
  updateURL: (URL: string) => void;
  resetAppData: () => void;
  openURL: (A: OpenURLActionParams) => void;
}

export type WholeDataStore = AppDataStore & ThemeDataSlice;

const resetAppData: Partial<WholeDataStore> = {
  prefsTab: 'general',
  URL: undefined,
  installedApps: [],
  hasSeenWelcomeMessage: false,
  appTheme: 'system' as AppTheme,
};

export const useAppDataStore = create<WholeDataStore>(
  (persist as TauriPersist)(
    (set, get) => ({
      prefsTab: 'general',
      URL: undefined,
      installedApps: [],
      hasSeenWelcomeMessage: false,
      clearWelcomeMessage: () => set({ hasSeenWelcomeMessage: true }),
      updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
      getInstalledApps: () => _getInstalledApps(set, get),
      updateHotCode: (name, hotCode) => _updateHotCode(set, get, name, hotCode),
      updateInstalledApps: (apps: InstalledApp[]) =>
        set({ installedApps: apps }),
      updateURL: (URL: string) => _updateURL(set, URL),
      resetAppData: () => set({ ...resetAppData }),
      openURL: (args: OpenURLActionParams) => _openURL(set, get, args),
      ...useThemeDataSlice(set, get),
    }),
    {
      name: 'unique-name',
      storage: tauriPersistStorage<WholeDataStore>({
        appDataKey: app_data_key,
        storeLocation: storageKey,
      }) as PersistStorage<WholeDataStore>,
    }
  )
);
