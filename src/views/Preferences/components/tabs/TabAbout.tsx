import Button from '@components/Button';
import { getVersion } from '@tauri-apps/api/app';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import React from 'react';
import { confirm } from '@tauri-apps/api/dialog';
import { useAppDataStore } from '@stores/appDataStore';
import { HOMEPAGE_URL, ISSUES_URL } from '@config/CONSTANTS';
import { Browsernaut } from '@components/Logo';

const BUTTON_UPDATE_STRING = 'Check for update';

export const TabAbout = (): JSX.Element => {
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

      const updateResult = await checkUpdate();
      clearInterval(interval);

      if (updateResult.shouldUpdate) {
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
    <div className="flex flex-col flex-1 text-center gap-1 h-full">
      <Browsernaut />
      <p className="mb-8 text-xl">Browser picker built for macOS</p>
      <p className="mb-2 opacity-70">Version {version || 'loading.'}</p>
      <Button
        onClick={checkForUpdate}
        disabled={isCheckingForUpdate}
        className="mb-8 self-center"
      >
        {updateButtonContent}
      </Button>

      <div className="gap-4 mt-auto mb-8">
        <p>Copyright © Billy Jacoby</p>
        <Button variant={'link'} onClick={() => openURL({ URL: HOMEPAGE_URL })}>
          Homepage
        </Button>
        <Button variant={'link'} onClick={() => openURL({ URL: ISSUES_URL })}>
          Report an Issue
        </Button>
      </div>
    </div>
  );
};
