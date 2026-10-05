"use client";

import { useState } from "react";
import { Plus, Settings } from "lucide-react";
import { RyunaLogo } from "@/components/brand/ryuna-logo";
import { ConversationList } from "@/components/sidebar/conversation-list";
import { SidebarSearch } from "@/components/sidebar/sidebar-search";
import { Button } from "@/components/ui/button";
import { useChat } from "@/lib/chat/chat-store";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onOpenSettings: () => void;
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({
  onOpenSettings,
  onNavigate,
  className,
}: SidebarProps) {
  const {
    conversations,
    activeConversationId,
    newChat,
    selectConversation,
    renameConversation,
    deleteConversation,
    togglePin,
  } = useChat();
  const [query, setQuery] = useState("");

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-surface",
        className,
      )}
    >
      <div className="flex items-center justify-between px-3 pb-1 pt-3">
        <RyunaLogo />
      </div>

      <div className="flex flex-col gap-2 px-3 py-2">
        <Button
          variant="secondary"
          className="w-full justify-start gap-2 border-border-strong"
          onClick={() => {
            newChat();
            onNavigate?.();
          }}
        >
          <Plus className="size-4" />
          New chat
        </Button>
        <SidebarSearch value={query} onChange={setQuery} />
      </div>

      <nav
        aria-label="Conversations"
        className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin px-2 py-2"
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          query={query}
          onSelect={(id) => {
            selectConversation(id);
            onNavigate?.();
          }}
          onRename={renameConversation}
          onDelete={deleteConversation}
          onTogglePin={togglePin}
        />
      </nav>

      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 text-muted-foreground"
          onClick={() => {
            onOpenSettings();
            onNavigate?.();
          }}
        >
          <Settings className="size-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}
