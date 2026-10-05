/**
 * Core domain types for Ryuna AI.
 *
 * These intentionally model more than the current frontend-only milestone
 * needs (attachments, capabilities, providers) so that real integrations can
 * be dropped in later without reshaping the UI.
 */

export type ThemePreference = "system" | "light" | "dark";

export type ResponseStyle = "concise" | "balanced" | "detailed" | "creative";

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "complete" | "streaming" | "error";

export type AttachmentKind = "image" | "file" | "audio";

export interface Attachment {
  id: string;
  kind: AttachmentKind;
  name: string;
  size?: number;
  mimeType?: string;
  /** Object/remote URL once real uploads are wired up. */
  url?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: number;
  status: MessageStatus;
  /** Model that produced the message (assistant messages only). */
  modelId?: string;
  attachments?: Attachment[];
  /** Populated when `status` is `error`. */
  error?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  modelId: string;
  pinned?: boolean;
}

export type ConversationGroupId =
  | "today"
  | "yesterday"
  | "previous7Days"
  | "older";

export interface ConversationGroup {
  id: ConversationGroupId;
  label: string;
  conversations: Conversation[];
}

export type ModelCapability =
  | "vision"
  | "web-search"
  | "reasoning"
  | "image-generation"
  | "tools";

export interface AIModel {
  id: string;
  name: string;
  providerId: string;
  description?: string;
  contextWindow?: number;
  capabilities?: ModelCapability[];
  /** Marks models that are not yet available in this milestone. */
  available?: boolean;
}

/**
 * Future-facing provider contract. Real providers (OpenAI-compatible,
 * OpenRouter, Gemini, Anthropic, custom endpoints) will implement this.
 */
export interface AIProvider {
  id: string;
  name: string;
  models: AIModel[];
}

export interface Settings {
  enterToSend: boolean;
  showTimestamps: boolean;
  autoScroll: boolean;
  defaultModelId: string;
  responseStyle: ResponseStyle;
  compactMode: boolean;
  animations: boolean;
}

export interface PersistedState {
  version: number;
  conversations: Conversation[];
  activeConversationId: string | null;
  settings: Settings;
}
