type RawRecord = Record<string, unknown>;

function asRecord(value: unknown): RawRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawRecord) : undefined;
}

function numericValue(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const record = asRecord(value);
  if (!record) return null;
  for (const key of ["total", "count", "average", "avg", "percentage", "value"]) {
    const parsed = numericValue(record[key]);
    if (parsed !== null) return parsed;
  }
  return null;
}

function collectStatisticDetails(value: unknown): { stat_type_id: number; value: number }[] {
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value)) return value.flatMap(collectStatisticDetails);
  const record = value as RawRecord;
  const statTypeId = Number(record.type_id || record.stat_type_id || asRecord(record.type)?.id);
  const statValue = numericValue(record.value ?? record.values);
  const direct = Number.isFinite(statTypeId) && statValue !== null
    ? [{ stat_type_id: statTypeId, value: statValue }]
    : [];
  return [...direct, ...Object.values(record).flatMap(collectStatisticDetails)];
}

function normalizeDetails(details: unknown): { stat_type_id: number; value: number }[] {
  if (!Array.isArray(details)) return [];
  return details
    .map((detail) => {
      const record = asRecord(detail);
      if (!record) return null;
      const statTypeId = Number(record.type_id || record.stat_type_id || asRecord(record.type)?.id);
      const value = numericValue(record.value ?? record.values);
      if (!Number.isFinite(statTypeId) || value === null) return null;
      return { stat_type_id: statTypeId, value };
    })
    .filter((detail): detail is { stat_type_id: number; value: number } => detail !== null);
}

export function normalizePlayer(player: unknown): RawRecord {
  const record = asRecord(player);
  if (!record) return {};

  const detailedPosition = record.detailed_position || record.detailedPosition || record.detailedposition;
  const rawStatistics = Array.isArray(record.statistics) ? record.statistics : [];
  const flattenedStatistics = rawStatistics.flatMap((stat) => {
    const statRecord = asRecord(stat);
    if (!statRecord) return [];
    return [...collectStatisticDetails(statRecord), ...normalizeDetails(statRecord.details)];
  });
  const uniqueStatistics = Array.from(
    new Map(flattenedStatistics.map((stat) => [stat.stat_type_id, stat])).values()
  );

  const teams = Array.isArray(record.teams)
    ? record.teams.map((team) => {
        const teamRecord = asRecord(team) || {};
        const nestedTeam = asRecord(teamRecord.team) || asRecord(teamRecord.participant) || {};
        return {
          ...teamRecord,
          id: Number(nestedTeam.id || teamRecord.team_id || teamRecord.id || 0),
          name: String(nestedTeam.name || teamRecord.name || teamRecord.team_name || ""),
          image_path: String(nestedTeam.image_path || teamRecord.image_path || ""),
        };
      })
    : [];

  const metadata = Array.isArray(record.metadata) ? record.metadata : [];
  const preferredFoot = String(
    record.preferred_foot ||
    metadata.find((item) => Number(asRecord(item)?.type_id) === 229 && asRecord(item)?.values)?.values ||
    ""
  );

  const trophies = Array.isArray(record.trophies)
    ? record.trophies.map((trophy) => {
        const trophyRecord = asRecord(trophy) || {};
        const nestedTrophy = asRecord(trophyRecord.trophy) || {};
        const league = asRecord(trophyRecord.league) || {};
        const season = asRecord(trophyRecord.season) || {};
        return {
          ...trophyRecord,
          name: String(nestedTrophy.name || trophyRecord.name || `Trophy #${trophyRecord.trophy_id || trophyRecord.id || ""}`),
          league: String(league.name || trophyRecord.league_name || ""),
          season: String(season.name || trophyRecord.season_name || trophyRecord.season_id || ""),
        };
      })
    : [];

  return {
    ...record,
    detailed_position: detailedPosition,
    detailedPosition,
    detailedposition: detailedPosition,
    teams,
    preferred_foot: preferredFoot || record.preferred_foot,
    trophies,
    statistics: uniqueStatistics,
  };
}

export function normalizePlayers(players: unknown): RawRecord[] {
  if (!Array.isArray(players)) return [];
  return players.map(normalizePlayer);
}

export function hasStatThresholdParams(searchParams: URLSearchParams) {
  return ["goals_min", "assists_min", "pass_min", "rating_min", "apps_min", "tackles_min"].some((param) => {
    const value = Number(searchParams.get(param));
    return Number.isFinite(value) && value > 0;
  });
}
