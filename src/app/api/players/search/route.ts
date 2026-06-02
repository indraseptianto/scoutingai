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

async function processPlayers(players: Record<string, unknown>[], filters: URLSearchParams) {
  let processed = players;
  if (filters.get("league")) {
    processed = await enrichPlayersWithLeagueNames(SPORTMONKS_BASE, API_TOKEN, processed);
  }
  processed = await enrichPlayersWithStats(processed, filters);
  return filterPlayers(processed, parseFilterParams(filters));
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
  const normalized = normalizePlayers(data.data || []);
  if (filters) {
    const currentPage = Number(filters.get("page") || "1");
    let matched = await processPlayers(normalized, filters);
    let pagesScanned = 1;

    if (hasStatThresholdParams(filters) && data.pagination?.has_more && matched.length < 20) {
      for (let page = currentPage + 1; page <= currentPage + 4 && matched.length < 20; page++) {
        const nextUrl = new URL(url.toString());
        nextUrl.searchParams.set("page", String(page));
        const nextRes = await fetch(nextUrl.toString(), { next: { revalidate: 1800 } });
        if (!nextRes.ok) break;
        const nextData = await nextRes.json();
        pagesScanned++;
        matched = [...matched, ...(await processPlayers(normalizePlayers(nextData.data || []), filters))];
        if (!nextData.pagination?.has_more) break;
      }
    }
    data.data = matched;
    data.scoutvision = {
      ...(data.scoutvision || {}),
      pagesScanned,
      partialScan: Boolean(data.pagination?.has_more && pagesScanned >= 5),
    };
  } else {
    data.data = normalized;
  }
  return NextResponse.json(data);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";

  return sportmonksFetch(
    `/players/search/${encodeURIComponent(query)}?include=position;detailedPosition;nationality;teams;teams.team;statistics;statistics.details&page=${page}`,
    searchParams
  );
}
