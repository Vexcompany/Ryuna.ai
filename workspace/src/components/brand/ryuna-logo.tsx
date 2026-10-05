import { cn } from "@/lib/utils";

export function RyunaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      <path
        d="M12 1.8c.55 5.5 2.95 7.9 8.45 8.45-5.5.55-7.9 2.95-8.45 8.45-.55-5.5-2.95-7.9-8.45-8.45C9.05 9.7 11.45 7.3 12 1.8Z"
        fill="currentColor"
      />
      <path
        d="M18.6 15.2c.22 2.2 1.18 3.16 3.38 3.38-2.2.22-3.16 1.18-3.38 3.38-.22-2.2-1.18-3.16-3.38-3.38 2.2-.22 3.16-1.18 3.38-3.38Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

export function RyunaLogo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <RyunaMark className="size-[18px]" />
      </span>
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          Ryuna
        </span>
      )}
    </span>
  );
}
