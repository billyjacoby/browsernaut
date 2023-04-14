import { execSync } from 'node:child_process';
import path from 'node:path';

import type { AppName } from '../config/apps';
import { apps } from '../config/apps';
import { Command } from '@tauri-apps/api/shell';

async function getAllInstalledAppNames(): Promise<string[]> {
  const output = await new Command('findApps').execute();
  const appNames = output.stdout
    .trim()
    .split('\n')
    .map((appPath) => path.parse(appPath).name);

  return appNames;
}

async function getInstalledAppNames(): Promise<void> {
  // dispatch(startedScanning());

  const allInstalledAppNames = await getAllInstalledAppNames();

  const installedApps = Object.keys(apps).filter((appName) =>
    allInstalledAppNames.includes(appName)
  ) as AppName[];

  // It appears that sometimes the installed app IDs are not fetched, maybe a
  // race with Spotlight index? So if none found, keep retrying.
  // TODO is this needed any more, now using we're `find` method?
  // https://github.com/will-stone/browserosaurus/issues/425
  if (installedApps.length === 0) {
    setTimeout(() => {
      // getInstalledAppNames();
    }, 500);
  } else {
    // dispatch(retrievedInstalledApps(installedApps));
  }
}

export { getInstalledAppNames };
