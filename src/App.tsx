import React from 'react';
import { getCurrent } from '@tauri-apps/api/window';
import { PreferencesView, MenuView, AppPicker } from '@views/index';

// https://google.com
export enum WindowLabelEnum {
  MAIN = 'menu_bar',
  PREFS = 'preferences_window',
  PICKER = 'picker_window',
}

function App() {
  const currentWindow: WindowLabelEnum = getCurrent().label as WindowLabelEnum;

  if (currentWindow === WindowLabelEnum.PREFS) {
    return <PreferencesView />;
  }
  if (currentWindow === WindowLabelEnum.PICKER) {
    return <AppPicker />;
  }

  return <MenuView />;
}

export default App;
