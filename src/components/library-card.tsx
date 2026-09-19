import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AMENITY_LABELS } from "@/lib/constants";
import type { Library } from "@/lib/types";

export function LibraryCard({ library }: { library: Library & { distanceKm?: number } }) {
  const { id, name, locality, district, rating, details, distanceKm } = library;

  return (
    <Link
      href={`/library/${id}`}
      className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="gap-3 p-5 transition group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
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

        {details?.pricing && <p className="text-sm font-medium">{details.pricing}</p>}

        {details?.amenities && (
          <div className="flex flex-wrap gap-1.5">
            {details.amenities.slice(0, 3).map((a) => (
              <Badge key={a} variant="secondary">
                {AMENITY_LABELS[a]}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}