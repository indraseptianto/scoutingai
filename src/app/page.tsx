"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Search, Users, List, GitCompare, Zap, TrendingUp, ArrowRightLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCell } from "@/components/bento/BentoCell";
import { useShortlistStore } from "@/lib/shortlist-store";
import { LEAGUE_OPTIONS } from "@/lib/seasons";

type LatestPlayer = { id: number; display_name: string; position?: { name: string } };

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [latestPlayers, setLatestPlayers] = useState<LatestPlayer[]>([]);
  const { shortlists } = useShortlistStore();

  useEffect(() => {
    let cancelled = false;
    async function loadLatest() {
      try {
        const res = await fetch("/api/players/latest");
        const data = await res.json();
        if (!cancelled) setLatestPlayers((data.data || []).slice(0, 4));
      } catch {
        if (!cancelled) setLatestPlayers([]);
      }
    }
    loadLatest();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/players?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="py-6">
      <BentoGrid>
        {/* Hero Search */}
        <BentoCell size="4x1" variant="primary" animate={false}>
          <div className="text-center py-10">
            <h1 className="text-3xl font-bold" style={{ color: "var(--color-text)" }}>
              Find Your Next Player
            </h1>
            <p className="mt-2 text-sm" style={{ color: "var(--color-primary-text)" }}>
              Search 2,300+ leagues · 60+ statistics per player
            </p>

            <form onSubmit={handleSearch} className="mt-6 max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-dim)" }}
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, position, nationality..."
                  className="w-full rounded-full border py-3.5 pl-12 pr-6 text-base outline-none transition-shadow"
                  style={{
                    background: "white",
                    borderColor: "var(--color-border-strong)",
                    color: "var(--color-text)",
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {[
                  ["Attackers", "/players?position=attacker"],
                  [LEAGUE_OPTIONS[1], `/players?league=${encodeURIComponent(LEAGUE_OPTIONS[1])}`],
                  ["U21", "/players?age_max=21"],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-full px-3 py-1 text-xs font-medium border inline-flex items-center gap-1"
                    style={{
                      background: "rgba(255,255,255,0.5)",
                      borderColor: "var(--color-border-strong)",
                      color: "var(--color-primary-text)",
                    }}
                  >
                    {label} ▾
                  </Link>
                ))}
              </div>
            </form>
          </div>
        </BentoCell>

        {/* Recently Viewed — 2x2 */}
        <BentoCell size="2x2">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} style={{ color: "var(--color-primary-dark)" }} />
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                Recently Viewed
              </h2>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-sm" style={{ color: "var(--color-text-dim)" }}>
                  Players you view will appear here.
                </p>
                <Link
                  href="/players"
                  className="mt-2 inline-block text-sm font-medium"
                  style={{ color: "var(--color-primary-dark)" }}
                >
                  Browse players →
                </Link>
              </div>
            </div>
          </div>
        </BentoCell>

        {/* Shortlists — 1x1 */}
        <BentoCell size="1x1">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <List size={18} style={{ color: "var(--color-primary-dark)" }} />
              <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                Shortlists
              </h2>
            </div>
            <p className="text-4xl font-black font-mono tabular-nums" style={{ color: "var(--color-text)" }}>
              {shortlists.length}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              active
            </p>
            <Link
              href="/shortlists"
              className="mt-auto text-sm font-medium"
              style={{ color: "var(--color-primary-dark)" }}
            >
              View →
            </Link>
          </div>
        </BentoCell>

        {/* Quick Compare — 1x1 */}
        <BentoCell size="1x1">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <GitCompare size={18} style={{ color: "var(--color-primary-dark)" }} />
              <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                Quick Compare
              </h2>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Compare up to 4 players side-by-side
            </p>
            <Link
              href="/compare"
              className="mt-auto text-sm font-medium"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Compare now →
            </Link>
          </div>
        </BentoCell>

        {/* Top Scorers — 1x1 */}
        <BentoCell size="1x1">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={18} style={{ color: "var(--color-stat-attack)" }} />
              <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                Stat Scout Starters
              </h2>
            </div>
            <div className="space-y-1.5">
              {[
                ["Goals ≥ 10", "/scout-builder?position=attacker&goalsMin=10&ageMin=16&ageMax=35"],
                ["Rating ≥ 7.5", "/scout-builder?ratingMin=7.5&ageMin=16&ageMax=35"],
                ["U21 Prospects", "/players?age_max=21"],
              ].map(([name, href], i) => (
                <Link
                  key={name}
                  href={href}
                  className="flex items-center justify-between text-sm py-1 rounded-lg px-2 -mx-2 transition-colors"
                  style={{ color: "var(--color-text)" }}
                >
                  <span>{i + 1}. {name}</span>
                  <span className="text-xs font-mono font-semibold" style={{ color: "var(--color-stat-attack)" }}>
                    Open
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </BentoCell>

        {/* Active Transfers — 1x1 */}
        <BentoCell size="1x1">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-3">
              <ArrowRightLeft size={18} style={{ color: "var(--color-warning)" }} />
              <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                Data Coverage
              </h2>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Sportmonks coverage depends on league, season, and API plan.
            </p>
            <Link
              href="/players"
              className="mt-auto text-sm font-medium"
              style={{ color: "var(--color-primary-dark)" }}
            >
              Check players →
            </Link>
          </div>
        </BentoCell>

        {/* Recently Updated — 2x1 */}
        <BentoCell size="2x1">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} style={{ color: "var(--color-primary-dark)" }} />
              <h2 className="text-lg font-semibold" style={{ color: "var(--color-text)" }}>
                Recently Updated Players
              </h2>
            </div>
            {latestPlayers.length > 0 ? (
              <div className="space-y-2">
                {latestPlayers.map((player) => (
                  <Link key={player.id} href={`/players/${player.id}`} className="block text-sm" style={{ color: "var(--color-text)" }}>
                    {player.display_name}
                    <span className="ml-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {player.position?.name || "Updated"}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                Latest updates unavailable for the current API response.
              </p>
            )}
          </div>
        </BentoCell>
      </BentoGrid>
    </div>
  );
}
