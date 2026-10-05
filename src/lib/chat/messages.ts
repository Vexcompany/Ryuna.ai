import type { Attachment, ChatMessage, Conversation } from "@/types";
import { createId } from "@/lib/utils/id";

export function createUserMessage(
  content: string,
  attachments?: Attachment[],
): ChatMessage {
  return {
    id: createId("msg"),
    role: "user",
    content,
    createdAt: Date.now(),
    status: "complete",
    attachments: attachments?.length ? attachments : undefined,
  };
}

export function createAssistantMessage(
  content: string,
  modelId: string,
): ChatMessage {
  return {
    id: createId("msg"),
    role: "assistant",
    content,
    createdAt: Date.now(),
    status: "complete",
    modelId,
  };
}

export function createConversation(modelId: string): Conversation {
  const now = Date.now();
  return {
    id: createId("conv"),
    title: "New chat",
    messages: [],
    createdAt: now,
    updatedAt: now,
    modelId,
  };
}
