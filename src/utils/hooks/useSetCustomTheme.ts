import { useAppDataStore } from "@stores/appDataStore";

export const useSetCustomTheme = () => {
  const activeCustomTheme = useAppDataStore((state) => state.activeCustomTheme);
  const updateCustomTheme = useAppDataStore((state) => state.updateCustomTheme);

  const setCustomTheme = () => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("custom");
    updateCustomTheme(activeCustomTheme);
  };

  return { setCustomTheme };
};
