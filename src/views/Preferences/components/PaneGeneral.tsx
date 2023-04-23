import { useAppDataStore } from '@stores/appDataStore';
import Button from '../../../components/Button';
import { Pane } from './Pane';

import { confirm, message } from '@tauri-apps/api/dialog';

export const GeneralPane = (): JSX.Element => {
  const dispatch = () => null;
  const installedApps = useAppDataStore((state) => state.installedApps);
  const getInstalledApps = useAppDataStore((state) => state.getInstalledApps);
  const resetAppData = useAppDataStore((state) => state.resetAppData);

  //TODO: can't figure out how to get this yet
  const isDefaultProtocolClient = true;
  // const isDefaultProtocolClient = useSelector(
  //   (state) => state.data.isDefaultProtocolClient
  // );

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

  return (
    <Pane className="space-y-8" pane="general">
      <Row>
        <Left>Default web browser:</Left>
        <Right>
          {isDefaultProtocolClient ? (
            'Browsernaut is the default web browser'
          ) : (
            <Button onClick={() => dispatch()}>Set As Default Browser</Button>
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
