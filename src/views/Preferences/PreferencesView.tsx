import React from "react";

import { DraggableTitleBar } from "@components/DraggableTitleBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/Tabs";
import { useAppDataStore } from "@stores/appDataStore";
import { getCurrent } from "@tauri-apps/api/window";

import { PrefsTab } from "@/types";

import { TabAbout } from "./components/tabs/TabAbout";
import { TabApps } from "./components/tabs/TabApps";
import { TabGeneral } from "./components/tabs/TabGeneral";
import { TabThemes } from "./components/tabs/TabThemes";
import { WelcomeModal } from "./components/WelcomeModal";

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
        className="h-full flex-1 flex-col"
        style={{ height: "calc(100vh - 36px)" }}
      >
        <Tabs
          className="flex h-full flex-col"
          onValueChange={(tabName) => updatePrefsTab(tabName as PrefsTab)}
          value={prefsTab}
        >
          <TabsList className="mb-6 gap-4 self-center">
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
          close={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />
      )}
    </>
  );
};
