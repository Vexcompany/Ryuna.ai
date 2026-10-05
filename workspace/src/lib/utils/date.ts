import type {
  Conversation,
  ConversationGroup,
  ConversationGroupId,
} from "@/types";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatFullDate(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

const GROUP_LABELS: Record<ConversationGroupId, string> = {
  today: "Today",
  yesterday: "Yesterday",
  previous7Days: "Previous 7 days",
  older: "Older",
};

const GROUP_ORDER: ConversationGroupId[] = [
  "today",
  "yesterday",
  "previous7Days",
  "older",
];

function resolveGroup(updatedAt: number, now: number): ConversationGroupId {
  const todayStart = startOfDay(new Date(now));
  const yesterdayStart = todayStart - DAY_MS;
  const weekStart = todayStart - 6 * DAY_MS;

  if (updatedAt >= todayStart) return "today";
  if (updatedAt >= yesterdayStart) return "yesterday";
  if (updatedAt >= weekStart) return "previous7Days";
  return "older";
}

export function groupConversations(
  conversations: Conversation[],
  now: number = Date.now(),
): ConversationGroup[] {
  const buckets: Record<ConversationGroupId, Conversation[]> = {
    today: [],
    yesterday: [],
    previous7Days: [],
    older: [],
  };

  const sorted = [...conversations].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });

  for (const conversation of sorted) {
    buckets[resolveGroup(conversation.updatedAt, now)].push(conversation);
  }

  return GROUP_ORDER.filter((id) => buckets[id].length > 0).map((id) => ({
    id,
    label: GROUP_LABELS[id],
    conversations: buckets[id],
  }));
}
