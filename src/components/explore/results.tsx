import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LibraryCard } from "@/components/library-card";
import { ResultsLayout } from "@/components/explore/results-layout";
import { MapViewLazy } from "@/components/map/map-view-lazy";
import type { MapPoint } from "@/components/map/types";
import { resolveSort, type SortKey } from "@/lib/constants";
import { searchLibraries } from "@/lib/data/libraries";
import type { Amenity } from "@/lib/types";
import { cn } from "@/lib/utils";

export type ExploreParams = {
  q: string;
  lat: number | null;
  lng: number | null;
  maxPrice: number | null;
  amenities: Amenity[];
  open: boolean;
  sort: SortKey | null;
};

const SORT_TEXT: Record<SortKey, string> = {
  rating: "top rated first",
  price: "cheapest first",
  distance: "closest first",
};

export async function Results({ params }: { params: ExploreParams }) {
  const { q, lat, lng, maxPrice, amenities, open, sort } = params;
  const hasLocation = lat !== null && lng !== null;

  const items = await searchLibraries({
    q: q || undefined,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
    maxPrice: maxPrice ?? undefined,
    amenities,
    openNow: open,
    sort: sort ?? undefined,
  });

  if (items.length === 0) {
    const hasFilters = maxPrice !== null || amenities.length > 0 || open;
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" aria-hidden />
        <h2 className="mt-4 font-display text-xl font-semibold">No libraries found</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {hasFilters
            ? "Nothing matches all your filters. Try removing a few."
            : hasLocation
              ? "We couldn't find any within 50 km of you. Try searching by city or area instead."
              : "Try a different area, or check the spelling."}
        </p>
        <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Clear search and filters
        </Link>
      </div>
    );
  }

  // send the map only the fields it needs
  const points: MapPoint[] = items.map((l) => ({
    id: l.id,
    name: l.name,
    lat: l.lat,
    lng: l.lng,
    rating: l.rating,
    pricing: l.details?.pricing,
    area: [l.locality, l.district].filter(Boolean).join(", "),
    distanceKm: l.distanceKm,
  }));

  return (
    <div>
      <p aria-live="polite" className="mb-4 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "library" : "libraries"}
        {q && ` matching “${q}”`}
        {hasLocation && " within 50 km"}, {SORT_TEXT[resolveSort(sort, hasLocation)]}
      </p>

      <ResultsLayout
        list={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {items.map((l) => (
              <LibraryCard key={l.id} library={l} showStatus />
            ))}
          </div>
        }
        map={<MapViewLazy points={points} user={hasLocation ? { lat, lng } : null} />}
      />
    </div>
  );
}