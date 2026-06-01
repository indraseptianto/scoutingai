import { NextResponse } from "next/server";

const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || "";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(`${SPORTMONKS_BASE}/players/${id}`);
  url.searchParams.set("api_token", API_TOKEN);
  url.searchParams.set(
    "include",
    "metadata;position;detailedPosition;statistics;statistics.details;transfers;pendingTransfers;teams;trophies;nationality;lineups"
  );

  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Player not found" },
      { status: res.status }
    );
  }
  return NextResponse.json(await res.json());
}
