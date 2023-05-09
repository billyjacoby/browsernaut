import React from 'react';
import styled from 'styled-components';
import { colors } from '@config/CONSTANTS';
import { TabBar } from './components/TabBar';
import { AboutPane } from './components/PaneAbout';
import { AppsPane } from './components/PaneApps';
import { GeneralPane } from './components/PaneGeneral';
import { DraggableTitleBar } from '@components/DraggableTitleBar';
import { getCurrent } from '@tauri-apps/api/window';

export const PreferencesView = () => {
  React.useEffect(() => {
    //* Supposed workaround to the flashing white screen on load
    getCurrent().show();
    getCurrent().setFocus();
  }, []);
  return (
    <Container>
      <div className="flex h-screen w-screen flex-col text-gray-800 dark:text-gray-300">
        <DraggableTitleBar height={36} />
        <TabBar />
        <div className="flex flex-col overflow-hidden p-8 flex-shrink">
          <GeneralPane />
          <AppsPane />
          <AboutPane />
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  background: ${colors.background};
  color: ${colors.text};
`;
