import { NextResponse } from "next/server";
import { getSeasonId } from "@/lib/seasons";
import { enrichPlayerTeamNames } from "@/lib/sportmonks-context";
import { normalizePlayer } from "@/lib/sportmonks-normalize";

const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || "";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const seasonName = searchParams.get("season") || "";
  const leagueName = searchParams.get("league") || undefined;
  const seasonId = getSeasonId(seasonName, leagueName);

  const url = new URL(`${SPORTMONKS_BASE}/players/${id}`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set(
    "include",
    "metadata;position;detailedPosition;statistics;statistics.details;transfers;pendingTransfers;teams;teams.team;trophies;trophies.trophy;trophies.league;trophies.season;nationality;lineups"
  );

  // If a valid season is requested, filter statistics to that season
  if (seasonId) {
    url.searchParams.set("filters", `playerStatisticSeasons:${seasonId}`);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Player not found" },
      { status: res.status }
    );
  }
  const data = await res.json();
  data.data = await enrichPlayerTeamNames(SPORTMONKS_BASE, API_TOKEN, normalizePlayer(data.data || data));
  data.scoutvision = {
    selectedSeason: seasonName || null,
    seasonId: seasonId || null,
    statsFallback: false,
    statsSource: seasonId ? "selected-season" : "latest-available",
    statsCount: Array.isArray(data.data.statistics) ? data.data.statistics.length : 0,
    subscriptionPlan: data.subscription?.[0]?.plans?.[0]?.plan || null,
  };

  if (seasonId && Array.isArray(data.data.statistics) && data.data.statistics.length === 0) {
    const fallbackUrl = new URL(`${SPORTMONKS_BASE}/players/${id}`);
    fallbackUrl.searchParams.set("api_token", API_TOKEN);
    fallbackUrl.searchParams.set(
      "include",
      "metadata;position;detailedPosition;statistics;statistics.details;transfers;pendingTransfers;teams;teams.team;trophies;trophies.trophy;trophies.league;trophies.season;nationality;lineups"
    );
    const fallbackRes = await fetch(fallbackUrl.toString(), { next: { revalidate: 1800 } });
    if (fallbackRes.ok) {
      const fallbackData = await fallbackRes.json();
      const fallbackPlayer = await enrichPlayerTeamNames(SPORTMONKS_BASE, API_TOKEN, normalizePlayer(fallbackData.data || fallbackData));
      if (Array.isArray(fallbackPlayer.statistics) && fallbackPlayer.statistics.length > 0) {
        data.data = fallbackPlayer;
        data.scoutvision.statsFallback = true;
        data.scoutvision.statsSource = "latest-available";
        data.scoutvision.statsCount = fallbackPlayer.statistics.length;
        data.scoutvision.fallbackReason = "Selected season returned no statistics; showing latest available player statistics.";
      }
    }
  }
  data.scoutvision.hasStatistics = Array.isArray(data.data.statistics) && data.data.statistics.length > 0;
  return NextResponse.json(data);
}
