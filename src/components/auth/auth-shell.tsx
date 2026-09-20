import { BookOpen, Check } from "lucide-react";

const benefits = [
  "Save your favourite libraries",
  "Compare fees, timings and amenities",
  "See what's open right now",
];

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
      <div className="hidden rounded-3xl bg-primary p-10 text-primary-foreground lg:block">
        <BookOpen className="size-8" aria-hidden />
        <p className="mt-6 font-display text-3xl font-semibold leading-tight">
          Your quiet corner is one search away.
        </p>
        <ul className="mt-8 space-y-3">
          {benefits.map((b) => (
            <li key={b} className="flex items-center gap-2.5">
              <Check className="size-5 shrink-0" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mx-auto w-full max-w-md">
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </div>
    </div>
  );
}