import React from 'react';
import styled from 'styled-components';
import { colors } from '../constants';

import { PreferencesPage as BPrefsPage } from '../renderers/prefs';

export const PreferencesPage = () => {
  React.useEffect(() => {
    document.body.classList.remove('arrow');
    return () => document.body.classList.add('arrow');
  }, []);
  return (
    <Container>
      {/* <Heading className="underline">Preferences Page</Heading> */}
      <BPrefsPage />
    </Container>
  );
};

const Heading = styled.h2`
  font-weight: 500;
`;

const Container = styled.div`
  display: flex;
  flex: 1;
  height: 100vh;
  justify-content: center;
  background: ${colors.background};
  color: ${colors.text};
`;
