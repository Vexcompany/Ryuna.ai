"use client";

import { Menu, MoreVertical, Plus, Search, Settings } from "lucide-react";
import { RyunaMark } from "@/components/brand/ryuna-logo";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/lib/chat/chat-store";

export function MobileSidebar({
  open,
  onOpenChange,
  onOpenSettings,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSettings: () => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" aria-describedby={undefined}>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Sidebar
          onOpenSettings={onOpenSettings}
          onNavigate={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}

export function MobileHeader({
  onOpenSidebar,
  onOpenSettings,
}: {
  onOpenSidebar: () => void;
  onOpenSettings: () => void;
}) {
  const { newChat } = useChat();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-1 border-b border-border bg-background/85 px-2 py-1.5 backdrop-blur md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open navigation menu"
        onClick={onOpenSidebar}
      >
        <Menu />
      </Button>

      <div className="flex flex-1 items-center justify-center gap-1.5">
        <RyunaMark className="size-4 text-primary" />
        <span className="text-sm font-semibold tracking-tight">Ryuna</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="More options">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onSelect={newChat}>
            <Plus />
            New chat
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onOpenSidebar}>
            <Search />
            Search chats
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onOpenSettings}>
            <Settings />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
