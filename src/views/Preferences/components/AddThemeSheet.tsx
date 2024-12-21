import React from "react";

import Button from "@components/Button";
import { Input, Label } from "@components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/Select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui/Sheet";
import { useAppDataStore } from "@stores/appDataStore";

export const AddThemeSheet = ({
  onOpenChange,
  open,
}: {
  onOpenChange: (b: boolean) => void;
  open: boolean;
}) => {
  const allCustomThemes = useAppDataStore((state) => state.customThemes);
  const themeNameSet = new Set(
    allCustomThemes.map((theme) => theme.name.toLowerCase()),
  );
  const addCustomTheme = useAppDataStore((state) => state.addCustomTheme);
  const updatePrefsTab = useAppDataStore((state) => state.updatePrefsTab);

  const [baseTheme, setBaseTheme] = React.useState<string>(
    allCustomThemes[0]?.name,
  );
  const [themeName, setThemeName] = React.useState<string>("");
  const [isNameError, setIsNameError] = React.useState(false);

  const validateThemeName = (name: string) => {
    if (!themeNameSet.has(name.toLowerCase())) {
      return true;
    }
    return false;
  };

  const onThemeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    if (validateThemeName(name)) {
      // Clear input error, set button to enabled
      setIsNameError(false);
    } else {
      // Set input error, button disabled
      setIsNameError(true);
    }
    // No matter what we want to update the value
    setThemeName(name);
  };

  const handleAddTheme = () => {
    const inheritedTheme = allCustomThemes.find((th) => th.name === baseTheme);
    if (!inheritedTheme) {
      console.error("Base theme not found: ", baseTheme);
    } else {
      addCustomTheme(themeName, inheritedTheme);
      onOpenChange(false);
      updatePrefsTab("theme");
    }
  };

  return (
    <Sheet onOpenChange={onOpenChange} open={open}>
      <SheetContent className="h-1/2" side={"bottom"}>
        <div className="mx-auto w-1/2">
          <SheetHeader>
            <SheetTitle>Add a new custom theme</SheetTitle>
            <SheetDescription>
              <div className="grid w-full grid-cols-6">
                <span className="col-span-3"></span>
                <span className="col-span-3 h-5 text-center text-xs text-red-600">
                  {isNameError && "*Theme name must be unique*"}
                </span>
                <Label className="col-span-2" htmlFor="name">
                  Theme Name
                </Label>
                <span className="col-span-1" />
                <Input
                  className="col-span-3 mb-2 py-1.5"
                  error={isNameError}
                  onChange={onThemeInputChange}
                  placeholder="Unique theme name"
                  type="text"
                  value={themeName}
                />
                <Label className="col-span-2" htmlFor="base-theme">
                  Base Theme
                </Label>
                <span className="col-span-1" />
                <div className="col-span-3 mb-3">
                  <Select
                    name="base-theme"
                    onValueChange={(value) => setBaseTheme(value)}
                    value={baseTheme}
                  >
                    <SelectTrigger className="w-[180px] capitalize">
                      <SelectValue defaultValue={baseTheme} />
                    </SelectTrigger>
                    <SelectContent className="capitalize">
                      {allCustomThemes.map((theme) => {
                        return (
                          <SelectItem key={theme.name} value={theme.name}>
                            {theme.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6">
                  <Button
                    className="w-full"
                    disabled={isNameError}
                    onClick={handleAddTheme}
                  >
                    Add Theme
                  </Button>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </div>
      </SheetContent>
    </Sheet>
  );
};
