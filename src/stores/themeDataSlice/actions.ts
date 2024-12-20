import { HSLColor } from "react-color";
import { defaultDarkTheme, defaultLightTheme, variableVals } from "./config";

const HSLToCSSValue = (cv: HSLColor): string => {
  const { h, s, l } = cv;
  return `${h} ${s}% ${l}%`;
};

const CSSToHSLValue = (css: string): HSLColor => {
  const values = css.replaceAll("%", "").split(" ");

  return {
    h: parseFloat(values[0]),
    s: parseFloat(values[1]),
    l: parseFloat(values[2]),
  };
};

export const getCurrentCSSTheme = (): CustomTheme => {
  const currentTheme: CustomTheme = JSON.parse(
    JSON.stringify(defaultLightTheme)
  );
  currentTheme.name = "current";
  if (document && document?.documentElement) {
    for (const value of variableVals) {
      const cssVal = getComputedStyle(
        document.documentElement
      ).getPropertyValue(value);
      if (currentTheme?.themeVariableMap[value]?.value) {
        currentTheme.themeVariableMap[value].value = CSSToHSLValue(cssVal);
      }
    }
  }
  return currentTheme;
};

export const setCSSVariable = (
  themeVar: ThemeVariable,
  querySelector: string | null
) => {
  if (typeof document !== "undefined") {
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
      ...defaultLightTheme,
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
    set({ customThemes: [defaultDarkTheme, defaultLightTheme] });
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
    setCSSVariable(value, querySelector || ".custom");
  }
};

export const updateCustomTheme = (
  set: ThemeSetter,
  get: ThemeGetter,
  customTheme: CustomTheme,
  updates?: ThemeVariable[]
) => {
  //? If we're updating the default theme we actually want to clone it to another theme instead
  const newCustomTheme: CustomTheme = JSON.parse(JSON.stringify(customTheme));
  if (newCustomTheme.name === "default dark") {
    newCustomTheme.name = "default dark - edited";
  }
  if (newCustomTheme.name === "default light") {
    newCustomTheme.name = "default light - edited";
  }
  if (!updates) {
    updates = Object.values(customTheme.themeVariableMap);
  }
  for (const update of updates) {
    const currentValue = {
      ...newCustomTheme.themeVariableMap[
        update.cssVarName as keyof typeof newCustomTheme.themeVariableMap
      ],
    };

    //? If the update inherits it's value from another (inheritedFrom) then we want to wipe
    //? both the values inheritedFrom and remove from the parents inherits array

    if (currentValue.inheritedFrom) {
      const parent =
        newCustomTheme.themeVariableMap[currentValue.inheritedFrom];

      if (parent.inherits?.length) {
        newCustomTheme.themeVariableMap[currentValue.inheritedFrom].inherits =
          parent.inherits.filter(
            (varName) => varName !== currentValue.inheritedFrom
          );
      }
      delete currentValue.inheritedFrom;
    } else {
      //? If it's not inherited then we want to check if anything inherits and update accordingly
      if (currentValue?.inherits?.length) {
        // Update the inherited properties too
        for (const inherited of currentValue.inherits) {
          const curInheritedValue = {
            ...newCustomTheme.themeVariableMap[inherited],
          };
          newCustomTheme.themeVariableMap[inherited] = {
            ...curInheritedValue,
            value: update.value,
          };
        }
      }
    }

    newCustomTheme.themeVariableMap[
      update.cssVarName as keyof typeof newCustomTheme.themeVariableMap
    ] = update;
  }
  setCSSVariablesFromTheme(newCustomTheme);

  setActiveCustomTheme(set, newCustomTheme);

  const currentThemes = get().customThemes;
  let shouldAppendTheme = true;
  const newThemes = currentThemes.map((theme) => {
    if (theme.name === newCustomTheme.name) {
      shouldAppendTheme = false;
      return newCustomTheme;
    }
    return theme;
  });
  if (shouldAppendTheme) {
    newThemes.push(newCustomTheme);
  }

  set({ customThemes: newThemes });
};

export const setAppTheme = (
  set: ThemeSetter,
  get: ThemeGetter,
  appTheme?: AppTheme
) => {
  if (appTheme === "custom") {
    const activeCustomTheme = getActiveCustomTheme(set, get);
    setCSSVariablesFromTheme(activeCustomTheme);
  }
  set({ appTheme: appTheme || "system" });
};

export const setActiveCustomTheme = (
  set: ThemeSetter,
  customTheme: CustomTheme
) => {
  setCSSVariablesFromTheme(customTheme);
  set({ activeCustomTheme: customTheme });
};

export const renameCustomTheme = (
  set: ThemeSetter,
  get: ThemeGetter,
  customTheme: CustomTheme,
  newName: string
) => {
  const { activeCustomTheme, customThemes } = get();
  const newCustomTheme: CustomTheme = JSON.parse(JSON.stringify(customTheme));
  newCustomTheme.name = newName;

  const newCustomThemes = customThemes.map((theme) => {
    if (theme.name === customTheme.name) {
      return newCustomTheme;
    } else {
      return theme;
    }
  });

  set({ customThemes: newCustomThemes });

  if (activeCustomTheme.name === customTheme.name) {
    setActiveCustomTheme(set, newCustomTheme);
  }
};
