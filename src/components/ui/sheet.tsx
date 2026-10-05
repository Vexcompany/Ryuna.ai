"use client";

import { forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetContent = forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "left" | "right";
  }
>(({ className, children, side = "left", ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[1px] data-[state=open]:animate-fade-in-fast" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 z-50 flex w-[86%] max-w-[19rem] flex-col bg-surface shadow-2xl outline-none",
        side === "left"
          ? "left-0 border-r border-border data-[state=open]:animate-slide-in-right"
          : "right-0 border-l border-border",
        className,
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = "SheetContent";

const SheetTitle = DialogPrimitive.Title;

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetTitle };
