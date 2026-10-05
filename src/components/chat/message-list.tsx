"use client";

import type { ChatMessage, Conversation } from "@/types";
import { AssistantMessage } from "@/components/chat/assistant-message";
import { UserMessage } from "@/components/chat/user-message";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { ChatError } from "@/components/chat/chat-error";

interface MessageListProps {
  conversation: Conversation;
  showTimestamps: boolean;
  isGenerating: boolean;
  errorMessage?: string;
  onRegenerate: (messageId?: string) => void;
  onEdit: (messageId: string, content: string) => void;
  onRetry: () => void;
  onDismissError: () => void;
}

export function MessageList({
  conversation,
  showTimestamps,
  isGenerating,
  errorMessage,
  onRegenerate,
  onEdit,
  onRetry,
  onDismissError,
}: MessageListProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  const showTyping =
    isGenerating && (!lastMessage || lastMessage.role === "user");

  return (
    <div className="flex flex-col gap-6">
      {conversation.messages.map((message: ChatMessage) =>
        message.role === "user" ? (
          <UserMessage
            key={message.id}
            message={message}
            showTimestamps={showTimestamps}
            onEdit={(content) => onEdit(message.id, content)}
            disabled={isGenerating}
          />
        ) : (
          <AssistantMessage
            key={message.id}
            message={message}
            showTimestamps={showTimestamps}
            onRegenerate={() => onRegenerate(message.id)}
            disabled={isGenerating}
          />
        ),
      )}

      {showTyping && <TypingIndicator />}

      {errorMessage && (
        <ChatError
          message={errorMessage}
          onRetry={onRetry}
          onDismiss={onDismissError}
          isRetrying={isGenerating}
        />
      )}
    </div>
  );
}
