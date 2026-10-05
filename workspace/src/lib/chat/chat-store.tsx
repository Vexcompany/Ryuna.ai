"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type {
  Attachment,
  ChatMessage,
  Conversation,
  PersistedState,
  Settings,
} from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/storage/settings";
import {
  loadPersistedState,
  savePersistedState,
  STORAGE_VERSION,
} from "@/lib/storage/persistence";
import {
  createAssistantMessage,
  createConversation,
  createUserMessage,
} from "@/lib/chat/messages";
import { getMockReply } from "@/lib/chat/mock-data";
import { slugifyTitle } from "@/lib/utils/id";

interface ChatState {
  hydrated: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  settings: Settings;
  generatingConversationId: string | null;
  error: { conversationId: string; message: string; prompt: string } | null;
}

const initialState: ChatState = {
  hydrated: false,
  conversations: [],
  activeConversationId: null,
  settings: DEFAULT_SETTINGS,
  generatingConversationId: null,
  error: null,
};

type Action =
  | { type: "hydrate"; payload: PersistedState }
  | { type: "newChat" }
  | { type: "selectConversation"; id: string }
  | { type: "addConversation"; conversation: Conversation }
  | { type: "deleteConversation"; id: string }
  | { type: "renameConversation"; id: string; title: string; touch?: boolean }
  | { type: "togglePin"; id: string }
  | {
      type: "addMessage";
      conversationId: string;
      message: ChatMessage;
      titleFrom?: string;
    }
  | { type: "updateMessage"; messageId: string; patch: Partial<ChatMessage> }
  | { type: "removeMessagesFrom"; conversationId: string; messageId: string }
  | {
      type: "truncateAfter";
      conversationId: string;
      messageId: string;
      content?: string;
    }
  | { type: "setConversationModel"; conversationId: string; modelId: string }
  | { type: "updateSettings"; patch: Partial<Settings> }
  | { type: "setGenerating"; conversationId: string | null }
  | {
      type: "setError";
      conversationId: string;
      message: string;
      prompt: string;
    }
  | { type: "clearError" }
  | { type: "clearAllConversations" };

function updateConversation(
  state: ChatState,
  id: string,
  updater: (conversation: Conversation) => Conversation,
): ChatState {
  return {
    ...state,
    conversations: state.conversations.map((conversation) =>
      conversation.id === id ? updater(conversation) : conversation,
    ),
  };
}

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "hydrate":
      return {
        ...state,
        hydrated: true,
        conversations: action.payload.conversations,
        activeConversationId: action.payload.activeConversationId,
        settings: action.payload.settings,
      };

    case "newChat":
      return { ...state, activeConversationId: null, error: null };

    case "selectConversation":
      return { ...state, activeConversationId: action.id, error: null };

    case "addConversation":
      return {
        ...state,
        conversations: [action.conversation, ...state.conversations],
        activeConversationId: action.conversation.id,
      };

    case "deleteConversation": {
      const conversations = state.conversations.filter(
        (conversation) => conversation.id !== action.id,
      );
      const wasActive = state.activeConversationId === action.id;
      return {
        ...state,
        conversations,
        activeConversationId: wasActive ? null : state.activeConversationId,
        generatingConversationId:
          state.generatingConversationId === action.id
            ? null
            : state.generatingConversationId,
        error: state.error?.conversationId === action.id ? null : state.error,
      };
    }

    case "renameConversation":
      return updateConversation(state, action.id, (conversation) => ({
        ...conversation,
        title: action.title.trim() || conversation.title,
        updatedAt: action.touch === false ? conversation.updatedAt : Date.now(),
      }));

    case "togglePin":
      return updateConversation(state, action.id, (conversation) => ({
        ...conversation,
        pinned: !conversation.pinned,
      }));

    case "addMessage":
      return updateConversation(state, action.conversationId, (conversation) => {
        const shouldTitle =
          action.titleFrom !== undefined &&
          (conversation.messages.length === 0 ||
            conversation.title === "New chat");
        return {
          ...conversation,
          title: shouldTitle
            ? slugifyTitle(action.titleFrom ?? "")
            : conversation.title,
          messages: [...conversation.messages, action.message],
          updatedAt: Date.now(),
        };
      });

    case "updateMessage":
      return {
        ...state,
        conversations: state.conversations.map((conversation) => ({
          ...conversation,
          messages: conversation.messages.map((message) =>
            message.id === action.messageId
              ? { ...message, ...action.patch }
              : message,
          ),
        })),
      };

    case "removeMessagesFrom":
      return updateConversation(
        state,
        action.conversationId,
        (conversation) => {
          const index = conversation.messages.findIndex(
            (message) => message.id === action.messageId,
          );
          if (index === -1) return conversation;
          return {
            ...conversation,
            messages: conversation.messages.slice(0, index),
            updatedAt: Date.now(),
          };
        },
      );

    case "truncateAfter":
      return updateConversation(
        state,
        action.conversationId,
        (conversation) => {
          const index = conversation.messages.findIndex(
            (message) => message.id === action.messageId,
          );
          if (index === -1) return conversation;
          const kept = conversation.messages.slice(0, index + 1);
          if (action.content !== undefined) {
            kept[index] = { ...kept[index], content: action.content };
          }
          return {
            ...conversation,
            messages: kept,
            updatedAt: Date.now(),
          };
        },
      );

    case "setConversationModel":
      return updateConversation(state, action.conversationId, (conversation) => ({
        ...conversation,
        modelId: action.modelId,
      }));

    case "updateSettings":
      return { ...state, settings: { ...state.settings, ...action.patch } };

    case "setGenerating":
      return { ...state, generatingConversationId: action.conversationId };

    case "setError":
      return {
        ...state,
        error: {
          conversationId: action.conversationId,
          message: action.message,
          prompt: action.prompt,
        },
      };

    case "clearError":
      return { ...state, error: null };

    case "clearAllConversations":
      return {
        ...state,
        conversations: [],
        activeConversationId: null,
        generatingConversationId: null,
        error: null,
      };

    default:
      return state;
  }
}

