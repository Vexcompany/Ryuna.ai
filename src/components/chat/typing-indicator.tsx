"use client";

import { RyunaMark } from "@/components/brand/ryuna-logo";

export function TypingIndicator({ label = "Ryuna is thinking" }: { label?: string }) {
  return (
    <div className="flex gap-3" role="status" aria-live="polite">
      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary-soft-foreground">
        <RyunaMark className="size-3.5 animate-breathe" />
      </div>
      <div className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
        <span>{label}</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="thinking-dot size-1.5 rounded-full bg-muted-foreground"
              style={{ animationDelay: `${index * 0.16}s` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
