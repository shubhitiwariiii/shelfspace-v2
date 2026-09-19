import { createSearchParamsCache, parseAsFloat, parseAsString } from "nuqs/server";

export const searchParamParsers = {
  q: parseAsString.withDefault(""),
  lat: parseAsFloat,
  lng: parseAsFloat,
  near: parseAsString, // "1" when arriving from the landing page's "Near me" button
};

export const searchParamsCache = createSearchParamsCache(searchParamParsers);