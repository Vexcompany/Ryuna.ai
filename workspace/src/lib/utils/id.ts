export function createId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function slugifyTitle(input: string, maxLength = 60): string {
  const cleaned = input.replace(/\s+/g, " ").trim();
  if (!cleaned) return "New chat";
  return cleaned.length > maxLength
    ? `${cleaned.slice(0, maxLength).trimEnd()}…`
    : cleaned;
}
