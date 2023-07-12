import { HSLColor } from 'react-color';
import { ThemeDataSlice, availableThemes, variableVals } from '.';
import { StoreApi } from 'zustand';

export type ThemeVariableMap = {
  [K in (typeof variableVals)[number]]: ThemeVariable;
};

export type CustomTheme = {
  name: string;
  isActive: boolean;
  themeVariableMap: ThemeVariableMap;
};

export type AppTheme = (typeof availableThemes)[number];

export type ThemeVariable = {
  label: string;
  cssVarName: string;
  value: HSLColor;
  varNotFound: boolean;
};

export type ThemeSetter = StoreApi<ThemeDataSlice>['setState'];
export type ThemeGetter = StoreApi<ThemeDataSlice>['getState'];
