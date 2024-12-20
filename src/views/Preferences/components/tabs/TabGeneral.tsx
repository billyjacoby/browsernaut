import Button from "@components/Button";
import { useAppDataStore } from "@stores/appDataStore";

import { GREEN_RGB, PINK, PURPLE_RGB } from "@config/CONSTANTS";
import { confirm, message } from "@tauri-apps/api/dialog";
import { useDefaultBrowserCheck } from "@utils/hooks/useDefaultBrowserCheck";
import React from "react";
import ConfettiExplosion from "react-confetti-explosion";

import { Left, Right, Row } from "@components/ui/Layout";
import { ThemeSelect } from "../ThemeSelect";

export const TabGeneral = ({
  setIsModalOpen,
}: {
  setIsModalOpen: () => void;
}) => {
  const installedApps = useAppDataStore((state) => state.installedApps);
  const getInstalledApps = useAppDataStore((state) => state.getInstalledApps);

  const resetAppData = useAppDataStore((state) => state.resetAppData);

  const { isDefaultBrowser, checkForDefaultBrowser, setDefaultBrowser } =
    useDefaultBrowserCheck();

  const numberOfInstalledApps = installedApps.length;

  const onResetClick = async () => {
    const result = await confirm(
      "Are you sure you wish to reset all of your preferences"
    );
    if (result) {
      resetAppData();
      message("App data reset!");
    }
  };

  React.useEffect(() => {
    checkForDefaultBrowser();
  }, [checkForDefaultBrowser]);

  return (
    <div className="flex flex-col gap-8 content-center h-full overflow-y-auto">
      <Row>
        <Left>Default browser:</Left>
        <Right>
          {isDefaultBrowser === false ? (
            <Button onClick={setDefaultBrowser}>Set As Default Browser</Button>
          ) : (
            <>
              {/* // TODO: maybe make this less frequent? Or at least turn-off-able */}
              <ConfettiExplosion colors={[GREEN_RGB, PINK, PURPLE_RGB]} />
              🎉 Browsernaut is the default web browser
            </>
          )}
          <p className="mt-2 text-sm opacity-70">
            Setting Browsernaut as the default browser means links clicked
            outside of web browsers will open the picker window. This is the
            primary design of Browsernaut.
          </p>
        </Right>
      </Row>

      <Row>
        <Left>Find apps:</Left>
        <Right>
          <Button onClick={getInstalledApps}>Rescan</Button>
          <p className="mt-2 text-sm opacity-70">
            {numberOfInstalledApps} compatible apps found. Rescan if you have
            added or removed a compatible app whilst Browsernaut is running.
          </p>
        </Right>
      </Row>

      {/* //TODO */}
      {/* <Row>
        <Left>Update:</Left>
        <Right>
          {updateStatus === 'available' && (
            <Button onClick={() => dispatch()}>Download Update</Button>
          )}
          {updateStatus === 'downloading' && 'Downloading…'}
          {updateStatus === 'downloaded' && (
            <Button onClick={() => dispatch()}>Restart & Update</Button>
          )}
          {updateStatus === 'no-update' && 'No update available'}
        </Right>
      </Row> */}

      <Row>
        <Left>Factory Reset:</Left>
        <Right>
          <Button onClick={onResetClick}>Reset</Button>
          <p className="mt-2 text-sm opacity-70">
            Restores all preferences to initial defaults and restarts the app as
            if run for the first time.
          </p>
        </Right>
      </Row>
      <Row>
        <ThemeSelect />
      </Row>
      <Button onClick={setIsModalOpen} className="self-center" variant={"link"}>
        Show welcome message
      </Button>
    </div>
  );
};
