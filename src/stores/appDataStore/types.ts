import { InstalledApp } from "@config/apps";
import { ThemeDataSlice } from "@stores/themeDataSlice";
import { StateCreator } from "zustand";
import { PersistOptions } from "zustand/middleware";

import { AppDataStore } from "./appDataStore";

export type TauriPersist = (
  config: StateCreator<WholeDataStore>,
  options: PersistOptions<WholeDataStore>,
) => StateCreator<WholeDataStore>;

export type WholeDataStore = AppDataStore & ThemeDataSlice;

export interface OpenURLActionParams {
  altPressed?: boolean;
  app?: InstalledApp;
  onError?: (message?: string) => void;
  onSuccess?: () => void;
  shiftPressed?: boolean;
  URL?: string;
}
