import {
  AppTheme,
  CustomTheme,
  ThemeGetter,
  ThemeSetter,
  ThemeVariable,
} from "./types";

import {
  addCustomTheme as _addCustomTheme,
  deleteCustomTheme as _deleteCustomTheme,
  getCurrentCSSTheme as _getCurrentCSSTheme,
  renameCustomTheme as _renameCustomTheme,
  setActiveCustomTheme as _setActiveCustomTheme,
  setAppTheme as _setAppTheme,
  updateCustomTheme as _updateCustomTheme,
  defaultDarkTheme,
  defaultLightTheme,
} from ".";

export interface ThemeDataSlice {
  activeCustomTheme: CustomTheme;
  addCustomTheme: (N: string, CT?: CustomTheme) => void;
  appTheme: AppTheme;
  customThemes: CustomTheme[];
  deleteCustomTheme: (T: string) => void;
  getCurrentCSSTheme: () => CustomTheme;
  renameCustomTheme: (T: CustomTheme, S: string) => void;
  resetThemeState: () => void;
  setActiveCustomTheme: (CT: CustomTheme) => void;
  setAppTheme: (T?: AppTheme) => void;
  updateCustomTheme: (T: CustomTheme, U?: ThemeVariable[]) => void;
}

export const useThemeDataSlice = (set: ThemeSetter, get: ThemeGetter) => ({
  activeCustomTheme: defaultLightTheme,
  addCustomTheme: (themeName: string, baseTheme?: CustomTheme) =>
    _addCustomTheme(set, get, themeName, baseTheme),
  appTheme: "system" as AppTheme,
  customThemes: [],
  deleteCustomTheme: (themeName: string) =>
    _deleteCustomTheme(set, get, themeName),
  getCurrentCSSTheme: () => _getCurrentCSSTheme(),
  renameCustomTheme: (customTheme: CustomTheme, newName: string) =>
    _renameCustomTheme(set, get, customTheme, newName),
  resetThemeState: () =>
    set({
      activeCustomTheme: defaultDarkTheme,
      appTheme: "system",
      customThemes: [defaultDarkTheme, defaultLightTheme],
    }),
  setActiveCustomTheme: (activeCustomTheme: CustomTheme) =>
    _setActiveCustomTheme(set, activeCustomTheme),
  setAppTheme: (appTheme?: AppTheme) => _setAppTheme(set, get, appTheme),
  updateCustomTheme: (customTheme: CustomTheme, updates?: ThemeVariable[]) =>
    _updateCustomTheme(set, get, customTheme, updates),
});

//! Gives me a "Cannot access uninitialized variable error when trying to use this"
// const defaultCustomThemeState: Partial<ThemeDataSlice> = {
//   appTheme: 'system',
//   customThemes: [defaultCustomTheme],
//   activeCustomTheme: defaultCustomTheme,
// };
