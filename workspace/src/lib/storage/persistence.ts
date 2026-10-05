import type { Conversation, PersistedState, Settings } from "@/types";
import { STORAGE_KEYS, hasStoredItem, readJSON, writeJSON } from "./storage";
import { DEFAULT_SETTINGS } from "./settings";
import { createSeedConversations } from "@/lib/chat/mock-data";

export const STORAGE_VERSION = 1;

function isConversation(value: unknown): value is Conversation {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    Array.isArray(candidate.messages)
  );
}

function normalizeSettings(value: unknown): Settings {
  if (!value || typeof value !== "object") return { ...DEFAULT_SETTINGS };
  return { ...DEFAULT_SETTINGS, ...(value as Partial<Settings>) };
}

export function loadPersistedState(): PersistedState {
  if (!hasStoredItem(STORAGE_KEYS.state)) {
    return {
      version: STORAGE_VERSION,
      conversations: createSeedConversations(),
      activeConversationId: null,
      settings: { ...DEFAULT_SETTINGS },
    };
  }

  const raw = readJSON<Partial<PersistedState>>(STORAGE_KEYS.state, {});
  const conversations = Array.isArray(raw.conversations)
    ? raw.conversations.filter(isConversation)
    : [];

  const activeConversationId =
    typeof raw.activeConversationId === "string" &&
    conversations.some((c) => c.id === raw.activeConversationId)
      ? raw.activeConversationId
      : null;

  return {
    version: STORAGE_VERSION,
    conversations,
    activeConversationId,
    settings: normalizeSettings(raw.settings),
  };
}

export function savePersistedState(state: PersistedState): void {
  writeJSON(STORAGE_KEYS.state, state);
}
