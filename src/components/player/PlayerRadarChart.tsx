"use client";

import {
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getRadarMetrics, getRadarPercentile, getStatValue } from "@/lib/radar-metrics";

interface PlayerRadarChartProps {
  statistics: { stat_type_id: number; value: number }[];
  positionCode: string;
  playerName: string;
  compareStatistics?: { stat_type_id: number; value: number }[];
  compareName?: string;
}

export function PlayerRadarChart({
  statistics,
  positionCode,
  playerName,
  compareStatistics,
  compareName,
}: PlayerRadarChartProps) {
  const metrics = getRadarMetrics(positionCode);

  const data = metrics.map((metric) => {
    const p1 = getRadarPercentile(positionCode, metric.key, getStatValue(statistics, metric.statIds));
    const p2 = compareStatistics
      ? getStatValue(compareStatistics, metric.statIds)
      : 0;

    const obj: Record<string, string | number> = { metric: metric.label };
    obj[playerName] = p1;
    if (compareStatistics) {
      obj[compareName || "Player 2"] = getRadarPercentile(positionCode, metric.key, p2);
    }
    return obj;
  });

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "var(--color-text-dim)" }}
          />
          <Radar
            name={playerName}
            dataKey={playerName}
            stroke="var(--color-primary-dark)"
            fill="var(--color-primary)"
            fillOpacity={0.5}
          />
          {compareStatistics && compareName && (
            <Radar
              name={compareName}
              dataKey={compareName}
              stroke="var(--color-secondary)"
              fill="var(--color-secondary)"
              fillOpacity={0.3}
            />
          )}
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  );
}
