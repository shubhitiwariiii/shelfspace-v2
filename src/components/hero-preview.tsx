import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AMENITY_LABELS } from "@/lib/constants";
import type { Library } from "@/lib/types";
import { cn } from "@/lib/utils";

function PreviewCard({ library, className }: { library: Library; className?: string }) {
  const { name, locality, district, rating, details } = library;

  return (
    <div className={cn("w-72 rounded-2xl border bg-card p-5 shadow-xl", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-lg font-semibold leading-snug">{name}</p>
        {rating !== undefined && (
          <span className="flex items-center gap-1 text-sm font-medium">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {rating.toFixed(1)}
          </span>
        )}
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4" />
        {[locality, district].filter(Boolean).join(", ")}
      </p>
      {details?.pricing && <p className="mt-3 text-sm font-medium">{details.pricing}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {details?.amenities.slice(0, 3).map((a) => (
          <Badge key={a} variant="secondary">
            {AMENITY_LABELS[a]}
          </Badge>
        ))}
      </div>
    </div>
  );
}

// Decorative only, so screen readers skip it
export function HeroPreview({ libraries }: { libraries: Library[] }) {
  const [first, second] = libraries;

  return (
    <div aria-hidden="true" className="relative mx-auto h-[24rem] w-full max-w-sm select-none">
      {first && <PreviewCard library={first} className="absolute left-0 top-0 -rotate-3" />}
      {second && <PreviewCard library={second} className="absolute bottom-0 right-0 rotate-3" />}
    </div>
  );
}