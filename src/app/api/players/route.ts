import { NextResponse } from "next/server";
import { filterPlayers, parseFilterParams } from "@/lib/player-filters";

const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || "";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  const url = new URL(`${SPORTMONKS_BASE}/players`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set("include", "position;detailedPosition;nationality;teams;statistics;statistics.details");
  url.searchParams.set("page", page);

  const res = await fetch(url.toString(), { next: { revalidate: 600 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: res.status }
    );
  }
  const data = await res.json();
  data.data = filterPlayers(data.data || [], parseFilterParams(searchParams));
  return NextResponse.json(data);
}
