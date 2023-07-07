import React from 'react';
import { Left, Right, Row } from '@components/ui/Layout';
import { ColorPicker } from '../ColorPicker';
import { useAppDataStore } from '@stores/appDataStore';

export const TabThemes = (): JSX.Element => {
  const themeVariableMap = useAppDataStore((state) => state.themeVariableMap);

  return (
    <div className="flex flex-col flex-1 text-center gap-1 h-full">
      <h1 className="text-4xl font-bold">Theme Customizer</h1>
      <p className="text-xl mb-4">Build your own Browsernaut theme:</p>
      <div className="flex flex-row flex-1 justify-center overflow-y-auto mb-24">
        <div className="flex flex-col gap-8 ">
          {themeVariableMap &&
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(themeVariableMap).map(([_key, value]) => (
              <Row key={value.cssVarName}>
                <Left className="col-span-6">
                  <Label>{value.label}: </Label>
                </Left>
                <Right className="col-span-5">
                  <ColorPicker color={value.value} />
                </Right>
              </Row>
            ))}
        </div>
      </div>
    </div>
  );
};

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-bold text-lg capitalize">{children}</p>
);
