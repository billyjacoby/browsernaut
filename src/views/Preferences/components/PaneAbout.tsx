import Button from '@components/Button';
import { getVersion } from '@tauri-apps/api/app';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { Pane } from '@components/Pane';
import React from 'react';
import { confirm } from '@tauri-apps/api/dialog';
import { useAppDataStore } from '@stores/appDataStore';
import { HOMEPAGE_URL, ISSUES_URL } from '@config/CONSTANTS';

const BUTTON_UPDATE_STRING = 'Check for update';

export const AboutPane = (): JSX.Element => {
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
    setUpdateButtonContent('Checking for update.');

    try {
      const interval = setInterval(() => {
        setUpdateButtonContent((prev) => {
          if (prev.endsWith('...')) {
            return prev.replace('...', '.');
          }
          return prev + '.';
        });
      }, 500);
      const timeout = setTimeout(() => {
        return;
      }, 10000);
      const shouldUpdate = await new Promise<boolean>((res) => {
        const timeout = setTimeout(() => {
          res(false);
        }, 5000);
        checkUpdate().then((result) => {
          clearTimeout(timeout);
          clearInterval(interval);
          res(result.shouldUpdate);
        });
      });

      clearTimeout(timeout);
      clearInterval(interval);

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
      setUpdateButtonContent('Up to date!');
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
          {updateButtonContent}
        </Button>

        <p className="mb-8">Copyright © Billy Jacoby</p>
        <div className="space-x-4">
          <Button onClick={() => openURL({ URL: HOMEPAGE_URL })}>
            Homepage
          </Button>
          <Button onClick={() => openURL({ URL: ISSUES_URL })}>
            Report an Issue
          </Button>
        </div>
      </div>
    </Pane>
  );
};
