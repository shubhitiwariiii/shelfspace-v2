import { SavedList } from "@/components/saved-list";

export const metadata = { title: "Saved libraries | ShelfSpace" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Saved libraries</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Libraries you&apos;ve bookmarked. When you&apos;re logged in they&apos;re stored in your account and
        available on any device.
      </p>
      <div className="mt-8">
        <SavedList />
      </div>
    </div>
  );
}