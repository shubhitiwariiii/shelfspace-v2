export type Amenity = "ac" | "wifi" | "silent" | "lockers" | "charging" | "water" | "group-friendly";
export type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type DayHours = { open: string; close: string } | null; // null = closed

export type LibraryDetails = {
  ownerName?: string;
  ownerContact?: string;
  pricing?: string;          // display text, e.g. "₹600/month"
  monthlyPrice?: number;     // number, used for filters
  timings: Record<Day, DayHours>;
  amenities: Amenity[];
};

export type Library = {
  id: string;
  name: string;
  address: string;
  district: string;
  locality?: string;
  state: string;
  lat: number;
  lng: number;
  rating?: number;
  details?: LibraryDetails;
};