import { BG_GRADIENT_ACTIVE } from '@config/CONSTANTS';
import { InstalledApp } from '@config/apps';
import clsx from 'clsx';

interface AppButtonProps {
  app: InstalledApp;
  buttonRefs: React.MutableRefObject<HTMLButtonElement[]>;
  index: number;
  iconString: string;
  onBrowserButtonClick: (
    app: InstalledApp,
    shiftPressed?: boolean,
    altPressed?: boolean
  ) => void;
}

export const AppButton = (props: AppButtonProps) => {
  const { app, buttonRefs, index, onBrowserButtonClick, iconString } = props;
  return (
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
        BG_GRADIENT_ACTIVE,
        'mx-auto',
        'my-1 p-0.5',
        'rounded-xl',
        'w-[90%]'
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
          if (index !== 0) {
            buttonRefs.current?.[index - 1].focus();
          }
        } else if (event.code === 'Enter') {
          event.preventDefault();
          buttonRefs.current[index].click();
        }
      }}
      type="button"
    >
      <div
        className={clsx(
          'bg-background/50',
          'font-medium',
          'flex w-full items-center justify-between text-left px-4',
          'focus:bg-black/0 hover:bg-black/0',
          'hover:text-background',
          'rounded-xl'
        )}
      >
        <span>{app.name}</span>
        {app.hotCode && (
          <span className="text-sm ml-auto mr-1">
            {app.hotCode.toUpperCase()}
          </span>
        )}
        <img src={iconString} className="h-10 w-10" />
      </div>
    </button>
  );
};
