import React from "react";

import { Left, Right } from "@components/ui/Layout";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@components/ui/Select";
import { useAppDataStore } from "@stores/appDataStore";
import { availableThemes } from "@stores/themeDataSlice";

import { AddThemeSheet } from "./AddThemeSheet";

export const ThemeSelect = () => {
  const appTheme = useAppDataStore((state) => state.appTheme);
  const setAppTheme = useAppDataStore((state) => state.setAppTheme);

  const allCustomThemes = useAppDataStore((state) => state.customThemes);
  const activeCustomTheme = useAppDataStore((state) => state.activeCustomTheme);

  const activeTheme = appTheme === "custom" ? activeCustomTheme.name : appTheme;

  const setActiveCustomTheme = useAppDataStore(
    (state) => state.setActiveCustomTheme,
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
    if (at === "add") {
      onAddTheme();
      return;
    }
    if (at === "dark" || at === "light" || at === "system") {
      setAppTheme(at);
    } else {
      let customTheme = allCustomThemes.find(
        (ct) => ct.name.toLowerCase() === at.toLowerCase(),
      );
      if (!customTheme) {
        console.error("No custom theme found named: ", at);
        customTheme = activeCustomTheme;
      }
      setActiveCustomTheme(customTheme);
      setAppTheme("custom");
    }
  };

  return (
    <>
      <Left>Theme Preference:</Left>
      <Right>
        <Select onValueChange={onThemeChange} value={activeTheme}>
          <SelectTrigger className="w-[180px] capitalize">
            <SelectValue defaultValue={appTheme} />
          </SelectTrigger>
          <SelectContent className="capitalize">
            {allThemeStrings.map((theme) => {
              if (theme === "custom") {
                return (
                  <React.Fragment key={theme}>
                    <SelectSeparator />
                    <SelectGroup>
                      <SelectLabel>Custom Themes:</SelectLabel>
                      <SelectSeparator />
                    </SelectGroup>
                  </React.Fragment>
                );
              } else {
                return (
                  <SelectItem key={theme} value={theme}>
                    {theme}
                  </SelectItem>
                );
              }
            })}
            <SelectGroup>
              <SelectSeparator />
            </SelectGroup>
            <SelectItem className="cursor-pointer" value={"add"}>
              + Add New
            </SelectItem>
          </SelectContent>
        </Select>
      </Right>
      <AddThemeSheet
        onOpenChange={(value) => setIsSheetOpen(value)}
        open={isSheetOpen}
      />
    </>
  );
};
