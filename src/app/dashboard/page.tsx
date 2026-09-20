import { SavedList } from "@/components/saved-list";

export const metadata = { title: "Saved libraries | ShelfSpace" };

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-semibold sm:text-4xl">Saved libraries</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Your saved libraries are kept on this device. Accounts, coming soon, will keep them in sync everywhere.
      </p>
      <div className="mt-8">
        <SavedList />
      </div>
    </div>
  );
}