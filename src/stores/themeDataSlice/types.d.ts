import { HSLColor } from 'react-color';
import { ThemeDataSlice, availableThemes, variableVals } from '.';
import { StoreApi } from 'zustand';

declare global {
  type ThemeVariableMap = {
    [K in (typeof variableVals)[number]]: ThemeVariable;
  };

  type ThemeVariableKey = keyof ThemeVariableMap;

  type CustomTheme = {
    name: string;
    themeVariableMap: ThemeVariableMap;
  };

  type AppTheme = (typeof availableThemes)[number];

  type ThemeVariable = {
    label: string;
    cssVarName: ThemeVariableKey;
    value: HSLColor;
    varNotFound: boolean;
    inherits?: ThemeVariableKey[];
    inheritedFrom?: ThemeVariableKey;
  };

  type ThemeSetter = StoreApi<ThemeDataSlice>['setState'];
  type ThemeGetter = StoreApi<ThemeDataSlice>['getState'];
}
