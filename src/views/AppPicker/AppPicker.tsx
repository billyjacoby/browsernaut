import { Spinner } from '@components/Spinner';
import { DraggableTitleBar } from '@components/DraggableTitleBar';
import { getCurrent } from '@tauri-apps/api/window';
import React from 'react';
import styled from 'styled-components';
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
import { useCloseOnUnfocus } from '../../utils/hooks/useCloseOnUnfocus';
import { getAppIcons } from '../../utils/get-app-icon';

// https://getfrontrunner.com

export const AppPicker = () => {
  const pickerWindow = getCurrent();

  useCloseOnUnfocus(getCurrent());
  const apps = useAppDataStore((state) => state.installedApps);
  const URL = useAppDataStore((state) => state.URL);

  const isEscPressed = useIsKeyPressed(ListenedKeyboardCodes.escape);

  //TODO: save these in local storage so we don't have top get them all the time
  const [appIcons, setAppIcons] = React.useState<string[] | null>(null);

  React.useEffect(() => {
    if (apps.length) {
      (async () => {
        const _appIcons = await getAppIcons(
          apps.map((app) => app.name),
          128
        );
        setAppIcons(_appIcons);
      })();
    }
  }, [apps]);

  React.useEffect(() => {
    if (isEscPressed) {
      getCurrent().close();
    }
  }, [isEscPressed]);

  React.useEffect(() => {
    //* Supposed workaround to the flashing white screen on load
    getCurrent().show();
    getCurrent().setFocus();
  }, []);

  const buttonRefs = React.useRef<HTMLButtonElement[]>([]);

  const onBrowserButtonClick = (
    app: InstalledApp,
    shiftPressed?: boolean,
    altPressed?: boolean
  ) => {
    if (URL) {
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
        className="relative flex h-screen w-screen select-none flex-col items-center px-1 pt-3 dark:text-white"
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
              key={app.name}
              index={index}
              buttonRefs={buttonRefs}
              app={app}
              onBrowserButtonClick={onBrowserButtonClick}
              iconString={appIcons?.[index] ?? ''}
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
