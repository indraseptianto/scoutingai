"use client";

import { useState } from "react";
import { STAT_CATEGORIES, STAT_LABELS } from "@/lib/stat-categories";

interface PlayerStatsTableProps {
  statistics: { stat_type_id: number; value: number }[];
}

export function PlayerStatsTable({ statistics }: PlayerStatsTableProps) {
  const [activeTab, setActiveTab] = useState("attacking");

  const relevantCategories = STAT_CATEGORIES;

  const activeCategory = STAT_CATEGORIES.find((c) => c.key === activeTab);
  const statIds = activeCategory?.statIds || [];
  const stats = statIds
    .map((id, index) => {
      const stat = statistics.find((s) => s.stat_type_id === id);
      return {
        id,
        label: STAT_LABELS[id] || `Stat ${id}`,
        value: stat?.value ?? null,
        rank: index + 1,
      };
    })
    .filter(Boolean) as { id: number; label: string; value: number | null; rank: number }[];

  const maxValue = Math.max(...stats.map((s) => s.value ?? 0), 1);

  return (
    <div>
      <div
        className="flex flex-wrap gap-1 border-b pb-3 mb-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        {relevantCategories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveTab(cat.key)}
            className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200"
            style={{
              backgroundColor:
                activeTab === cat.key ? `var(${cat.colorVar})` : "transparent",
              color: activeTab === cat.key ? "#FFFFFF" : "var(--color-text-muted)",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-0">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="grid items-center gap-3 py-2.5 hover:bg-white/30 rounded transition-colors px-2 -mx-2"
            style={{
              gridTemplateColumns: "2fr 70px 60px 1fr",
              borderBottom:
                index < stats.length - 1
                  ? "1px solid var(--color-border)"
                  : "none",
            }}
          >
            <span className="text-sm truncate" style={{ color: "var(--color-text)" }}>
              {stat.label}
            </span>
            <span
              className="text-sm font-mono font-semibold tabular-nums text-right"
              style={{ color: "var(--color-text)" }}
              title={stat.value === null ? "Not available for this season" : undefined}
            >
              {stat.value ?? "—"}
            </span>
            <span
              className="text-xs text-center"
              style={{ color: "var(--color-text-dim)" }}
            >
              {stat.rank <= 3
                ? `${["1st", "2nd", "3rd"][stat.rank - 1]}`
                : `${stat.rank}th`}
            </span>
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 rounded-full overflow-hidden flex-1"
                style={{ background: "var(--color-border)" }}
              >
                <div
                  className="h-full rounded-full stat-bar-fill-animate"
                  style={{
                    width: `${((stat.value ?? 0) / maxValue) * 100}%`,
                    backgroundColor: activeCategory?.colorVar
                      ? `var(${activeCategory.colorVar})`
                      : "var(--color-primary-dark)",
                  }}
                />
              </div>
              <span
                className="text-xs font-mono font-semibold min-w-[2.5rem] text-right"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stat.value === null ? "—" : `${Math.round((stat.value / maxValue) * 100)}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
