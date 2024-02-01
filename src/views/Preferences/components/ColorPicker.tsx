import React from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { hslToHex } from '@utils/hsl-to-hex';

import { useAppDataStore } from '@stores/appDataStore';

interface ColorPickerProps {
  themeVar: ThemeVariable;
  beforeChange: () => void;
  //? This actually should never be null
  activeTheme: CustomTheme | null;
}

export const ColorPicker = ({
  themeVar,

  beforeChange,
  activeTheme,
}: ColorPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localColor, setLocalColor] = React.useState(themeVar.value);

  const wrapperRef = React.useRef<null | HTMLDivElement>(null);
  const buttonRef = React.useRef<null | HTMLButtonElement>(null);

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
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const onSwatchClick = () => {
    setIsOpen((prev) => !prev);
  };

  const onColorChange = (color: ColorResult) => {
    beforeChange();
    const { h, s, l } = color.hsl;
    const newVar = { ...themeVar, value: { h, s: s * 100, l: l * 100 } };

    if (!activeTheme) {
      console.error('No active theme found.');
    } else {
      updateCustomTheme(activeTheme, [newVar]);
    }
  };

  return (
    <div className="relative">
      <button
        className="h-8 w-8 rounded-sm border border-muted-foreground"
        style={{ background: hexColor }}
        onClick={onSwatchClick}
        ref={buttonRef}
      />
      {isOpen && (
        <div ref={wrapperRef} className="absolute z-10 right-2.5 top-9">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment -- React type error*/}
          {/* @ts-expect-error */}
          <SketchPicker
            onChangeComplete={onColorChange}
            color={localColor}
            styles={{
              default: {
                picker: { color: 'black' },
              },
            }}
            onChange={(color) => {
              beforeChange();
              setLocalColor({
                ...color.hsl,
                s: color.hsl.s * 100,
                l: color.hsl.l * 100,
              });
            }}
          />
        </div>
      )}
    </div>
  );
};
