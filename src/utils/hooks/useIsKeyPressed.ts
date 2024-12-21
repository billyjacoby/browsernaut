import React from "react";

// TODO: update with vim bindings and other arrow keys
export enum ListenedKeyboardCodes {
  down = "ArrowDown",
  enter = "Enter",
  escape = "Escape",
  left = "ArrowLeft",
  right = "ArrowRight",
  space = "Space",
  up = "ArrowUp",
}

export const useIsKeyPressed = (targetKey: ListenedKeyboardCodes) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = React.useState<boolean>(false);
  // If pressed key is our target key then set to true
  const downHandler = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.key === targetKey) {
      setKeyPressed(true);
    }
  };

  // If released key is our target key then set to false
  const upHandler = (event: KeyboardEvent) => {
    event.preventDefault();
    if (event.key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  React.useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount
  return keyPressed;
};
