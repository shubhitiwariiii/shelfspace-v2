"use client";

import { useState } from "react";
import { List, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ResultsLayout({
  list,
  map,
}: {
  list: React.ReactNode;
  map: React.ReactNode;
}) {
  const [view, setView] = useState<"list" | "map">("list");

  return (
    <div>
      {/* toggle only on screens smaller than lg */}
      <div
        role="group"
        aria-label="Results view"
        className="mb-4 inline-flex rounded-lg border bg-card p-1 lg:hidden"
      >
        {(["list", "map"] as const).map((v) => (
          <button
            key={v}
            type="button"
            aria-pressed={view === v}
            onClick={() => setView(v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {v === "list" ? <List className="size-4" aria-hidden /> : <MapIcon className="size-4" aria-hidden />}
            {v === "list" ? "List" : "Map"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={cn(view === "map" && "hidden lg:block")}>{list}</div>
        <div className={cn(view === "list" && "hidden lg:block")}>
          {/* isolate keeps Leaflet's high z-indexes from covering the navbar */}
          <div className="isolate h-[70vh] overflow-hidden rounded-2xl border lg:sticky lg:top-20 lg:h-[calc(100vh-7rem)]">
            {map}
          </div>
        </div>
      </div>
    </div>
  );
}