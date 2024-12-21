import { Store } from "tauri-plugin-store-api";
import {
  createJSONStorage,
  PersistStorage,
  StateStorage,
} from "zustand/middleware";

export const tauriPersistStorage = <T>({
  appDataKey,
  storeLocation = "settings.dat",
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
    getItem: async (name: string): Promise<null | string> => {
      return get(name) || null;
    },
    removeItem: async (name: string): Promise<void> => {
      await del(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
      await set(name, value);
    },
  };
  return createJSONStorage(() => storage);
};
