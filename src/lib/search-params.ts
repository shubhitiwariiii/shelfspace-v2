import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import { AMENITY_KEYS, SORT_KEYS } from "@/lib/constants";

export const searchParamParsers = {
  q: parseAsString.withDefault(""),
  lat: parseAsFloat,
  lng: parseAsFloat,
  near: parseAsString, // "1" when arriving from the landing page's "Near me" button
  maxPrice: parseAsInteger,
  amenities: parseAsArrayOf(parseAsStringLiteral(AMENITY_KEYS)).withDefault([]),
  open: parseAsBoolean.withDefault(false),
  sort: parseAsStringLiteral(SORT_KEYS),
};

export const searchParamsCache = createSearchParamsCache(searchParamParsers);