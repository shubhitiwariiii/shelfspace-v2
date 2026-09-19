"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import type { MapPoint, UserPoint } from "@/components/map/types";

// Custom SVG pin. Leaflet's default PNG icons break with bundlers, and this one follows our theme color.
const pinIcon = L.divIcon({
  className: "shelf-pin",
  html: `<svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 39C16 39 30 25.5 30 15C30 7.268 23.732 1 16 1C8.268 1 2 7.268 2 15C2 25.5 16 39 16 39Z"
      style="fill:var(--primary)" stroke="white" stroke-width="2"/>
    <circle cx="16" cy="15" r="5.5" fill="white"/>
  </svg>`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -36],
});

function MapController({ points, user }: { points: MapPoint[]; user: UserPoint | null }) {
  const map = useMap();

  const fit = useCallback(() => {
    if (map.getSize().x === 0) return; // map is hidden right now
    const coords: L.LatLngTuple[] = points.map((p) => [p.lat, p.lng]);
    if (user) coords.push([user.lat, user.lng]);
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView(coords[0], 15);
      return;
    }
    map.fitBounds(L.latLngBounds(coords), { padding: [40, 40], maxZoom: 15 });
  }, [map, points, user]);

  // zoom to the results whenever they change
  useEffect(() => {
    fit();
  }, [fit]);

  // a map inside a hidden container has size 0, so re-measure and re-fit when it becomes visible
  useEffect(() => {
    const el = map.getContainer();
    let wasHidden = el.clientWidth === 0;
    const observer = new ResizeObserver(() => {
      const hidden = el.clientWidth === 0;
      map.invalidateSize();
      if (wasHidden && !hidden) fit();
      wasHidden = hidden;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [map, fit]);

  return null;
}

export function MapView({ points, user }: { points: MapPoint[]; user: UserPoint | null }) {
  return (
    <MapContainer
      center={[22.5, 79]}
      zoom={5}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController points={points} user={user} />

      {points.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon} title={p.name}>
          <Popup>
            <div className="space-y-1">
              <p className="font-display text-base font-semibold leading-snug">{p.name}</p>
              <p className="text-xs opacity-70">
                {p.area}
                {p.distanceKm !== undefined && ` · ${p.distanceKm.toFixed(1)} km away`}
              </p>
              {p.pricing && <p className="text-sm font-medium">{p.pricing}</p>}
              <Link href={`/library/${p.id}`} className="text-sm font-medium hover:underline">
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}

      {user && (
        <CircleMarker
          center={[user.lat, user.lng]}
          radius={9}
          pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#2563eb", fillOpacity: 1 }}
        >
          <Tooltip>You are here</Tooltip>
        </CircleMarker>
      )}
    </MapContainer>
  );
}