import {
  setCSSVariable as _setCSSVariable,
  addCustomTheme as _addCustomTheme,
  getActiveCustomTheme as _getActiveCustomTheme,
  setCSSVariablesFromTheme as _setCSSVariablesFromTheme,
  updateCustomTheme as _updateCustomTheme,
  setAppTheme as _setAppTheme,
  deleteCustomTheme as _deleteCustomTheme,
  setActiveCustomTheme as _setActiveCustomTheme,
  getCurrentCSSTheme as _getCurrentCSSTheme,
  renameCustomTheme as _renameCustomTheme,
  defaultDarkTheme,
  defaultLightTheme,
} from '.';

export interface ThemeDataSlice {
  appTheme: AppTheme;
  customThemes: CustomTheme[];
  activeCustomTheme: CustomTheme;
  addCustomTheme: (N: string, CT?: CustomTheme) => void;
  setAppTheme: (T?: AppTheme) => void;
  deleteCustomTheme: (T: string) => void;
  setActiveCustomTheme: (CT: CustomTheme) => void;
  updateCustomTheme: (T: CustomTheme, U?: ThemeVariable[]) => void;
  renameCustomTheme: (T: CustomTheme, S: string) => void;
  resetThemeState: () => void;
  getCurrentCSSTheme: () => CustomTheme;
}

export const useThemeDataSlice = (set: ThemeSetter, get: ThemeGetter) => ({
  appTheme: 'system' as AppTheme,
  customThemes: [],
  activeCustomTheme: defaultLightTheme,
  renameCustomTheme: (customTheme: CustomTheme, newName: string) =>
    _renameCustomTheme(set, get, customTheme, newName),
  setActiveCustomTheme: (activeCustomTheme: CustomTheme) =>
    _setActiveCustomTheme(set, activeCustomTheme),
  addCustomTheme: (themeName: string, baseTheme?: CustomTheme) =>
    _addCustomTheme(set, get, themeName, baseTheme),
  deleteCustomTheme: (themeName: string) =>
    _deleteCustomTheme(set, get, themeName),
  setAppTheme: (appTheme?: AppTheme) => _setAppTheme(set, get, appTheme),
  updateCustomTheme: (customTheme: CustomTheme, updates?: ThemeVariable[]) =>
    _updateCustomTheme(set, get, customTheme, updates),
  resetThemeState: () =>
    set({
      appTheme: 'system',
      customThemes: [defaultDarkTheme, defaultLightTheme],
      activeCustomTheme: defaultDarkTheme,
    }),
  getCurrentCSSTheme: () => _getCurrentCSSTheme(),
});

//! Gives me a "Cannot access uninitialized variable error when trying to use this"
// const defaultCustomThemeState: Partial<ThemeDataSlice> = {
//   appTheme: 'system',
//   customThemes: [defaultCustomTheme],
//   activeCustomTheme: defaultCustomTheme,
// };
