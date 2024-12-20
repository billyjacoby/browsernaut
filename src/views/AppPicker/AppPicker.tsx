import { DraggableTitleBar } from "@components/DraggableTitleBar";
import { Spinner } from "@components/Spinner";
import { InstalledApp } from "@config/apps";
import { useAppDataStore } from "@stores/appDataStore";
import { getCurrent } from "@tauri-apps/api/window";
import { useCloseOnUnfocus } from "@utils/hooks/useCloseOnUnfocus";
import {
  ListenedKeyboardCodes,
  useIsKeyPressed,
} from "@utils/hooks/useIsKeyPressed";
import React from "react";
import { AppButton } from "./components/AppButton";
import UrlBar from "./components/UrlBar";

// https://billyjacoby.com

export const AppPicker = () => {
  const pickerWindow = getCurrent();

  useCloseOnUnfocus(getCurrent());
  const apps = useAppDataStore((state) => state.installedApps);
  const openURL = useAppDataStore((state) => state.openURL);

  const isEscPressed = useIsKeyPressed(ListenedKeyboardCodes.escape);

  const hotCodeMap = new Map<string | null, InstalledApp>();
  apps.forEach((app) =>
    hotCodeMap.set(app.hotCode ? app.hotCode.toLowerCase() : null, app)
  );

  React.useEffect(() => {
    if (isEscPressed) {
      getCurrent().close();
    }
  }, [isEscPressed]);

  React.useEffect(() => {
    //* Supposed workaround to the flashing white screen on load
    getCurrent().show();
    getCurrent().setFocus();
  }, []);

  const buttonRefs = React.useRef<HTMLButtonElement[]>([]);

  const onBrowserButtonClick = (
    app: InstalledApp,
    shiftPressed?: boolean,
    altPressed?: boolean
  ) => {
    console.log(app);
    openURL({
      app,
      shiftPressed,
      altPressed,
      onSuccess: pickerWindow.close,
    });
  };

  return (
    <div
      onKeyDown={(e) => {
        const app = hotCodeMap.get(e.key.toLowerCase());
        if (app) {
          onBrowserButtonClick(app, e.shiftKey, e.altKey);
        }
      }}
    >
      <DraggableTitleBar height={24} />
      <div
        className="flex flex-col flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(100vh - 25px)" }}
      >
        {!apps[0] && (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        )}

        <div className="flex flex-col overflow-y-auto">
          {apps.map((app, index) => (
            <AppButton
              key={app.name}
              index={index}
              buttonRefs={buttonRefs}
              app={app}
              onBrowserButtonClick={onBrowserButtonClick}
              iconString={app?.icon ?? ""}
            />
          ))}
        </div>
        {URL && <UrlBar />}
        {/*
      <UpdateBar />
      <SupportMessage /> */}
      </div>
    </div>
  );
};
