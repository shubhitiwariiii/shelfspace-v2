"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error); // later: send to an error-tracking service
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <TriangleAlert className="size-12 text-muted-foreground" aria-hidden />
      <h1 className="mt-6 font-display text-4xl font-semibold">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">
        An unexpected error happened on our side. Try again, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go home
        </Link>
      </div>
    </div>
  );
}