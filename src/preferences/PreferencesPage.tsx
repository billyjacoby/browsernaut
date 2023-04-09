import React from 'react';
import styled from 'styled-components';

export const PreferencesPage = () => {
  React.useEffect(() => {
    document.body.classList.remove('arrow');
    return () => document.body.classList.add('arrow');
  }, []);
  return (
    <Container>
      <Heading>Preferences Page</Heading>
    </Container>
  );
};

const Heading = styled.h1`
  font-weight: 500;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
