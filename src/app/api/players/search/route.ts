import { NextResponse } from "next/server";

const SPORTMONKS_BASE = "https://api.sportmonks.com/v3/football";
const API_TOKEN = process.env.SPORTMONKS_API_TOKEN || process.env.NEXT_PUBLIC_SPORTMONKS_API_TOKEN || "";

async function sportmonksFetch(endpoint: string) {
  const url = new URL(`${SPORTMONKS_BASE}${endpoint}`);
  url.searchParams.set("api_token", API_TOKEN);

  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json({ error: errorText }, { status: res.status });
  }
  return NextResponse.json(await res.json());
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";
  const page = searchParams.get("page") || "1";

  return sportmonksFetch(
    `/players/search/${encodeURIComponent(query)}?include=position;detailedPosition;nationality;teams&page=${page}`
  );
}
