import { useSyncExternalStore } from "react";

const KEY = "shelfspace:saved";
const EMPTY: string[] = []; // stable reference for server rendering
const listeners = new Set<() => void>();
let cache: string[] | null = null; // getSnapshot must return the same array until data changes

function read(): string[] {
  if (cache !== null) return cache;
  let ids: string[] = [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (Array.isArray(parsed)) ids = parsed.filter((x): x is string => typeof x === "string");
  } catch {
    // corrupted or blocked storage: start empty
  }
  cache = ids;
  return ids;
}

function write(ids: string[]) {
  cache = ids;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // storage full or blocked: the in-memory copy still works this session
  }
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  // another tab changed the saved list
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

export function useSavedIds() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleSaved(id: string) {
  const current = read();
  write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
}