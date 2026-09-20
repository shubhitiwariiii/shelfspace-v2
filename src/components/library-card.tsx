import { CompareButton } from "@/components/compare-button";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SaveButton } from "@/components/save-button";
import { AMENITY_LABELS } from "@/lib/constants";
import { getOpenStatus } from "@/lib/open-now";
import type { Library } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  library: Library & { distanceKm?: number };
  showStatus?: boolean; // only on dynamic pages, because the status depends on the current time
};

export function LibraryCard({ library, showStatus = false }: Props) {
  const { id, name, locality, district, rating, details, distanceKm } = library;
  const status = showStatus && details ? getOpenStatus(details.timings) : null;
  const extra = (details?.amenities.length ?? 0) - 3;

  return (
    <div className="relative">
      <Link
        href={`/library/${id}`}
        className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Card className="h-full gap-3 p-5 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
          <div className="flex items-start justify-between gap-3 pr-24">
            <h3 className="font-display text-lg font-semibold leading-snug">{name}</h3>
            {rating !== undefined && (
              <span className="flex shrink-0 items-center gap-1 text-sm font-medium">
                <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" aria-hidden />
            {[locality, district].filter(Boolean).join(", ")}
            {distanceKm !== undefined && ` · ${distanceKm.toFixed(1)} km away`}
          </p>

          {status && (
            <p className="flex items-center gap-2 text-sm">
              <span
                className={cn("size-2 rounded-full", status.open ? "bg-emerald-500" : "bg-muted-foreground/50")}
                aria-hidden
              />
              <span
                className={cn(
                  status.open ? "font-medium text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
                )}
              >
                {status.label}
              </span>
            </p>
          )}

          {details?.pricing && <p className="text-sm font-medium">{details.pricing}</p>}

          {details?.amenities && (
            <div className="flex flex-wrap gap-1.5">
              {details.amenities.slice(0, 3).map((a) => (
                <Badge key={a} variant="secondary">
                  {AMENITY_LABELS[a]}
                </Badge>
              ))}
              {extra > 0 && <Badge variant="outline">+{extra} more</Badge>}
            </div>
          )}
        </Card>
      </Link>

      {/* a sibling of the link, not inside it, because a button inside a link is invalid HTML */}
      <SaveButton id={id} label={name} compact className="absolute right-3 top-3" />
      <CompareButton id={id} label={name} compact className="absolute right-12 top-3" />
    </div>
  );
}