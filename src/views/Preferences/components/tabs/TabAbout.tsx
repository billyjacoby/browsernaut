import React from "react";

import Button from "@components/Button";
import { Browsernaut } from "@components/Logo";
import { HOMEPAGE_URL, ISSUES_URL } from "@config/CONSTANTS";
import { useAppDataStore } from "@stores/appDataStore";
import { getVersion } from "@tauri-apps/api/app";
import { confirm } from "@tauri-apps/api/dialog";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";

const BUTTON_UPDATE_STRING = "Check for update";

export const TabAbout = () => {
  const openURL = useAppDataStore((state) => state.openURL);

  const [version, setVersion] = React.useState<null | string>(null);

  const [isCheckingForUpdate, setIsCheckingForUpdate] = React.useState(false);
  const [updateButtonContent, setUpdateButtonContent] =
    React.useState(BUTTON_UPDATE_STRING);

  React.useEffect(() => {
    (async () => {
      const _version = await getVersion();
      setVersion(_version);
    })();
  }, []);

  const checkForUpdate = async () => {
    setIsCheckingForUpdate(true);
    setUpdateButtonContent("Checking for update.");

    const resetTimeout = setTimeout(() => {
      setIsCheckingForUpdate(false);
      setUpdateButtonContent(BUTTON_UPDATE_STRING);
    }, 6000);

    try {
      const updateResult = await checkUpdate();
      if (updateResult.shouldUpdate) {
        const result = await confirm(
          "There is an update available. Would you like to update now?",
        );
        //? This isn't working as expected, the promise seems to never resolve if the user clicks no.
        clearTimeout(resetTimeout);
        setUpdateButtonContent("Update available!");
        if (result) {
          await installUpdate();
          return;
        } else {
          return;
        }
      } else {
        return;
      }
    } finally {
      setIsCheckingForUpdate(false);
      setUpdateButtonContent("Up to date!");
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col gap-1 text-center">
      <Browsernaut />
      <p className="mb-8 text-xl">Browser picker built for macOS</p>
      <p className="mb-2 opacity-70">Version {version || "loading."}</p>
      <Button
        className="mb-8 self-center"
        disabled={isCheckingForUpdate}
        onClick={checkForUpdate}
      >
        {updateButtonContent}
      </Button>
      <div className="mb-8 mt-auto gap-4">
        <p>Copyright © Billy Jacoby</p>
        <Button onClick={() => openURL({ URL: HOMEPAGE_URL })} variant={"link"}>
          Homepage
        </Button>
        <Button onClick={() => openURL({ URL: ISSUES_URL })} variant={"link"}>
          Report an Issue
        </Button>
      </div>
    </div>
  );
};
