import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { ExploreSearch } from "@/components/explore/explore-search";
import { Results } from "@/components/explore/results";
import { ResultsSkeleton } from "@/components/explore/results-skeleton";
import { searchParamsCache } from "@/lib/search-params";

export const metadata = { title: "Explore libraries | ShelfSpace" };

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q, lat, lng } = await searchParamsCache.parse(searchParams);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Explore libraries</h1>
      <p className="mt-2 text-muted-foreground">
        Search by area or city, or find what&apos;s closest to you.
      </p>

      <div className="mt-6">
        <Suspense fallback={<div className="h-12" />}>
          <ExploreSearch />
        </Suspense>
      </div>

      <div className="mt-8">
        {/* changing key restarts Suspense, so the skeleton shows on every new search */}
        <Suspense key={`${q}|${lat}|${lng}`} fallback={<ResultsSkeleton />}>
          <Results q={q} lat={lat} lng={lng} />
        </Suspense>
      </div>
    </div>
  );
}