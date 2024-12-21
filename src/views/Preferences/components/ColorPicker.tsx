import React from "react";

import { useAppDataStore } from "@stores/appDataStore";
import { CustomTheme, ThemeVariable } from "@stores/themeDataSlice/types";
import { hslToHex } from "@utils/hsl-to-hex";
import { ColorResult, SketchPicker } from "react-color";

interface ColorPickerProps {
  //? This actually should never be null
  activeTheme: CustomTheme | null;
  beforeChange: () => void;
  themeVar: ThemeVariable;
}

export const ColorPicker = ({
  activeTheme,

  beforeChange,
  themeVar,
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localColor, setLocalColor] = React.useState(themeVar.value);

  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const updateCustomTheme = useAppDataStore((state) => state.updateCustomTheme);

  const hexColor = hslToHex(localColor);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node | null) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node | null)
        ) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const onSwatchClick = () => {
    setIsOpen((prev) => !prev);
  };

  const onColorChange = (color: ColorResult) => {
    beforeChange();
    const { h, l, s } = color.hsl;
    const newVar = { ...themeVar, value: { h, l: l * 100, s: s * 100 } };

    if (!activeTheme) {
      console.error("No active theme found.");
    } else {
      updateCustomTheme(activeTheme, [newVar]);
    }
  };

  return (
    <div className="relative">
      <button
        className="size-8 rounded-sm border border-muted-foreground"
        onClick={onSwatchClick}
        ref={buttonRef}
        style={{ background: hexColor }}
      />
      {isOpen && (
        <div className="absolute right-2.5 top-9 z-10" ref={wrapperRef}>
          <SketchPicker
            color={localColor}
            onChange={(color) => {
              beforeChange();
              setLocalColor({
                ...color.hsl,
                l: color.hsl.l * 100,
                s: color.hsl.s * 100,
              });
            }}
            onChangeComplete={onColorChange}
            styles={{
              default: {
                picker: { color: "black" },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
