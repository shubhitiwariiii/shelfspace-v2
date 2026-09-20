"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { COMPARE_MAX } from "@/lib/constants";
import { clearCompare, useCompareIds } from "@/lib/compare-store";
import { cn } from "@/lib/utils";

export function CompareTray() {
  const ids = useCompareIds();
  const pathname = usePathname();

  if (ids.length === 0 || pathname.startsWith("/compare")) return null;
  const ready = ids.length >= 2;

  return (
    <div
      role="region"
      aria-label="Comparison tray"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border bg-card p-3 pl-4 shadow-lg"
    >
      <p className="flex items-center gap-2 text-sm font-medium">
        <Scale className="size-4 text-primary" aria-hidden />
        {ids.length} of {COMPARE_MAX} selected
        {!ready && <span className="font-normal text-muted-foreground">· pick one more</span>}
      </p>
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={clearCompare}>
          Clear
        </Button>
        {ready ? (
          <Link href={`/compare?ids=${ids.join(",")}`} className={buttonVariants({ size: "sm" })}>
            Compare
          </Link>
        ) : (
          <span aria-disabled="true" className={cn(buttonVariants({ size: "sm" }), "pointer-events-none opacity-50")}>
            Compare
          </span>
        )}
      </div>
    </div>
  );
}