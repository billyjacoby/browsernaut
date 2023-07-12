import React from 'react';
import { Left, Row } from '@components/ui/Layout';
import { ColorPicker } from '../ColorPicker';
import { useAppDataStore } from '@stores/appDataStore';

export const TabThemes = (): JSX.Element => {
  const [activeTheme, setActiveTheme] = React.useState<null | CustomTheme>(
    null
  );

  const appTheme = useAppDataStore((state) => state.appTheme);
  const setAppTheme = useAppDataStore((state) => state.setAppTheme);

  const getActiveCustomTheme = useAppDataStore(
    (state) => state.getActiveCustomTheme
  );

  const userTheme = React.useRef<null | AppTheme>(null);

  const { themeVariableMap } = getActiveCustomTheme();

  const setCustomThemeTemp = () => {
    if (!userTheme.current || appTheme === 'custom') {
      return;
    }
    setAppTheme('custom');
  };

  //? The first time a color is changed we want to update the theme to ensure it's set to custom.
  //? If we're setting it to custom then we want to change it back to the previously selected theme on unmount.

  React.useEffect(() => {
    setActiveTheme(getActiveCustomTheme());

    if (appTheme !== 'custom') {
      userTheme.current = appTheme;
      setAppTheme('custom');
    }

    return () => {
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
      <p className="text-xl mb-4">Build your own Browsernaut theme:</p>
      <div className="flex flex-row flex-1 justify-center overflow-y-auto mb-24">
        <div className="grid grid-cols-2">
          {themeVariableMap &&
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(themeVariableMap).map(([_key, value]) => (
              <Row key={value.cssVarName} className="col-span-1 p-3 m-1 gap-0">
                <Left className="col-span-6">
                  <Label>{value.label}: </Label>
                </Left>
                <div className="col-span-5 text-right">
                  <ColorPicker
                    themeVar={value}
                    beforeChange={setCustomThemeTemp}
                    activeTheme={activeTheme}
                  />
                </div>
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
