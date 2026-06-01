// Season display name → Sportmonks season_id mapping
// Update these IDs to match your Sportmonks subscription
export const SEASONS: Record<string, number> = {
  "2024/25": 23621,
  "2023/24": 21646,
  "2022/23": 19734,
};

export const SEASON_NAMES = Object.keys(SEASONS);

export function getSeasonId(name: string): number | undefined {
  return SEASONS[name];
}

export function getSeasonName(id: number): string | undefined {
  return Object.entries(SEASONS).find(([, v]) => v === id)?.[0];
}
