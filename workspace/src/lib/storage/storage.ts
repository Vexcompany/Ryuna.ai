/**
 * Thin, dependency-free localStorage layer.
 *
 * Every read/write goes through these helpers so the persistence backend can
 * later be swapped for a real API without touching feature code.
 */

const isBrowser = typeof window !== "undefined";

export const STORAGE_KEYS = {
  state: "ryuna:state:v1",
} as const;

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`[ryuna] Failed to read "${key}" from localStorage`, error);
    return fallback;
  }
}

export function hasStoredItem(key: string): boolean {
  if (!isBrowser) return false;
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[ryuna] Failed to write "${key}" to localStorage`, error);
  }
}

export function removeKey(key: string): void {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`[ryuna] Failed to remove "${key}" from localStorage`, error);
  }
}
