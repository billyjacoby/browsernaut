import React from 'react';
import { BlockPicker, HSLColor } from 'react-color';
import { hslToHex } from '@utils/hsl-to-hex';

interface ColorPickerProps {
  color: HSLColor;
}

export const ColorPicker = ({ color }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapperRef = React.useRef<null | HTMLDivElement>(null);

  const hexColor = hslToHex(color);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isOpen) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node | null)
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

  if (isOpen) {
    return (
      <div ref={wrapperRef}>
        <BlockPicker color={color} />
      </div>
    );
  }

  return (
    <button
      className="h-8 w-8 rounded-sm border border-muted-foreground"
      style={{ background: hexColor }}
      onClick={() => setIsOpen(true)}
    />
  );
};
