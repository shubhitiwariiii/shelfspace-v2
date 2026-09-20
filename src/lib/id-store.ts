import { useSyncExternalStore } from "react";

const EMPTY: string[] = []; // stable reference for server rendering

// Creates a small store of ids saved in localStorage, with an optional size limit.
export function createIdStore(key: string, max = Infinity) {
  const listeners = new Set<() => void>();
  let cache: string[] | null = null; // getSnapshot must return the same array until data changes

  function read(): string[] {
    if (cache !== null) return cache;
    let ids: string[] = [];
    try {
      const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
      if (Array.isArray(parsed)) {
        ids = parsed.filter((x): x is string => typeof x === "string").slice(0, max);
      }
    } catch {
      // corrupted or blocked storage: start empty
    }
    cache = ids;
    return ids;
  }

  function write(ids: string[]) {
    cache = ids;
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // storage full or blocked: the in-memory copy still works this session
    }
    listeners.forEach((l) => l());
  }

  function subscribe(callback: () => void) {
    listeners.add(callback);
    // another tab changed the list
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
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

  return {
    useIds: () => useSyncExternalStore(subscribe, read, () => EMPTY),
    toggle(id: string) {
      const current = read();
      if (current.includes(id)) write(current.filter((x) => x !== id));
      else if (current.length < max) write([...current, id]);
    },
    clear() {
      write([]);
    },
  };
}