import React from "react";

import { WebviewWindow } from "@tauri-apps/api/window";

export const useCloseOnUnfocus = (currentWindow: WebviewWindow) => {
  React.useEffect(() => {
    (async () => {
      const unlisten = await currentWindow.onFocusChanged(
        ({ payload: focused }) => {
          if (!focused) {
            currentWindow.close();
          }
        },
      );
      return unlisten;
    })();
  }, []);
};
