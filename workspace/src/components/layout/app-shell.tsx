"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import {
  MobileHeader,
  MobileSidebar,
} from "@/components/layout/mobile-header";
import { ChatContainer } from "@/components/chat/chat-container";
import { SettingsDialog } from "@/components/settings/settings-dialog";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <aside className="hidden w-[var(--sidebar-width)] shrink-0 border-r border-border md:flex">
        <Sidebar
          onOpenSettings={() => setSettingsOpen(true)}
          className="w-full"
        />
      </aside>

      <MobileSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <ChatContainer />
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
