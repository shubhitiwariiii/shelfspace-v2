import { createClient } from "@/lib/supabase/server";
import { haversineKm } from "@/lib/distance";
import { resolveSort, type SortKey } from "@/lib/constants";
import { isOpenNow } from "@/lib/open-now";
import type { Amenity, Day, DayHours, Library, LibraryDetails } from "@/lib/types";

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

// Supabase row shapes, before we reassemble them into the app's Library type
type LibraryRow = {
  id: string;
  name: string;
  address: string | null;
  district: string;
  locality: string | null;
  state: string;
  lat: number;
  lng: number;
  rating: number | null;
};

type DetailsRow = {
  library_id: string;
  pricing: string | null;
  monthly_price: number | null;
  owner_name: string | null;
  owner_contact: string | null;
  amenities: string[];
  timings: Record<Day, DayHours> | null;
  last_verified: string | null;
};

// Converts a raw DB row pair into the Library shape the rest of the app already knows
function toLibrary(row: LibraryRow, details: DetailsRow | undefined): Library {
  const hasDetails = !!details && (details.pricing || details.amenities.length > 0 || details.timings);

  return {
    id: row.id,
    name: row.name,
    address: row.address ?? `${row.district}, ${row.state}`,
    district: row.district,
    locality: row.locality ?? undefined,
    state: row.state,
    lat: row.lat,
    lng: row.lng,
    rating: row.rating ?? undefined,
    details: hasDetails
      ? ({
          pricing: details!.pricing ?? undefined,
          monthlyPrice: details!.monthly_price ?? undefined,
          ownerName: details!.owner_name ?? undefined,
          ownerContact: details!.owner_contact ?? undefined,
          amenities: (details!.amenities ?? []) as Amenity[],
          timings: details!.timings ?? ({} as Record<Day, DayHours>),
          lastVerified: details!.last_verified ?? undefined,
        } satisfies LibraryDetails)
      : undefined,
  };
}

// Fetches every library + its details (if any) and assembles them together.
// Kept in one place so every function below reuses the same join logic.
async function fetchAllWithDetails(): Promise<Library[]> {
  const supabase = await createClient();

  const [{ data: libraryRows, error: libError }, { data: detailRows, error: detailError }] =
    await Promise.all([
      supabase.from("libraries").select("*"),
      supabase.from("library_details").select("*"),
    ]);

  if (libError) throw libError;
  if (detailError) throw detailError;

  const detailsById = new Map((detailRows ?? []).map((d) => [d.library_id, d as DetailsRow]));
  return (libraryRows ?? []).map((row) => toLibrary(row as LibraryRow, detailsById.get(row.id)));
}

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
  let results: LibraryResult[] = await fetchAllWithDetails();

  if (q) {
    const term = q.toLowerCase();
    results = results.filter((l) =>
      [l.name, l.address, l.district, l.locality].some((f) => f?.toLowerCase().includes(term))
    );
  }

  if (amenities.length > 0) {
    results = results.filter((l) => amenities.every((a) => l.details?.amenities.includes(a)));
  }

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
      .filter((l) => l.distanceKm! <= radiusKm);
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

export async function getLibraryById(id: string): Promise<Library | null> {
  const supabase = await createClient();

  const [{ data: libRow, error: libError }, { data: detailRow, error: detailError }] =
    await Promise.all([
      supabase.from("libraries").select("*").eq("id", id).maybeSingle(),
      supabase.from("library_details").select("*").eq("library_id", id).maybeSingle(),
    ]);

  if (libError) throw libError;
  if (detailError) throw detailError;
  if (!libRow) return null;

  return toLibrary(libRow as LibraryRow, (detailRow as DetailsRow) ?? undefined);
}

export async function getLibrariesByIds(ids: string[]): Promise<Library[]> {
  if (ids.length === 0) return [];
  const all = await fetchAllWithDetails();
  const byId = new Map(all.map((l) => [l.id, l]));
  return ids.map((id) => byId.get(id)).filter((l): l is Library => l !== undefined);
}

export async function getAllLibraries(): Promise<Library[]> {
  return fetchAllWithDetails();
}