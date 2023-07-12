import { HSLColor } from 'react-color';
import { ThemeDataSlice, availableThemes, variableVals } from '.';
import { StoreApi } from 'zustand';

declare global {
  type ThemeVariableMap = {
    [K in (typeof variableVals)[number]]: ThemeVariable;
  };

  type CustomTheme = {
    name: string;
    isActive: boolean;
    themeVariableMap: ThemeVariableMap;
  };

  type AppTheme = (typeof availableThemes)[number];

  type ThemeVariable = {
    label: string;
    cssVarName: string;
    value: HSLColor;
    varNotFound: boolean;
  };

  type ThemeSetter = StoreApi<ThemeDataSlice>['setState'];
  type ThemeGetter = StoreApi<ThemeDataSlice>['getState'];
}
