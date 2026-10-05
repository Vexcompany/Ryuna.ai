"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, ImageIcon } from "lucide-react";
import type { ChatMessage } from "@/types";
import { MessageActions } from "@/components/chat/message-actions";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface UserMessageProps {
  message: ChatMessage;
  showTimestamps: boolean;
  onEdit: (content: string) => void;
  disabled?: boolean;
}

export function UserMessage({
  message,
  showTimestamps,
  onEdit,
  disabled,
}: UserMessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      }
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setIsEditing(false);
    if (trimmed !== message.content) {
      onEdit(trimmed);
    }
  };

  return (
    <div className="group/message flex flex-col items-end gap-1.5">
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex max-w-[85%] flex-wrap justify-end gap-2">
          {message.attachments.map((attachment) => (
            <span
              key={attachment.id}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-muted-foreground"
            >
              {attachment.kind === "image" ? (
                <ImageIcon className="size-3.5" />
              ) : (
                <FileText className="size-3.5" />
              )}
              <span className="max-w-[10rem] truncate">{attachment.name}</span>
            </span>
          ))}
        </div>
      )}

      {isEditing ? (
        <div className="w-full max-w-[85%] rounded-2xl border border-border bg-surface p-2 shadow-sm">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              event.target.style.height = "auto";
              event.target.style.height = `${Math.min(
                event.target.scrollHeight,
                200,
              )}px`;
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                setIsEditing(false);
                setDraft(message.content);
              }
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSave();
              }
            }}
            rows={1}
            aria-label="Edit message"
            className="w-full resize-none rounded-lg bg-transparent px-2 py-1.5 text-sm leading-relaxed text-foreground outline-none"
          />
          <div className="mt-1 flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setDraft(message.content);
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!draft.trim()}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "max-w-[85%] rounded-2xl rounded-br-md bg-muted px-4 py-2.5 text-sm leading-relaxed text-foreground",
            "whitespace-pre-wrap break-words",
          )}
        >
          {message.content}
        </div>
      )}

      {!isEditing && (
        <div className="flex items-center gap-2 pl-1">
          {showTimestamps && (
            <span className="text-[11px] text-muted-foreground">
              {formatTimestamp(message.createdAt)}
            </span>
          )}
          <MessageActions
            role="user"
            content={message.content}
            onEdit={() => setIsEditing(true)}
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
}
