import { useAppDataStore } from '@stores/appDataStore';
import Button from '@components/Button';

import { confirm, message } from '@tauri-apps/api/dialog';
import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { PURPLE_RGB, GREEN_RGB, PINK } from '@config/CONSTANTS';
import { useDefaultBrowserCheck } from '@utils/hooks/useDefaultBrowserCheck';

export const TabGeneral = ({
  setIsModalOpen,
}: {
  setIsModalOpen: () => void;
}): JSX.Element => {
  const installedApps = useAppDataStore((state) => state.installedApps);
  const getInstalledApps = useAppDataStore((state) => state.getInstalledApps);
  const resetAppData = useAppDataStore((state) => state.resetAppData);
  const prefsTab = useAppDataStore((state) => state.prefsTab);

  const { isDefaultBrowser, checkForDefaultBrowser, setDefaultBrowser } =
    useDefaultBrowserCheck();

  const numberOfInstalledApps = installedApps.length;

  const onResetClick = async () => {
    const result = await confirm(
      'Are you sure you wish to reset all of your preferences'
    );
    if (result) {
      resetAppData();
      message('App data reset!');
    }
  };

  React.useEffect(() => {
    checkForDefaultBrowser();
  }, []);

  return (
    <div className="flex flex-col space-y-8 content-center">
      <Row>
        <Left>Default browser:</Left>
        <Right>
          {isDefaultBrowser === false ? (
            <Button onClick={setDefaultBrowser}>Set As Default Browser</Button>
          ) : (
            <>
              {prefsTab === 'general' && (
                // TODO: maybe make this less frequent? Or at least turn-off-able
                <ConfettiExplosion colors={[GREEN_RGB, PINK, PURPLE_RGB]} />
              )}
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
      <Button onClick={setIsModalOpen} className="self-center" variant={'link'}>
        Show welcome message
      </Button>
    </div>
  );
};

//TODO: move these to styled components
interface RowProps {
  children: React.ReactNode;
}

const Row = ({ children }: RowProps): JSX.Element => (
  <div className="grid grid-cols-12 gap-8">{children}</div>
);

interface LeftProps {
  children: React.ReactNode;
}

const Left = ({ children }: LeftProps): JSX.Element => (
  <div className="col-span-3 text-right">{children}</div>
);

interface RightProps {
  children: React.ReactNode;
}

const Right = ({ children }: RightProps): JSX.Element => (
  <div className="col-span-8">{children}</div>
);
