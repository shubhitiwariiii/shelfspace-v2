"use client";

import { useState } from "react";
import { useQueryStates } from "nuqs";
import { Clock, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  AMENITY_KEYS,
  AMENITY_LABELS,
  PRICE_OPTIONS,
  SORT_KEYS,
  SORT_LABELS,
  type SortKey,
} from "@/lib/constants";
import { searchParamParsers } from "@/lib/search-params";
import type { Amenity } from "@/lib/types";
import { cn } from "@/lib/utils";

const selectClass =
  "h-10 rounded-lg border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-accent"
      )}
    >
      {children}
    </button>
  );
}

// idPrefix keeps element ids unique, because the panel can exist twice (desktop and sheet)
function FiltersPanel({ idPrefix }: { idPrefix: string }) {
  const [{ lat, lng, maxPrice, amenities, open, sort }, setParams] = useQueryStates(
    searchParamParsers,
    { shallow: false }
  );
  const hasLocation = lat !== null && lng !== null;
  const activeCount = (maxPrice ? 1 : 0) + amenities.length + (open ? 1 : 0);

  function toggleAmenity(a: Amenity) {
    setParams({
      amenities: amenities.includes(a) ? amenities.filter((x) => x !== a) : [...amenities, a],
    });
  }

  return (
    <section aria-label="Filters" className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label
            htmlFor={`${idPrefix}-max-price`}
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Max price per month
          </label>
          <select
            id={`${idPrefix}-max-price`}
            className={selectClass}
            value={maxPrice ?? ""}
            onChange={(e) => setParams({ maxPrice: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Any price</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p}>
                Up to ₹{p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${idPrefix}-sort`} className="mb-1 block text-xs font-medium text-muted-foreground">
            Sort by
          </label>
          <select
            id={`${idPrefix}-sort`}
            className={selectClass}
            value={sort ?? ""}
            onChange={(e) => setParams({ sort: (e.target.value || null) as SortKey | null })}
          >
            <option value="">{hasLocation ? "Nearest (default)" : "Top rated (default)"}</option>
            {SORT_KEYS.map((k) => (
              <option key={k} value={k} disabled={k === "distance" && !hasLocation}>
                {SORT_LABELS[k]}
                {k === "distance" && !hasLocation ? " (use Near me)" : ""}
              </option>
            ))}
          </select>
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => setParams({ maxPrice: null, amenities: [], open: false })}
            className="inline-flex h-10 items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            Reset filters
          </button>
        )}
      </div>

      <div role="group" aria-label="Quick filters" className="flex flex-wrap gap-2">
        <Chip active={open} onClick={() => setParams({ open: !open })}>
          <Clock className="size-4" aria-hidden />
          Open now
        </Chip>
        {AMENITY_KEYS.map((a) => (
          <Chip key={a} active={amenities.includes(a)} onClick={() => toggleAmenity(a)}>
            {AMENITY_LABELS[a]}
          </Chip>
        ))}
      </div>
    </section>
  );
}

export function ExploreFilters() {
  const [{ maxPrice, amenities, open }] = useQueryStates(searchParamParsers, { shallow: false });
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeCount = (maxPrice ? 1 : 0) + amenities.length + (open ? 1 : 0);

  return (
    <>
      <div className="hidden md:block">
        <FiltersPanel idPrefix="desktop" />
      </div>

      <div className="md:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger className={cn(buttonVariants({ variant: "outline" }), "h-11")}>
            <SlidersHorizontal className="mr-2 size-4" aria-hidden />
            Filters
            {activeCount > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {activeCount}
              </span>
            )}
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FiltersPanel idPrefix="mobile" />
              <Button className="mt-6 h-11 w-full" onClick={() => setSheetOpen(false)}>
                Show results
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}