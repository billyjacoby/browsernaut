import React from "react";

import { InstalledApp } from "@config/apps";
import { BG_GRADIENT_ACTIVE } from "@config/CONSTANTS";
import clsx from "clsx";

interface AppButtonProps {
  app: InstalledApp;
  buttonRefs: React.MutableRefObject<HTMLButtonElement[]>;
  iconString: string;
  index: number;
  onBrowserButtonClick: (
    app: InstalledApp,
    shiftPressed?: boolean,
    altPressed?: boolean,
  ) => void;
}

export const AppButton = (props: AppButtonProps) => {
  const { app, buttonRefs, iconString, index, onBrowserButtonClick } = props;
  return (
    <button
      aria-label={`${app.name} App`}
      autoFocus={index === 0}
      className={clsx(
        BG_GRADIENT_ACTIVE,
        "mx-auto",
        "my-1 p-0.5",
        "rounded-xl",
        "w-[90%]",
      )}
      disabled={!URL}
      onClick={(event) => {
        onBrowserButtonClick(app, event.altKey, event.shiftKey);
      }}
      onKeyDown={(event) => {
        if (event.code === "ArrowDown") {
          event.preventDefault();
          event.stopPropagation();
          buttonRefs.current?.[index + 1].focus();
        } else if (event.code === "ArrowUp") {
          event.preventDefault();
          event.stopPropagation();
          if (index !== 0) {
            buttonRefs.current?.[index - 1].focus();
          }
        } else if (event.code === "Enter") {
          event.preventDefault();
          buttonRefs.current[index].click();
        }
      }}
      onMouseEnter={() => buttonRefs.current[index].focus()}
      ref={(element) => {
        if (!buttonRefs.current) {
          buttonRefs.current = [];
        }
        if (element) {
          buttonRefs.current[index] = element;
        }
      }}
      type="button"
    >
      <div
        className={clsx(
          "bg-background/50",
          "font-medium",
          "flex w-full items-center justify-between px-4 text-left",
          "hover:bg-black/0 focus:bg-black/0",
          "hover:text-background",
          "rounded-xl",
        )}
      >
        <span>{app.name}</span>
        {app.hotCode && (
          <span className="ml-auto mr-1 text-sm">
            {app.hotCode.toUpperCase()}
          </span>
        )}
        <img className="size-10" src={iconString} />
      </div>
    </button>
  );
};
