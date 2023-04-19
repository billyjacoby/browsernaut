import { Spinner } from '@components/Spinner';
import { DraggableTitleBar } from '@components/DraggableTitleBar';
import { getCurrent } from '@tauri-apps/api/window';
import React from 'react';
import styled from 'styled-components';
import { getInstalledAppNames } from '../../utils/get-installed-app-names';
import { InstalledApp } from '../../config/apps';
import { colors } from '../../constants';
import { openApp } from '../../utils/open-app';
import UrlBar from './components/UrlBar';
import {
  ListenedKeyboardCodes,
  useIsKeyPressed,
} from '../../utils/hooks/useIsKeyPressed';
import { AppButton } from './components/AppButton';
import { useAppDataStore } from '@stores/appDataStore';

// https://getfrontrunner.com

export const AppPicker = () => {
  const pickerWindow = getCurrent();
  const apps = useAppDataStore((state) => state.installedApps);
  const isEscPressed = useIsKeyPressed(ListenedKeyboardCodes.escape);

  const URL = useAppDataStore((state) => state.URL);

  React.useEffect(() => {
    if (isEscPressed) {
      getCurrent().close();
    }
  }, [isEscPressed]);

  React.useEffect(() => {
    //* Supposed workaround to the flashing white screen on load
    getCurrent().show();
    getCurrent().setFocus();
    (async () => {
      const unlisten = await getCurrent().onFocusChanged(
        ({ payload: focused }) => {
          if (!focused) {
            getCurrent().close();
          }
        }
      );
      return unlisten;
    })();
  }, []);

  const buttonRefs = React.useRef<HTMLButtonElement[]>([]);

  const onBrowserButtonClick = (
    app: InstalledApp,
    shiftPressed?: boolean,
    altPressed?: boolean
  ) => {
    if (URL) {
      console.log('URL', URL);
      console.log('Opening');
      openApp(app.name, URL, altPressed, shiftPressed);
      pickerWindow.close();
    } else {
      console.warn('no URL found');
    }
  };

  return (
    <OuterContainer>
      <DraggableTitleBar backgroundColor={colors.background} height={12} />
      <Container
        className="relative flex h-screen w-screen select-none flex-col items-center px-2 pt-4 dark:text-white"
        title="Title"
      >
        {!apps[0] && (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        )}

        <div className="relative w-full grow overflow-y-auto px-2 pb-2">
          {apps.map((app, index) => (
            <AppButton
              index={index}
              buttonRefs={buttonRefs}
              app={app}
              onBrowserButtonClick={onBrowserButtonClick}
            />
          ))}
        </div>
        {URL && <UrlBar URL={URL} />}
        {/*
      <UpdateBar />
      <SupportMessage /> */}
      </Container>
    </OuterContainer>
  );
};

const OuterContainer = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  align-items: center;
  background: ${colors.background};
  color: ${colors.text};
`;
