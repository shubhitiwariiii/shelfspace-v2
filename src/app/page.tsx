import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6">
      <Badge>Design system check</Badge>
      <h1 className="font-display text-5xl font-semibold tracking-tight">
        Find your quiet corner to study.
      </h1>
      <p className="text-muted-foreground">
        Libraries and study spaces near you, with real pricing and timings.
      </p>
      <Button>Search libraries</Button>
    </main>
  );
}