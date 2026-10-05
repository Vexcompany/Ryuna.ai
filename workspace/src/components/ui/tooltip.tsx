"use client";

import { forwardRef } from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-[16rem] rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-foreground shadow-lg",
        "data-[state=delayed-open]:animate-fade-in-fast",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = "TooltipContent";

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
}

function Tooltip({
  label,
  children,
  side = "top",
  align = "center",
  delayDuration = 300,
}: TooltipProps) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        {label}
      </TooltipContent>
    </TooltipRoot>
  );
}

export { Tooltip, TooltipProvider, TooltipRoot, TooltipTrigger, TooltipContent };
