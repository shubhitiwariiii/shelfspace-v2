import { CompareButton } from "@/components/compare-button";
import type { Metadata } from "next";
import { BadgeCheck, MapPin, Navigation, Phone, Star } from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/library/back-button";
import { AMENITY_ICONS } from "@/components/library/amenity-icons";
import { TimingsTable } from "@/components/library/timings-table";
import { MapViewLazy } from "@/components/map/map-view-lazy";
import type { MapPoint } from "@/components/map/types";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { AMENITY_LABELS, USING_SAMPLE_DATA } from "@/lib/constants";
import { getLibraryById } from "@/lib/data/libraries";
import { formatDate } from "@/lib/format";
import { getOpenStatus } from "@/lib/open-now";
import { cn } from "@/lib/utils";

// "Open now" depends on the current time, so this page must render fresh on every request
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const library = await getLibraryById(id);
  if (!library) return { title: "Library not found | ShelfSpace" };
  return {
    title: `${library.name}, ${library.district} | ShelfSpace`,
    description: `Fees, timings and amenities for ${library.name} in ${library.district}.`,
  };
}

export default async function LibraryPage({ params }: Props) {
  const { id } = await params;
  const library = await getLibraryById(id);
  if (!library) notFound();

  const { name, address, district, state, rating, details, lat, lng, locality } = library;
  const status = details ? getOpenStatus(details.timings) : null;
  const fullAddress = `${address}, ${state}`;
  const points: MapPoint[] = [
    {
      id,
      name,
      lat,
      lng,
      rating,
      pricing: details?.pricing,
      area: [locality, district].filter(Boolean).join(", "),
    },
  ];
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <BackButton />

      <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">{name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {fullAddress}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            {rating !== undefined && (
              <span className="flex items-center gap-1 font-medium">
                <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                {rating.toFixed(1)}
              </span>
            )}
            {status && (
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1",
                  status.open
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "text-muted-foreground"
                )}
              >
                <span
                  className={cn("size-2 rounded-full", status.open ? "bg-emerald-500" : "bg-muted-foreground/50")}
                  aria-hidden
                />
                {status.label}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <SaveButton id={id} label={name} />
          <CompareButton id={id} label={name} />
          <ShareButton title={name} text={`${name} in ${district} on ShelfSpace`} />
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="gap-1 p-6">
            <h2 className="text-sm font-medium text-muted-foreground">Monthly fee</h2>
            <p className="font-display text-3xl font-semibold">{details?.pricing ?? "Not added yet"}</p>
          </Card>

          {details && details.amenities.length > 0 && (
            <Card className="gap-4 p-6">
              <h2 className="font-display text-xl font-semibold">Amenities</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {details.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a];
                  return (
                    <li key={a} className="flex items-center gap-2.5 rounded-lg border bg-background px-3 py-2.5 text-sm">
                      <Icon className="size-4 text-primary" aria-hidden />
                      {AMENITY_LABELS[a]}
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {details && (
            <Card className="gap-3 p-6">
              <h2 className="font-display text-xl font-semibold">Opening hours</h2>
              <TimingsTable timings={details.timings} />
            </Card>
          )}

          <Card className="gap-3 p-6">
            <h2 className="font-display text-xl font-semibold">Verification and contact</h2>
            <p className="flex items-center gap-2 text-sm">
              <BadgeCheck
                className={cn("size-5", details?.lastVerified ? "text-primary" : "text-muted-foreground")}
                aria-hidden
              />
              {details?.lastVerified
                ? `Details last verified on ${formatDate(details.lastVerified)}`
                : "Details not verified yet"}
            </p>
            {details?.ownerContact ? (
              <a
                href={`tel:${details.ownerContact}`}
                className={cn(buttonVariants({ variant: "outline" }), "w-fit")}
              >
                <Phone className="mr-2 size-4" aria-hidden />
                Call {details.ownerName ?? "the library"}
              </a>
            ) : (
              <p className="text-sm text-muted-foreground">Contact details haven&apos;t been added yet.</p>
            )}
            {USING_SAMPLE_DATA && (
              <Badge variant="outline" className="w-fit">
                Demo build: this listing is sample data
              </Badge>
            )}
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="gap-0 overflow-hidden p-0">
            <div className="isolate h-64">
              <MapViewLazy points={points} user={null} />
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-muted-foreground">{fullAddress}</p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants(), "w-full")}
              >
                <Navigation className="mr-2 size-4" aria-hidden />
                Get directions
              </a>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}