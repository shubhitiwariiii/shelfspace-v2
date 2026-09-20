import { HeroPreview } from "@/components/hero-preview";
import Link from "next/link";
import { ArrowRight, Bookmark, Clock, IndianRupee, LocateFixed, MapPin, Search, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/fade-in";
import { LibraryCard } from "@/components/library-card";
import { SearchBox } from "@/components/search-box";
import { searchLibraries } from "@/lib/data/libraries";
import { cn } from "@/lib/utils";

const steps = [
  { icon: Search, title: "Search", text: "Type an area or city, or tap Near me." },
  { icon: MapPin, title: "Compare", text: "See distance, price, timings and amenities side by side." },
  { icon: Bookmark, title: "Save", text: "Bookmark your favourites and come back anytime." },
];

const features = [
  { icon: IndianRupee, title: "Real pricing", text: "Know the monthly fee before you walk in." },
  { icon: Clock, title: "Opening hours", text: "No more reaching a locked gate." },
  { icon: Wifi, title: "Amenities", text: "AC, Wi-Fi, lockers, silent zones and more." },
  { icon: LocateFixed, title: "Near you", text: "Sorted by real distance from where you are." },
];

export default async function Home() {
  const all = await searchLibraries();
  const featured = all.slice(0, 3);
  const districts = new Set(all.map((l) => l.district)).size;

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-linear-to-b from-primary/10 to-transparent" />
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <FadeIn>
            <Badge variant="secondary">Built for students</Badge>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-6xl">
              Find your quiet corner to study.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Libraries and study spaces near you, with the pricing, timings and amenities a map pin
              never tells you.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchBox />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-card">
        <dl className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-4 py-8 text-center sm:px-6">
          {[
            { label: "Libraries listed", value: all.length },
            { label: "Cities covered", value: districts },
            { label: "Cost to use", value: "Free" },
          ].map((s) => (
            <div key={s.label}>
              <dd className="font-display text-3xl font-semibold text-primary">{s.value}</dd>
              <dt className="mt-1 text-sm text-muted-foreground">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn>
          <h2 className="font-display text-3xl font-semibold">How it works</h2>
        </FadeIn>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.1}>
              <Card className="h-full gap-3 p-6">
                <s.icon className="size-6 text-primary" aria-hidden />
                <h3 className="font-display text-xl font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-accent/50">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <FadeIn>
            <h2 className="font-display text-3xl font-semibold">What a map pin doesn&apos;t tell you</h2>
          </FadeIn>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.08}>
                <Card className="h-full gap-3 p-6">
                  <f.icon className="size-6 text-primary" aria-hidden />
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured libraries */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <FadeIn>
              <h2 className="font-display text-3xl font-semibold">Popular libraries</h2>
            </FadeIn>
            <Link href="/explore" className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex">
              See all <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((l, i) => (
              <FadeIn key={l.id} delay={i * 0.08}>
                <LibraryCard library={l} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-semibold">Ready to find your spot?</h2>
          <p className="mx-auto mt-3 max-w-md opacity-90">
            Start with your area and see what&apos;s open near you.
          </p>
          <Link
            href="/explore"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-6")}
          >
            Explore libraries
          </Link>
        </div>
      </section>
    </div>
  );
}