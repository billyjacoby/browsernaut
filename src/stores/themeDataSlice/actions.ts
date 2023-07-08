import { HSLColor } from 'react-color';
import {
  ThemeVariable,
  variableVals,
  ThemeVariableMap,
  ThemeSetter,
  ThemeGetter,
  CustomTheme,
} from './themeDataSlice';
import { defaultCustomTheme } from './config';

const cssToHSLValue = (cv: string): HSLColor => {
  const values = cv.replace('%', '').split(' ');
  return {
    h: parseInt(values?.[0] ?? '0', 10),
    s: parseInt(values?.[1] ?? '0', 10),
    l: parseInt(values?.[2] ?? '0', 10),
  };
};

const HSLToCSSValue = (cv: HSLColor): string => {
  const { h, s, l } = cv;
  return `${h} ${s}% ${l}%`;
};

const CSSVarToHSLValue = (cssVar: string): HSLColor | undefined => {
  if (typeof document !== 'undefined') {
    const cssValue = getComputedStyle(
      document.documentElement
    ).getPropertyValue(cssVar);
    if (cssValue.length) {
      return cssToHSLValue(cssValue);
    }
  }
};

const UpdateCSSVar = (themeVar: ThemeVariable) => {
  if (typeof document !== 'undefined') {
    console.log('🪵 | file: actions.ts:160 | UpdateCSSVar | setting value');
    const cssString = HSLToCSSValue(themeVar.value);
    document.documentElement.style.setProperty(themeVar.cssVarName, cssString);
  }
};

export const getCurrentTheme = (set: ThemeSetter) => {
  const themeVariableMap = variableVals.reduce((acc, curr) => {
    const value = CSSVarToHSLValue(curr);
    acc[curr] = {
      label: curr.replaceAll('--', ' ').replaceAll('-', ' ').trim(),
      cssVarName: curr,
      value: value || { h: 0, s: 0, l: 0 },
      varNotFound: typeof value === 'undefined',
    };

    return acc;
  }, {} as ThemeVariableMap);
  set({ themeVariableMap });
};

export const setCSSVariable = (themeVar: ThemeVariable) => {
  UpdateCSSVar(themeVar);
};

export const addCustomTHeme = (
  set: ThemeSetter,
  get: ThemeGetter,
  newTheme: CustomTheme
) => {
  const newThemes = get().customThemes;
  newThemes.push(newTheme);
  set({ customThemes: newThemes });
};

export const getActiveCustomTheme = (set: ThemeSetter, get: ThemeGetter) => {
  const customThemes = get().customThemes;
  //? If for some reason there aren't any custom themes, add the default one
  if (!customThemes.length) {
    const defaultActiveTheme = { ...defaultCustomTheme, isActive: true };
    customThemes.push(defaultActiveTheme);
    return defaultActiveTheme;
  }

  let activeTheme = customThemes.find((th) => th.isActive);
  //? if there is no active theme default to the first one.
  if (!activeTheme) {
    activeTheme = { ...customThemes[0], isActive: true };
  }
  //? If there is an active theme, resort the array so that theme is first and ensure the rest are inActive
  const newThemes = customThemes.filter((th) => th.name !== activeTheme?.name);
  newThemes.unshift(activeTheme);
  set({ customThemes: newThemes });
  return activeTheme;
};

export const setCSSVariablesFromTheme = (customTheme: CustomTheme) => {
  const { themeVariableMap } = customTheme;
  for (const [_key, value] of Object.entries(themeVariableMap)) {
    setCSSVariable(value);
  }
};
