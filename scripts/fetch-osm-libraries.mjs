// scripts/fetch-osm-libraries.mjs
// Fetches real library locations from OpenStreetMap (Overpass API) and
// upserts them directly into the Supabase `libraries` table.
// Run with: npm run fetch:osm

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Service role key bypasses RLS — correct here, since this is a trusted,
// server-only script, never something that runs in a user's browser.
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// const OVERPASS_URL = "https://overpass-api.de/api/interpreter";.
// Public Overpass instances — overpass-api.de is the main one but frequently
// overloaded (502/504), so we fall back to community mirrors on failure.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.ru/api/interpreter",
];

const AREAS = [
  { district: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462, radius: 20000 },
  { district: "Greater Noida", state: "Uttar Pradesh", lat: 28.4744, lng: 77.504, radius: 20000 },
];

function buildQuery({ lat, lng, radius }) {
  return `
    [out:json][timeout:25];
    (
      node(around:${radius},${lat},${lng})[amenity=library];
      way(around:${radius},${lat},${lng})[amenity=library];
    );
    out center tags;
  `;
}

async function fetchFromEndpoint(endpoint, area) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
      "User-Agent": "ShelfSpace-student-project/1.0 (college mini project)",
    },
    body: buildQuery(area),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchArea(area, attempt = 0) {
  const endpoint = OVERPASS_ENDPOINTS[attempt];
  try {
    const data = await fetchFromEndpoint(endpoint, area);
    return data.elements.map((el) => toLibraryRow(el, area));
  } catch (err) {
    if (attempt >= OVERPASS_ENDPOINTS.length - 1) {
      throw new Error(`All Overpass mirrors failed for ${area.district}: ${err.message}`);
    }
    console.warn(`    ${endpoint} failed (${err.message}), trying next mirror...`);
    await new Promise((r) => setTimeout(r, 1500));
    return fetchArea(area, attempt + 1);
  }
}

let counter = 0;

function toLibraryRow(el, area) {
  const tags = el.tags ?? {};
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  counter += 1;

  const addressParts = [tags["addr:housenumber"], tags["addr:street"], tags["addr:suburb"]]
    .filter(Boolean)
    .join(", ");

  return {
    id: `osm-${el.type}-${el.id}`,
    name: tags.name || tags["name:en"] || `Library #${counter} (${area.district})`,
    address: addressParts || `${area.district}, ${area.state}`,
    district: area.district,
    locality: tags["addr:suburb"] || tags["addr:neighbourhood"] || null,
    state: area.state,
    lat,
    lng,
    source: "openstreetmap",
  };
}

function dedupe(rows) {
  const seen = new Set();
  return rows.filter((r) => {
    const key = `${r.name.toLowerCase()}|${r.lat.toFixed(3)}|${r.lng.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  console.log("Fetching libraries from OpenStreetMap...");
  const results = [];
  for (const area of AREAS) {
    console.log(`  - ${area.district}...`);
    const rows = await fetchArea(area);
    console.log(`    found ${rows.length}`);
    results.push(...rows);
  }

  const rows = dedupe(results).filter((r) => r.lat && r.lng);
  console.log(`Total unique libraries: ${rows.length}`);

  if (rows.length === 0) {
    console.warn("No libraries found. OSM coverage may be sparse here — try widening the radius.");
    return;
  }

  console.log("Upserting into Supabase...");
  const { error, count } = await supabase
    .from("libraries")
    .upsert(rows, { onConflict: "id", count: "exact" });

  if (error) {
    console.error("Supabase upsert failed:", error.message);
    process.exit(1);
  }

  console.log(`Done. ${count ?? rows.length} rows written to the libraries table.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});