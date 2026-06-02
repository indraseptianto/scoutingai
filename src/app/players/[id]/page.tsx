"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCell } from "@/components/bento/BentoCell";
import { PlayerHeroCard } from "@/components/player/PlayerHeroCard";
import { PlayerKPICell } from "@/components/player/PlayerKPICell";
import { PlayerStatsTable } from "@/components/player/PlayerStatsTable";
import { PlayerRadarChart } from "@/components/player/PlayerRadarChart";
import { SeasonSelector } from "@/components/ui/SeasonSelector";
import { SkeletonCell } from "@/components/ui/SkeletonCell";
import { DataQualityNotice } from "@/components/ui/DataQualityNotice";
import { SEASON_NAMES } from "@/lib/seasons";

interface RawPlayerData {
  id: number;
  display_name: string;
  common_name?: string;
  image_path: string;
  date_of_birth: string;
  height?: number;
  weight?: number;
  position?: { name: string; code: string };
  detailed_position?: { name: string };
  metadata?: Record<string, string>;
  preferred_foot?: string;
  nationality?: { id: number; name: string; image_path?: string };
  teams?: { id: number; name: string; image_path: string }[];
  statistics?: { type_id: number; stat_type_id: number; value: number }[];
  transfers?: { id: number; date: string; from_team?: { name: string }; to_team?: { name: string } }[];
  trophies?: { id: number; name: string; league?: string; season?: string; trophy_id?: number }[];
}

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params.id as string;
  const [player, setPlayer] = useState<RawPlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedSeason, setSelectedSeason] = useState(SEASON_NAMES[0]);
  const [dataStatus, setDataStatus] = useState<{
    statsFallback?: boolean;
    fallbackReason?: string;
    statsSource?: string;
    statsCount?: number;
    subscriptionPlan?: string | null;
    hasStatistics?: boolean;
  } | null>(null);

  const fetchPlayer = useCallback(
    async (season: string, isSeasonChange = false) => {
      if (isSeasonChange) setSeasonLoading(true);
      setError("");
      try {
        const url = new URL(`/api/players/${playerId}`, window.location.origin);
        if (season) url.searchParams.set("season", season);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("Failed to fetch player");
        const data = await res.json();
        setPlayer((data.data || data) as RawPlayerData);
        setDataStatus(data.scoutvision || null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load player data");
      }
      if (isSeasonChange) setSeasonLoading(false);
    },
    [playerId]
  );

  // Initial fetch on mount only
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const res = await fetch(`/api/players/${playerId}?season=${encodeURIComponent(selectedSeason)}`);
        if (!res.ok) throw new Error("Failed to fetch player");
        const data = await res.json();
        if (!cancelled) {
          setPlayer((data.data || data) as RawPlayerData);
          setDataStatus(data.scoutvision || null);
        }
      } catch (err: unknown) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load player data");
      }
      if (!cancelled) setLoading(false);
    }
    init();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  const handleSeasonChange = (season: string) => {
    if (season === selectedSeason) return;
    setSelectedSeason(season);
    fetchPlayer(season, true);
  };

  const handleShowLatestStats = () => {
    fetchPlayer("", true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-lg mb-4" style={{ color: "var(--color-danger)" }}>
          {error}
        </p>
        <button
          onClick={() => fetchPlayer(selectedSeason)}
          className="rounded-full px-6 py-2 text-sm font-medium border transition-colors"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
            background: "var(--color-surface)",
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading || !player) {
    return (
      <div className="py-6 px-6">
        <BentoGrid>
          <SkeletonCell size="4x1" />
          <SkeletonCell size="1x1" />
          <SkeletonCell size="1x1" />
          <SkeletonCell size="1x1" />
          <SkeletonCell size="4x1" />
          <SkeletonCell size="1x2" />
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCell key={i} size="1x1" />
          ))}
        </BentoGrid>
      </div>
    );
  }

  const statistics = player.statistics || [];
  const statMap = statistics.map((s) => ({
    stat_type_id: s.type_id || s.stat_type_id,
    value: s.value,
  }));

  const getStatValue = (statId: number): number | string =>
    statMap.find((s) => s.stat_type_id === statId)?.value ?? "—";

  const positionCode = player.position?.code || "midfielder";

  const transfers = player.transfers || [];
  const joinTransfer = transfers.length > 0 ? transfers[transfers.length - 1] : null;
  const joinYear = joinTransfer ? new Date(joinTransfer.date).getFullYear() : null;

  return (
    <div className="py-6 px-6">
      <BentoGrid>
        {/* Row 1 — Hero Card */}
        <BentoCell size="4x1" animate={false}>
          <PlayerHeroCard
            player={{
              id: player.id,
              display_name: player.display_name || player.common_name || "Unknown",
              common_name: player.common_name,
              image_path: player.image_path,
              date_of_birth: player.date_of_birth,
              height: player.height,
              weight: player.weight,
              position: player.position || { name: "Unknown", code: "midfielder" },
              detailed_position: player.detailed_position,
              preferred_foot: player.metadata?.preferred_foot || player.preferred_foot,
              nationality: player.nationality,
              teams: player.teams,
              joinYear,
              statistics: statMap,
              transfers,
              selectedSeason,
            }}
          />
        </BentoCell>

        {/* Row 2 — Season Selector */}
        <BentoCell size="4x1" variant="ghost">
          <div className="space-y-3">
            <SeasonSelector
              seasons={SEASON_NAMES}
              current={selectedSeason}
              onChange={handleSeasonChange}
              disabled={seasonLoading}
            />
            <div className="grid gap-2 md:grid-cols-3">
              <div className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Stats loaded</p>
                <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{dataStatus?.statsCount ?? statMap.length}</p>
              </div>
              <div className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>Stats source</p>
                <p className="text-sm font-semibold capitalize" style={{ color: "var(--color-text)" }}>{(dataStatus?.statsSource || "unknown").replaceAll("-", " ")}</p>
              </div>
              <div className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--color-border)", background: "var(--color-surface)" }}>
                <p className="text-[10px] uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>API plan</p>
                <p className="truncate text-sm font-semibold" style={{ color: "var(--color-text)" }}>{dataStatus?.subscriptionPlan || "Unknown"}</p>
              </div>
            </div>
            <DataQualityNotice
              visible={statMap.length === 0}
              message="Sportmonks returned no player statistics for this season."
              details="This can happen when historical data is incomplete, the selected season ID does not match the player's league, or your API subscription does not include the requested stats."
            />
            {statMap.length === 0 && (
              <button
                onClick={handleShowLatestStats}
                disabled={seasonLoading}
                className="rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-50"
                style={{ background: "var(--color-primary-dark)", color: "white" }}
              >
                Show latest available stats
              </button>
            )}
            <DataQualityNotice
              visible={!!dataStatus?.statsFallback}
              title="Showing latest available stats"
              message={dataStatus?.fallbackReason || "Selected season returned no statistics, so latest available statistics are shown."}
              details="Season-specific data can vary by league and subscription coverage."
            />
          </div>
        </BentoCell>

        {/* Row 3 — Radar + KPI cells */}
        {seasonLoading ? (
          <>
            <SkeletonCell size="1x2" />
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCell key={i} size="1x1" />
            ))}
          </>
        ) : (
          <>
            <BentoCell size="1x2">
              <PlayerRadarChart
                statistics={statMap}
                positionCode={positionCode}
                playerName={player.display_name || player.common_name || "Player"}
              />
            </BentoCell>

            <BentoCell size="1x1">
              <PlayerKPICell label="Goals" value={getStatValue(52)} trend={3} subtitle="vs position avg" />
            </BentoCell>

            <BentoCell size="1x1">
              <PlayerKPICell label="Assists" value={getStatValue(79)} trend={0} subtitle="vs position avg" />
            </BentoCell>

            <BentoCell size="1x1">
              <PlayerKPICell label="Rating" value={getStatValue(118)} format="rating" trend={0.2} subtitle="vs last season" />
            </BentoCell>

            <BentoCell size="1x1">
              <PlayerKPICell label="Pass Acc%" value={getStatValue(82)} format="percentage" trend={2} subtitle="vs position avg" />
            </BentoCell>

            <BentoCell size="1x1">
              <PlayerKPICell label="Minutes" value={getStatValue(119)} format="time" />
            </BentoCell>

            <BentoCell size="1x1">
              <PlayerKPICell label="Apps" value={getStatValue(321)} />
            </BentoCell>
          </>
        )}

        {/* Row 4 — Statistics Deep Dive */}
        {seasonLoading ? (
          <SkeletonCell size="4x2" />
        ) : (
          <BentoCell size="4x2">
            <PlayerStatsTable statistics={statMap} />
          </BentoCell>
        )}

        {/* Row 5 — Transfer History + Trophies */}
        <BentoCell size="1x1">
          <div className="flex flex-col h-full">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              Transfer History
            </h3>
            {transfers.length > 0 ? (
              <div className="space-y-2">
                {[...transfers]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((t, i) => {
                    const year = new Date(t.date).getFullYear();
                    const isLatest = i === 0;
                    return (
                      <div key={t.id} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text)" }}>
                        <span className="font-mono w-10" style={{ color: "var(--color-text-dim)" }}>
                          {year}
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-stat-attack)" }}>
                          {isLatest ? "→" : "←"}
                        </span>
                        <span className="font-medium truncate">
                          {isLatest ? t.to_team?.name : t.from_team?.name || "Unknown"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                No transfer history available
              </p>
            )}
          </div>
        </BentoCell>

        <BentoCell size="2x1">
          <div className="flex flex-col h-full">
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              Trophies & Achievements
            </h3>
            {player.trophies && player.trophies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {player.trophies.slice(0, 8).map((t) => (
                  <span
                    key={t.id}
                    className="rounded-full px-3 py-1.5 text-xs font-medium border inline-flex items-center gap-1"
                    style={{
                      background: "var(--color-surface-2)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    🏆 {t.name || t.league || `Trophy #${t.trophy_id || t.id}`}
                    {t.season && (
                      <span style={{ color: "var(--color-text-muted)" }}>· {t.season}</span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                No trophies data available
              </p>
            )}
          </div>
        </BentoCell>
      </BentoGrid>
    </div>
  );
}
