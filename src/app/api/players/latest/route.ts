import { NextResponse } from "next/server";
import { normalizePlayers } from "@/lib/sportmonks-normalize";

const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || "";

export async function GET() {
  const url = new URL(`${SPORTMONKS_BASE}/players/latest`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set("include", "position;nationality;teams;teams.team");

  const res = await fetch(url.toString(), { next: { revalidate: 7200 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch latest players" },
      { status: res.status }
    );
  }
  const data = await res.json();
  data.data = normalizePlayers(data.data || []);
  return NextResponse.json(data);
}
