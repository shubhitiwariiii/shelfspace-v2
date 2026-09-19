import type { Day, LibraryDetails } from "@/lib/types";

// Vercel servers run in UTC, but these libraries are in India.
const TIME_ZONE = "Asia/Kolkata";

function nowInZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const day = get("weekday").slice(0, 3).toLowerCase() as Day;
  const hour = Number(get("hour")) % 24; // some engines return "24" for midnight
  return { day, minutes: hour * 60 + Number(get("minute")) };
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function getOpenStatus(timings: LibraryDetails["timings"], date = new Date()) {
  const { day, minutes } = nowInZone(date);
  const today = timings[day];
  if (!today) return { open: false, label: "Closed today" };

  const open = toMinutes(today.open);
  const close = toMinutes(today.close);
  // close < open means it runs past midnight (e.g. 18:00 to 02:00)
  const isOpen = close >= open ? minutes >= open && minutes <= close : minutes >= open || minutes < close;

  if (isOpen) {
    const is24h = today.open === "00:00" && today.close === "23:59";
    return { open: true, label: is24h ? "Open 24 hours" : `Open now · until ${formatTime(today.close)}` };
  }
  return {
    open: false,
    label: minutes < open ? `Closed · opens ${formatTime(today.open)}` : "Closed now",
  };
}

export const isOpenNow = (timings: LibraryDetails["timings"], date = new Date()) =>
  getOpenStatus(timings, date).open;