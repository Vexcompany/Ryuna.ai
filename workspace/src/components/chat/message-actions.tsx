"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import type { MessageRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  role: MessageRole;
  content: string;
  onRegenerate?: () => void;
  onEdit?: () => void;
  className?: string;
  disabled?: boolean;
}

export function MessageActions({
  role,
  content,
  onRegenerate,
  onEdit,
  className,
  disabled,
}: MessageActionsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Couldn't access the clipboard");
    }
  };

  const handleFeedback = (value: "like" | "dislike") => {
    const next = feedback === value ? null : value;
    setFeedback(next);
    if (next) {
      toast(next === "like" ? "Thanks for the feedback" : "We'll do better next time");
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 transition-opacity duration-150",
        "opacity-100 md:opacity-0 md:group-hover/message:opacity-100 md:group-focus-within/message:opacity-100",
        className,
      )}
    >
      {role === "user" && onEdit && (
        <Tooltip label="Edit">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Edit message"
            onClick={onEdit}
            disabled={disabled}
          >
            <Pencil />
          </Button>
        </Tooltip>
      )}

      <Tooltip label={copied ? "Copied" : "Copy"}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Copy message"
          onClick={handleCopy}
          disabled={disabled}
        >
          {copied ? <Check className="text-success" /> : <Copy />}
        </Button>
      </Tooltip>

      {role === "assistant" && (
        <>
          {onRegenerate && (
            <Tooltip label="Regenerate">
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Regenerate response"
                onClick={onRegenerate}
                disabled={disabled}
              >
                <RefreshCw />
              </Button>
            </Tooltip>
          )}

          <Tooltip label="Good response">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Like response"
              aria-pressed={feedback === "like"}
              onClick={() => handleFeedback("like")}
              disabled={disabled}
              className={cn(feedback === "like" && "text-primary")}
            >
              <ThumbsUp />
            </Button>
          </Tooltip>

          <Tooltip label="Bad response">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Dislike response"
              aria-pressed={feedback === "dislike"}
              onClick={() => handleFeedback("dislike")}
              disabled={disabled}
              className={cn(feedback === "dislike" && "text-destructive")}
            >
              <ThumbsDown />
            </Button>
          </Tooltip>

          <DropdownMenu>
            <Tooltip label="More">
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="More actions"
                  disabled={disabled}
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
            </Tooltip>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={handleCopy}>
                <Copy />
                Copy
              </DropdownMenuItem>
              {onRegenerate && (
                <DropdownMenuItem onSelect={onRegenerate}>
                  <RefreshCw />
                  Regenerate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => toast("Coming soon")}>
                <MoreHorizontal />
                Report response
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
