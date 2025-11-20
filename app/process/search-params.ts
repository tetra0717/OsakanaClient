import { parseAsString, createLoader } from "nuqs/server";

export const searchParams = {
  nfcId: parseAsString.withDefault(""),
  name: parseAsString.withDefault(""),
  status: parseAsString.withDefault(""),
  error: parseAsString.withDefault(""),
};

export const loadSearchParams = createLoader(searchParams);
