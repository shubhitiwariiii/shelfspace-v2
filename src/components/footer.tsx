import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
            <BookOpen className="size-4 text-primary" aria-hidden />
            ShelfSpace
          </Link>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Find libraries and study spaces near you, with the pricing, timings and amenities a map
            pin never tells you.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-6 text-sm text-muted-foreground">
          <Link href="/explore" className="hover:text-foreground">Explore</Link>
          <Link href="/dashboard" className="hover:text-foreground">Saved</Link>
          <Link href="/login" className="hover:text-foreground">Log in</Link>
        </nav>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ShelfSpace. A student project.
      </div>
    </footer>
  );
}