import React from 'react';
import { getCurrent } from '@tauri-apps/api/window';
import { WelcomeModal } from './components/WelcomeModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { DraggableTitleBar } from '@components/DraggableTitleBar';
import { TabGeneral } from './components/tabs/TabGeneral';
import { TabApps } from './components/tabs/TabApps';
import { TabAbout } from './components/tabs/TabAbout';
import { useAppDataStore } from '@stores/appDataStore';
import { TabThemes } from './components/tabs/TabThemes';

export const PreferencesView = ({ newUser }: { newUser?: boolean }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(!!newUser);

  const prefsTab = useAppDataStore((state) => state.prefsTab);
  const updatePrefsTab = useAppDataStore((state) => state.updatePrefsTab);

  React.useEffect(() => {
    //* Supposed workaround to the flashing white screen on load
    getCurrent().show();
    getCurrent().setFocus();
  }, []);

  return (
    <>
      <DraggableTitleBar height={36} />
      <div
        className="flex-col flex-1 h-full"
        style={{ height: 'calc(100vh - 36px)' }}
      >
        <Tabs
          value={prefsTab}
          onValueChange={(tabName) => updatePrefsTab(tabName as PrefsTab)}
          className="flex flex-col h-full"
        >
          <TabsList className="self-center mb-6 gap-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="apps">Apps</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <TabGeneral setIsModalOpen={() => setIsModalOpen(true)} />
          </TabsContent>
          <TabsContent value="apps">
            <TabApps />
          </TabsContent>
          <TabsContent value="theme">
            <TabThemes />
          </TabsContent>
          <TabsContent value="about">
            <TabAbout />
          </TabsContent>
        </Tabs>
      </div>
      {isModalOpen && (
        <WelcomeModal
          isOpen={isModalOpen}
          close={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};
