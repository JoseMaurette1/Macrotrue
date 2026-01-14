"use client";

import { InstallPrompt } from "./InstallPrompt";
import { OnlineStatus } from "./OnlineStatus";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <OnlineStatus />
      <InstallPrompt />
    </>
  );
}
