"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCell } from "@/components/bento/BentoCell";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { useCompareStore } from "@/lib/compare-store";

const COMPARE_STATS = [
  { label: "Goals", statIds: [52] },
  { label: "Assists", statIds: [79] },
  { label: "Rating", statIds: [118] },
  { label: "Pass %", statIds: [82] },
  { label: "xG", statIds: [5304] },
  { label: "Tackles", statIds: [78] },
  { label: "Interceptions", statIds: [100] },
  { label: "Dribbles (success)", statIds: [109] },
  { label: "Yellow Cards", statIds: [84] },
  { label: "Appearances", statIds: [321] },
];

function getStatVal(
  stats: { stat_type_id: number; value: number }[],
  statIds: number[]
): number {
  for (const s of stats) {
    if (statIds.includes(s.stat_type_id)) return s.value;
  }
  return 0;
}

export default function ComparePage() {
  const { players, removePlayer } = useCompareStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [season, setSeason] = useState("2024/25");
  const [loading, setLoading] = useState(false);

  const handleAddPlayer = async (query: string) => {
    if (!query.trim() || players.length >= 4) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/players/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      const found = data.data?.[0];
      if (found) {
        const detailRes = await fetch(`/api/players/${found.id}`);
        const detailData = await detailRes.json();
        const p = detailData.data || detailData;
        useCompareStore.getState().addPlayer({
          id: Number(p.id),
          display_name: String(p.display_name || p.common_name),
          image_path: String(p.image_path || ""),
          position: p.position || { name: "Unknown", code: "midfielder" },
          detailed_position: p.detailed_position || { name: "" },
          nationality: p.nationality,
          date_of_birth: String(p.date_of_birth || ""),
          teams: p.teams || [],
          statistics: (p.statistics || []).map((s: Record<string, unknown>) => ({
            stat_type_id: Number(s.type_id || s.stat_type_id),
            value: Number(s.value),
          })),
        });
      }
    } catch (err) {
      console.error(err);
    }
    setSearchQuery("");
    setLoading(false);
  };

  return (
    <div className="py-6 px-6">
      <BentoGrid>
        {/* Header */}
        <BentoCell size="4x1" variant="primary">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                Compare Players
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-primary-text)" }}>
                {players.length === 0
                  ? "Search and add players to compare side-by-side"
                  : `Comparing ${players.length} player${players.length > 1 ? "s" : ""}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SeasonSelector
                seasons={["2024/25", "2023/24", "2022/23"]}
                current={season}
                onChange={setSeason}
              />
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddPlayer(searchQuery);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="+ Add player"
                  disabled={players.length >= 4}
                  className="rounded-full border px-4 py-1.5 text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderColor: "var(--color-border-strong)",
                    color: "var(--color-text)",
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || players.length >= 4}
                  className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                  style={{ background: "var(--color-primary-dark)", color: "white" }}
                >
                  {loading ? "..." : <Plus size={16} />}
                </button>
              </form>
            </div>
          </div>
        </BentoCell>

        {players.length === 0 && (
          <BentoCell size="4x1">
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-lg mb-2" style={{ color: "var(--color-text-muted)" }}>
                No players to compare
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-dim)" }}>
                Search and add up to 4 players above
              </p>
            </div>
          </BentoCell>
        )}

        {players.length > 0 && (
          <BentoCell size="4x2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                    <th className="p-3 text-left text-xs uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                      Stat
                    </th>
                    {players.map((player) => (
                      <th key={player.id} className="p-3 text-center min-w-[140px]">
                        <div className="flex flex-col items-center relative">
                          <button
                            onClick={() => removePlayer(player.id)}
                            className="absolute -top-1 -right-1 rounded-full p-0.5"
                            style={{ background: "var(--color-surface-2)", color: "var(--color-text-dim)" }}
                          >
                            <X size={12} />
                          </button>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={player.image_path || "/placeholder.svg"}
                            alt={player.display_name}
                            width={48}
                            height={48}
                            className="rounded-full border-2 object-cover mb-1"
                            style={{ borderColor: "var(--color-primary)", width: 48, height: 48 }}
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                          />
                          <p className="text-sm font-semibold truncate max-w-[120px]" style={{ color: "var(--color-text)" }}>
                            {player.display_name}
                          </p>
                          <p className="text-xs truncate max-w-[120px]" style={{ color: "var(--color-text-muted)" }}>
                            {player.detailed_position?.name || player.position.name} · {player.teams?.[0]?.name || "—"}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_STATS.map((stat, rowIdx) => {
                    const vals = players.map((p) => getStatVal(p.statistics, stat.statIds));
                    const max = Math.max(...vals.filter((v) => v > 0));
                    return (
                      <tr
                        key={stat.label}
                        style={{
                          borderBottom: rowIdx < COMPARE_STATS.length - 1 ? "1px solid var(--color-border)" : "none",
                        }}
                      >
                        <td className="p-3">
                          <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                            {stat.label}
                          </span>
                        </td>
                        {vals.map((val, i) => (
                          <td
                            key={i}
                            className="p-3 text-center rounded-lg transition-colors"
                            style={{
                              background: val === max && max > 0 ? "#F0FFF4" : "transparent",
                              color: val === max && max > 0 ? "var(--color-success)" : "var(--color-text)",
                            }}
                          >
                            <span className={`text-sm font-mono font-semibold tabular-nums ${val === max && max > 0 ? "font-bold" : ""}`}>
                              {val}
                              {val === max && max > 0 && (
                                <span className="ml-1 text-xs" style={{ color: "var(--color-success)" }}>🟢</span>
                              )}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </BentoCell>
        )}
      </BentoGrid>
    </div>
  );
}
