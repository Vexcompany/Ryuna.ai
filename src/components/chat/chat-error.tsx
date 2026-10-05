"use client";

import { RotateCcw, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatErrorProps {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
  isRetrying?: boolean;
}

export function ChatError({
  message,
  onRetry,
  onDismiss,
  isRetrying,
}: ChatErrorProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive-soft p-3.5"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">
          Ryuna hit a snag
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>
        <div className="mt-2.5 flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={onRetry}
            disabled={isRetrying}
          >
            <RotateCcw />
            Retry
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
        </div>
      </div>
      <button
        type="button"
        aria-label="Dismiss error"
        onClick={onDismiss}
        className="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
}
