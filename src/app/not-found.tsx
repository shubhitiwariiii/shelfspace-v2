import Link from "next/link";
import { BookX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <BookX className="size-12 text-muted-foreground" aria-hidden />
      <h1 className="mt-6 font-display text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        This shelf is empty. The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Go home
        </Link>
        <Link href="/explore" className={buttonVariants({ variant: "outline" })}>
          Browse libraries
        </Link>
      </div>
    </div>
  );
}