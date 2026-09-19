export type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  pricing?: string;
  area: string;
  distanceKm?: number;
};

export type UserPoint = { lat: number; lng: number };