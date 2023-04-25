import { useAppDataStore } from '@stores/appDataStore';
import Button from '../../../components/Button';
import { Pane } from './Pane';

import { confirm, message } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api';
import React from 'react';

export const GeneralPane = (): JSX.Element => {
  const installedApps = useAppDataStore((state) => state.installedApps);
  const getInstalledApps = useAppDataStore((state) => state.getInstalledApps);
  const resetAppData = useAppDataStore((state) => state.resetAppData);

  const [isDefaultBrowser, setIsDefaultBrowser] = React.useState<
    null | boolean
  >(null);

  const numberOfInstalledApps = installedApps.length;

  const setDefaultBrowser = async () => {
    const result = await invoke<boolean>('make_default_browser');
    if (result) {
      // Confetti or something fun here
      setIsDefaultBrowser(true);
    } else {
      message(
        'Could not set default browser. Open the settings app to proceed.'
      );
    }
  };

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
    (async () => {
      const _isDefaultBrowser = await invoke<boolean>('is_default_browser');
      setIsDefaultBrowser(_isDefaultBrowser);
    })();
  }, []);

  return (
    <Pane className="space-y-8" pane="general">
      <Row>
        <Left>Default web browser:</Left>
        <Right>
          {isDefaultBrowser === false ? (
            <Button onClick={setDefaultBrowser}>Set As Default Browser</Button>
          ) : (
            '🎉 Browsernaut is the default web browser'
          )}
          <p className="mt-2 text-sm opacity-70">
            Setting Browsernaut as your default web browser means links clicked
            outside of web browsers will open the picker window. This is the
            primary design of Browsernaut. However, you can also
            programmatically send URLs to Browsernaut.
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
    </Pane>
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
  <div className="col-span-5 text-right">{children}</div>
);

interface RightProps {
  children: React.ReactNode;
}

const Right = ({ children }: RightProps): JSX.Element => (
  <div className="col-span-7">{children}</div>
);
