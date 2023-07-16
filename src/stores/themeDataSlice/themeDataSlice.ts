import {
  setCSSVariable as _setCSSVariable,
  addCustomTheme as _addCustomTheme,
  getActiveCustomTheme as _getActiveCustomTheme,
  setCSSVariablesFromTheme as _setCSSVariablesFromTheme,
  updateCustomTheme as _updateCustomTheme,
  setAppTheme as _setAppTheme,
  deleteCustomTheme as _deleteCustomTheme,
  setActiveCustomTheme as _setActiveCustomTheme,
  defaultCustomTheme,
} from '.';

export interface ThemeDataSlice {
  appTheme: AppTheme;
  customThemes: CustomTheme[];
  activeCustomTheme: CustomTheme;
  addCustomTheme: (N: string, CT?: CustomTheme) => void;
  setAppTheme: (T?: AppTheme) => void;
  deleteCustomTheme: (T?: string) => void;
  setActiveCustomTheme: (CT: CustomTheme) => void;
  updateCustomTheme: (T: CustomTheme, U?: ThemeVariable[]) => void;
}

export const useThemeDataSlice = (set: ThemeSetter, get: ThemeGetter) => ({
  appTheme: 'system' as AppTheme,
  customThemes: [defaultCustomTheme],
  activeCustomTheme: defaultCustomTheme,
  setActiveCustomTheme: (activeCustomTheme: CustomTheme) =>
    _setActiveCustomTheme(set, activeCustomTheme),
  addCustomTheme: (themeName: string, baseTheme?: CustomTheme) =>
    _addCustomTheme(set, get, themeName, baseTheme),
  deleteCustomTheme: (themeName: string) =>
    _deleteCustomTheme(set, get, themeName),
  setAppTheme: (appTheme?: AppTheme) => _setAppTheme(set, get, appTheme),
  updateCustomTheme: (customTheme: CustomTheme, updates?: ThemeVariable[]) =>
    _updateCustomTheme(set, get, customTheme, updates),
});
