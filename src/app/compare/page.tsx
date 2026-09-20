import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus, Scale } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AMENITY_KEYS, AMENITY_LABELS, COMPARE_MAX } from "@/lib/constants";
import { getLibraryById } from "@/lib/data/libraries";
import { formatDate } from "@/lib/format";
import { formatHours, getOpenStatus, getTodayKey } from "@/lib/open-now";
import type { Library } from "@/lib/types";
import { cn } from "@/lib/utils";

// "Open now" depends on the current time
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Compare libraries | ShelfSpace" };

export default async function ComparePage({
    searchParams,
}: {
    searchParams: Promise<{ ids?: string }>;
}) {
    const { ids = "" } = await searchParams;

    // the URL is user input: dedupe and cap the number of ids
    const wanted = Array.from(
        new Set(ids.split(",").map((s) => s.trim()).filter(Boolean))
    ).slice(0, COMPARE_MAX);
    const found = (await Promise.all(wanted.map((id) => getLibraryById(id)))).filter(
        (l): l is Library => l !== null
    );

    if (found.length < 2) {
        return (
            <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
                <Scale className="size-10 text-muted-foreground" aria-hidden />
                <h1 className="mt-4 font-display text-3xl font-semibold">Pick at least 2 libraries</h1>
                <p className="mt-3 text-muted-foreground">
                    Use the scale icon on any library card to add it, then open the comparison.
                </p>
                <Link href="/explore" className={cn(buttonVariants(), "mt-6")}>
                    Browse libraries
                </Link>
            </div>
        );
    }

    const today = getTodayKey();
    const prices = found.map((l) => l.details?.monthlyPrice).filter((p): p is number => p !== undefined);
    const ratings = found.map((l) => l.rating).filter((r): r is number => r !== undefined);
    const lowestPrice = prices.length ? Math.min(...prices) : null;
    const topRating = ratings.length ? Math.max(...ratings) : null;

    const rows: { label: string; cells: React.ReactNode[] }[] = [
        {
            label: "Rating",
            cells: found.map((l) =>
                l.rating === undefined ? (
                    "—"
                ) : (
                    <span className={cn(l.rating === topRating && "font-semibold text-primary")}>
                        {l.rating.toFixed(1)} ★{l.rating === topRating && " (highest)"}
                    </span>
                )
            ),
        },
        {
            label: "Monthly fee",
            cells: found.map((l) =>
                !l.details?.pricing ? (
                    "—"
                ) : (
                    <span className={cn(l.details.monthlyPrice === lowestPrice && "font-semibold text-primary")}>
                        {l.details.pricing}
                        {l.details.monthlyPrice === lowestPrice && " (lowest)"}
                    </span>
                )
            ),
        },
        {
            label: "Open now",
            cells: found.map((l) => {
                const status = l.details ? getOpenStatus(l.details.timings) : null;
                if (!status) return "—";
                return (
                    <span className={status.open ? "font-medium text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}>
                        {status.label}
                    </span>
                );
            }),
        },
        {
            label: "Hours today",
            cells: found.map((l) => (l.details ? formatHours(l.details.timings[today]) : "—")),
        },
        {
            label: "Area",
            cells: found.map((l) => [l.locality, l.district].filter(Boolean).join(", ")),
        },
        {
            label: "Last verified",
            cells: found.map((l) =>
                l.details?.lastVerified ? formatDate(l.details.lastVerified) : (
                    <span className="text-muted-foreground">Not verified yet</span>
                )
            ),
        },
    ];

    // only show amenities that at least one selected library has
    const amenityRows = AMENITY_KEYS.filter((a) => found.some((l) => l.details?.amenities.includes(a)));

    return (
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">Compare libraries</h1>
            <p className="mt-2 text-muted-foreground">Side by side, so you can pick the right one.</p>
            <p className="mt-6 text-xs text-muted-foreground sm:hidden">Swipe sideways to see every library →</p>
            <div
                role="region"
                aria-label="Comparison table"
                tabIndex={0}
                className="mt-3 overflow-x-auto rounded-2xl border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring sm:mt-8"
            >
                <table className="w-full min-w-[36rem] border-collapse text-sm">
                    <caption className="sr-only">Comparison of the selected libraries</caption>
                    <thead>
                        <tr className="border-b">
                            <th scope="col" className="sticky left-0 bg-card p-4 text-left">
                                <span className="sr-only">Feature</span>
                            </th>
                            {found.map((l) => (
                                <th key={l.id} scope="col" className="p-4 text-left align-top">
                                    <Link
                                        href={`/library/${l.id}`}
                                        className="font-display text-lg font-semibold underline-offset-4 hover:underline"
                                    >
                                        {l.name}
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.label} className="border-b">
                                <th scope="row" className="sticky left-0 bg-card p-4 text-left font-medium text-muted-foreground">
                                    {row.label}
                                </th>
                                {row.cells.map((cell, i) => (
                                    <td key={found[i].id} className="p-4 align-top">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        <tr>
                            <th
                                colSpan={found.length + 1}
                                scope="colgroup"
                                className="bg-accent/50 px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                            >
                                Amenities
                            </th>
                        </tr>
                        {amenityRows.map((a) => (
                            <tr key={a} className="border-b last:border-0">
                                <th scope="row" className="sticky left-0 bg-card p-4 text-left font-medium text-muted-foreground">
                                    {AMENITY_LABELS[a]}
                                </th>
                                {found.map((l) => {
                                    const has = l.details?.amenities.includes(a);
                                    return (
                                        <td key={l.id} className="p-4">
                                            {has ? (
                                                <Check className="size-4 text-primary" aria-hidden />
                                            ) : (
                                                <Minus className="size-4 text-muted-foreground" aria-hidden />
                                            )}
                                            <span className="sr-only">{has ? "Yes" : "No"}</span>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>

                </table>


            </div>

            <Link href="/explore" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
                Back to Explore
            </Link>
        </div>
    );
}