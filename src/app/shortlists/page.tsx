"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BentoGrid } from "@/components/bento/BentoGrid";
import { BentoCell } from "@/components/bento/BentoCell";
import { useShortlistStore } from "@/lib/shortlist-store";

const PRIORITY_COLORS = {
  High: { bg: "#FEE2E2", text: "#DC2626" },
  Medium: { bg: "#FEF3C7", text: "#D97706" },
  Low: { bg: "#E8F0F7", text: "#4B5563" },
};

export default function ShortlistsPage() {
  const { shortlists, addShortlist, removeShortlist } = useShortlistStore();
  const [searchPlayer, setSearchPlayer] = useState("");
  const router = useRouter();

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
            <Link href={`/shortlists?id=${sl.id}`} className="block h-full">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
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

                <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
                  {sl.players.length} players · {sl.description || sl.priority + " priority"}
                </p>

                {sl.players.length > 0 && (
                  <div className="flex -space-x-2 mb-4">
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

                <div className="mt-auto flex items-center justify-between">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-primary-dark)" }}
                  >
                    Open →
                  </span>
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
            </Link>
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
