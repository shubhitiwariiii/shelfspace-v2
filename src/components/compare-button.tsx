"use client";

import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPARE_MAX } from "@/lib/constants";
import { toggleCompare, useCompareIds } from "@/lib/compare-store";
import { cn } from "@/lib/utils";

type Props = { id: string; label: string; compact?: boolean; className?: string };

export function CompareButton({ id, label, compact = false, className }: Props) {
  const ids = useCompareIds();
  const selected = ids.includes(id);
  const full = !selected && ids.length >= COMPARE_MAX;

  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-pressed={selected}
        disabled={full}
        aria-label={
          selected
            ? `Remove ${label} from comparison`
            : full
              ? `Comparison is full, maximum ${COMPARE_MAX}`
              : `Add ${label} to comparison`
        }
        title={full ? `You can compare up to ${COMPARE_MAX}` : selected ? "Remove from compare" : "Add to compare"}
        onClick={() => toggleCompare(id)}
        className={cn(selected && "bg-primary/10 text-primary", className)}
      >
        <Scale className="size-5" />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={selected ? "default" : "outline"}
      aria-pressed={selected}
      disabled={full}
      onClick={() => toggleCompare(id)}
      className={className}
    >
      <Scale className="mr-2 size-4" aria-hidden />
      {selected ? "Added to compare" : "Compare"}
    </Button>
  );
}