import {
  createJSONStorage,
  StateStorage,
  PersistStorage,
} from 'zustand/middleware';
import { Store } from 'tauri-plugin-store-api';

export const tauriPersistStorage = <T>({
  appDataKey,
  storeLocation = 'settings.dat',
}: {
  appDataKey: string;
  storeLocation: string;
}): PersistStorage<T> | undefined => {
  const appDataStore = new Store(storeLocation);

  const appDataObject = async () => {
    const store = await appDataStore.get<string>(appDataKey);
    if (!store) {
      return {};
    }
    return JSON.parse(store);
  };

  const set = async (name: string, value: string) => {
    const newStore = await appDataObject();
    newStore[name] = value;

    await appDataStore.set(appDataKey, JSON.stringify(newStore));
    await appDataStore.save();
  };

  const get = async (name: string) => {
    const store = await appDataObject();
    if (store[name]) {
      return store[name];
    }
    return;
  };

  const del = async (name: string) => {
    const store = await appDataObject();
    if (store[name]) {
      delete store[name];
    }
    return;
  };

  const storage: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
      return get(name) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
      await set(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
      await del(name);
    },
  };
  return createJSONStorage(() => storage);
};
