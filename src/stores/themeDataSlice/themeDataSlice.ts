import {
  setCSSVariable as _setCSSVariable,
  addCustomTheme as _addCustomTheme,
  getActiveCustomTheme as _getActiveCustomTheme,
  setCSSVariablesFromTheme as _setCSSVariablesFromTheme,
  updateCustomTheme as _updateCustomTheme,
  setAppTheme as _setAppTheme,
  defaultCustomTheme,
} from '.';

export interface ThemeDataSlice {
  appTheme: AppTheme;
  customThemes: CustomTheme[];
  activeCustomTheme: CustomTheme;
  setAppTheme: (T?: AppTheme) => void;
  setActiveCustomTheme: (CT: CustomTheme) => void;
  updateCustomTheme: (T: CustomTheme, U?: ThemeVariable[]) => void;
}

export const useThemeDataSlice = (set: ThemeSetter, get: ThemeGetter) => ({
  appTheme: 'system' as AppTheme,
  customThemes: [defaultCustomTheme],
  activeCustomTheme: defaultCustomTheme,
  setActiveCustomTheme: (activeCustomTheme: CustomTheme) =>
    set({ activeCustomTheme }),
  addCustomTheme: (newTheme: CustomTheme) =>
    _addCustomTheme(set, get, newTheme),
  setAppTheme: (appTheme?: AppTheme) => _setAppTheme(set, get, appTheme),
  updateCustomTheme: (customTheme: CustomTheme, updates?: ThemeVariable[]) =>
    _updateCustomTheme(set, get, customTheme, updates),
});
