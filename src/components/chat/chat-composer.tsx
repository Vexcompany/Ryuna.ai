"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ImageIcon,
  Mic,
  Paperclip,
  Square,
  X,
} from "lucide-react";
import type { Attachment } from "@/types";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/toast";
import { ModelSelector } from "@/components/model/model-selector";
import { useChat } from "@/lib/chat/chat-store";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { createId } from "@/lib/utils/id";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  onSend: (text: string, attachments: Attachment[]) => void;
  onStop: () => void;
  isGenerating: boolean;
  disabled?: boolean;
  variant?: "default" | "hero";
  autoFocus?: boolean;
}

const MAX_HEIGHT = 200;

export function ChatComposer({
  onSend,
  onStop,
  isGenerating,
  disabled,
  variant = "default",
  autoFocus,
}: ChatComposerProps) {
  const { settings } = useChat();
  const { toast } = useToast();
  const online = useOnlineStatus();
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend =
    value.trim().length > 0 && !isGenerating && !disabled && online;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const reset = () => {
    setValue("");
    setAttachments([]);
    const textarea = textareaRef.current;
    if (textarea) textarea.style.height = "auto";
  };

  const handleSend = () => {
    if (!canSend) return;
    onSend(value.trim(), attachments);
    reset();
    textareaRef.current?.focus();
  };

  const addMockAttachment = (kind: Attachment["kind"]) => {
    const attachment: Attachment = {
      id: createId("att"),
      kind,
      name: kind === "image" ? "diagram.png" : "brief.pdf",
      size: kind === "image" ? 248_000 : 96_000,
      mimeType: kind === "image" ? "image/png" : "application/pdf",
    };
    setAttachments((current) => [...current, attachment]);
    toast(
      kind === "image"
        ? "Image understanding is coming soon"
        : "File uploads are coming soon",
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter") return;
    if (event.nativeEvent.isComposing) return;
    const shouldSend = settings.enterToSend
      ? !event.shiftKey
      : event.metaKey || event.ctrlKey;
    if (shouldSend) {
      event.preventDefault();
      handleSend();
    }
  };

  const placeholder = online
    ? variant === "hero"
      ? "Ask anything..."
      : "Ask Ryuna..."
    : "You're offline - reconnect to continue";

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative rounded-2xl border bg-surface shadow-sm transition-all duration-150",
          focused ? "border-border-strong shadow-md" : "border-border",
          !online && "opacity-80",
        )}
      >
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-3 pt-3">
            {attachments.map((attachment) => (
              <span
                key={attachment.id}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {attachment.kind === "image" ? (
                  <ImageIcon className="size-3.5" />
                ) : (
                  <Paperclip className="size-3.5" />
                )}
                <span className="max-w-[9rem] truncate">{attachment.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${attachment.name}`}
                  onClick={() =>
                    setAttachments((current) =>
                      current.filter((item) => item.id !== attachment.id),
                    )
                  }
                  className="ml-0.5 grid size-4 place-items-center rounded-full hover:bg-surface-hover hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          aria-label="Message Ryuna"
          className={cn(
            "w-full resize-none bg-transparent px-4 text-[15px] leading-relaxed text-foreground outline-none",
            "placeholder:text-muted-foreground disabled:cursor-not-allowed",
            variant === "hero" ? "min-h-[52px] py-3.5" : "min-h-[46px] py-3",
          )}
        />

        <div className="flex items-center gap-0.5 px-2 pb-2">
          <Tooltip label="Attach file (coming soon)">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Attach file"
              onClick={() => addMockAttachment("file")}
            >
              <Paperclip />
            </Button>
          </Tooltip>
          <Tooltip label="Add image (coming soon)">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Add image"
              onClick={() => addMockAttachment("image")}
            >
              <ImageIcon />
            </Button>
          </Tooltip>
          <Tooltip label="Voice input (coming soon)">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Voice input"
              onClick={() => toast("Voice input is coming soon")}
            >
              <Mic />
            </Button>
          </Tooltip>

          <div className="ml-auto flex items-center gap-1">
            <ModelSelector />
            {isGenerating ? (
              <Tooltip label="Stop generating">
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  aria-label="Stop generating"
                  onClick={onStop}
                  className="rounded-xl"
                >
                  <Square className="fill-current" />
                </Button>
              </Tooltip>
            ) : (
              <Tooltip label={online ? "Send" : "Offline"}>
                <Button
                  type="button"
                  size="icon"
                  aria-label="Send message"
                  onClick={handleSend}
                  disabled={!canSend}
                  className="rounded-xl"
                >
                  <ArrowUp />
                </Button>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 hidden text-center text-[11px] text-muted-foreground md:block">
        {settings.enterToSend
          ? "Press Enter to send, Shift + Enter for a new line"
          : "Press Ctrl / Cmd + Enter to send"}
      </p>
    </div>
  );
}
