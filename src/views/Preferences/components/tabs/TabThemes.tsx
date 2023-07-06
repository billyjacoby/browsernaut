import React from 'react';
import { Left, Right, Row } from '@components/ui/Layout';
import { ColorPicker } from '../ColorPicker';
import { HSLColor } from 'react-color';

const themeItems: { label: string; value: HSLColor; cssVarName: string }[] = [
  {
    label: 'Background',
    value: { h: 0, s: 0, l: 100 },
    cssVarName: '--background',
  },
  {
    label: 'Foreground',
    value: { h: 222.2, s: 47.4, l: 11.2 },
    cssVarName: '--foreground',
  },
];

export const TabThemes = (): JSX.Element => {
  return (
    <div className="flex flex-col flex-1 text-center gap-1 h-full">
      <h1 className="text-4xl font-bold">Theme Customizer</h1>
      <p className="text-xl mb-4">Build your own Browsernaut theme:</p>
      <div className="flex flex-row flex-1 justify-center">
        <div className="flex flex-col gap-8">
          {themeItems.map((color) => (
            <Row key={color.cssVarName}>
              <Left>
                <Label>{color.label}: </Label>
              </Left>
              <Right colSpan={8}>
                <ColorPicker color={color.value} />
              </Right>
            </Row>
          ))}
        </div>
      </div>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-bold text-lg">{children}</p>
);
