/* eslint-disable react/no-unescaped-entities */
import Button from '@components/Button';
import { colors } from '@config/CONSTANTS';
import { useAppDataStore } from '@stores/appDataStore';
import {
  ListenedKeyboardCodes,
  useIsKeyPressed,
} from '@utils/hooks/useIsKeyPressed';
import React from 'react';
import styled from 'styled-components';

export const WelcomeModal = ({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) => {
  const modalRef = React.useRef<HTMLDialogElement>(null);
  const isEscPressed = useIsKeyPressed(ListenedKeyboardCodes.escape);

  const clearWelcomeMessage = useAppDataStore(
    (state) => state.clearWelcomeMessage
  );

  const handleCloseClick = () => {
    clearWelcomeMessage();
    close();
  };

  React.useEffect(() => {
    const modalNode = modalRef.current;
    if (!modalNode) return;

    if (isEscPressed) {
      close();
      return;
    }

    if (isOpen) {
      setTimeout(() => {
        modalNode.showModal();
      }, 10);
    } else {
      modalNode.close();
    }
  }, [isOpen, isEscPressed, close]);

  return (
    <Modal ref={modalRef}>
      <Heading>Welcome to Browsernaut!</Heading>
      <Paragraph>
        Browsernaut is an application picker for macOS that helps you to open
        links in the application of your choice.
      </Paragraph>
      <Paragraph>
        Have you ever clicked on a Notion link in Slack but your web browser
        opened before opening the desktop app? How about clicking a Discord link
        in your email client?
      </Paragraph>
      <Paragraph>
        Browsernaut fixes this! Clicking on a link opens the app picker. From
        there you choose what app to open by clicking the application or by
        pressing a hot key. Shift and Alt key modifiers work as well to do
        things like open an incognito window.
      </Paragraph>
      <Paragraph>
        The app picker is customizable, so be sure to order your apps the way
        you want in the "Apps" tab of this preferences view.
      </Paragraph>
      <Paragraph>
        Most importantly Browsernaut is intended to be set as your default web
        browser. This allows for opening links in a variety of applications.
      </Paragraph>
      <Row>
        <Button onClick={handleCloseClick}>Continue</Button>
      </Row>
    </Modal>
  );
};

const Modal = styled.dialog`
  padding: 24px 36px;
  transition: all 0.3s ease-in-out;
  opacity: 0;
  width: 90%;
  height: 80%;
  border-radius: 8px;
  background-color: ${colors.background};
  color: ${colors.text};
  border: 1px solid ${colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;

  ::backdrop {
    background: rgba(0, 0, 0, 0.6);
  }

  &[open] {
    opacity: 1;
  }
`;

const Heading = styled.h1`
  color: ${colors.text};
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Paragraph = styled.p`
  margin-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
`;
