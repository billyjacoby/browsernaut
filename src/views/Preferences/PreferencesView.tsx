import React from 'react';
import styled from 'styled-components';
import { colors } from '@config/CONSTANTS';
import { TabBar } from './components/TabBar';
import { AboutPane } from './components/PaneAbout';
import { AppsPane } from './components/PaneApps';
import { GeneralPane } from './components/PaneGeneral';
import { DraggableTitleBar } from '@components/DraggableTitleBar';
import { getCurrent } from '@tauri-apps/api/window';
import { WelcomeModal } from './components/WelcomeModal';

export const PreferencesView = ({ newUser }: { newUser?: boolean }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(!!newUser);

  React.useEffect(() => {
    //* Supposed workaround to the flashing white screen on load
    getCurrent().show();
    getCurrent().setFocus();
  }, []);
  return (
    <>
      <Container>
        <div className="flex h-screen w-screen flex-col text-gray-300">
          <DraggableTitleBar height={36} />
          <TabBar />
          <div className="flex flex-col overflow-hidden p-8 flex-shrink">
            <GeneralPane setIsModalOpen={() => setIsModalOpen(true)} />
            <AppsPane />
            <AboutPane />
          </div>
        </div>
      </Container>
      <WelcomeModal isOpen={isModalOpen} close={() => setIsModalOpen(false)} />
    </>
  );
};

const Container = styled.div`
  background: ${colors.background};
  color: ${colors.text};
`;