interface ChatContextValue {
  hydrated: boolean;
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeConversationId: string | null;
  settings: Settings;
  isGenerating: boolean;
  error: ChatState["error"];
  newChat: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  togglePin: (id: string) => void;
  sendMessage: (text: string, attachments?: Attachment[]) => void;
  stopGeneration: () => void;
  regenerate: (messageId?: string) => void;
  editUserMessage: (messageId: string, content: string) => void;
  retry: () => void;
  dismissError: () => void;
  setModel: (modelId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  clearAllConversations: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "hydrate", payload: loadPersistedState() });
    return clearTimer;
  }, [clearTimer]);

  useEffect(() => {
    if (!state.hydrated) return;
    savePersistedState({
      version: STORAGE_VERSION,
      conversations: state.conversations,
      activeConversationId: state.activeConversationId,
      settings: state.settings,
    });
  }, [
    state.hydrated,
    state.conversations,
    state.activeConversationId,
    state.settings,
  ]);

  const startGeneration = useCallback(
    (
      conversationId: string,
      prompt: string,
      modelId: string,
      simulateError = false,
    ) => {
      clearTimer();
      cancelledRef.current = false;
      dispatch({ type: "clearError" });
      dispatch({ type: "setGenerating", conversationId });

      const delay = simulateError ? 1100 : 850 + Math.random() * 900;

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        dispatch({ type: "setGenerating", conversationId: null });
        if (cancelledRef.current) return;

        if (simulateError) {
          dispatch({
            type: "setError",
            conversationId,
            message:
              "Something interrupted that response. You can try again or rephrase your message.",
            prompt,
          });
          return;
        }

        try {
          const content = getMockReply(prompt);
          dispatch({
            type: "addMessage",
            conversationId,
            message: createAssistantMessage(content, modelId),
          });
        } catch {
          dispatch({
            type: "setError",
            conversationId,
            message: "Ryuna couldn't generate a response just now.",
            prompt,
          });
        }
      }, delay);
    },
    [clearTimer],
  );

  const sendMessage = useCallback(
    (text: string, attachments?: Attachment[]) => {
      const trimmed = text.trim();
      if (!trimmed || state.generatingConversationId) return;

      const simulateError = /^\/error\b/i.test(trimmed);
      const displayText = simulateError
        ? trimmed.replace(/^\/error\s*/i, "") || "Please generate a response."
        : trimmed;

      let conversationId = state.activeConversationId;
      let modelId = state.settings.defaultModelId;

      if (conversationId) {
        const active = state.conversations.find(
          (conversation) => conversation.id === conversationId,
        );
        modelId = active?.modelId ?? modelId;
      } else {
        const conversation = createConversation(state.settings.defaultModelId);
        conversationId = conversation.id;
        modelId = conversation.modelId;
        dispatch({ type: "addConversation", conversation });
      }

      dispatch({
        type: "addMessage",
        conversationId,
        message: createUserMessage(displayText, attachments),
        titleFrom: displayText,
      });

      startGeneration(conversationId, displayText, modelId, simulateError);
    },
    [
      state.activeConversationId,
      state.conversations,
      state.generatingConversationId,
      state.settings.defaultModelId,
      startGeneration,
    ],
  );

  const stopGeneration = useCallback(() => {
    cancelledRef.current = true;
    clearTimer();
    dispatch({ type: "setGenerating", conversationId: null });
  }, [clearTimer]);

  const regenerate = useCallback(
    (messageId?: string) => {
      const conversation = state.conversations.find(
        (c) => c.id === state.activeConversationId,
      );
      if (!conversation || state.generatingConversationId) return;

      const targetId =
        messageId ??
        [...conversation.messages]
          .reverse()
          .find((message) => message.role === "assistant")?.id;

      if (!targetId) return;

      const index = conversation.messages.findIndex((m) => m.id === targetId);
      if (index === -1) return;

      let userMessage: ChatMessage | undefined;
      for (let i = index - 1; i >= 0; i -= 1) {
        if (conversation.messages[i].role === "user") {
          userMessage = conversation.messages[i];
          break;
        }
      }
      if (!userMessage) return;

      dispatch({
        type: "removeMessagesFrom",
        conversationId: conversation.id,
        messageId: targetId,
      });
      startGeneration(conversation.id, userMessage.content, conversation.modelId);
    },
    [
      state.activeConversationId,
      state.conversations,
      state.generatingConversationId,
      startGeneration,
    ],
  );

  const editUserMessage = useCallback(
    (messageId: string, content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      const conversation = state.conversations.find(
        (c) => c.id === state.activeConversationId,
      );
      if (!conversation || state.generatingConversationId) return;

      dispatch({
        type: "truncateAfter",
        conversationId: conversation.id,
        messageId,
        content: trimmed,
      });
      startGeneration(conversation.id, trimmed, conversation.modelId);
    },
    [
      state.activeConversationId,
      state.conversations,
      state.generatingConversationId,
      startGeneration,
    ],
  );

  const retry = useCallback(() => {
    if (!state.error || state.generatingConversationId) return;
    startGeneration(
      state.error.conversationId,
      state.error.prompt,
      state.settings.defaultModelId,
    );
  }, [
    state.error,
    state.generatingConversationId,
    state.settings.defaultModelId,
    startGeneration,
  ]);

  const value = useMemo<ChatContextValue>(() => {
    const activeConversation =
      state.conversations.find(
        (conversation) => conversation.id === state.activeConversationId,
      ) ?? null;

    return {
      hydrated: state.hydrated,
      conversations: state.conversations,
      activeConversation,
      activeConversationId: state.activeConversationId,
      settings: state.settings,
      isGenerating: state.generatingConversationId !== null,
      error: state.error,
      newChat: () => dispatch({ type: "newChat" }),
      selectConversation: (id) =>
        dispatch({ type: "selectConversation", id }),
      deleteConversation: (id) =>
        dispatch({ type: "deleteConversation", id }),
      renameConversation: (id, title) =>
        dispatch({ type: "renameConversation", id, title }),
      togglePin: (id) => dispatch({ type: "togglePin", id }),
      sendMessage,
      stopGeneration,
      regenerate,
      editUserMessage,
      retry,
      dismissError: () => dispatch({ type: "clearError" }),
      setModel: (modelId) => {
        if (state.activeConversationId) {
          dispatch({
            type: "setConversationModel",
            conversationId: state.activeConversationId,
            modelId,
          });
        } else {
          dispatch({ type: "updateSettings", patch: { defaultModelId: modelId } });
        }
      },
      updateSettings: (patch) => dispatch({ type: "updateSettings", patch }),
      clearAllConversations: () => dispatch({ type: "clearAllConversations" }),
    };
  }, [
    state,
    sendMessage,
    stopGeneration,
    regenerate,
    editUserMessage,
    retry,
  ]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
