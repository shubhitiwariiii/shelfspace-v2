"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LocateFixed, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBox() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/explore?q=${encodeURIComponent(term)}` : "/explore");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor="hero-search" className="sr-only">
          Search libraries by name, area or city
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="hero-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
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
        onClick={() => router.push("/explore?near=1")}
      >
        <LocateFixed className="mr-2 size-4" aria-hidden />
        Near me
      </Button>
    </form>
  );
}