import { useAppDataStore } from '@stores/appDataStore';

export const useSetCustomTheme = () => {
  const getActiveTheme = useAppDataStore((state) => state.getActiveCustomTheme);

  const setCSSVariablesFromTheme = useAppDataStore(
    (state) => state.setCSSVariablesFromTheme
  );

  const setCustomTheme = () => {
    const activeTheme = getActiveTheme();
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('custom');
    /**
     * ! This will overwrite the css vars for the whole document, not just the specified class
     * Possible solutions:
     * - Manage the theme entirely from JS instead of the CSS stylesheet
     *    I hate not using the builtin css functionality for this and could imagine it would slow things down...
     * - Figure out a way to properly only overwrite scoped variables
     *    maybe this: https://stackoverflow.com/questions/68089714/how-to-add-update-scoped-css-variables-via-javascript
     */
    setCSSVariablesFromTheme(activeTheme);
  };

  return { setCustomTheme };
};
