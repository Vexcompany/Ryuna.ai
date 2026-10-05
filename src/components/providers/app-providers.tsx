"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";
import { ChatProvider, useChat } from "@/lib/chat/chat-store";

function SettingsEffects() {
  const { settings } = useChat();

  useEffect(() => {
    document.documentElement.classList.toggle(
      "reduce-motion",
      !settings.animations,
    );
  }, [settings.animations]);

  useEffect(() => {
    document.documentElement.dataset.compact = settings.compactMode
      ? "true"
      : "false";
  }, [settings.compactMode]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ChatProvider>
        <TooltipProvider delayDuration={300}>
          <ToastProvider>
            <SettingsEffects />
            {children}
          </ToastProvider>
        </TooltipProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}
