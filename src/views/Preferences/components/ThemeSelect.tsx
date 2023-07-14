import React from 'react';
import { Left, Right } from '@components/ui/Layout';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectSeparator,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@components/ui/Select';

import { useAppDataStore } from '@stores/appDataStore';
import { availableThemes } from '@stores/themeDataSlice';
import { AddThemeSheet } from './AddThemeSheet';

export const ThemeSelect = () => {
  const appTheme = useAppDataStore((state) => state.appTheme);
  const setAppTheme = useAppDataStore((state) => state.setAppTheme);

  const allCustomThemes = useAppDataStore((state) => state.customThemes);
  const activeCustomTheme = useAppDataStore((state) => state.activeCustomTheme);
  const addCustomTheme = useAppDataStore((state) => state.addCustomTheme);

  const activeTheme = appTheme === 'custom' ? activeCustomTheme.name : appTheme;

  const setActiveCustomTheme = useAppDataStore(
    (state) => state.setActiveCustomTheme
  );

  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const allThemeStrings = [
    ...availableThemes,
    ...allCustomThemes.map((ct) => ct.name),
  ];

  const onAddTheme = () => {
    // Open sheet to get theme info
    setIsSheetOpen(true);
    // Add theme to the store
    // Redirect to the theme customizer?
  };

  const onThemeChange = (at: string) => {
    if (at === 'add') {
      onAddTheme();
      return;
    }
    if (at === 'dark' || at === 'light' || at === 'system') {
      setAppTheme(at);
    } else {
      let customTheme = allCustomThemes.find((ct) => ct.name === at);
      if (!customTheme) {
        console.error('No custom theme found named: ', at);
        customTheme = activeCustomTheme;
      }
      setActiveCustomTheme(customTheme);
      setAppTheme('custom');
    }
  };

  return (
    <>
      <Left>Theme Preference:</Left>
      <Right>
        <Select value={activeTheme} onValueChange={onThemeChange}>
          <SelectTrigger className="w-[180px] capitalize">
            <SelectValue defaultValue={appTheme} />
          </SelectTrigger>
          <SelectContent className="capitalize">
            {allThemeStrings.map((theme) => {
              if (theme === 'custom') {
                return (
                  <>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel key={theme}>Custom Themes:</SelectLabel>
                      <SelectSeparator />
                    </SelectGroup>
                  </>
                );
              } else {
                return (
                  <SelectItem value={theme} key={theme}>
                    {theme}
                  </SelectItem>
                );
              }
            })}
            <SelectGroup>
              <SelectSeparator />
            </SelectGroup>
            <SelectItem value={'add'} className="cursor-pointer">
              + Add New
            </SelectItem>
          </SelectContent>
        </Select>
      </Right>
      <AddThemeSheet
        open={isSheetOpen}
        onOpenChange={(value) => setIsSheetOpen(value)}
      />
    </>
  );
};
