import type { Library, DayHours } from "@/lib/types";

const everyDay = (h: DayHours) => ({ mon: h, tue: h, wed: h, thu: h, fri: h, sat: h, sun: h });
const daily = { open: "07:00", close: "22:00" };

export const libraries: Library[] = [
  {
    id: "1", name: "Sample Study Library", address: "Sample Road, Hazratganj",
    district: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, rating: 4.4,
    details: { pricing: "₹600/month", monthlyPrice: 600, timings: everyDay(daily), amenities: ["ac", "wifi", "silent"] },
  },
  {
    id: "2", name: "Sample Reading Room", address: "Sample Chowk, Knowledge Park",
    district: "Greater Noida", state: "Uttar Pradesh", lat: 28.4744, lng: 77.504, rating: 4.1,
    details: { pricing: "₹500/month", monthlyPrice: 500, timings: { ...everyDay(daily), sun: null }, amenities: ["wifi", "lockers", "charging"] },
  },
];