"use client";

import { NotificationSection, SettingsMain } from "@/lib/ui/screen-components/protected/profile/settings";

  export default function SettingsScreen() {
    return (
      <div className="flex flex-col space-y-10 my-10">
      <SettingsMain/>
      <NotificationSection/>
      </div>
    );
  }