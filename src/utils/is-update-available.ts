import axios from 'axios';

import { getUpdateUrl } from './get-update-url';

//? This too should just be handled by Tauri

export async function isUpdateAvailable(): Promise<boolean> {
  let isNewVersionAvailable = false;

  try {
    const { data } = await axios(getUpdateUrl());
    isNewVersionAvailable = Boolean(data);
  } catch {
    isNewVersionAvailable = false;
  }

  return isNewVersionAvailable;
}
