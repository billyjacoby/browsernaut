import { HSLColor } from "react-color";
import { StoreApi } from "zustand";

import { availableThemes, ThemeDataSlice, variableVals } from ".";

export type ThemeVariableMap = {
  [K in (typeof variableVals)[number]]: ThemeVariable;
};

export type ThemeVariableKey = keyof ThemeVariableMap;

export type CustomTheme = {
  name: string;
  themeVariableMap: ThemeVariableMap;
};

export type AppTheme = (typeof availableThemes)[number];

export type ThemeVariable = {
  cssVarName: ThemeVariableKey;
  inheritedFrom?: ThemeVariableKey;
  inherits?: ThemeVariableKey[];
  label: string;
  value: HSLColor;
  varNotFound: boolean;
};

export type ThemeSetter = StoreApi<ThemeDataSlice>["setState"];
export type ThemeGetter = StoreApi<ThemeDataSlice>["getState"];
