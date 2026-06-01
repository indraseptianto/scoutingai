import { NextResponse } from "next/server";
import { getSeasonId } from "@/lib/seasons";
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
    "metadata;position;detailedPosition;statistics;statistics.details;transfers;pendingTransfers;teams;trophies;nationality;lineups"
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
  data.data = normalizePlayer(data.data || data);
  return NextResponse.json(data);
}
