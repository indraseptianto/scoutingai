"use client";

import { useState } from "react";
import { useShortlistStore } from "@/lib/shortlist-store";
import { Plus, Check, Loader2 } from "lucide-react";

interface ShortlistButtonProps {
  playerId: number;
}

export function ShortlistButton({ playerId }: ShortlistButtonProps) {
  const { shortlists, addPlayerToShortlist, removePlayerFromShortlist, getPlayerShortlists } =
    useShortlistStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const playerShortlists = getPlayerShortlists(playerId);
  const isInAnyShortlist = playerShortlists.length > 0;

  const handleToggle = async (shortlistId: string) => {
    setLoading(true);
    if (playerShortlists.some((s) => s.id === shortlistId)) {
      removePlayerFromShortlist(shortlistId, playerId);
    } else {
      addPlayerToShortlist(shortlistId, {
        playerId,
        playerName: "",
        playerImage: "",
        playerPosition: "",
        playerTeam: "",
      });
    }
    await new Promise((r) => setTimeout(r, 150));
    setLoading(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 flex items-center gap-1.5"
        style={{
          background: isInAnyShortlist
            ? "var(--color-primary)"
            : "transparent",
          color: isInAnyShortlist
            ? "var(--color-primary-text)"
            : "var(--color-text)",
          border: isInAnyShortlist
            ? "1px solid var(--color-primary-dark)"
            : "1px solid var(--color-border)",
        }}
      >
        {isInAnyShortlist ? "★" : "☆"} Shortlist
        {isInAnyShortlist && (
          <span className="text-xs opacity-75">({playerShortlists.length})</span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute top-full mt-2 left-0 z-20 w-64 rounded-xl p-3 shadow-xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
              Add to shortlist
            </p>
            {shortlists.length === 0 ? (
              <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                No shortlists yet. Create one first.
              </p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {shortlists.map((sl) => {
                  const isIn = playerShortlists.some((s) => s.id === sl.id);
                  return (
                    <button
                      key={sl.id}
                      onClick={() => handleToggle(sl.id)}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-left transition-colors hover:bg-opacity-10"
                      style={{ color: "var(--color-text)" }}
                    >
                      {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : isIn ? (
                        <Check size={14} style={{ color: "var(--color-success)" }} />
                      ) : (
                        <Plus size={14} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{sl.name}</p>
                        <p style={{ color: "var(--color-text-dim)" }}>
                          {sl.players.length} players
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
