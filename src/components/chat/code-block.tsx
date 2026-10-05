"use client";

import { isValidElement, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  let language = "";
  if (isValidElement(children)) {
    const childClassName =
      (children.props as { className?: string }).className ?? "";
    const match = /language-([\w-]+)/.exec(childClassName);
    if (match) language = match[1];
  }

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context).
    }
  };

  return (
    <div className="ryuna-code group my-3">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {language || "text"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Code copied" : "Copy code"}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          {copied ? (
            <Check className="size-3.5 text-success" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre ref={preRef} className={cn(className)} {...props}>
        {children}
      </pre>
    </div>
  );
}
