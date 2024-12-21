import { InstalledApp } from "@config/apps";
import { invoke } from "@tauri-apps/api";
import { getAppIcons } from "@utils/get-app-icon";
import { getInstalledAppNames } from "@utils/get-installed-app-names";
import { openApp } from "@utils/open-app";
import { Store } from "tauri-plugin-store-api";
import { StoreApi } from "zustand";

import { AppDataStore } from "./appDataStore";
import { OpenURLActionParams } from "./types";

export const getInstalledApps = async (
  set: StoreApi<AppDataStore>["setState"],
  get: StoreApi<AppDataStore>["getState"],
) => {
  const currentInstalledApps = get().installedApps;

  const currentInstalledAppNames = currentInstalledApps.map(
    (item) => item.name,
  );

  const installedAppNames = await getInstalledAppNames();

  const installedNotStored = installedAppNames.filter(
    (appName) => !currentInstalledAppNames.includes(appName),
  );
  const storedNotInstalled = currentInstalledAppNames.filter(
    (appName) => !installedAppNames.includes(appName),
  );

  const newInstalledApps = [...currentInstalledApps];
  if (installedNotStored.length) {
    //TODO: enhancement - add new apps at top of list
    // Add newly found apps here
    for (const appName of installedNotStored) {
      newInstalledApps.push({ hotCode: null, name: appName });
    }
  }

  if (storedNotInstalled.length) {
    // Remove newly uninstalled apps here
    for (const appName of storedNotInstalled) {
      newInstalledApps.filter((app) => app.name !== appName);
    }
  }

  const appIcons = await getAppIcons(
    newInstalledApps.map((app) => app.name),
    256,
  );

  const newApps: InstalledApp[] = newInstalledApps.map((app, index) => ({
    ...app,
    icon: appIcons[index],
  }));
  set({ installedApps: newApps });
};

export const updateHotCode = (
  set: StoreApi<AppDataStore>["setState"],
  get: StoreApi<AppDataStore>["getState"],
  name: string,
  hotCode: null | string,
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
  set: StoreApi<AppDataStore>["setState"],
  URL: string,
) => {
  const store = new Store(".settings.dat");

  await store.set("URL", URL);
  await store.save();
  set({ URL });
};

export const openURL = async (
  set: StoreApi<AppDataStore>["setState"],
  get: StoreApi<AppDataStore>["getState"],
  {
    altPressed,
    app,
    onError,
    onSuccess,
    shiftPressed,
    URL,
  }: OpenURLActionParams,
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
    invoke("open_picker_window");
    return;
  }

  if (URL) {
    openApp(app.name, URL, altPressed, shiftPressed);
    onSuccess?.();
  } else {
    console.warn("no URL found");
    onError?.("No URL found");
  }
};
