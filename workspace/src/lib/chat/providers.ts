import type { AIModel, AIProvider } from "@/types";

/**
 * Mock provider registry.
 *
 * The shape mirrors real provider APIs so that future milestones can replace
 * the static data with fetched model lists without changing consumers.
 */
export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "ryuna",
    name: "Ryuna",
    models: [
      {
        id: "ryuna-1",
        name: "Ryuna 1",
        providerId: "ryuna",
        description: "Balanced everyday assistant",
        contextWindow: 128_000,
        capabilities: ["reasoning", "vision", "web-search", "tools"],
        available: true,
      },
      {
        id: "ryuna-1-mini",
        name: "Ryuna 1 Mini",
        providerId: "ryuna",
        description: "Fastest responses for simple tasks",
        contextWindow: 64_000,
        capabilities: ["reasoning"],
        available: true,
      },
    ],
  },
  {
    id: "openai",
    name: "OpenAI",
    models: [
      {
        id: "gpt-5",
        name: "GPT-5",
        providerId: "openai",
        description: "Flagship reasoning model",
        contextWindow: 256_000,
        capabilities: ["reasoning", "vision", "tools"],
        available: true,
      },
      {
        id: "gpt-5-mini",
        name: "GPT-5 Mini",
        providerId: "openai",
        description: "Lightweight and quick",
        contextWindow: 128_000,
        capabilities: ["reasoning", "vision"],
        available: true,
      },
    ],
  },
  {
    id: "google",
    name: "Google",
    models: [
      {
        id: "gemini-2.5-pro",
        name: "Gemini 2.5 Pro",
        providerId: "google",
        description: "Long context and multimodal",
        contextWindow: 1_000_000,
        capabilities: ["reasoning", "vision", "web-search"],
        available: true,
      },
      {
        id: "gemini-2.5-flash",
        name: "Gemini 2.5 Flash",
        providerId: "google",
        description: "Speed-optimized multimodal",
        contextWindow: 1_000_000,
        capabilities: ["vision"],
        available: true,
      },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      {
        id: "claude-sonnet",
        name: "Claude Sonnet",
        providerId: "anthropic",
        description: "Thoughtful and precise",
        contextWindow: 200_000,
        capabilities: ["reasoning", "vision", "tools"],
        available: true,
      },
      {
        id: "claude-haiku",
        name: "Claude Haiku",
        providerId: "anthropic",
        description: "Fast and efficient",
        contextWindow: 200_000,
        capabilities: ["vision"],
        available: true,
      },
    ],
  },
];

export const DEFAULT_MODEL_ID = "ryuna-1";

export function getAllModels(): AIModel[] {
  return AI_PROVIDERS.flatMap((provider) => provider.models);
}

export function getModelById(id: string): AIModel | undefined {
  return getAllModels().find((model) => model.id === id);
}

export function getProviderForModel(modelId: string): AIProvider | undefined {
  return AI_PROVIDERS.find((provider) =>
    provider.models.some((model) => model.id === modelId),
  );
}

export function getModelDisplayName(id: string): string {
  return getModelById(id)?.name ?? id;
}
