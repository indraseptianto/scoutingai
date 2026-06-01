export interface RadarMetric {
  key: string;
  label: string;
  statIds: number[];
}

export const RADAR_METRICS: Record<string, RadarMetric[]> = {
  goalkeeper: [
    { key: "saves", label: "Saves", statIds: [57] },
    { key: "goalsConceded", label: "Goals Conceded", statIds: [88] },
    { key: "cleanSheets", label: "Clean Sheets", statIds: [194] },
    { key: "passAccuracy", label: "Pass %", statIds: [82] },
    { key: "aerialsWon", label: "Aerials Won", statIds: [107] },
    { key: "rating", label: "Rating", statIds: [118] },
  ],
  defender: [
    { key: "tackles", label: "Tackles", statIds: [78] },
    { key: "interceptions", label: "Interceptions", statIds: [100] },
    { key: "clearances", label: "Clearances", statIds: [101] },
    { key: "aerialsWon", label: "Aerials Won", statIds: [107] },
    { key: "passAccuracy", label: "Pass %", statIds: [82] },
    { key: "duelsWon", label: "Duels Won", statIds: [106] },
  ],
  midfielder: [
    { key: "keyPasses", label: "Key Passes", statIds: [117] },
    { key: "passAccuracy", label: "Pass %", statIds: [82] },
    { key: "dribbles", label: "Dribbles", statIds: [109] },
    { key: "tackles", label: "Tackles", statIds: [78] },
    { key: "goals", label: "Goals", statIds: [52] },
    { key: "assists", label: "Assists", statIds: [79] },
  ],
  attacker: [
    { key: "goals", label: "Goals", statIds: [52] },
    { key: "assists", label: "Assists", statIds: [79] },
    { key: "dribbles", label: "Dribbles", statIds: [109] },
    { key: "shotsOnTarget", label: "Shots on Target", statIds: [86] },
    { key: "xg", label: "xG", statIds: [5304] },
    { key: "keyPasses", label: "Key Passes", statIds: [117] },
  ],
};

export function getRadarMetrics(positionCode: string): RadarMetric[] {
  switch (positionCode) {
    case "goalkeeper":
      return RADAR_METRICS.goalkeeper;
    case "defender":
      return RADAR_METRICS.defender;
    case "midfielder":
      return RADAR_METRICS.midfielder;
    case "attacker":
      return RADAR_METRICS.attacker;
    default:
      return RADAR_METRICS.midfielder;
  }
}

export function getStatValue(
  statistics: { stat_type_id: number; value: number }[],
  statIds: number[]
): number {
  for (const stat of statistics) {
    if (statIds.includes(stat.stat_type_id)) return stat.value;
  }
  return 0;
}
