"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { PlayerCard } from "@/components/player/PlayerCard";
import { SkeletonCell } from "@/components/ui/SkeletonCell";

const POSITION_OPTIONS = [
  { code: "goalkeeper", label: "GK" },
  { code: "defender", label: "DEF" },
  { code: "midfielder", label: "MID" },
  { code: "attacker", label: "ATT" },
];

const DETAILED_POSITIONS: Record<string, string[]> = {
  attacker: ["Winger", "Left Wing", "Right Wing", "Striker", "Centre Forward"],
  midfielder: ["Central Midfielder", "Attacking Midfielder", "Defensive Midfielder", "Winger"],
  defender: ["Right Back", "Left Back", "Centre Back", "Wing Back"],
  goalkeeper: ["Goalkeeper"],
};

const LEAGUE_OPTIONS = [
  "Premier League",
  "La Liga",
  "Bundesliga",
  "Serie A",
  "Ligue 1",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [players, setPlayers] = useState<{
    id: number;
    display_name: string;
    image_path: string;
    position: { name: string; code: string };
    detailed_position?: { name: string };
    nationality?: { name: string };
    teams?: { name: string }[];
  }[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedDetailedPositions, setSelectedDetailedPositions] = useState<string[]>([]);
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 40]);
  const [sortBy, setSortBy] = useState("rating");

  const fetchPlayers = useCallback(
    async (p: number, reset = false) => {
      if (!initialQuery) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/players/search?query=${encodeURIComponent(initialQuery)}&page=${p}`
        );
        const data = await res.json();
        const newPlayers = data.data || [];
        setPlayers((prev) => (reset ? newPlayers : [...prev, ...newPlayers]));
        setHasMore(newPlayers.length === 20);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    },
    [initialQuery]
  );

  useEffect(() => {
    if (!initialQuery) return;
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/players/search?query=${encodeURIComponent(initialQuery)}&page=1`
        );
        const data = await res.json();
        if (!cancelled) {
          setPlayers(data.data || []);
          setHasMore((data.data || []).length === 20);
        }
      } catch (err) {
        console.error(err);
      }
      if (!cancelled) setLoading(false);
    }
    fetchData();
    return () => { cancelled = true; };
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("query", query.trim());
      if (selectedPosition) params.set("position", selectedPosition);
      router.push(`/players?${params.toString()}`);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPlayers(nextPage);
  };

  const toggleLeague = (league: string) => {
    setSelectedLeagues((prev) =>
      prev.includes(league) ? prev.filter((l) => l !== league) : [...prev, league]
    );
  };

  const toggleDetailedPosition = (pos: string) => {
    setSelectedDetailedPositions((prev) =>
      prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
    );
  };

  const activeFilters: string[] = [];
  if (initialQuery) activeFilters.push(`Search: "${initialQuery}"`);
  if (selectedPosition) {
    const posLabel = POSITION_OPTIONS.find((p) => p.code === selectedPosition)?.label;
    if (posLabel) activeFilters.push(posLabel);
  }
  if (ageRange[0] > 16 || ageRange[1] < 40) {
    activeFilters.push(`Age ${ageRange[0]}-${ageRange[1]}`);
  }

  return (
    <div className="py-6">
      <div className="px-6 mb-4">
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search players by name..."
              className="flex-1 rounded-full border px-4 py-2.5 text-sm outline-none transition-shadow"
              style={{
                background: "var(--color-surface-2)",
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            />
            <button
              type="submit"
              className="rounded-full px-6 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: "var(--color-primary-dark)", color: "white" }}
            >
              Search
            </button>
          </form>
          {activeFilters.length > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {activeFilters.join(" · ")}
              </span>
              <button
                onClick={() => {
                  router.push("/players");
                  setSelectedPosition(null);
                  setSelectedDetailedPositions([]);
                  setSelectedLeagues([]);
                  setAgeRange([16, 40]);
                  setPlayers([]);
                }}
                className="text-xs font-medium"
                style={{ color: "var(--color-primary-dark)" }}
              >
                Clear All ×
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="grid gap-4 px-6"
        style={{ gridTemplateColumns: "280px 1fr" }}
      >
        {/* Filter Sidebar */}
        <div
          className="rounded-xl p-5 self-start sticky top-24"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h3 className="text-sm font-bold mb-5 uppercase tracking-wider" style={{ color: "var(--color-text)" }}>
            Filters
          </h3>

          {/* Position */}
          <div className="mb-6">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
              Position
            </p>
            <div className="flex flex-wrap gap-1.5">
              {POSITION_OPTIONS.map((pos) => (
                <button
                  key={pos.code}
                  onClick={() => setSelectedPosition(selectedPosition === pos.code ? null : pos.code)}
                  className="rounded-full px-3 py-1 text-xs font-medium border transition-colors"
                  style={{
                    background: selectedPosition === pos.code ? "var(--color-primary)" : "transparent",
                    borderColor: selectedPosition === pos.code ? "var(--color-primary-dark)" : "var(--color-border)",
                    color: selectedPosition === pos.code ? "var(--color-primary-text)" : "var(--color-text-muted)",
                  }}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Detailed Position */}
          {selectedPosition && DETAILED_POSITIONS[selectedPosition] && (
            <div className="mb-6">
              <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
                Detailed Position
              </p>
              <div className="space-y-1">
                {DETAILED_POSITIONS[selectedPosition].map((dp) => (
                  <label key={dp} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDetailedPositions.includes(dp)}
                      onChange={() => toggleDetailedPosition(dp)}
                      className="rounded"
                    />
                    <span className="text-xs" style={{ color: "var(--color-text)" }}>
                      {dp}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Age Range */}
          <div className="mb-6">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
              Age Range
            </p>
            <div className="flex items-center gap-2 mb-1">
              <input
                type="number"
                min={16}
                max={40}
                value={ageRange[0]}
                onChange={(e) => setAgeRange([+e.target.value, ageRange[1]])}
                className="w-16 rounded-lg border px-2 py-1 text-xs text-center outline-none"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              />
              <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>to</span>
              <input
                type="number"
                min={16}
                max={40}
                value={ageRange[1]}
                onChange={(e) => setAgeRange([ageRange[0], +e.target.value])}
                className="w-16 rounded-lg border px-2 py-1 text-xs text-center outline-none"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
              />
            </div>
          </div>

          {/* League */}
          <div className="mb-6">
            <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "var(--color-text-muted)" }}>
              League
            </p>
            {LEAGUE_OPTIONS.map((league) => (
              <label key={league} className="flex items-center gap-2 mb-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedLeagues.includes(league)}
                  onChange={() => toggleLeague(league)}
                  className="rounded"
                />
                <span className="text-xs" style={{ color: "var(--color-text)" }}>
                  {league}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          {initialQuery && players.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Showing {players.length} players
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border px-3 py-1.5 text-xs outline-none"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                <option value="rating">Sort by: Rating</option>
                <option value="goals">Sort by: Goals</option>
                <option value="assists">Sort by: Assists</option>
                <option value="name">Sort by: Name</option>
              </select>
            </div>
          )}

          {!initialQuery && (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="text-lg" style={{ color: "var(--color-text-dim)" }}>
                Search for a player to get started
              </p>
            </div>
          )}

          {loading && players.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonCell key={i} />
              ))}
            </div>
          )}

          {players.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {players.map((player) => (
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

              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="rounded-full px-6 py-2.5 text-sm font-medium border transition-colors"
                    style={{
                      borderColor: "var(--color-border-strong)",
                      color: "var(--color-text)",
                      background: loading ? "var(--color-surface-2)" : "var(--color-surface)",
                    }}
                  >
                    {loading ? "Loading..." : "Load more ↓"}
                  </button>
                </div>
              )}
            </>
          )}

          {!loading && players.length === 0 && initialQuery && (
            <div className="flex flex-col items-center justify-center py-32">
              <p className="text-lg mb-2" style={{ color: "var(--color-text-muted)" }}>
                No players match &ldquo;{initialQuery}&rdquo;
              </p>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-dim)" }}>
                Try a different search term or adjust your filters
              </p>
              <button
                onClick={() => router.push("/players")}
                className="rounded-full px-4 py-2 text-sm font-medium border transition-colors"
                style={{
                  borderColor: "var(--color-border-strong)",
                  color: "var(--color-text)",
                  background: "var(--color-surface)",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PlayersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-6 px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCell key={i} />
            ))}
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
