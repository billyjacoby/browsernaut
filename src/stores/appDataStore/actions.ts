import { StoreApi } from 'zustand';
import { InstalledApp } from '@config/apps';
import { getInstalledAppNames } from '@utils/get-installed-app-names';
import { AppDataStore } from './appDataStore';
import { getAppIcons } from '@utils/get-app-icon';
import { openApp } from '@utils/open-app';
import { invoke } from '@tauri-apps/api';
import { Store } from 'tauri-plugin-store-api';

export const getInstalledApps = async (
  set: StoreApi<AppDataStore>['setState']
) => {
  const installedAppNames = await getInstalledAppNames();

  const appIcons = await getAppIcons(installedAppNames, 256);

  const newApps: InstalledApp[] = installedAppNames.map((name, index) => ({
    name,
    hotCode: null,
    icon: appIcons[index],
  }));
  //TODO: make it so that installed app objects can be merged
  set({ installedApps: newApps });
};

export const updateHotCode = (
  set: StoreApi<AppDataStore>['setState'],
  get: StoreApi<AppDataStore>['getState'],
  name: string,
  hotCode: string | null
) => {
  const apps = get().installedApps;
  const appIndex = apps.findIndex((a) => a.name === name);

  if (appIndex > -1) {
    const updatedApp = apps[appIndex];
    updatedApp.hotCode = hotCode;
    apps.splice(appIndex, 1, updatedApp);

    set({ installedApps: Array.from([...apps]) });
  }
};

export const updateURL = async (
  set: StoreApi<AppDataStore>['setState'],
  URL: string
) => {
  const store = new Store('.settings.dat');

  await store.set('URL', URL);
  await store.save();
  set({ URL });
};

export interface OpenURLActionParams {
  app?: InstalledApp;
  URL?: string;
  shiftPressed?: boolean;
  altPressed?: boolean;
  onSuccess?: () => void;
  onError?: (message?: string) => void;
}

export const openURL = async (
  set: StoreApi<AppDataStore>['setState'],
  get: StoreApi<AppDataStore>['getState'],
  {
    URL,
    app,
    shiftPressed,
    altPressed,
    onSuccess,
    onError,
  }: OpenURLActionParams
) => {
  // eslint-disable-next-line prefer-const
  const localURL = get().URL;

  if (URL && URL !== localURL) {
    await updateURL(set, URL);
  }
  if (!URL) {
    URL = localURL;
  }

  if (!app) {
    //? Allows for passing in arbitrary URLs
    invoke('open_picker_window');
    return;
  }

  if (URL) {
    openApp(app.name, URL, altPressed, shiftPressed);
    onSuccess?.();
  } else {
    console.warn('no URL found');
    onError?.('No URL found');
  }
};
