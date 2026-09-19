import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LibraryCard } from "@/components/library-card";
import { searchLibraries } from "@/lib/data/libraries";
import { cn } from "@/lib/utils";

type Props = { q: string; lat: number | null; lng: number | null };

export async function Results({ q, lat, lng }: Props) {
  const hasLocation = lat !== null && lng !== null;
  const items = await searchLibraries({
    q: q || undefined,
    lat: lat ?? undefined,
    lng: lng ?? undefined,
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
        <SearchX className="size-10 text-muted-foreground" aria-hidden />
        <h2 className="mt-4 font-display text-xl font-semibold">No libraries found</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          {hasLocation
            ? "We couldn't find any within 50 km of you. Try searching by city or area instead."
            : "Try a different area, or check the spelling."}
        </p>
        <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
          Clear search
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p aria-live="polite" className="mb-4 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "library" : "libraries"}
        {q && ` matching “${q}”`}
        {hasLocation ? " within 50 km, closest first" : ", top rated first"}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((l) => (
          <LibraryCard key={l.id} library={l} />
        ))}
      </div>
    </div>
  );
}