import { LibraryCard } from "@/components/library-card";
import { findSimilarLibraries } from "@/lib/recommend";
import { getAllLibraries } from "@/lib/data/libraries";
import type { Library } from "@/lib/types";

export async function SimilarLibraries({ library }: { library: Library }) {
  const all = await getAllLibraries();
  const similar = findSimilarLibraries(library, all);

  if (similar.length === 0) return null;

  return (
    <section aria-label="Similar libraries">
      <h2 className="font-display text-xl font-semibold">You might also like</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {similar.map((l) => (
          <LibraryCard key={l.id} library={l} />
        ))}
      </div>
    </section>
  );
}