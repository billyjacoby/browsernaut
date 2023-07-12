import {
  getCurrentTheme as _getCurrentTheme,
  setCSSVariable as _setCSSVariable,
  addCustomTheme as _addCustomTheme,
  getActiveCustomTheme as _getActiveCustomTheme,
  setCSSVariablesFromTheme as _setCSSVariablesFromTheme,
  updateCustomTheme as _updateCustomTheme,
  setAppTheme as _setAppTheme,
} from '.';

export interface ThemeDataSlice {
  appTheme: AppTheme;
  themeVariableMap?: ThemeVariableMap;
  customThemes: CustomTheme[];
  getActiveCustomTheme: () => CustomTheme;
  setCSSVariable: (t: ThemeVariable, qs: string | null) => void;
  setCSSVariablesFromTheme: (t: CustomTheme) => void;
  getCurrentTheme: () => void;
  setAppTheme: (T?: AppTheme) => void;
  updateCustomTheme: (T: CustomTheme, U: ThemeVariable[]) => void;
}

export const useThemeDataSlice = (set: ThemeSetter, get: ThemeGetter) => ({
  appTheme: 'system' as AppTheme,
  themeVariableMap: undefined,
  customThemes: [],
  getActiveCustomTheme: () => _getActiveCustomTheme(set, get),
  addCustomTheme: (newTheme: CustomTheme) =>
    _addCustomTheme(set, get, newTheme),
  setCSSVariable: (themeVar: ThemeVariable, querySelector: string | null) =>
    _setCSSVariable(themeVar, querySelector),
  setCSSVariablesFromTheme: (customTheme: CustomTheme) =>
    _setCSSVariablesFromTheme(customTheme),
  getCurrentTheme: () => _getCurrentTheme(set),
  setAppTheme: (appTheme?: AppTheme) => _setAppTheme(set, get, appTheme),
  updateCustomTheme: (customTheme: CustomTheme, updates: ThemeVariable[]) =>
    _updateCustomTheme(set, get, customTheme, updates),
});
