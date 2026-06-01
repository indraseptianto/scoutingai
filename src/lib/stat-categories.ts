export interface StatCategory {
  name: string;
  key: string;
  colorVar: string;
  statIds: number[];
}

export const STAT_CATEGORIES: StatCategory[] = [
  {
    name: "Attacking",
    key: "attacking",
    colorVar: "--color-stat-attack",
    statIds: [52, 79, 86, 41, 42, 64, 580, 581, 5304, 27259, 47],
  },
  {
    name: "Creativity & Passing",
    key: "passing",
    colorVar: "--color-stat-pass",
    statIds: [80, 81, 82, 116, 1584, 117, 98, 99, 122, 123, 124, 125],
  },
  {
    name: "Defending",
    key: "defending",
    colorVar: "--color-stat-defend",
    statIds: [78, 100, 101, 97, 107, 571, 27255],
  },
  {
    name: "Duels & Dribbling",
    key: "duels",
    colorVar: "--color-stat-duel",
    statIds: [105, 106, 108, 109, 110, 94, 96],
  },
  {
    name: "Discipline",
    key: "discipline",
    colorVar: "--color-stat-attack",
    statIds: [84, 85, 83, 56, 87, 51],
  },
  {
    name: "Goalkeeper",
    key: "goalkeeper",
    colorVar: "--color-stat-gk",
    statIds: [57, 104, 88, 194],
  },
  {
    name: "Participation",
    key: "participation",
    colorVar: "--color-stat-pass",
    statIds: [321, 119, 322, 323, 118, 214, 215, 216, 9676],
  },
];

export const STAT_LABELS: Record<number, string> = {
  52: "Goals",
  79: "Assists",
  86: "Shots on Target",
  41: "Shots Off Target",
  42: "Shots Total",
  64: "Hit Woodwork",
  580: "Big Chances Created",
  581: "Big Chances Missed",
  5304: "Expected Goals (xG)",
  27259: "Hattricks",
  47: "Penalties",
  80: "Passes",
  81: "Successful Passes",
  82: "Pass Accuracy %",
  116: "Accurate Passes",
  1584: "Accurate Passes %",
  117: "Key Passes",
  98: "Total Crosses",
  99: "Accurate Crosses",
  122: "Long Balls",
  123: "Long Balls Won",
  124: "Through Balls",
  125: "Through Balls Won",
  78: "Tackles",
  100: "Interceptions",
  101: "Clearances",
  97: "Blocked Shots",
  107: "Aerials Won",
  571: "Error Lead to Goal",
  27255: "Crosses Blocked",
  105: "Total Duels",
  106: "Duels Won",
  108: "Dribble Attempts",
  109: "Successful Dribbles",
  110: "Dribbled Past",
  94: "Dispossessed",
  96: "Fouls Drawn",
  84: "Yellow Cards",
  85: "Yellow-Red Cards",
  83: "Red Cards",
  56: "Fouls",
  87: "Injuries",
  51: "Offsides",
  57: "Saves",
  104: "Saves Inside Box",
  88: "Goals Conceded",
  194: "Clean Sheets",
  321: "Appearances",
  119: "Minutes Played",
  322: "Lineups",
  323: "Bench",
  118: "Rating",
  214: "Team Wins",
  215: "Team Draws",
  216: "Team Losses",
  9676: "Avg Points/Game",
};

export function getStatsByCategory(
  statistics: { stat_type_id: number; value: number }[],
  categoryKey: string
): { label: string; value: number }[] {
  const category = STAT_CATEGORIES.find((c) => c.key === categoryKey);
  if (!category) return [];

  return category.statIds
    .map((id) => {
      const stat = statistics.find((s) => s.stat_type_id === id);
      return stat
        ? { label: STAT_LABELS[id] || `Stat ${id}`, value: stat.value }
        : null;
    })
    .filter(Boolean) as { label: string; value: number }[];
}

export function getPositionCategory(
  positionCode: string
): "goalkeeper" | "defender" | "midfielder" | "attacker" {
  switch (positionCode) {
    case "goalkeeper":
      return "goalkeeper";
    case "defender":
      return "defender";
    case "midfielder":
      return "midfielder";
    case "attacker":
      return "attacker";
    default:
      return "midfielder";
  }
}

export const POSITION_COLORS = {
  goalkeeper: { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
  defender: { bg: "#DBEAFE", text: "#1E3A8A", border: "#3B82F6" },
  midfielder: { bg: "#D1FAE5", text: "#064E3B", border: "#10B981" },
  attacker: { bg: "#FEE2E2", text: "#7F1D1D", border: "#EF4444" },
} as const;
