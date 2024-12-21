import { InstalledApp } from "@config/apps";
import { tauriPersistStorage } from "@lib/zustand-persist-tauri";
import { useThemeDataSlice } from "@stores/themeDataSlice";
import { AppTheme } from "@stores/themeDataSlice/types";
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

import {
  getInstalledApps as _getInstalledApps,
  openURL as _openURL,
  updateHotCode as _updateHotCode,
  updateURL as _updateURL,
} from "./actions";
import { OpenURLActionParams, TauriPersist, WholeDataStore } from "./types";
import { PrefsTab } from "@/types";

const app_data_key = "appData";
const storageKey = ".settings.dat";

export interface AppDataStore {
  clearWelcomeMessage: () => void;
  getInstalledApps: () => void;
  hasSeenWelcomeMessage: boolean;
  installedApps: InstalledApp[];

  openURL: (A: OpenURLActionParams) => void;
  prefsTab: PrefsTab;
  resetAppData: () => void;
  updateHotCode: (name: string, hotCode: null | string) => void;
  updateInstalledApps: (apps: InstalledApp[]) => void;
  updatePrefsTab: (tab: PrefsTab) => void;
  updateURL: (URL: string) => void;
  URL?: string;
}

const resetAppData: Partial<WholeDataStore> = {
  appTheme: "system" as AppTheme,
  hasSeenWelcomeMessage: false,
  installedApps: [],
  prefsTab: "general",
  URL: undefined,
};

export const useAppDataStore = create<WholeDataStore>(
  (persist as TauriPersist)(
    (set, get) => ({
      clearWelcomeMessage: () => set({ hasSeenWelcomeMessage: true }),
      getInstalledApps: () => _getInstalledApps(set, get),
      hasSeenWelcomeMessage: false,
      installedApps: [],
      openURL: (args: OpenURLActionParams) => _openURL(set, get, args),
      prefsTab: "general",
      resetAppData: () => set({ ...resetAppData }),
      updateHotCode: (name: string, hotCode: null | string) =>
        _updateHotCode(set, get, name, hotCode),
      updateInstalledApps: (apps: InstalledApp[]) =>
        set({ installedApps: apps }),
      updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
      updateURL: (URL: string) => _updateURL(set, URL),
      URL: undefined,
      ...useThemeDataSlice(set, get),
    }),
    {
      name: "unique-name",
      storage: tauriPersistStorage<WholeDataStore>({
        appDataKey: app_data_key,
        storeLocation: storageKey,
      }) as PersistStorage<WholeDataStore>,
    },
  ),
);
