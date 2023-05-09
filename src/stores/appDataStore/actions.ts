import { StoreApi } from 'zustand';
import { InstalledApp } from '@config/apps';
import { getInstalledAppNames } from '@utils/get-installed-app-names';
import { AppDataStore } from './appDataStore';
import { getAppIcons } from '@utils/get-app-icon';

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
