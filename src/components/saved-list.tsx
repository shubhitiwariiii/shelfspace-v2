"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { LibraryCard } from "@/components/library-card";
import { ResultsSkeleton } from "@/components/explore/results-skeleton";
import { useSavedIds, useSavedReady } from "@/lib/saved-store";
import { useUser } from "@/lib/use-user";
import type { Library } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SavedList() {
  const ready = useSavedReady();
  const ids = useSavedIds();
  const { user, loading: userLoading } = useUser();
  const [items, setItems] = useState<Library[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!ready || ids.length === 0) return;
    const controller = new AbortController();

    fetch(`/api/libraries?ids=${encodeURIComponent(ids.join(","))}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json() as Promise<{ items: Library[] }>;
      })
      .then((data) => {
        setItems(data.items);
        setFailed(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setFailed(true);
      });

    return () => controller.abort();
  }, [ids, attempt, ready]);

  if (!ready) return <ResultsSkeleton />;

  const banner =
    !userLoading && !user ? (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
        <p>Saved on this device only. Log in to keep them on every device.</p>
        <Link href="/login" className={buttonVariants({ size: "sm" })}>
          Log in
        </Link>
      </div>
    ) : null;

  if (ids.length === 0) {
    return (
      <>
        {banner}
        <div className="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center">
          <Bookmark className="size-10 text-muted-foreground" aria-hidden />
          <h2 className="mt-4 font-display text-xl font-semibold">No saved libraries yet</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Tap the bookmark on any library to keep it here for later.
          </p>
          <Link href="/explore" className={cn(buttonVariants(), "mt-6")}>
            Browse libraries
          </Link>
        </div>
      </>
    );
  }

  if (failed) {
    return (
      <>
        {banner}
        <div role="alert" className="flex flex-col items-center rounded-2xl border px-6 py-16 text-center">
          <h2 className="font-display text-xl font-semibold">Couldn&apos;t load your saved libraries</h2>
          <p className="mt-2 text-sm text-muted-foreground">Check your connection and try again.</p>
          <Button className="mt-6" onClick={() => setAttempt((a) => a + 1)}>
            Try again
          </Button>
        </div>
      </>
    );
  }

  if (items === null) return <ResultsSkeleton />;

  // keep the saved order, and drop anything just un-saved without waiting for a refetch
  const byId = new Map(items.map((l) => [l.id, l]));
  const visible = ids.map((id) => byId.get(id)).filter((l): l is Library => l !== undefined);

  return (
    <div>
      {banner}
      <p aria-live="polite" className="mb-4 text-sm text-muted-foreground">
        {visible.length} saved {visible.length === 1 ? "library" : "libraries"}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((l) => (
          <LibraryCard key={l.id} library={l} showStatus />
        ))}
      </div>
    </div>
  );
}