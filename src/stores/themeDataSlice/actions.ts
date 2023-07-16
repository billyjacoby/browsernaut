import { HSLColor } from 'react-color';
import { defaultCustomTheme } from './config';

const HSLToCSSValue = (cv: HSLColor): string => {
  const { h, s, l } = cv;
  return `${h} ${s}% ${l}%`;
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

export const addCustomTheme = (
  set: ThemeSetter,
  get: ThemeGetter,
  themeName: string,
  baseTheme?: CustomTheme
) => {
  const newCustomThemes = get().customThemes.map((theme) => ({
    ...theme,
  }));

  let activeTheme: CustomTheme;

  if (baseTheme) {
    //? Necessary to deep clone the theme object as to not reference child properties of it
    // https://stackoverflow.com/questions/12690107/clone-object-without-reference-javascript
    const baseThemeCopy: CustomTheme = JSON.parse(JSON.stringify(baseTheme));
    const newTheme: CustomTheme = {
      ...baseThemeCopy,
      name: themeName,
    };
    newCustomThemes.push(newTheme);
    newCustomThemes.sort((a, b) => {
      const aName = a.name.toUpperCase();
      const bName = b.name.toUpperCase();
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }
      return 0;
    });
    activeTheme = newTheme;
  } else {
    const newTheme: CustomTheme = {
      ...defaultCustomTheme,
      name: themeName,
    };
    newCustomThemes.push(newTheme);
    activeTheme = newTheme;
  }
  setActiveCustomTheme(set, activeTheme);
  set({ customThemes: newCustomThemes });
};

export const deleteCustomTheme = (
  set: ThemeSetter,
  get: ThemeGetter,
  themeName: string
) => {
  const { customThemes, activeCustomTheme } = get();
  const newCustomThemes = customThemes.filter(
    (ct) => ct.name.toLowerCase() !== themeName.toLowerCase()
  );

  if (activeCustomTheme.name.toLowerCase() === themeName.toLowerCase()) {
    // Set the first indexed theme as the new active one;
    const newActiveCustomTheme = newCustomThemes[0];
    setActiveCustomTheme(set, newActiveCustomTheme);
    set({
      customThemes: newCustomThemes,
    });
    return;
  }

  set({ customThemes: newCustomThemes });
};

export const getActiveCustomTheme = (set: ThemeSetter, get: ThemeGetter) => {
  const { customThemes, activeCustomTheme } = get();
  let newActiveTheme = activeCustomTheme;

  //? If for some reason there aren't any custom themes, add the default one
  if (!customThemes.length) {
    const defaultActiveTheme = { ...defaultCustomTheme };
    customThemes.push(defaultActiveTheme);
    set({ customThemes });
  }

  if (!newActiveTheme) {
    newActiveTheme = customThemes[0];
  }

  set({ activeCustomTheme: newActiveTheme });
  return newActiveTheme;
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
  updates?: ThemeVariable[]
) => {
  const newCustomTheme = { ...customTheme };
  if (!updates) {
    updates = Object.values(customTheme.themeVariableMap);
  }
  for (const update of updates) {
    newCustomTheme.themeVariableMap[
      update.cssVarName as keyof typeof newCustomTheme.themeVariableMap
    ] = update;
  }
  setCSSVariablesFromTheme(newCustomTheme);

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

export const setActiveCustomTheme = (
  set: ThemeSetter,
  customTheme: CustomTheme
) => {
  setCSSVariablesFromTheme(customTheme);
  set({ activeCustomTheme: customTheme });
};
