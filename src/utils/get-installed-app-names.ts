import { AppName, apps } from "@config/apps";
import { path } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/tauri";

async function getAllInstalledAppNames(): Promise<string[]> {
  const newApps = (await invoke("get_apps")) as Array<string>;
  const appNamePromises = newApps.map(async (appPath) => {
    const baseName = await path.basename(appPath);
    const appName = baseName.substring(0, baseName.length - 4);
    return appName;
  });

  const allResults = await Promise.allSettled(appNamePromises);
  const fulfilledResults = allResults.filter(
    (res) => res.status === "fulfilled",
  ) as PromiseFulfilledResult<string>[];
  const results = fulfilledResults.map(({ value }) => value);

  return results;
}

async function getInstalledAppNames(): Promise<AppName[]> {
  const allInstalledAppNames = await getAllInstalledAppNames();

  const installedApps = Object.keys(apps).filter((appName) =>
    allInstalledAppNames.includes(appName),
  ) as AppName[];

  return installedApps;
}

export { getInstalledAppNames };
