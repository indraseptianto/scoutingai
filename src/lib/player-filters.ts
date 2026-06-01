type RawPlayer = Record<string, unknown>;

export type PlayerFilterParams = {
  position?: string;
  detailed?: string[];
  leagues?: string[];
  ageMin?: number;
  ageMax?: number;
  nationality?: string;
  statThresholds?: Record<number, number>;
};

function getNestedName(value: unknown): string {
  if (!value || typeof value !== "object") return "";
  const record = value as Record<string, unknown>;
  return String(record.name || "").toLowerCase();
}

function calculateAge(dateOfBirth: unknown): number | null {
  if (!dateOfBirth || typeof dateOfBirth !== "string") return null;
  const birthDate = new Date(dateOfBirth);
  if (Number.isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function collectStat(value: unknown, statId: number): number | null {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = collectStat(item, statId);
      if (match !== null) return match;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  const id = Number(record.stat_type_id || record.type_id);
  if (id === statId && typeof record.value !== "undefined") {
    const numberValue = Number(record.value);
    return Number.isFinite(numberValue) ? numberValue : null;
  }
  for (const nested of Object.values(record)) {
    const match = collectStat(nested, statId);
    if (match !== null) return match;
  }
  return null;
}

export function filterPlayers(players: RawPlayer[], filters: PlayerFilterParams) {
  return players.filter((player) => {
    if (filters.position) {
      const position = player.position as Record<string, unknown> | undefined;
      const code = String(position?.code || "").toLowerCase();
      const name = String(position?.name || "").toLowerCase();
      if (code !== filters.position && name !== filters.position) return false;
    }

    if (filters.detailed?.length) {
      const detailedName = getNestedName(player.detailed_position || player.detailedPosition);
      const detailedFilters = filters.detailed.map((value) => value.toLowerCase());
      if (!detailedFilters.some((value) => detailedName.includes(value))) return false;
    }

    if (filters.leagues?.length) {
      const teams = Array.isArray(player.teams) ? player.teams : [];
      const leagueFilters = filters.leagues.map((value) => value.toLowerCase());
      const teamText = teams.map((team) => JSON.stringify(team).toLowerCase()).join(" ");
      if (!leagueFilters.some((league) => teamText.includes(league))) return false;
    }

    if (filters.nationality) {
      const nationality = getNestedName(player.nationality);
      if (!nationality.includes(filters.nationality.toLowerCase())) return false;
    }

    const age = calculateAge(player.date_of_birth);
    if (filters.ageMin !== undefined && age !== null && age < filters.ageMin) return false;
    if (filters.ageMax !== undefined && age !== null && age > filters.ageMax) return false;

    if (filters.statThresholds) {
      for (const [statId, minValue] of Object.entries(filters.statThresholds)) {
        const value = collectStat(player, Number(statId));
        if (value === null || value < minValue) return false;
      }
    }

    return true;
  });
}

export function parseFilterParams(searchParams: URLSearchParams): PlayerFilterParams {
  const statThresholds: Record<number, number> = {};
  const statMap = [
    [52, "goals_min"],
    [79, "assists_min"],
    [82, "pass_min"],
    [118, "rating_min"],
    [321, "apps_min"],
    [78, "tackles_min"],
  ] as const;

  statMap.forEach(([statId, param]) => {
    const value = Number(searchParams.get(param));
    if (Number.isFinite(value) && value > 0) statThresholds[statId] = value;
  });

  return {
    position: searchParams.get("position") || undefined,
    detailed: (searchParams.get("detailed") || searchParams.get("detailed_position") || "").split(",").filter(Boolean),
    leagues: (searchParams.get("league") || "").split(",").filter(Boolean),
    ageMin: searchParams.has("age_min") ? Number(searchParams.get("age_min")) : undefined,
    ageMax: searchParams.has("age_max") ? Number(searchParams.get("age_max")) : undefined,
    nationality: searchParams.get("nationality") || undefined,
    statThresholds: Object.keys(statThresholds).length ? statThresholds : undefined,
  };
}
