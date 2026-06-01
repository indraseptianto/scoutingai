const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";

const API_TOKEN = typeof window === "undefined"
  ? process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || ""
  : "";

interface FetchOptions {
  include?: string;
  filters?: Record<string, string>;
  page?: number;
}

async function sportmonksFetch<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  if (typeof window === "undefined") {
    const url = new URL(`${SPORTMONKS_BASE}${endpoint}`);
    url.searchParams.set("api_token", API_TOKEN);

    if (options?.include) {
      url.searchParams.set("include", options.include);
    }
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        url.searchParams.set(`filters[${key}]`, value);
      });
    }
    if (options?.page) {
      url.searchParams.set("page", String(options.page));
    }

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`Sportmonks API error: ${res.status}`);
    return res.json();
  }
  throw new Error("Server-side only");
}

export async function getPlayerById(id: number): Promise<{ data: import("./sportmonks").PlayerProfile }> {
  return sportmonksFetch(`/players/${id}`, {
    include: "metadata;position;detailedPosition;statistics;statistics.details;transfers;pendingTransfers;teams;trophies;nationality",
  });
}

export async function searchPlayers(
  query: string,
  page = 1
): Promise<{ data: import("./sportmonks").PlayerSearchResult[] }> {
  return sportmonksFetch(`/players/search/${encodeURIComponent(query)}`, {
    include: "position;detailedPosition;nationality;teams",
    page,
  });
}

export async function getLatestPlayers(): Promise<{ data: import("./sportmonks").PlayerSearchResult[] }> {
  return sportmonksFetch("/players/latest", {
    include: "position;nationality;teams",
  });
}

export async function getPlayersByCountry(
  countryId: number,
  page = 1
): Promise<{ data: import("./sportmonks").PlayerSearchResult[] }> {
  return sportmonksFetch(`/players/country/${countryId}`, {
    include: "position;nationality;teams",
    page,
  });
}
