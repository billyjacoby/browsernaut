import React from 'react';
import { Input, Label } from '@components/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/Sheet';
import { useAppDataStore } from '@stores/appDataStore';
import Button from '@components/Button';

export const AddThemeSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
}) => {
  const allCustomThemes = useAppDataStore((state) => state.customThemes);
  const themeNameSet = new Set(allCustomThemes.map((theme) => theme.name));

  const [baseTheme, setBaseTheme] = React.useState<string>(
    allCustomThemes[0].name
  );
  const [themeName, setThemeName] = React.useState<string>('');

  const validateThemeName = (name: string) => {
    if (name.length && !themeNameSet.has(name)) {
      return true;
    }
    return false;
  };

  const onThemeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(
      '🪵 | file: AddThemeSheet.tsx:43 | onThemeInputChange | event:',
      event
    );
    // const name = event.target.value;
    // console.log(
    //   '🪵 | file: AddThemeSheet.tsx:43 | onThemeInputChange | name:',
    //   name
    // );
    // if (validateThemeName(name)) {
    //   // Clear input error, set button to enabled
    // } else {
    //   // Set input error, button disabled
    // }
    // // No matter what we want to update the value
    // setThemeName(name);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={'bottom'} className="h-1/2">
        <div className="w-1/2 mx-auto">
          <SheetHeader>
            <SheetTitle>Add a new custom theme</SheetTitle>
            <SheetDescription>
              <div className="grid grid-cols-6 w-full gap-3">
                <Label htmlFor="name" className="col-span-2">
                  Theme Name
                </Label>
                <span className="col-span-1" />
                <input
                  id="some-id"
                  className="col-span-3 py-1.5"
                  placeholder="Unique name"
                  // value={themeName}
                  onChange={onThemeInputChange}
                />
                <Label htmlFor="base-theme" className="col-span-2">
                  Base Theme
                </Label>
                <span className="col-span-1" />
                <div className="col-span-3">
                  <Select
                    name="base-theme"
                    value={baseTheme}
                    onValueChange={(value) => setBaseTheme(value)}
                  >
                    <SelectTrigger className="w-[180px] capitalize">
                      <SelectValue defaultValue={baseTheme} />
                    </SelectTrigger>
                    <SelectContent className="capitalize">
                      {allCustomThemes.map((theme) => {
                        return (
                          <SelectItem value={theme.name} key={theme.name}>
                            {theme.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6">
                  <Button className="w-full">Add Theme</Button>
                </div>
              </div>
            </SheetDescription>
          </SheetHeader>
        </div>
      </SheetContent>
    </Sheet>
  );
};
