import { useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";

const LOCAL_KEY = "shelfspace:saved";
const EMPTY: string[] = [];

type Listener = () => void;
const listeners = new Set<Listener>();

let ids: string[] = EMPTY; // current saved ids; the reference only changes when the data changes
let ready = false; // true once we know who is logged in and have loaded their saves
let userId: string | null = null;
let started = false;

function emit() {
  listeners.forEach((l) => l());
}

function setIds(next: string[]) {
  ids = next;
  emit();
}

function readLocal(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? "[]");
    if (Array.isArray(parsed)) return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    // corrupted or blocked storage: treat as empty
  }
  return [];
}

function writeLocal(next: string[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
  } catch {
    // storage full or blocked: the in-memory copy still works this session
  }
}

// Logged in: load the account's saves, first merging anything saved as a guest
async function loadForUser(uid: string) {
  const supabase = createClient();
  userId = uid;

  const guestIds = readLocal();
  if (guestIds.length > 0) {
    // Old guest ids may point at libraries that no longer exist (the foreign key would reject them)
    const { data: valid } = await supabase.from("libraries").select("id").in("id", guestIds);
    const validIds = (valid ?? []).map((r) => r.id);

    let merged = true;
    if (validIds.length > 0) {
      const { error } = await supabase
        .from("saved_libraries")
        .upsert(
          validIds.map((library_id) => ({ library_id })),
          { onConflict: "user_id,library_id", ignoreDuplicates: true }
        );
      merged = !error;
    }
    if (merged) writeLocal([]);
  }

  const { data, error } = await supabase
    .from("saved_libraries")
    .select("library_id")
    .order("saved_at", { ascending: false });

  if (!error && data) setIds(data.map((r) => r.library_id));
  ready = true;
  emit();
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;

  const supabase = createClient();
  ids = readLocal(); // guest saves show immediately

  supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user ?? null;
    if (user) {
      if (user.id !== userId) {
        // Deferred: calling Supabase directly inside this callback can deadlock
        setTimeout(() => void loadForUser(user.id), 0);
      }
    } else {
      userId = null;
      ids = readLocal();
      ready = true;
      emit();
    }
  });
}

function subscribe(callback: Listener) {
  start();
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useSavedIds() {
  return useSyncExternalStore(subscribe, () => ids, () => EMPTY);
}

// False until we know whether the visitor is logged in, so pages don't flash "nothing saved"
export function useSavedReady() {
  return useSyncExternalStore(subscribe, () => ready, () => false);
}

export async function toggleSaved(libraryId: string) {
  const previous = ids;
  const isSaved = previous.includes(libraryId);
  const next = isSaved ? previous.filter((x) => x !== libraryId) : [libraryId, ...previous];

  setIds(next); // optimistic: the screen updates instantly

  if (!userId) {
    writeLocal(next);
    return;
  }

  const supabase = createClient();
  const { error } = isSaved
    ? await supabase.from("saved_libraries").delete().eq("library_id", libraryId)
    : await supabase.from("saved_libraries").insert({ library_id: libraryId });

  if (error) setIds(previous); // the database refused, so undo the change on screen
}