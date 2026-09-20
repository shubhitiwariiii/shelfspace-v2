import { Badge } from "@/components/ui/badge";
import { formatTime, getTodayKey } from "@/lib/open-now";
import type { Day, LibraryDetails } from "@/lib/types";
import { cn } from "@/lib/utils";

const ORDER: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const LABELS: Record<Day, string> = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

export function TimingsTable({ timings }: { timings: LibraryDetails["timings"] }) {
  const today = getTodayKey();

  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Opening hours by day</caption>
      <tbody>
        {ORDER.map((d) => {
          const hours = timings[d];
          const isToday = d === today;
          const is24h = hours?.open === "00:00" && hours?.close === "23:59";

          return (
            <tr key={d} className="border-b last:border-0">
              <th scope="row" className={cn("py-2.5 pr-4 text-left", isToday ? "font-semibold" : "font-normal")}>
                {LABELS[d]}
                {isToday && (
                  <Badge variant="secondary" className="ml-2">
                    Today
                  </Badge>
                )}
              </th>
              <td className={cn("py-2.5 text-right", isToday && "font-semibold", !hours && "text-muted-foreground")}>
                {!hours ? "Closed" : is24h ? "Open 24 hours" : `${formatTime(hours.open)} – ${formatTime(hours.close)}`}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}