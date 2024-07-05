import { invoke } from '@tauri-apps/api';
import { message } from '@tauri-apps/api/dialog';
import { getCurrent } from '@tauri-apps/api/window';
import React from 'react';

export const useDefaultBrowserCheck = () => {
  const [isDefaultBrowser, setIsDefaultBrowser] = React.useState<
    null | boolean
  >(null);
  const [isDefaultBrowserLoading, setIsDefaultBrowserLoading] =
    React.useState(false);

  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const intervalChecksRef = React.useRef<number>(0);

  const checkForDefaultBrowser = async () => {
    const _isDefaultBrowser = await invoke<boolean>('is_default_browser');
    if (_isDefaultBrowser) {
      setIsDefaultBrowserLoading(false);
    }
    setIsDefaultBrowser(_isDefaultBrowser);
  };

  const setDefaultBrowser = async () => {
    // Check if default once first:
    checkForDefaultBrowser();
    const result = await invoke<boolean>('make_default_browser');
    if (result) {
      setIsDefaultBrowserLoading(true);
    } else {
      message(
        'Could not set default browser. Open the settings app to proceed.'
      );
    }
  };

  React.useEffect(() => {
    if (isDefaultBrowserLoading) {
      // check for default browser every 2 seconds for 15 seconds
      if (isDefaultBrowser) {
        clearInterval(intervalRef.current || 0);
        setIsDefaultBrowserLoading(false);
      } else {
        intervalRef.current = setInterval(() => {
          if (intervalChecksRef.current >= 10 || isDefaultBrowser) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
          } else {
            intervalChecksRef.current += 1;
            // checkForDefaultBrowser();
          }
        }, 2000);
      }
    } else {
      if (intervalRef.current) {
        // Setting browser takes focus away from app
        getCurrent().setFocus();
        intervalChecksRef.current = 0;
        clearInterval(intervalRef.current);
      }
    }
  }, [isDefaultBrowser, isDefaultBrowserLoading]);

  return { isDefaultBrowser, checkForDefaultBrowser, setDefaultBrowser };
};
