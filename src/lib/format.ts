export function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC", // "2026-09-12" is parsed as UTC midnight, so format in UTC to avoid off-by-one days
  }).format(new Date(isoDate));
}