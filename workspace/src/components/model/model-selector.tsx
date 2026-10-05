"use client";

import { Check, ChevronDown, Sparkles } from "lucide-react";
import { AI_PROVIDERS, getModelById } from "@/lib/chat/providers";
import { useChat } from "@/lib/chat/chat-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function ModelSelector({
  className,
  compact = true,
  mode = "active",
}: {
  className?: string;
  compact?: boolean;
  mode?: "active" | "default";
}) {
  const { activeConversation, settings, setModel, updateSettings } = useChat();
  const currentId =
    mode === "default"
      ? settings.defaultModelId
      : (activeConversation?.modelId ?? settings.defaultModelId);
  const current = getModelById(currentId);

  const handleSelect = (modelId: string) => {
    if (mode === "default") {
      updateSettings({ defaultModelId: modelId });
    } else {
      setModel(modelId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Current model: ${current?.name ?? "Ryuna"}. Change model`}
          className={cn(
            "inline-flex h-8 max-w-[9.5rem] items-center gap-1.5 rounded-lg px-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <Sparkles className="size-3.5 shrink-0 text-primary" />
          <span className="truncate">{current?.name ?? "Ryuna"}</span>
          {!compact && <span className="sr-only">model</span>}
          <ChevronDown className="size-3 shrink-0 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="max-h-[60vh] w-64 overflow-y-auto scrollbar-thin"
      >
        {AI_PROVIDERS.map((provider, index) => (
          <div key={provider.id}>
            {index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
            {provider.models.map((model) => {
              const selected = model.id === currentId;
              return (
                <DropdownMenuItem
                  key={model.id}
                  onSelect={() => handleSelect(model.id)}
                  className="items-start gap-2"
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="flex items-center gap-2 font-medium">
                      {model.name}
                      {!model.available && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </span>
                    {model.description && (
                      <span className="truncate text-xs text-muted-foreground">
                        {model.description}
                      </span>
                    )}
                  </div>
                  {selected && (
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
