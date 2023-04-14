import clsx from 'clsx';
import { useEffect } from 'react';

import { Spinner } from '../shared/components/atoms/spinner';
import { WebviewWindow, getCurrent } from '@tauri-apps/api/window';
import React from 'react';
import styled from 'styled-components';
import { useAppDataStore } from '../../stores/appDataStore';
import { getInstalledAppNames } from '../../utils/get-installed-app-names';
import { AppName, InstalledApp } from '../../config/apps';
import { colors } from '../../constants';
// import {
//   useDeepEqualSelector,
//   useInstalledApps,
//   useKeyCodeMap,
//   useSelector,
// } from '../shared/state/hooks'
// import { appsRef, appsScrollerRef } from '../refs'
// import { clickedApp, startedPicker } from './state/actions';
// import AppLogo from './components/atoms/app-logo';
// import Kbd from './components/atoms/kbd';
// import { useKeyboardEvents } from './components/hooks/use-keyboard-events';
// import SupportMessage from './components/organisms/support-message';
// import UpdateBar from './components/organisms/update-bar';
// import UrlBar from './components/organisms/url-bar';

// https://getfrontrunner.com

const useDispatch = () => (action: any) => console.log(JSON.stringify(action));

export const AppPicker = () => {
  const url = useAppDataStore((state) => state.URL);
  const pickerWindow = getCurrent();

  const dispatch = useDispatch();

  const [apps, setApps] = React.useState<InstalledApp[]>([]);

  React.useEffect(() => {
    (async () => {
      const installedAppNames = await getInstalledAppNames();
      console.log('installedAppNames', installedAppNames);
      // TODO: map these to actual app objects now
    })();
  }, []);

  /**
   * Setup keyboard listeners
   */
  // useKeyboardEvents();

  // const icons = useDeepEqualSelector((state) => state.data.icons)

  // const keyCodeMap = useKeyCodeMap()

  // const totalApps = apps.length

  // useEffect(() => {}, [totalApps])

  return (
    <Container
      className="relative flex h-screen w-screen select-none flex-col items-center px-2 pt-4 dark:text-white"
      title="Title"
    >
      {!apps[0] && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )}

      <div
        // ref={appsScrollerRef}
        className="relative w-full grow overflow-y-auto px-2 pb-2"
      >
        {apps.map((app, index) => {
          return (
            <div key={app.name}>
              <button
                // ref={(element) => {
                //   if (!appsRef.current) {
                //     appsRef.current = []
                //   }

                //   if (element) {
                //     appsRef.current[index] = element
                //   }
                // }}
                aria-label={`${app.name} App`}
                className={clsx(
                  'flex h-12 w-full shrink-0 items-center justify-between space-x-4 px-4 py-2 text-left',
                  'focus:bg-blue-500 focus:text-white focus:outline-none focus:dark:bg-blue-700',
                  'hover:bg-black/10 hover:dark:bg-blue-50/10',
                  'rounded-xl'
                )}
                onClick={(event) => {
                  dispatch(
                    `clickedApp({
                      appName: ${app.name},
                      isAlt: ${event.altKey},
                      isShift: ${event.shiftKey},
                    })`
                  );
                  console.log('pickerWindow', pickerWindow);
                  pickerWindow?.close();
                }}
                onKeyDown={(event) => {
                  if (event.code === 'ArrowDown') {
                    event.preventDefault();
                    event.stopPropagation();
                    // appsRef.current?.[index + 1].focus()
                  } else if (event.code === 'ArrowUp') {
                    event.preventDefault();
                    event.stopPropagation();
                    // appsRef.current?.[index - 1].focus()
                  }
                }}
                type="button"
              >
                <span>{app.name}</span>
                <span className="flex items-center space-x-4">
                  Icon
                  {/* {app.hotCode ? (
                    <Kbd className="shrink-0">{keyCodeMap[app.hotCode]}</Kbd>
                  ) : null}
                  <AppLogo
                    app={app}
                    className="h-6 w-6 shrink-0"
                    icon={icons[app.name]}
                  /> */}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* <UrlBar />

      <UpdateBar />

      <SupportMessage /> */}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  align-items: center;
  background: ${colors.background};
  color: ${colors.text};
`;
