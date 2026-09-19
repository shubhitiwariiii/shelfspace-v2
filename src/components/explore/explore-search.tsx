"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryStates } from "nuqs";
import { Loader2, LocateFixed, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchParamParsers } from "@/lib/search-params";

export function ExploreSearch() {
  // shallow: false makes the server re-run the page when the URL changes
  const [{ q, lat, lng, near }, setParams] = useQueryStates(searchParamParsers, {
    shallow: false,
  });
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const hasLocation = lat !== null && lng !== null;

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setGeoError("Your browser doesn't support location.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setParams({
          lat: Number(pos.coords.latitude.toFixed(3)), // ~110 m: precise enough, not too exact
          lng: Number(pos.coords.longitude.toFixed(3)),
          near: null,
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setGeoError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission was denied. You can still search by area or city."
            : "Couldn't get your location. Try again, or search by area."
        );
        setParams({ near: null });
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, [setParams]);

  // Arrived from the landing page's "Near me" button: ask for location once
  const autoLocated = useRef(false);
  useEffect(() => {
    if (near === "1" && !autoLocated.current) {
      autoLocated.current = true;
      if (hasLocation) setParams({ near: null });
      else locate();
    }
  }, [near, hasLocation, locate, setParams]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    setParams({ q: value || null });
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="explore-search" className="sr-only">
            Search libraries by name, area or city
          </label>
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          {/* key resets the input when the URL changes (e.g. Back button) */}
          <Input
            key={q}
            id="explore-search"
            name="q"
            defaultValue={q}
            placeholder="Search by area, city or library name"
            className="h-12 bg-card pl-11 text-base"
          />
        </div>
        <Button type="submit" className="h-12 px-6 text-base">
          Search
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-4 text-base"
          onClick={locate}
          disabled={locating}
        >
          {locating ? (
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
          ) : (
            <LocateFixed className="mr-2 size-4" aria-hidden />
          )}
          {locating ? "Locating…" : "Near me"}
        </Button>
      </form>

      {geoError && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {geoError}
        </p>
      )}

      {(q || hasLocation) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {q && (
            <Badge variant="secondary" className="gap-1 py-1 pl-3 pr-1.5 text-sm">
              Search: {q}
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setParams({ q: null })}
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="size-3.5" />
              </button>
            </Badge>
          )}
          {hasLocation && (
            <Badge variant="secondary" className="gap-1 py-1 pl-3 pr-1.5 text-sm">
              Within 50 km of you
              <button
                type="button"
                aria-label="Clear location"
                onClick={() => setParams({ lat: null, lng: null })}
                className="rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="size-3.5" />
              </button>
            </Badge>
          )}
          <button
            type="button"
            onClick={() => setParams({ q: null, lat: null, lng: null })}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}