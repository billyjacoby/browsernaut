import { Spinner } from '@components/Spinner';
import { DraggableTitleBar } from '@components/DraggableTitleBar';
import { getCurrent } from '@tauri-apps/api/window';
import React from 'react';
import styled from 'styled-components';
import { InstalledApp } from '@config/apps';
import { colors } from '@config/CONSTANTS';
import UrlBar from './components/UrlBar';
import {
  ListenedKeyboardCodes,
  useIsKeyPressed,
} from '@utils/hooks/useIsKeyPressed';
import { AppButton } from './components/AppButton';
import { useAppDataStore } from '@stores/appDataStore';
import { useCloseOnUnfocus } from '@utils/hooks/useCloseOnUnfocus';

// https://getfrontrunner.com
// https://billyjacoby.com

export const AppPicker = () => {
  const pickerWindow = getCurrent();

  useCloseOnUnfocus(getCurrent());
  const apps = useAppDataStore((state) => state.installedApps);
  const openURL = useAppDataStore((state) => state.openURL);

  const isEscPressed = useIsKeyPressed(ListenedKeyboardCodes.escape);

  const hotCodeMap = new Map<string | null, InstalledApp>();
  apps.forEach((app) =>
    hotCodeMap.set(app.hotCode ? app.hotCode.toLowerCase() : null, app)
  );

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
    openURL({
      app,
      shiftPressed,
      altPressed,
      onSuccess: pickerWindow.close,
    });
  };

  return (
    <OuterContainer
      onKeyDown={(e) => {
        const app = hotCodeMap.get(e.key.toLowerCase());
        if (app) {
          onBrowserButtonClick(app, e.shiftKey, e.altKey);
        }
      }}
    >
      <DraggableTitleBar backgroundColor={colors.background} height={12} />
      <Container>
        {!apps[0] && (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        )}

        <ButtonContainer>
          {apps.map((app, index) => (
            <AppButton
              key={app.name}
              index={index}
              buttonRefs={buttonRefs}
              app={app}
              onBrowserButtonClick={onBrowserButtonClick}
              iconString={app?.icon ?? ''}
            />
          ))}
        </ButtonContainer>
        {URL && <UrlBar />}
        {/*
      <UpdateBar />
      <SupportMessage /> */}
      </Container>
    </OuterContainer>
  );
};

const OuterContainer = styled.div`
  max-height: 100vh;
  border-radius: 10px;
  padding: 4px;
  background-color: ${colors.background};
`;

const Container = styled.div`
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${colors.background};
  color: ${colors.text};
`;

const ButtonContainer = styled.div`
  overflow-y: auto;
  padding: 0 10px;
`;
