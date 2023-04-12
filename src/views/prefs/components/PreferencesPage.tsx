import React from 'react';
import styled from 'styled-components';
import { colors } from '../../../constants';
import Layout from './layout';

export const PreferencesPage = () => {
  React.useEffect(() => {
    document.body.classList.remove('arrow');
    return () => document.body.classList.add('arrow');
  }, []);
  return (
    <Container>
      <Layout />
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
