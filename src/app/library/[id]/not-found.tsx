import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Library not found</h1>
      <p className="mt-3 text-muted-foreground">It may have been removed, or the link is wrong.</p>
      <Link href="/explore" className={cn(buttonVariants(), "mt-6")}>
        Browse all libraries
      </Link>
    </div>
  );
}