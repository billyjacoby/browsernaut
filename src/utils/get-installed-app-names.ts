import { path } from '@tauri-apps/api';

import { AppName, apps } from '@config/apps';
import { Command } from '@tauri-apps/api/shell';

async function getAllInstalledAppNames(): Promise<string[]> {
  const output = await new Command('findApps').execute();
  const appNamesRaw = output.stdout.trim().split('\n');
  const appNamePromises = appNamesRaw.map(async (appPath) => {
    const baseName = await path.basename(appPath);
    const appName = baseName.substring(0, baseName.length - 4);
    return appName;
  });

  const allResults = await Promise.allSettled(appNamePromises);
  const fulfilledResults = allResults.filter(
    (res) => res.status === 'fulfilled'
  ) as PromiseFulfilledResult<string>[];
  const results = fulfilledResults.map(({ value }) => value);
  console.log(
    '🪵 | file: get-installed-app-names.ts:20 | getAllInstalledAppNames | results:',
    results
  );

  return results;
}

async function getInstalledAppNames(): Promise<AppName[]> {
  const allInstalledAppNames = await getAllInstalledAppNames();

  const installedApps = Object.keys(apps).filter((appName) =>
    allInstalledAppNames.includes(appName)
  ) as AppName[];

  return installedApps;
}

export { getInstalledAppNames };
