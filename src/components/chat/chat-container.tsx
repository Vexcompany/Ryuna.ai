"use client";

import { ArrowDown } from "lucide-react";
import { MessageList } from "@/components/chat/message-list";
import { ChatComposer } from "@/components/chat/chat-composer";
import {
  SuggestionChips,
  WelcomeHero,
} from "@/components/chat/welcome-state";
import { RyunaMark } from "@/components/brand/ryuna-logo";
import { Button } from "@/components/ui/button";
import { useChat } from "@/lib/chat/chat-store";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

function ChatLoading() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <RyunaMark className="size-6 animate-breathe text-primary" />
    </div>
  );
}

export function ChatContainer() {
  const {
    hydrated,
    activeConversation,
    settings,
    isGenerating,
    error,
    sendMessage,
    stopGeneration,
    regenerate,
    editUserMessage,
    retry,
    dismissError,
  } = useChat();

  const messages = activeConversation?.messages ?? [];
  const isEmpty = messages.length === 0;

  const { ref, isAtBottom, scrollToBottom, handleScroll } =
    useAutoScroll<HTMLDivElement>(
      messages.length + (isGenerating ? 1 : 0),
      settings.autoScroll,
    );

  const activeError =
    error && error.conversationId === activeConversation?.id
      ? error.message
      : undefined;

  if (!hydrated) {
    return <ChatLoading />;
  }

  const composer = (
    <ChatComposer
      onSend={sendMessage}
      onStop={stopGeneration}
      isGenerating={isGenerating}
    />
  );

  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col">
      <div
        ref={ref}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin"
      >
        {isEmpty ? (
          <div className="flex min-h-full items-center justify-center px-4 py-10">
            <div className="flex w-full max-w-2xl animate-fade-in flex-col gap-6">
              <WelcomeHero />
              {composer}
              <SuggestionChips onPick={sendMessage} disabled={isGenerating} />
            </div>
          </div>
        ) : activeConversation ? (
          <div className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6 md:py-8">
            <MessageList
              conversation={activeConversation}
              showTimestamps={settings.showTimestamps}
              isGenerating={isGenerating}
              errorMessage={activeError}
              onRegenerate={regenerate}
              onEdit={editUserMessage}
              onRetry={retry}
              onDismissError={dismissError}
            />
          </div>
        ) : null}
      </div>

      {!isEmpty && (
        <div className="shrink-0 bg-linear-to-t from-background via-background to-transparent px-3 pb-3 pt-1 safe-bottom md:px-6 md:pb-5">
          <div className="mx-auto w-full max-w-3xl">{composer}</div>
        </div>
      )}

      {!isAtBottom && !isEmpty && (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Scroll to latest message"
          onClick={() => scrollToBottom()}
          className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 rounded-full shadow-md md:bottom-32"
        >
          <ArrowDown />
        </Button>
      )}
    </div>
  );
}
