import { HSLColor } from 'react-color';
import { StoreApi } from 'zustand';

import {
  getCurrentTheme as _getCurrentTheme,
  setCSSVariable as _setCSSVariable,
  addCustomTHeme as _addCustomTheme,
  getActiveCustomTheme as _getActiveCustomTheme,
  setCSSVariablesFromTheme as _setCSSVariablesFromTheme,
} from './actions';

export const availableThemes = ['dark', 'light', 'system', 'custom'] as const;
export type AppTheme = (typeof availableThemes)[number];

export type ThemeVariable = {
  label: string;
  cssVarName: string;
  value: HSLColor;
  varNotFound: boolean;
};

export const variableVals = [
  '--background',
  '--foreground',
  '--muted',
  '--muted-foreground',
  '--popover',
  '--popover-foreground',
  '--card',
  '--card-muted',
  '--border',
  '--input',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--ring',
] as const;

export type ThemeVariableMap = {
  [K in (typeof variableVals)[number]]: ThemeVariable;
};

export type CustomTheme = {
  name: string;
  isActive: boolean;
  themeVariableMap: ThemeVariableMap;
};

export interface ThemeDataSlice {
  appTheme: AppTheme;
  themeVariableMap?: ThemeVariableMap;
  customThemes: CustomTheme[];
  getActiveCustomTheme: () => CustomTheme;
  setCSSVariable: (t: ThemeVariable) => void;
  setCSSVariablesFromTheme: (t: CustomTheme) => void;
  getCurrentTheme: () => void;
  setAppTheme: (T?: AppTheme) => void;
}

export type ThemeSetter = StoreApi<ThemeDataSlice>['setState'];
export type ThemeGetter = StoreApi<ThemeDataSlice>['getState'];

export const useThemeDataSlice = (set: ThemeSetter, get: ThemeGetter) => ({
  appTheme: 'system' as AppTheme,
  themeVariableMap: undefined,
  customThemes: [],
  getActiveCustomTheme: () => _getActiveCustomTheme(set, get),
  addCustomTheme: (newTheme: CustomTheme) =>
    _addCustomTheme(set, get, newTheme),
  setCSSVariable: (themeVar: ThemeVariable) => _setCSSVariable(themeVar),
  setCSSVariablesFromTheme: (customTheme: CustomTheme) =>
    _setCSSVariablesFromTheme(customTheme),
  getCurrentTheme: () => _getCurrentTheme(set),
  setAppTheme: (appTheme?: AppTheme) => set({ appTheme: appTheme || 'system' }),
});
