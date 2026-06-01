export const LEAGUE_OPTIONS = [
  "La Liga",
  "Premier League",
  "Championship",
  "League One",
  "League Two",
] as const;

export type SupportedLeague = (typeof LEAGUE_OPTIONS)[number];

// Fallback season IDs. Override with SPORTMONKS_SEASON_IDS_JSON for production accuracy.
// Shape: { "Premier League": { "2024/25": 23621 }, "default": { "2024/25": 23621 } }
const FALLBACK_SEASONS: Record<string, Record<string, number>> = {
  default: {
    "2024/25": 23621,
    "2023/24": 21646,
    "2022/23": 19734,
  },
};

function configuredSeasons() {
  const raw = process.env.SPORTMONKS_SEASON_IDS_JSON;
  if (!raw) return FALLBACK_SEASONS;
  try {
    return { ...FALLBACK_SEASONS, ...(JSON.parse(raw) as Record<string, Record<string, number>>) };
  } catch {
    return FALLBACK_SEASONS;
  }
}

export const SEASONS = FALLBACK_SEASONS.default;

export const SEASON_NAMES = Object.keys(SEASONS);

export function getSeasonId(name: string, league?: string): number | undefined {
  const seasons = configuredSeasons();
  return (league ? seasons[league]?.[name] : undefined) || seasons.default?.[name];
}

export function getSeasonName(id: number): string | undefined {
  return Object.entries(SEASONS).find(([, v]) => v === id)?.[0];
}
