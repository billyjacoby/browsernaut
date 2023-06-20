/* eslint-disable react/no-unescaped-entities */
import Button from '@components/Button';
import { useAppDataStore } from '@stores/appDataStore';
import {
  ListenedKeyboardCodes,
  useIsKeyPressed,
} from '@utils/hooks/useIsKeyPressed';
import React from 'react';

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
    <dialog ref={modalRef} className="welcome-modal bg-muted text-foreground">
      <h1 className="text-2xl font-bold mb-2">Welcome to Browsernaut!</h1>
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
      <div className="flex gap-2">
        <Button
          className="bg-foreground text-background hover:bg-background hover:text-foreground"
          onClick={handleCloseClick}
        >
          Continue
        </Button>
      </div>
    </dialog>
  );
};

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2">{children}</p>
);
