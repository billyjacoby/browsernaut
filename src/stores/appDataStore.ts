import { create } from 'zustand';

interface AppDataStore {
  prefsTab: PrefsTab;
  URL?: string;
  updateState: (state: Partial<AppDataStore>) => void;
  updatePrefsTab: (tab: PrefsTab) => void;
  updateURL: (URL: string) => void;
}

export const useAppDataStore = create<AppDataStore>((set) => ({
  prefsTab: 'general',
  URL: undefined,
  updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
  updateURL: (URL: string) => set({ URL }),
  updateState: (update: Partial<AppDataStore>) => set(update),
}));
