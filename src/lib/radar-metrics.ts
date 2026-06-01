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

const RADAR_BENCHMARKS: Record<string, Record<string, number>> = {
  goalkeeper: { saves: 120, goalsConceded: 55, cleanSheets: 18, passAccuracy: 95, aerialsWon: 90, rating: 8.5 },
  defender: { tackles: 120, interceptions: 95, clearances: 170, aerialsWon: 150, passAccuracy: 95, duelsWon: 220 },
  midfielder: { keyPasses: 90, passAccuracy: 95, dribbles: 90, tackles: 110, goals: 18, assists: 18 },
  attacker: { goals: 35, assists: 20, dribbles: 120, shotsOnTarget: 90, xg: 28, keyPasses: 80 },
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

export function getRadarPercentile(positionCode: string, metricKey: string, value: number): number {
  const benchmarks = RADAR_BENCHMARKS[positionCode] || RADAR_BENCHMARKS.midfielder;
  const benchmark = benchmarks[metricKey] || 100;
  const raw = Math.round((value / benchmark) * 100);
  return Math.max(0, Math.min(raw, 100));
}
