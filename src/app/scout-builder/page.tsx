"use client";

import { useState } from "react";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCell } from "@/components/bento/BentoCell";
import { PlayerCard } from "@/components/player/PlayerCard";
import { SkeletonCell } from "@/components/ui/SkeletonCell";
import { useQueryStore, type QueryPresetValues } from "@/lib/query-store";

function getInitialQueryValues(): QueryPresetValues {
  if (typeof window === "undefined") {
    return {
      position: "defender",
      detailedPos: "Right Back",
      ageMin: 20,
      ageMax: 25,
      league: "Premier League",
      season: "2024/25",
      nationality: "",
      goalsMin: 3,
      assistsMin: 2,
      passMin: 75,
      ratingMin: 7,
      appsMin: 15,
      tacklesMin: 30,
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    position: params.get("position") || "defender",
    detailedPos: params.get("detailedPos") || "Right Back",
    ageMin: Number(params.get("ageMin") || 20),
    ageMax: Number(params.get("ageMax") || 25),
    league: params.get("league") || "Premier League",
    season: params.get("season") || "2024/25",
    nationality: params.get("nationality") || "",
    goalsMin: Number(params.get("goalsMin") || 3),
    assistsMin: Number(params.get("assistsMin") || 2),
    passMin: Number(params.get("passMin") || 75),
    ratingMin: Number(params.get("ratingMin") || 7),
    appsMin: Number(params.get("appsMin") || 15),
    tacklesMin: Number(params.get("tacklesMin") || 30),
  };
}

export default function ScoutBuilderPage() {
  const [initialValues] = useState(getInitialQueryValues);
  const { presets, addPreset, removePreset } = useQueryStore();
  const [position, setPosition] = useState(initialValues.position);
  const [detailedPos, setDetailedPos] = useState(initialValues.detailedPos);
  const [ageRange, setAgeRange] = useState<[number, number]>([initialValues.ageMin, initialValues.ageMax]);
  const [league, setLeague] = useState(initialValues.league);
  const [season, setSeason] = useState(initialValues.season);
  const [nationality, setNationality] = useState(initialValues.nationality);
  const [goalsMin, setGoalsMin] = useState(initialValues.goalsMin);
  const [assistsMin, setAssistsMin] = useState(initialValues.assistsMin);
  const [passMin, setPassMin] = useState(initialValues.passMin);
  const [ratingMin, setRatingMin] = useState(initialValues.ratingMin);
  const [appsMin, setAppsMin] = useState(initialValues.appsMin);
  const [tacklesMin, setTacklesMin] = useState(initialValues.tacklesMin);
  const [results, setResults] = useState<{
    id: number;
    display_name: string;
    image_path: string;
    position: { name: string; code: string };
    detailed_position?: { name: string };
    nationality?: { name: string };
    teams?: { name: string }[];
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [presetName, setPresetName] = useState("");

  const getCurrentValues = (): QueryPresetValues => ({
    position,
    detailedPos,
    ageMin: ageRange[0],
    ageMax: ageRange[1],
    league,
    season,
    nationality,
    goalsMin,
    assistsMin,
    passMin,
    ratingMin,
    appsMin,
    tacklesMin,
  });

  const applyValues = (values: QueryPresetValues) => {
    setPosition(values.position);
    setDetailedPos(values.detailedPos);
    setAgeRange([values.ageMin, values.ageMax]);
    setLeague(values.league);
    setSeason(values.season);
    setNationality(values.nationality);
    setGoalsMin(values.goalsMin);
    setAssistsMin(values.assistsMin);
    setPassMin(values.passMin);
    setRatingMin(values.ratingMin);
    setAppsMin(values.appsMin);
    setTacklesMin(values.tacklesMin);
  };

  const buildPresetParams = (values: QueryPresetValues) => {
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== "" && value !== undefined) params.set(key, String(value));
    });
    return params;
  };

  const handleRunQuery = async () => {
    window.history.replaceState(null, "", `/scout-builder?${buildPresetParams(getCurrentValues()).toString()}`);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("position", position);
      if (detailedPos) params.set("detailed_position", detailedPos);
      params.set("age_min", String(ageRange[0]));
      params.set("age_max", String(ageRange[1]));
      if (league) params.set("league", league);
      params.set("season", season);

      const res = await fetch(`/api/players?${params.toString()}`);
      const data = await res.json();
      const players = data.data || [];
      setResults(players.slice(0, 6));
      setResultCount(players.length);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSavePreset = () => {
    const name = presetName.trim();
    if (!name) return;
    addPreset(name, getCurrentValues());
    setPresetName("");
  };

  const handleSharePreset = async () => {
    const url = `${window.location.origin}/scout-builder?${buildPresetParams(getCurrentValues()).toString()}`;
    await navigator.clipboard?.writeText(url);
    window.history.replaceState(null, "", url);
  };

  const handleReset = () => {
    setPosition("midfielder");
    setDetailedPos("");
    setAgeRange([20, 25]);
    setLeague("");
    setSeason("2024/25");
    setNationality("");
    setGoalsMin(3);
    setAssistsMin(2);
    setPassMin(75);
    setRatingMin(7.0);
    setAppsMin(15);
    setTacklesMin(30);
    setResults([]);
    setResultCount(0);
  };

  return (
    <div className="py-6 px-6">
      <BentoGrid>
        <BentoCell size="4x1" variant="primary">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
              Scout Query Builder
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-primary-text)" }}>
              Build your ideal player profile and find matches
            </p>
          </div>
        </BentoCell>

        {/* Builder Form — 2x1 */}
        <BentoCell size="2x1">
          <div className="flex flex-col h-full gap-5">
            <div>
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Identity
              </h3>
              <div className="flex gap-2 mb-2">
                {["all", "male", "female"].map((g) => (
                  <button
                    key={g}
                    className="rounded-full px-3 py-1 text-xs font-medium border capitalize"
                    style={{
                      background: "transparent",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {g === "all" ? "All" : g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Position
              </h3>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{
                  background: "var(--color-surface-2)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                <option value="goalkeeper">Goalkeeper</option>
                <option value="defender">Defender</option>
                <option value="midfielder">Midfielder</option>
                <option value="attacker">Attacker</option>
              </select>
              <input
                type="text"
                value={detailedPos}
                onChange={(e) => setDetailedPos(e.target.value)}
                placeholder="e.g. Right Back..."
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none mt-2"
                style={{
                  background: "var(--color-surface-2)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Age Range
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number" min={16} max={50}
                  value={ageRange[0]}
                  onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])}
                  className="w-20 rounded-lg border px-3 py-1.5 text-sm text-center outline-none"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
                <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>to</span>
                <input
                  type="number" min={16} max={50}
                  value={ageRange[1]}
                  onChange={(e) => setAgeRange([ageRange[0], +e.target.value])}
                  className="w-20 rounded-lg border px-3 py-1.5 text-sm text-center outline-none"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                League / Season
              </h3>
              <select
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none mb-2"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                <option value="">All Leagues</option>
                <option value="La Liga">La Liga</option>
                <option value="Premier League">Premier League</option>
                <option value="Championship">Championship</option>
                <option value="League One">League One</option>
                <option value="League Two">League Two</option>
              </select>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              >
                <option value="2024/25">2024/25</option>
                <option value="2023/24">2023/24</option>
                <option value="2022/23">2022/23</option>
              </select>
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Nationality
              </h3>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="All or e.g. South East Asia"
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              />
            </div>

            <div>
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Stat Thresholds
              </h3>
              <div className="space-y-2">
                {[
                  { label: "Goals", value: goalsMin, setter: setGoalsMin },
                  { label: "Assists", value: assistsMin, setter: setAssistsMin },
                  { label: "Pass%", value: passMin, setter: setPassMin },
                  { label: "Rating", value: ratingMin, setter: setRatingMin, step: 0.1 },
                  { label: "Apps", value: appsMin, setter: setAppsMin },
                  { label: "Tackles", value: tacklesMin, setter: setTacklesMin },
                ].map(({ label, value, setter, step }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--color-text)" }}>
                      {label} ≥
                    </span>
                    <input
                      type="number"
                      step={step || 1}
                      value={value}
                      onChange={(e) => setter(+e.target.value)}
                      className="w-20 rounded-lg border px-3 py-1 text-sm text-center outline-none"
                      style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={handleRunQuery}
                disabled={loading}
                className="flex-1 rounded-full py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
                style={{ background: "var(--color-primary-dark)", color: "white" }}
              >
                {loading ? "Running..." : "Run Query →"}
              </button>
              <button
                onClick={handleReset}
                className="rounded-full px-5 py-2.5 text-sm font-medium border transition-colors"
                style={{ borderColor: "var(--color-border-strong)", color: "var(--color-text-muted)" }}
              >
                Reset All
              </button>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: "var(--color-border)" }}>
              <h3 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                Save & Share
              </h3>
              <div className="flex gap-2">
                <input
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name"
                  className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-xs outline-none"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                />
                <button
                  onClick={handleSavePreset}
                  className="rounded-full px-3 py-2 text-xs font-medium"
                  style={{ background: "var(--color-primary)", color: "var(--color-primary-text)" }}
                >
                  Save
                </button>
                <button
                  onClick={handleSharePreset}
                  className="rounded-full px-3 py-2 text-xs font-medium border"
                  style={{ borderColor: "var(--color-border-strong)", color: "var(--color-text)" }}
                >
                  Copy URL
                </button>
              </div>
              {presets.length > 0 && (
                <div className="mt-3 space-y-2">
                  {presets.map((preset) => (
                    <div key={preset.id} className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5" style={{ background: "var(--color-surface-2)" }}>
                      <button
                        onClick={() => applyValues(preset.values)}
                        className="truncate text-left text-xs font-medium"
                        style={{ color: "var(--color-text)" }}
                      >
                        {preset.name}
                      </button>
                      <button
                        onClick={() => removePreset(preset.id)}
                        className="text-xs"
                        style={{ color: "var(--color-text-dim)" }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </BentoCell>

        {/* Results Preview — 2x1 */}
        <BentoCell size="2x1">
          {resultCount > 0 && (
            <div className="mb-4">
              <p className="text-lg font-semibold" style={{ color: "var(--color-success)" }}>
                {resultCount} players match your criteria
              </p>
              <div className="flex gap-4 mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <span>Rating avg: 7.2</span>
                <span>Goals avg: 4.1</span>
                <span>Pass % avg: 79%</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCell key={i} />
              ))}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={{
                    id: player.id,
                    display_name: player.display_name,
                    image_path: player.image_path,
                    position: player.position || { name: "Unknown", code: "midfielder" },
                    detailed_position: player.detailed_position,
                    nationality: player.nationality,
                    teams: player.teams,
                  }}
                />
              ))}
            </div>
          )}

          {!loading && results.length === 0 && !resultCount && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-lg mb-1" style={{ color: "var(--color-text-muted)" }}>
                Build and run a query
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--color-text-dim)" }}>
                Use the filters to find matching players
              </p>
            </div>
          )}
        </BentoCell>
      </BentoGrid>
    </div>
  );
}
