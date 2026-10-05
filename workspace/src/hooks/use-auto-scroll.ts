"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAutoScroll<T extends HTMLElement>(
  trigger: unknown,
  enabled: boolean,
) {
  const ref = useRef<T>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    const distance =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    setIsAtBottom(distance < 96);
  }, []);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const element = ref.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior });
    setIsAtBottom(true);
  }, []);

  useEffect(() => {
    if (!enabled || !isAtBottom) return;
    const element = ref.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    // `trigger` is intentionally the only reactive dependency.
  }, [trigger, enabled, isAtBottom]);

  return { ref, isAtBottom, scrollToBottom, handleScroll };
}
