"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import type { ChatMessage } from "@/types";
import { RyunaMark } from "@/components/brand/ryuna-logo";
import { MarkdownMessage } from "@/components/chat/markdown-message";
import { MessageActions } from "@/components/chat/message-actions";
import { getModelDisplayName } from "@/lib/chat/providers";
import { formatTimestamp } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface AssistantMessageProps {
  message: ChatMessage;
  showTimestamps: boolean;
  onRegenerate: () => void;
  disabled?: boolean;
}

export function AssistantMessage({
  message,
  showTimestamps,
  onRegenerate,
  disabled,
}: AssistantMessageProps) {
  const isError = message.status === "error";

  return (
    <div className="group/message flex gap-3">
      <div
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg",
          isError
            ? "bg-destructive-soft text-destructive"
            : "bg-primary-soft text-primary-soft-foreground",
        )}
      >
        {isError ? (
          <TriangleAlert className="size-3.5" />
        ) : (
          <RyunaMark className="size-3.5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Ryuna</span>
          {message.modelId && !isError && (
            <span className="truncate">{getModelDisplayName(message.modelId)}</span>
          )}
          {showTimestamps && (
            <span className="ml-auto shrink-0">
              {formatTimestamp(message.createdAt)}
            </span>
          )}
        </div>

        {isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive-soft px-4 py-3 text-sm text-foreground">
            <p>{message.content}</p>
            <button
              type="button"
              onClick={onRegenerate}
              disabled={disabled}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-destructive hover:underline disabled:opacity-50"
            >
              <RotateCcw className="size-3.5" />
              Try again
            </button>
          </div>
        ) : (
          <MarkdownMessage content={message.content} />
        )}

        {!isError && (
          <div className="mt-1.5">
            <MessageActions
              role="assistant"
              content={message.content}
              onRegenerate={onRegenerate}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
