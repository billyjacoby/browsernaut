import { fs } from '@tauri-apps/api';

import type { AppName, InstalledApp } from '../config/apps';
//@ts-ignore
// import { fileIconToBuffer } from 'file-icon';

const HUNDRED_MEGABYTES = 1024 * 1024 * 100;

//? Shouldn't need this
// async function getIconDataURI(file: string, size: number): Promise<string> {
//   try {
//     const { stdout: buffer } = await fileIconToBuffer(
//       [JSON.stringify([{ appOrPID: file, size }])],
//       { encoding: null, maxBuffer: HUNDRED_MEGABYTES }
//     );

//     return `data:image/png;base64,${buffer.toString('base64')}`;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       // eslint-disable-next-line no-console
//       console.log(`Error reading ${file}`);
//     }

//     throw error;
//   }
// }

export async function getAppIcons(apps: InstalledApp[]): Promise<void> {
  try {
    const icons: Partial<Record<AppName, string>> = {};

    for await (const app of apps) {
      try {
        const iconLocation = `/Applications/${app.name}.app/Contents/Resources`;
        const files = await fs.readDir(iconLocation);
        console.log(
          '🪵 | file: get-app-icons.ts:37 | forawait | files:',
          files
        );
      } catch (error: unknown) {
        console.warn(error);
      }
    }
  } catch (error: unknown) {
    console.error(error);
    // eslint-disable-next-line no-console
    console.error('[getAppIcon error]', error);
  }
}
