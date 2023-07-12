import { HSLColor } from 'react-color';
import {
  ThemeVariable,
  variableVals,
  ThemeVariableMap,
  ThemeSetter,
  ThemeGetter,
  CustomTheme,
  AppTheme,
} from '.';
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

export const setCSSVariable = (
  themeVar: ThemeVariable,
  querySelector: string | null
) => {
  if (typeof document !== 'undefined') {
    const cssString = HSLToCSSValue(themeVar.value);

    if (querySelector) {
      const styleSheets = document.styleSheets;
      let targetRule: CSSStyleRule | null = null;
      for (const sheet of styleSheets) {
        for (const rule of sheet.cssRules) {
          if (
            rule instanceof CSSStyleRule &&
            rule.selectorText === querySelector
          ) {
            targetRule = rule;
            break;
          }
        }
        if (targetRule) {
          break;
        }
      }
      if (targetRule) {
        targetRule.style.setProperty(themeVar.cssVarName, cssString);
      }
    } else {
      document.documentElement.style.setProperty(
        themeVar.cssVarName,
        cssString
      );
    }
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

export const addCustomTheme = (
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

export const setCSSVariablesFromTheme = (
  customTheme: CustomTheme,
  querySelector?: string
) => {
  const { themeVariableMap } = customTheme;
  for (const [_key, value] of Object.entries(themeVariableMap)) {
    setCSSVariable(value, querySelector || '.custom');
  }
};

export const updateCustomTheme = (
  set: ThemeSetter,
  get: ThemeGetter,
  customTheme: CustomTheme,
  updates: ThemeVariable[]
) => {
  const newCustomTheme = { ...customTheme };
  for (const update of updates) {
    newCustomTheme.themeVariableMap[
      update.cssVarName as keyof typeof newCustomTheme.themeVariableMap
    ] = update;
  }
  if (newCustomTheme.isActive) {
    // If it's the active theme make sure we're updating the CSS vars too
    setCSSVariablesFromTheme(newCustomTheme);
  }

  const currentThemes = get().customThemes;
  const newThemes = currentThemes.map((theme) => {
    if (theme.name === newCustomTheme.name) {
      return newCustomTheme;
    }
    return theme;
  });

  set({ customThemes: newThemes });
};

export const setAppTheme = (
  set: ThemeSetter,
  get: ThemeGetter,
  appTheme?: AppTheme
) => {
  if (appTheme === 'custom') {
    const activeCustomTheme = getActiveCustomTheme(set, get);
    setCSSVariablesFromTheme(activeCustomTheme);
  }
  set({ appTheme: appTheme || 'system' });
};
