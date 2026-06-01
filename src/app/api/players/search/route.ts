import { NextResponse } from "next/server";
import { filterPlayers, parseFilterParams } from "@/lib/player-filters";
import { getSeasonId } from "@/lib/seasons";
import { hasStatThresholdParams, normalizePlayer, normalizePlayers } from "@/lib/sportmonks-normalize";

const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || "";

async function fetchPlayerDetail(id: number, season?: string) {
  const url = new URL(`${SPORTMONKS_BASE}/players/${id}`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set("include", "position;detailedPosition;nationality;teams;statistics;statistics.details");
  const seasonId = getSeasonId(season || "");
  if (seasonId) url.searchParams.set("filters", `playerStatisticSeasons:${seasonId}`);
  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) return null;
  const data = await res.json();
  return normalizePlayer(data.data || data);
}

async function enrichPlayersWithStats(players: Record<string, unknown>[], filters: URLSearchParams) {
  if (!hasStatThresholdParams(filters)) return players;
  const season = filters.get("season") || undefined;
  return Promise.all(
    players.map(async (player) => {
      const stats = Array.isArray(player.statistics) ? player.statistics : [];
      if (stats.length > 0) return player;
      const id = Number(player.id);
      if (!Number.isFinite(id)) return player;
      return (await fetchPlayerDetail(id, season)) || player;
    })
  );
}

async function sportmonksFetch(endpoint: string, filters?: URLSearchParams) {
  const url = new URL(`${SPORTMONKS_BASE}${endpoint}`);
  url.searchParams.set("api_token", API_TOKEN);

  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }
  const data = await res.json();
  data.data = normalizePlayers(data.data || []);
  if (filters) {
    data.data = await enrichPlayersWithStats(data.data, filters);
    const parsedFilters = parseFilterParams(filters);
    data.data = filterPlayers(data.data || [], parsedFilters);
  }
  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";

  return sportmonksFetch(
    `/players/search/${encodeURIComponent(query)}?include=position;detailedPosition;nationality;teams;statistics;statistics.details&page=${page}`,
    searchParams
  );
}
