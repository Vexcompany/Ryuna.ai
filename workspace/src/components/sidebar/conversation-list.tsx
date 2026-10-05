"use client";

import { MessageSquareDashed, SearchX } from "lucide-react";
import type { Conversation } from "@/types";
import { ConversationItem } from "@/components/sidebar/conversation-item";
import { groupConversations } from "@/lib/utils/date";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  query: string;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeConversationId,
  query,
  onSelect,
  onRename,
  onDelete,
  onTogglePin,
}: ConversationListProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = normalizedQuery
    ? conversations.filter((conversation) =>
        conversation.title.toLowerCase().includes(normalizedQuery),
      )
    : conversations;

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <MessageSquareDashed className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          No conversations yet
        </p>
        <p className="text-xs text-muted-foreground">
          Start a new chat to see it here.
        </p>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <SearchX className="size-5 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No matches</p>
        <p className="text-xs text-muted-foreground">
          Try a different search term.
        </p>
      </div>
    );
  }

  const groups = groupConversations(filtered);

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group) => (
        <div key={group.id} className="flex flex-col gap-0.5">
          <h3 className="px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {group.label}
          </h3>
          {group.conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === activeConversationId}
              onSelect={() => onSelect(conversation.id)}
              onRename={(title) => onRename(conversation.id, title)}
              onDelete={() => onDelete(conversation.id)}
              onTogglePin={() => onTogglePin(conversation.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
