"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import type { ResponseStyle, ThemePreference } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ModelSelector } from "@/components/model/model-selector";
import { useChat } from "@/lib/chat/chat-store";
import { useToast } from "@/components/ui/toast";

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="mt-1 divide-y divide-border">{children}</div>
    </section>
  );
}

function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const THEME_OPTIONS = [
  { value: "system" as const, label: "System", icon: Monitor },
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
];

const RESPONSE_STYLE_OPTIONS: {
  value: ResponseStyle;
  label: string;
}[] = [
  { value: "concise", label: "Concise" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
  { value: "creative", label: "Creative" },
];

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { settings, updateSettings, clearAllConversations } = useChat();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [confirmClear, setConfirmClear] = useState(false);

  const themeValue = (theme ?? "system") as ThemePreference;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl p-0" showClose={false}>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Preferences are stored locally on this device.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[62vh] overflow-y-auto overscroll-contain scrollbar-thin px-5 pb-2">
            <div className="flex flex-col gap-7 pb-2">
              <SettingsSection title="General">
                <SettingsRow
                  label="Theme"
                  description="Choose light, dark, or match your system."
                >
                  <SegmentedControl
                    ariaLabel="Theme"
                    value={themeValue}
                    onChange={(value) => setTheme(value)}
                    options={THEME_OPTIONS}
                  />
                </SettingsRow>
              </SettingsSection>

              <SettingsSection title="Chat">
                <SettingsRow
                  label="Enter to send"
                  description="Use Shift + Enter for a new line."
                >
                  <Switch
                    checked={settings.enterToSend}
                    onCheckedChange={(checked) =>
                      updateSettings({ enterToSend: checked })
                    }
                    aria-label="Enter to send"
                  />
                </SettingsRow>
                <SettingsRow
                  label="Show timestamps"
                  description="Display the time next to each message."
                >
                  <Switch
                    checked={settings.showTimestamps}
                    onCheckedChange={(checked) =>
                      updateSettings({ showTimestamps: checked })
                    }
                    aria-label="Show timestamps"
                  />
                </SettingsRow>
                <SettingsRow
                  label="Auto-scroll"
                  description="Follow new messages as they arrive."
                >
                  <Switch
                    checked={settings.autoScroll}
                    onCheckedChange={(checked) =>
                      updateSettings({ autoScroll: checked })
                    }
                    aria-label="Auto-scroll"
                  />
                </SettingsRow>
              </SettingsSection>

              <SettingsSection title="AI">
                <SettingsRow
                  label="Default model"
                  description="Used for new conversations."
                >
                  <ModelSelector mode="default" />
                </SettingsRow>
                <SettingsRow
                  label="Response style"
                  description="Adjust how detailed Ryuna's replies are."
                >
                  <SegmentedControl
                    ariaLabel="Response style"
                    value={settings.responseStyle}
                    onChange={(value) =>
                      updateSettings({ responseStyle: value })
                    }
                    options={RESPONSE_STYLE_OPTIONS}
                  />
                </SettingsRow>
              </SettingsSection>

              <SettingsSection title="Interface">
                <SettingsRow
                  label="Compact mode"
                  description="Tighter spacing throughout the interface."
                >
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) =>
                      updateSettings({ compactMode: checked })
                    }
                    aria-label="Compact mode"
                  />
                </SettingsRow>
                <SettingsRow
                  label="Animations"
                  description="Subtle motion and transitions."
                >
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(checked) =>
                      updateSettings({ animations: checked })
                    }
                    aria-label="Animations"
                  />
                </SettingsRow>
              </SettingsSection>

              <SettingsSection title="Data">
                <SettingsRow
                  label="Clear all conversations"
                  description="Remove every conversation saved on this device."
                >
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setConfirmClear(true)}
                  >
                    Clear
                  </Button>
                </SettingsRow>
              </SettingsSection>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Done</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Clear all conversations?</DialogTitle>
            <DialogDescription>
              This permanently removes every conversation from this device.
              This action can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearAllConversations();
                setConfirmClear(false);
                toast("All conversations cleared");
              }}
            >
              Clear everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
