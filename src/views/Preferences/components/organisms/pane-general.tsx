import Button from '../../../../components/Button';
// import { useSelector } from '../../../shared/state/hooks';
// import {
//   clickedRescanApps,
//   clickedSetAsDefaultBrowserButton,
//   clickedUpdateButton,
//   clickedUpdateRestartButton,
//   confirmedReset,
// } from '../../state/actions';
import { Pane } from '../molecules/pane';

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

console.log('GeneralPane');

export const GeneralPane = (): JSX.Element => {
  const dispatch = () => null;

  console.log('GeneralPane');
  const updateStatus = undefined;

  const isDefaultProtocolClient = true;
  // const isDefaultProtocolClient = useSelector(
  //   (state) => state.data.isDefaultProtocolClient
  // );

  // const updateStatus = useSelector((state) => state.data.updateStatus);

  const numberOfInstalledApps = 10;
  // const numberOfInstalledApps = useSelector(
  //   (state) => state.storage.apps.filter((app) => app.isInstalled).length
  // );

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
          <Button onClick={() => dispatch()}>Rescan</Button>
          <p className="mt-2 text-sm opacity-70">
            {numberOfInstalledApps} compatible apps found. Rescan if you have
            added or removed a compatible app whilst Browsernaut is running.
          </p>
        </Right>
      </Row>

      <Row>
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
      </Row>

      <Row>
        <Left>Factory Reset:</Left>
        <Right>
          <Button
            onClick={() => {
              // eslint-disable-next-line no-restricted-globals, no-alert
              if (confirm('Are you sure you wish to reset all preferences?')) {
                dispatch();
              }
            }}
          >
            Reset
          </Button>
          <p className="mt-2 text-sm opacity-70">
            Restores all preferences to initial defaults and restarts the app as
            if run for the first time.
          </p>
        </Right>
      </Row>
    </Pane>
  );
};
