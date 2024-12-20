import Button from "@components/Button";
import { Input } from "@components/Input";
import { Left, Row } from "@components/ui/Layout";
import { useAppDataStore } from "@stores/appDataStore";
import { confirm } from "@tauri-apps/api/dialog";
import React from "react";
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
    allCustomThemes.map((theme) => theme.name.toLowerCase())
  );

  const [editedThemeName, setEditedThemeName] = React.useState(
    activeCustomTheme.name
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [inputError, setInputError] = React.useState(false);
  const isRenameDisabled =
    activeCustomTheme.name === "default dark" ||
    activeCustomTheme.name === "default light";

  const userTheme = React.useRef<null | AppTheme>(null);

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
      { type: "warning", title: "Delete Theme" }
    );
    if (shouldDelete) {
      deleteCustomTheme(activeCustomTheme.name);
    }
  };

  const onResetThemeDataClick = async () => {
    const shouldReset = await confirm(
      "Are you sure you want to reset all theme data to the default?",
      { type: "warning", title: "Reset Theme Data" }
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
    <div className="flex flex-col flex-1 text-center gap-1 h-full">
      <h1 className="text-4xl font-bold">Theme Customizer</h1>
      <p className="text-xl -mb-2">
        Currently editing:{" "}
        {isEditing ? (
          <Input
            error={inputError}
            type="text"
            value={editedThemeName}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        ) : (
          <span className="font-bold capitalize">{activeCustomTheme.name}</span>
        )}
      </p>
      {isEditing ? (
        <div>
          <Button
            variant={"link"}
            disabled={!editedThemeName.length}
            onClick={handleThemeRename}
          >
            Save
          </Button>
          <Button
            variant={"link"}
            onClick={() => {
              setEditedThemeName(activeCustomTheme.name);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant={"link"}
          disabled={isRenameDisabled}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          Rename
        </Button>
      )}
      <div className="flex flex-row flex-1 justify-center overflow-y-auto mb-24">
        <div className="grid grid-cols-2">
          {themeVariableMap &&
            Object.entries(themeVariableMap).map(([_key, value]) => (
              <Row key={value.cssVarName} className="col-span-1 p-3 m-1 gap-0">
                <Left className="col-span-6">
                  <Label>{value.label}: </Label>
                </Left>
                <div className="col-span-5 text-right">
                  <ColorPicker
                    themeVar={value}
                    beforeChange={setCustomThemeTemp}
                    activeTheme={activeCustomTheme}
                  />
                </div>
              </Row>
            ))}
          <div className="col-span-2">
            <Button
              className="col-span-1 text-destructive"
              variant={"link"}
              onClick={onDeleteThemeClick}
              disabled={activeCustomTheme.name.toLowerCase() === "default"}
            >
              Delete Theme
            </Button>
            <Button
              className="text-destructive col-span-1"
              variant={"link"}
              onClick={onResetThemeDataClick}
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
  <p className="font-bold text-lg capitalize">{children}</p>
);
