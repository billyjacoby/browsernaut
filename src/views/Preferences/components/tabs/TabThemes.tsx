import React from "react";

import Button from "@components/Button";
import { Input } from "@components/Input";
import { Left, Row } from "@components/ui/Layout";
import { useAppDataStore } from "@stores/appDataStore";
import { AppTheme } from "@stores/themeDataSlice/types";
import { confirm } from "@tauri-apps/api/dialog";

import { ColorPicker } from "../ColorPicker";

export const TabThemes = () => {
  const activeCustomTheme = useAppDataStore((state) => state.activeCustomTheme);
  const allCustomThemes = useAppDataStore((state) => state.customThemes);
  const appTheme = useAppDataStore((state) => state.appTheme);
  const setAppTheme = useAppDataStore((state) => state.setAppTheme);
  const deleteCustomTheme = useAppDataStore((state) => state.deleteCustomTheme);
  const renameCustomTheme = useAppDataStore((state) => state.renameCustomTheme);
  const resetThemeState = useAppDataStore((state) => state.resetThemeState);

  const themeNameSet = new Set(
    allCustomThemes.map((theme) => theme.name.toLowerCase()),
  );

  const [editedThemeName, setEditedThemeName] = React.useState(
    activeCustomTheme.name,
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputError, setInputError] = React.useState(false);
  const isRenameDisabled =
    activeCustomTheme.name === "default dark" ||
    activeCustomTheme.name === "default light";

  const userTheme = React.useRef<AppTheme | null>(null);

  const { themeVariableMap } = activeCustomTheme;

  const validateThemeName = (name: string) => {
    if (!themeNameSet.has(name.toLowerCase())) {
      return true;
    }
    return false;
  };

  const setCustomThemeTemp = () => {
    if (!userTheme.current || appTheme === "custom") {
      return;
    }
    setAppTheme("custom");
  };

  const onDeleteThemeClick = async () => {
    const shouldDelete = await confirm(
      "Are you sure you want to delete this theme?",
      { title: "Delete Theme", type: "warning" },
    );
    if (shouldDelete) {
      deleteCustomTheme(activeCustomTheme.name);
    }
  };

  const onResetThemeDataClick = async () => {
    const shouldReset = await confirm(
      "Are you sure you want to reset all theme data to the default?",
      { title: "Reset Theme Data", type: "warning" },
    );
    if (shouldReset) {
      resetThemeState();
    }
  };

  const handleInputChange = (e: string) => {
    if (validateThemeName(e)) {
      setInputError(false);
    } else {
      setInputError(true);
    }
    setEditedThemeName(e);
  };

  const handleThemeRename = () => {
    if (validateThemeName(editedThemeName)) {
      //
      renameCustomTheme(activeCustomTheme, editedThemeName);
    }
    setIsEditing(false);
  };

  //? The first time a color is changed we want to update the theme to ensure it's set to custom.
  //? If we're setting it to custom then we want to change it back to the previously selected theme on unmount.

  React.useEffect(() => {
    if (appTheme !== "custom") {
      userTheme.current = appTheme;
      setAppTheme("custom");
    }

    return () => {
      setIsEditing(false);
      if (userTheme.current) {
        setAppTheme(userTheme.current);
      }
    };
    //? This useEffect is here to only check for state on mount, and revert it on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full flex-1 flex-col gap-1 text-center">
      <h1 className="text-4xl font-bold">Theme Customizer</h1>
      <p className="-mb-2 text-xl">
        Currently editing:{" "}
        {isEditing ? (
          <Input
            error={inputError}
            onChange={(e) => handleInputChange(e.target.value)}
            type="text"
            value={editedThemeName}
          />
        ) : (
          <span className="font-bold capitalize">{activeCustomTheme.name}</span>
        )}
      </p>
      {isEditing ? (
        <div>
          <Button
            disabled={!editedThemeName.length}
            onClick={handleThemeRename}
            variant={"link"}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              setEditedThemeName(activeCustomTheme.name);
              setIsEditing(false);
            }}
            variant={"link"}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          disabled={isRenameDisabled}
          onClick={() => setIsEditing((prev) => !prev)}
          variant={"link"}
        >
          Rename
        </Button>
      )}
      <div className="mb-24 flex flex-1 flex-row justify-center overflow-y-auto">
        <div className="grid grid-cols-2">
          {themeVariableMap &&
            Object.entries(themeVariableMap).map(([_key, value]) => (
              <Row className="col-span-1 m-1 gap-0 p-3" key={value.cssVarName}>
                <Left className="col-span-6">
                  <Label>{value.label}: </Label>
                </Left>
                <div className="col-span-5 text-right">
                  <ColorPicker
                    activeTheme={activeCustomTheme}
                    beforeChange={setCustomThemeTemp}
                    themeVar={value}
                  />
                </div>
              </Row>
            ))}
          <div className="col-span-2">
            <Button
              className="col-span-1 text-destructive"
              disabled={activeCustomTheme.name.toLowerCase() === "default"}
              onClick={onDeleteThemeClick}
              variant={"link"}
            >
              Delete Theme
            </Button>
            <Button
              className="col-span-1 text-destructive"
              onClick={onResetThemeDataClick}
              variant={"link"}
            >
              Reset Theme Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-lg font-bold capitalize">{children}</p>
);
