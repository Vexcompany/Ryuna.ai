import type { Settings } from "@/types";
import { DEFAULT_MODEL_ID } from "@/lib/chat/providers";

export const DEFAULT_SETTINGS: Settings = {
  enterToSend: true,
  showTimestamps: false,
  autoScroll: true,
  defaultModelId: DEFAULT_MODEL_ID,
  responseStyle: "balanced",
  compactMode: false,
  animations: true,
};
