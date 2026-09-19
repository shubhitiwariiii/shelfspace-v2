import type { Amenity, DayHours, Library, LibraryDetails } from "@/lib/types";

const week = (weekday: DayHours, sunday: DayHours = weekday): LibraryDetails["timings"] => ({
  mon: weekday, tue: weekday, wed: weekday, thu: weekday, fri: weekday, sat: weekday, sun: sunday,
});

type Seed = {
  name: string; locality: string; district: string; lat: number; lng: number;
  rating: number; price: number; amenities: Amenity[];
  hours?: [string, string]; sundayClosed?: boolean;
};

const seeds: Seed[] = [
  // Lucknow
  { name: "Sample Study Library", locality: "Hazratganj", district: "Lucknow", lat: 26.8467, lng: 80.9462, rating: 4.4, price: 600, amenities: ["ac", "wifi", "silent"] },
  { name: "Gomti Reading Hub", locality: "Gomti Nagar", district: "Lucknow", lat: 26.857, lng: 81.003, rating: 4.6, price: 900, amenities: ["ac", "wifi", "lockers", "charging"], hours: ["06:00", "23:00"] },
  { name: "Aliganj Scholars Room", locality: "Aliganj", district: "Lucknow", lat: 26.889, lng: 80.942, rating: 4.0, price: 450, amenities: ["wifi", "water"], sundayClosed: true },
  { name: "Indira Nagar Study Point", locality: "Indira Nagar", district: "Lucknow", lat: 26.878, lng: 80.987, rating: 4.3, price: 700, amenities: ["ac", "silent", "charging"] },
  { name: "Alambagh Quiet Space", locality: "Alambagh", district: "Lucknow", lat: 26.809, lng: 80.901, rating: 3.9, price: 400, amenities: ["silent", "water"], hours: ["08:00", "20:00"] },
  { name: "Aminabad Book Circle", locality: "Aminabad", district: "Lucknow", lat: 26.849, lng: 80.926, rating: 4.2, price: 500, amenities: ["wifi", "group-friendly"] },
  { name: "Mahanagar Focus Library", locality: "Mahanagar", district: "Lucknow", lat: 26.87, lng: 80.955, rating: 4.5, price: 800, amenities: ["ac", "wifi", "silent", "lockers"], hours: ["05:30", "23:30"] },
  { name: "Chowk Heritage Reading Room", locality: "Chowk", district: "Lucknow", lat: 26.868, lng: 80.914, rating: 3.8, price: 350, amenities: ["water"], sundayClosed: true },
  // Greater Noida
  { name: "Sample Reading Room", locality: "Knowledge Park", district: "Greater Noida", lat: 28.4744, lng: 77.504, rating: 4.1, price: 500, amenities: ["wifi", "lockers", "charging"], sundayClosed: true },
  { name: "Alpha Study Lounge", locality: "Alpha 1", district: "Greater Noida", lat: 28.47, lng: 77.517, rating: 4.5, price: 850, amenities: ["ac", "wifi", "silent", "charging"], hours: ["06:00", "23:00"] },
  { name: "Pari Chowk Library", locality: "Pari Chowk", district: "Greater Noida", lat: 28.4645, lng: 77.5165, rating: 4.2, price: 600, amenities: ["ac", "wifi", "water"] },
  { name: "Beta Focus Hub", locality: "Beta 1", district: "Greater Noida", lat: 28.479, lng: 77.491, rating: 4.4, price: 750, amenities: ["ac", "silent", "lockers"] },
  { name: "Gamma Scholars Point", locality: "Gamma 1", district: "Greater Noida", lat: 28.465, lng: 77.522, rating: 4.0, price: 550, amenities: ["wifi", "group-friendly", "charging"] },
  { name: "Omega Reading Zone", locality: "Omega 1", district: "Greater Noida", lat: 28.4465, lng: 77.508, rating: 3.9, price: 450, amenities: ["wifi", "water"], hours: ["07:00", "21:00"] },
  { name: "Gaur City Study Hub", locality: "Greater Noida West", district: "Greater Noida", lat: 28.617, lng: 77.439, rating: 4.3, price: 650, amenities: ["ac", "wifi", "silent", "lockers"] },
  { name: "Zeta Night Library", locality: "Zeta 1", district: "Greater Noida", lat: 28.464, lng: 77.529, rating: 4.6, price: 1000, amenities: ["ac", "wifi", "silent", "charging", "lockers"], hours: ["00:00", "23:59"] },
];

export const libraries: Library[] = seeds.map((s, i) => ({
  id: String(i + 1),
  name: s.name,
  address: `${s.locality}, ${s.district}`,
  district: s.district,
  locality: s.locality,
  state: "Uttar Pradesh",
  lat: s.lat,
  lng: s.lng,
  rating: s.rating,
  details: {
    pricing: `₹${s.price}/month`,
    monthlyPrice: s.price,
    timings: week(
      { open: s.hours?.[0] ?? "07:00", close: s.hours?.[1] ?? "22:00" },
      s.sundayClosed ? null : undefined
    ),
    amenities: s.amenities,
  },
}));