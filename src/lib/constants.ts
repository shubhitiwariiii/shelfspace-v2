import type { Amenity } from "@/lib/types";

export const AMENITY_LABELS: Record<Amenity, string> = {
  ac: "AC",
  wifi: "Wi-Fi",
  silent: "Silent zone",
  lockers: "Lockers",
  charging: "Charging points",
  water: "Drinking water",
  "group-friendly": "Group friendly",
};

export const AMENITY_KEYS = Object.keys(AMENITY_LABELS) as Amenity[];

export const PRICE_OPTIONS = [500, 750, 1000] as const;

export const SORT_KEYS = ["rating", "price", "distance"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const SORT_LABELS: Record<SortKey, string> = {
  rating: "Top rated",
  price: "Price: low to high",
  distance: "Nearest",
};

// "Nearest" needs a location. Without one, fall back to rating.
export function resolveSort(sort: SortKey | null | undefined, hasLocation: boolean): SortKey {
  if (sort === "distance" && !hasLocation) return "rating";
  return sort ?? (hasLocation ? "distance" : "rating");
}

export const USING_SAMPLE_DATA = true;