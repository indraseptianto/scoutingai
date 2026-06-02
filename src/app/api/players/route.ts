import { NextResponse } from "next/server";
import { filterPlayers, parseFilterParams } from "@/lib/player-filters";
import { getSeasonId } from "@/lib/seasons";
import { enrichPlayersWithLeagueNames } from "@/lib/sportmonks-context";
import { hasStatThresholdParams, normalizePlayer, normalizePlayers } from "@/lib/sportmonks-normalize";

const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || "";

async function fetchPlayerDetail(id: number, season?: string, league?: string) {
  const url = new URL(`${SPORTMONKS_BASE}/players/${id}`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set("include", "position;detailedPosition;nationality;teams;teams.team;statistics;statistics.details");
  const seasonId = getSeasonId(season || "", league);
  if (seasonId) url.searchParams.set("filters", `playerStatisticSeasons:${seasonId}`);
  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) return null;
  const data = await res.json();
  return normalizePlayer(data.data || data);
}

async function enrichPlayersWithStats(players: Record<string, unknown>[], filters: URLSearchParams) {
  if (!hasStatThresholdParams(filters)) return players;
  const season = filters.get("season") || undefined;
  const league = filters.get("league") || undefined;
  return Promise.all(
    players.map(async (player) => {
      const stats = Array.isArray(player.statistics) ? player.statistics : [];
      if (stats.length > 0) return player;
      const id = Number(player.id);
      if (!Number.isFinite(id)) return player;
      return (await fetchPlayerDetail(id, season, league)) || player;
    })
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  const url = new URL(`${SPORTMONKS_BASE}/players`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set("include", "position;detailedPosition;nationality;teams;teams.team;statistics;statistics.details");
  url.searchParams.set("page", page);

  const res = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: res.status }
    );
  }
  const data = await res.json();
  data.data = normalizePlayers(data.data || []);
  if (searchParams.get("league")) {
    data.data = await enrichPlayersWithLeagueNames(SPORTMONKS_BASE, API_TOKEN, data.data);
  }
  data.data = await enrichPlayersWithStats(data.data, searchParams);
  data.data = filterPlayers(data.data || [], parseFilterParams(searchParams));
  return NextResponse.json(data);
}
