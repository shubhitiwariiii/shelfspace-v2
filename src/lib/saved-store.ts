import { createIdStore } from "@/lib/id-store";

const store = createIdStore("shelfspace:saved");

export const useSavedIds = store.useIds;
export const toggleSaved = store.toggle;