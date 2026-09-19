import { libraries } from "@/mock/libraries";
import { haversineKm } from "@/lib/distance";
import type { Library } from "@/lib/types";

type SearchParams = { q?: string; lat?: number; lng?: number; radiusKm?: number };

export async function searchLibraries({ q, lat, lng, radiusKm = 50 }: SearchParams = {}) {
  let results: (Library & { distanceKm?: number })[] = [...libraries];

  if (q) {
    const term = q.toLowerCase();
    results = results.filter((l) =>
      [l.name, l.address, l.district, l.locality].some((f) => f?.toLowerCase().includes(term))
    );
  }
  if (lat !== undefined && lng !== undefined) {
    results = results
      .map((l) => ({ ...l, distanceKm: haversineKm(lat, lng, l.lat, l.lng) }))
      .filter((l) => l.distanceKm! <= radiusKm)
      .sort((a, b) => a.distanceKm! - b.distanceKm!);
  }
  return results;
}

export async function getLibraryById(id: string) {
  return libraries.find((l) => l.id === id) ?? null;
}