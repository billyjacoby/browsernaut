import { create } from 'zustand';

interface AppDataStore {
  prefsTab: PrefsTab;
  updateState: (state: Partial<AppDataStore>) => void;
  updatePrefsTab: (tab: PrefsTab) => void;
}

export const useAppDataStore = create<AppDataStore>((set) => ({
  prefsTab: 'general',
  updatePrefsTab: (tab: PrefsTab) => set(() => ({ prefsTab: tab })),
  updateState: (update: Partial<AppDataStore>) => set(update),
}));
