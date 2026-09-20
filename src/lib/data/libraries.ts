import { libraries } from "@/mock/libraries";
import { haversineKm } from "@/lib/distance";
import { resolveSort, type SortKey } from "@/lib/constants";
import { isOpenNow } from "@/lib/open-now";
import type { Amenity, Library } from "@/lib/types";

export type LibraryQuery = {
  q?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  maxPrice?: number;
  amenities?: Amenity[];
  openNow?: boolean;
  sort?: SortKey;
};

export type LibraryResult = Library & { distanceKm?: number };

export async function searchLibraries({
  q,
  lat,
  lng,
  radiusKm = 50,
  maxPrice,
  amenities = [],
  openNow = false,
  sort,
}: LibraryQuery = {}): Promise<LibraryResult[]> {
  let results: LibraryResult[] = libraries.map((l) => ({ ...l }));

  if (q) {
    const term = q.toLowerCase();
    results = results.filter((l) =>
      [l.name, l.address, l.district, l.locality].some((f) => f?.toLowerCase().includes(term))
    );
  }

  // must have ALL selected amenities
  if (amenities.length > 0) {
    results = results.filter((l) => amenities.every((a) => l.details?.amenities.includes(a)));
  }

  // libraries with no known price are left out when a price filter is on
  if (maxPrice !== undefined) {
    results = results.filter(
      (l) => l.details?.monthlyPrice !== undefined && l.details.monthlyPrice <= maxPrice
    );
  }

  if (openNow) {
    results = results.filter((l) => l.details && isOpenNow(l.details.timings));
  }

  const hasLocation = lat !== undefined && lng !== undefined;
  if (lat !== undefined && lng !== undefined) {
    results = results
      .map((l) => ({ ...l, distanceKm: haversineKm(lat, lng, l.lat, l.lng) }))
      .filter((l) => l.distanceKm <= radiusKm);
  }

  switch (resolveSort(sort, hasLocation)) {
    case "distance":
      results.sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
      break;
    case "price":
      results.sort(
        (a, b) => (a.details?.monthlyPrice ?? Infinity) - (b.details?.monthlyPrice ?? Infinity)
      );
      break;
    default:
      results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  }

  return results;
}

export async function getLibraryById(id: string) {
  return libraries.find((l) => l.id === id) ?? null;
}

export async function getLibrariesByIds(ids: string[]) {
  return ids
    .map((id) => libraries.find((l) => l.id === id))
    .filter((l): l is Library => l !== undefined);
}