"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Pin,
  PinOff,
  Trash2,
} from "lucide-react";
import type { Conversation } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onDelete,
  onTogglePin,
}: ConversationItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draft, setDraft] = useState(conversation.title);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = draft.trim();
    setIsRenaming(false);
    if (trimmed && trimmed !== conversation.title) {
      onRename(trimmed);
    } else {
      setDraft(conversation.title);
    }
  };

  if (isRenaming) {
    return (
      <div className="px-1">
        <input
          ref={inputRef}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitRename}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitRename();
            }
            if (event.key === "Escape") {
              setDraft(conversation.title);
              setIsRenaming(false);
            }
          }}
          aria-label="Rename conversation"
          className="h-9 w-full rounded-lg border border-primary bg-surface px-2.5 text-sm text-foreground outline-none ring-2 ring-ring/20"
        />
      </div>
    );
  }

  return (
    <div className="group/item relative">
      <button
        type="button"
        onClick={onSelect}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-lg pl-2.5 pr-9 text-left text-sm transition-colors",
          isActive
            ? "bg-surface-active font-medium text-foreground"
            : "text-muted-foreground hover:bg-surface-hover hover:text-foreground",
        )}
      >
        {conversation.pinned && (
          <Pin className="size-3.5 shrink-0 text-primary" />
        )}
        <span className="truncate">{conversation.title}</span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Options for ${conversation.title}`}
            className={cn(
              "absolute right-1 top-1 grid size-7 place-items-center rounded-md text-muted-foreground transition-all",
              "hover:bg-surface-active hover:text-foreground focus-visible:opacity-100",
              "opacity-100 md:opacity-0 md:group-hover/item:opacity-100 md:group-focus-within/item:opacity-100",
              isActive && "md:opacity-100",
            )}
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onSelect={() => {
              setDraft(conversation.title);
              setIsRenaming(true);
            }}
          >
            <Pencil />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onTogglePin}>
            {conversation.pinned ? <PinOff /> : <Pin />}
            {conversation.pinned ? "Unpin" : "Pin"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            destructive
            onSelect={() => setConfirmOpen(true)}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete conversation?</DialogTitle>
            <DialogDescription>
              &ldquo;{conversation.title}&rdquo; will be removed from this
              device. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onDelete();
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
