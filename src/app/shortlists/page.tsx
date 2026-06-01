"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCell } from "@/components/bento/BentoCell";
import { useShortlistStore } from "@/lib/shortlist-store";
import { TagBadge } from "@/components/ui/TagBadge";
import { exportShortlistReport } from "@/lib/pdf-export";

const PRIORITY_COLORS = {
  High: { bg: "#FEE2E2", text: "#DC2626" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#E8F0F7", text: "#4B5563" },
};

type StatPreview = { goals: number | string; assists: number | string; rating: number | string };

function collectStat(value: unknown, statId: number): number | string | null {
  if (!value || typeof value !== "object") return null;
  if (Array.isArray(value)) {
    for (const item of value) {
      const match = collectStat(item, statId);
      if (match !== null) return match;
    }
    return null;
  }
  const record = value as Record<string, unknown>;
  if (record.stat_type_id === statId && typeof record.value !== "undefined") {
    return typeof record.value === "number" ? record.value : String(record.value);
  }
  for (const nested of Object.values(record)) {
    const match = collectStat(nested, statId);
    if (match !== null) return match;
  }
  return null;
}

export default function ShortlistsPage() {
  const { shortlists, addShortlist, removeShortlist, updatePlayerTags } = useShortlistStore();
  const [searchPlayer, setSearchPlayer] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statPreviews, setStatPreviews] = useState<Record<number, StatPreview>>({});
  const router = useRouter();

  useEffect(() => {
    const ids = Array.from(new Set(shortlists.flatMap((sl) => sl.players.map((p) => p.playerId))));
    const missingIds = ids.filter((id) => !statPreviews[id]);
    if (!missingIds.length) return;
    let cancelled = false;
    async function loadStats() {
      const entries = await Promise.all(
        missingIds.map(async (id) => {
          try {
            const res = await fetch(`/api/players/${id}`);
            const json = await res.json();
            const data = json.data || json;
            return [id, {
              goals: collectStat(data, 52) ?? "-",
              assists: collectStat(data, 79) ?? "-",
              rating: collectStat(data, 118) ?? "-",
            }] as const;
          } catch {
            return [id, { goals: "-", assists: "-", rating: "-" }] as const;
          }
        })
      );
      if (!cancelled) setStatPreviews((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    }
    loadStats();
    return () => { cancelled = true; };
  }, [shortlists, statPreviews]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchPlayer.trim()) {
      router.push(`/players?query=${encodeURIComponent(searchPlayer.trim())}`);
    }
  };

  return (
    <div className="py-6 px-6">
      <BentoGrid>
        <BentoCell size="4x1" variant="primary">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                My Shortlists
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-primary-text)" }}>
                {shortlists.length} active shortlist{shortlists.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => {
                addShortlist("New Shortlist", "", "Medium");
              }}
              className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
              style={{ background: "var(--color-primary-dark)", color: "white" }}
            >
              + New Shortlist
            </button>
          </div>
        </BentoCell>

        {shortlists.map((sl) => (
          <BentoCell key={sl.id} size="1x2">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--color-text)" }}
                >
                  {sl.name}
                </h3>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: PRIORITY_COLORS[sl.priority].bg,
                    color: PRIORITY_COLORS[sl.priority].text,
                  }}
                >
                  {sl.priority}
                </span>
              </div>

              <p className="text-sm mb-3" style={{ color: "var(--color-text-muted)" }}>
                {sl.players.length} players · {sl.description || sl.priority + " priority"}
              </p>

              {sl.players.length > 0 && (
                <div className="flex -space-x-2 mb-3">
                  {sl.players.slice(0, 4).map((p, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={p.playerImage || "/placeholder.svg"}
                      alt={p.playerName}
                      width={36}
                      height={36}
                      className="rounded-full border-2 object-cover"
                      style={{
                        borderColor: "var(--color-surface)",
                        width: 36,
                        height: 36,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  ))}
                  {sl.players.length > 4 && (
                    <div
                      className="rounded-full border-2 flex items-center justify-center text-xs font-medium"
                      style={{
                        width: 36,
                        height: 36,
                        background: "var(--color-surface-2)",
                        borderColor: "var(--color-surface)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      +{sl.players.length - 4}
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setExpandedId(expandedId === sl.id ? null : sl.id)}
                className="text-xs font-medium mb-2 self-start"
                style={{ color: "var(--color-primary-dark)" }}
              >
                {expandedId === sl.id ? "Hide players ↑" : "View players →"}
              </button>

              {expandedId === sl.id && (
                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                  {sl.players.map((p) => (
                    <div
                      key={p.playerId}
                      className="rounded-lg border p-2"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <Link
                        href={`/players/${p.playerId}`}
                        className="flex items-center gap-2 text-sm font-medium mb-1"
                        style={{ color: "var(--color-text)" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.playerImage || "/placeholder.svg"}
                          alt={p.playerName}
                          width={28}
                          height={28}
                          className="rounded-full object-cover"
                          style={{ width: 28, height: 28 }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <span className="truncate flex-1">{p.playerName || `Player #${p.playerId}`}</span>
                      </Link>
                      <p className="text-[10px] mb-1" style={{ color: "var(--color-text-muted)" }}>
                        {p.playerPosition} · {p.playerTeam}
                      </p>
                      <div className="grid grid-cols-3 gap-1 mb-2">
                        {[
                          ["Goals", statPreviews[p.playerId]?.goals ?? "..."],
                          ["Assists", statPreviews[p.playerId]?.assists ?? "..."],
                          ["Rating", typeof statPreviews[p.playerId]?.rating === "number" ? (statPreviews[p.playerId].rating as number).toFixed(1) : statPreviews[p.playerId]?.rating ?? "..."],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-md px-2 py-1 text-center" style={{ background: "var(--color-surface-2)" }}>
                            <div className="text-xs font-mono font-bold" style={{ color: "var(--color-text)" }}>{value}</div>
                            <div className="text-[9px] uppercase" style={{ color: "var(--color-text-muted)" }}>{label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {p.tags.map((tag) => (
                          <TagBadge
                            key={tag}
                            tag={tag}
                            size="sm"
                            onRemove={() => {
                              const newTags = p.tags.filter((t) => t !== tag);
                              updatePlayerTags(sl.id, p.playerId, newTags);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between">
                <button
                  onClick={() => exportShortlistReport(sl)}
                  className="text-sm font-medium"
                  style={{ color: "var(--color-primary-dark)" }}
                >
                  Export PDF
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeShortlist(sl.id);
                  }}
                  className="rounded-full px-2 py-0.5 text-xs"
                  style={{
                    background: "var(--color-surface-2)",
                    color: "var(--color-text-dim)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </BentoCell>
        ))}

        {/* Quick Add Cell */}
        {shortlists.length > 0 && (
          <BentoCell size="1x1" variant="secondary">
            <div className="flex flex-col h-full">
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                Quick Add
              </h3>
              <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
                Search and add players to any shortlist
              </p>
              <form onSubmit={handleQuickAdd}>
                <input
                  type="text"
                  value={searchPlayer}
                  onChange={(e) => setSearchPlayer(e.target.value)}
                  placeholder="Search player..."
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
              </form>
            </div>
          </BentoCell>
        )}

        {shortlists.length === 0 && (
          <BentoCell size="3x1">
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-lg mb-1" style={{ color: "var(--color-text-muted)" }}>
                Your shortlist is empty
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-dim)" }}>
                Create your first shortlist to start tracking players
              </p>
              <button
                onClick={() => {
                  addShortlist("My First Shortlist", "Custom shortlist", "Medium");
                }}
                className="rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
                style={{ background: "var(--color-primary-dark)", color: "white" }}
              >
                Create Shortlist
              </button>
            </div>
          </BentoCell>
        )}
      </BentoGrid>
    </div>
  );
}
