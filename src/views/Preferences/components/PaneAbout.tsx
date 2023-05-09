import Button from '@components/Button';
import { getVersion } from '@tauri-apps/api/app';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { Pane } from '@components/Pane';
import React from 'react';
import { confirm } from '@tauri-apps/api/dialog';

const useDispatch = () => (any: any) => console.log('dispatch: ', any);

export const AboutPane = (): JSX.Element => {
  const dispatch = useDispatch();
  const [version, setVersion] = React.useState<null | string>(null);

  const [isCheckingForUpdate, setIsCheckingForUpdate] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const _version = await getVersion();
      setVersion(_version);
    })();
  }, []);

  const checkForUpdate = async () => {
    setIsCheckingForUpdate(true);

    try {
      const _updateAvailable = await checkUpdate();
      const { manifest, shouldUpdate } = _updateAvailable;

      console.log(
        '🪵 | file: PaneAbout.tsx:23 | checkForUpdate | shouldUpdate:',
        shouldUpdate
      );
      console.log(
        '🪵 | file: PaneAbout.tsx:23 | checkForUpdate | manifest:',
        manifest
      );

      if (shouldUpdate) {
        const result = await confirm(
          'There is an update available. Would you like to update now?'
        );

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
    }
  };

  return (
    <Pane className="space-y-8" pane="about">
      <div className="text-center">
        {/* <img alt="Logo" className="inline-block w-40" src={icon} /> */}
        <h1 className="mb-2 text-4xl tracking-wider text-gray-900 dark:text-gray-50">
          Browsernaut
        </h1>
        <p className="mb-8 text-xl">Another browser prompter for macOS</p>
        <p className="mb-2 opacity-70">Version {version || 'loading.'}</p>
        <Button
          onClick={checkForUpdate}
          disabled={isCheckingForUpdate}
          className="mb-8"
        >
          Check{isCheckingForUpdate ? 'ing' : ''} for update
        </Button>

        <p className="mb-8">Copyright © Billy Jacoby</p>
        <div className="space-x-4">
          <Button onClick={() => dispatch('clickedHomepageButton()')}>
            Homepage
          </Button>
          <Button onClick={() => dispatch('clickedOpenIssueButton()')}>
            Report an Issue
          </Button>
        </div>
      </div>
    </Pane>
  );
};
