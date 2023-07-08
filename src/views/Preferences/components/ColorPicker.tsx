import React from 'react';
import { BlockPicker, ColorResult } from 'react-color';
import { hslToHex } from '@utils/hsl-to-hex';

import { useAppDataStore } from '@stores/appDataStore';
import { ThemeVariable } from '@stores/themeDataSlice';

interface ColorPickerProps {
  themeVar: ThemeVariable;
}

export const ColorPicker = ({ themeVar }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localColor, setLocalColor] = React.useState(themeVar.value);

  const wrapperRef = React.useRef<null | HTMLDivElement>(null);
  const buttonRef = React.useRef<null | HTMLButtonElement>(null);

  const setCSSVariable = useAppDataStore((state) => state.setCSSVariable);

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
    const { h, s, l } = color.hsl;
    const newVar = { ...themeVar, value: { h, s: s * 100, l: l * 100 } };

    setCSSVariable(newVar);
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
        <div ref={wrapperRef} className="absolute z-10 left-2.5 top-9">
          <BlockPicker
            onChangeComplete={onColorChange}
            triangle="hide"
            color={localColor}
            onChange={(color) =>
              setLocalColor({
                ...color.hsl,
                s: color.hsl.s * 100,
                l: color.hsl.l * 100,
              })
            }
            styles={{
              default: {
                card: {
                  borderWidth: 3,
                  borderColor: 'var(--muted-foreground)',
                  borderRadius: '6px',
                },
                triangle: {
                  width: 2,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
