import React from "react";

import { useAppDataStore } from "@stores/appDataStore";
import { invoke } from "@tauri-apps/api";
import { getCurrent } from "@tauri-apps/api/window";
import { useIsDarkMode } from "@utils/hooks/useIsDarkMode";
import { AppPicker, PreferencesView } from "@views/index";
import { Store } from "tauri-plugin-store-api";

// https://google.com

export enum WindowLabelEnum {
  PICKER = "picker_window",
  PREFS = "preferences_window",
}

function App() {
  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;
  const store = new Store(".settings.dat");
  useIsDarkMode();

  const updateUrl = useAppDataStore((state) => state.updateURL);
  const hasSeenWelcomeMessage = useAppDataStore(
    (state) => state.hasSeenWelcomeMessage,
  );

  const storedInstalledApps = useAppDataStore((state) => state.installedApps);
  const getInstalledApps = useAppDataStore((state) => state.getInstalledApps);

  React.useEffect(() => {
    (async () => {
      const storedURL: null | string = await store.get("URL");
      if (storedURL) {
        updateUrl(storedURL);
      }
    })();
  }, [store]);

  React.useEffect(() => {
    if (!storedInstalledApps.length) {
      getInstalledApps();
    }
  }, [getInstalledApps, storedInstalledApps]);

  React.useEffect(() => {
    if (!hasSeenWelcomeMessage) {
      // SHow the Prefs view with the welcome modal
      invoke("open_preferences_window");
    }
  }, [hasSeenWelcomeMessage]);

  if (currentWindow === WindowLabelEnum.PREFS) {
    return <PreferencesView newUser={!hasSeenWelcomeMessage} />;
  }
  if (currentWindow === WindowLabelEnum.PICKER) {
    return <AppPicker />;
  }

  console.error("Unknown window label: ", currentWindow);
  return null;
}

export default App;
