import type { Library } from "@/lib/types";

// Jaccard similarity: (shared amenities) / (total unique amenities across both libraries).
// Standard measure for comparing two sets — 1 = identical sets, 0 = nothing in common.
function amenitySimilarity(a: Library, b: Library): number {
  const setA = new Set(a.details?.amenities ?? []);
  const setB = new Set(b.details?.amenities ?? []);
  if (setA.size === 0 || setB.size === 0) return 0;

  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return intersection / union;
}

// Closer price = more similar, scaled so a ~50% price difference scores near 0
function priceSimilarity(a: Library, b: Library): number {
  const pa = a.details?.monthlyPrice;
  const pb = b.details?.monthlyPrice;
  if (pa === undefined || pb === undefined) return 0.5; // unknown: stay neutral
  const diff = Math.abs(pa - pb) / Math.max(pa, pb);
  return Math.max(0, 1 - diff * 2);
}

export function findSimilarLibraries(target: Library, all: Library[], limit = 3): Library[] {
  return all
    .filter((l) => l.id !== target.id)
    .map((l) => ({
      library: l,
      // amenities matter most for "similar", price is a secondary signal
      score: 0.7 * amenitySimilarity(target, l) + 0.3 * priceSimilarity(target, l),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.library);
}