import { MutableRefObject, PropsWithoutRef } from 'react';
import { InstalledApp } from '../../../config/apps';
import clsx from 'clsx';

interface AppButtonProps {
  app: InstalledApp;
  buttonRefs: React.MutableRefObject<HTMLButtonElement[]>;
  index: number;
  onBrowserButtonClick: (
    app: InstalledApp,
    shiftPressed?: boolean,
    altPressed?: boolean
  ) => void;
}

export const AppButton = (props: AppButtonProps) => {
  const { app, buttonRefs, index, onBrowserButtonClick } = props;
  return (
    <div key={app.name}>
      <button
        onMouseEnter={() => buttonRefs.current[index].focus()}
        autoFocus={index === 0}
        ref={(element) => {
          if (!buttonRefs.current) {
            buttonRefs.current = [];
          }
          if (element) {
            buttonRefs.current[index] = element;
          }
        }}
        disabled={!URL}
        aria-label={`${app.name} App`}
        className={clsx(
          'flex h-12 w-full shrink-0 items-center justify-between space-x-4 px-4 py-2 text-left',
          'focus:bg-blue-500 focus:text-white focus:outline-none focus:dark:bg-blue-700',
          'hover:bg-black/10 hover:dark:bg-blue-50/10',
          'rounded-xl'
        )}
        onClick={(event) => {
          onBrowserButtonClick(app, event.altKey, event.shiftKey);
        }}
        onKeyDown={(event) => {
          if (event.code === 'ArrowDown') {
            event.preventDefault();
            event.stopPropagation();
            buttonRefs.current?.[index + 1].focus();
          } else if (event.code === 'ArrowUp') {
            event.preventDefault();
            event.stopPropagation();
            buttonRefs.current?.[index - 1].focus();
          } else if (event.code === 'Enter') {
            event.preventDefault();
            buttonRefs.current[index].click();
          }
        }}
        type="button"
      >
        <span>{app.name}</span>
      </button>
    </div>
  );
};
