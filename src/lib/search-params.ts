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
  near: parseAsString,
  maxPrice: parseAsInteger,
  amenities: parseAsArrayOf(parseAsStringLiteral(AMENITY_KEYS)).withDefault([]),
  open: parseAsBoolean.withDefault(false),
  sort: parseAsStringLiteral(SORT_KEYS),
};

export const searchParamsCache = createSearchParamsCache(searchParamParsers);