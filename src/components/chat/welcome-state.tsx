"use client";

import {
  ImageIcon,
  Lightbulb,
  Mail,
  Plane,
  type LucideIcon,
} from "lucide-react";
import { RyunaMark } from "@/components/brand/ryuna-logo";
import { cn } from "@/lib/utils";

interface Suggestion {
  icon: LucideIcon;
  label: string;
  prompt: string;
}

const SUGGESTIONS: Suggestion[] = [
  {
    icon: Lightbulb,
    label: "Explain quantum computing",
    prompt: "Explain quantum computing in a way that's easy to understand.",
  },
  {
    icon: Mail,
    label: "Help me write an email",
    prompt: "Help me write a short, friendly email to reschedule a meeting.",
  },
  {
    icon: ImageIcon,
    label: "Analyze this image",
    prompt: "What should I keep in mind when asking Ryuna to analyze an image?",
  },
  {
    icon: Plane,
    label: "Plan a weekend trip",
    prompt: "Plan a relaxed 2-day weekend trip focused on food and walking.",
  },
];

export function WelcomeHero({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={cn(
          "grid place-items-center rounded-2xl bg-primary-soft text-primary-soft-foreground",
          compact ? "size-12" : "size-14",
        )}
      >
        <RyunaMark className={compact ? "size-6" : "size-7"} />
      </div>
      <h1
        className={cn(
          "mt-5 font-semibold tracking-tight text-foreground",
          compact ? "text-xl" : "text-2xl",
        )}
      >
        Ryuna
      </h1>
      <p className="mt-1.5 text-[15px] text-muted-foreground">
        What can I help you with?
      </p>
    </div>
  );
}

export function SuggestionChips({
  onPick,
  disabled,
}: {
  onPick: (prompt: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map(({ icon: Icon, label, prompt }) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          onClick={() => onPick(prompt)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-[13px] font-medium text-muted-foreground",
            "transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-foreground",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          <Icon className="size-3.5 text-primary" />
          {label}
        </button>
      ))}
    </div>
  );
}
