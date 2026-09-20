import { COMPARE_MAX } from "@/lib/constants";
import { createIdStore } from "@/lib/id-store";

const store = createIdStore("shelfspace:compare", COMPARE_MAX);

export const useCompareIds = store.useIds;
export const toggleCompare = store.toggle;
export const clearCompare = store.clear;