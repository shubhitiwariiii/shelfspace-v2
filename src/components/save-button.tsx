"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleSaved, useSavedIds } from "@/lib/saved-store";
import { cn } from "@/lib/utils";

type Props = { id: string; label: string; compact?: boolean; className?: string };

export function SaveButton({ id, label, compact = false, className }: Props) {
  const saved = useSavedIds().includes(id);

  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-pressed={saved}
        aria-label={`${saved ? "Remove" : "Save"} ${label}`}
        onClick={() => toggleSaved(id)}
        className={className}
      >
        <Bookmark className={cn("size-5", saved && "fill-primary text-primary")} />
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={saved ? "default" : "outline"}
      aria-pressed={saved}
      onClick={() => toggleSaved(id)}
      className={className}
    >
      <Bookmark className={cn("mr-2 size-4", saved && "fill-current")} aria-hidden />
      {saved ? "Saved" : "Save"}
    </Button>
  );
}