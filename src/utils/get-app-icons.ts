import { fs } from '@tauri-apps/api';
import { path } from '@tauri-apps/api';

import type { AppName } from '../config/apps';
//@ts-ignore
import { fileIconToBuffer } from 'file-icon';

const HUNDRED_MEGABYTES = 1024 * 1024 * 100;

//? Shouldn't need this
async function getIconDataURI(file: string, size: number): Promise<string> {
  try {
    const { stdout: buffer } = await fileIconToBuffer(
      [JSON.stringify([{ appOrPID: file, size }])],
      { encoding: null, maxBuffer: HUNDRED_MEGABYTES }
    );

    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.log(`Error reading ${file}`);
    }

    throw error;
  }
}

export async function getAppIcons(apps: Storage['apps']): Promise<void> {
  try {
    const icons: Partial<Record<AppName, string>> = {};

    for await (const app of apps) {
      try {
        const dataURI = await getIconDataURI(app.name, 64);
        icons[app.name as AppName] = dataURI;
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
