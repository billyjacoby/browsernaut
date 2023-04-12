import React from 'react';
import styled from 'styled-components';
import { colors } from '../../constants';
import { HeaderBar } from './components/organisms/header-bar';
import { AboutPane } from './components/organisms/pane-about';
import { AppsPane } from './components/organisms/pane-apps';
import { GeneralPane } from './components/organisms/pane-general';

export const PreferencesPage = () => {
  React.useEffect(() => {
    document.body.classList.remove('arrow');
    return () => document.body.classList.add('arrow');
  }, []);
  return (
    <Container>
      <div className="flex h-screen w-screen flex-col text-gray-800 dark:text-gray-300">
        <HeaderBar className="shrink-0" />
        <div className="flex grow flex-col overflow-hidden p-8">
          <GeneralPane />
          <AppsPane />
          <AboutPane />
        </div>
      </div>
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
