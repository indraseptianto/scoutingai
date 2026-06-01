type RawRecord = Record<string, unknown>;

function asRecord(value: unknown): RawRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as RawRecord) : undefined;
}

function normalizeDetails(details: unknown): { stat_type_id: number; value: number }[] {
  if (!Array.isArray(details)) return [];
  return details
    .map((detail) => {
      const record = asRecord(detail);
      if (!record) return null;
      const statTypeId = Number(record.type_id || record.stat_type_id || asRecord(record.type)?.id);
      const value = Number(record.value);
      if (!Number.isFinite(statTypeId) || !Number.isFinite(value)) return null;
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
    const directTypeId = Number(statRecord.type_id || statRecord.stat_type_id);
    const directValue = Number(statRecord.value);
    const direct = Number.isFinite(directTypeId) && Number.isFinite(directValue)
      ? [{ stat_type_id: directTypeId, value: directValue }]
      : [];
    return [...direct, ...normalizeDetails(statRecord.details)];
  });

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

  return {
    ...record,
    detailed_position: detailedPosition,
    detailedPosition,
    detailedposition: detailedPosition,
    teams,
    statistics: flattenedStatistics,
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
