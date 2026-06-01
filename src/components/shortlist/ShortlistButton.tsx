"use client";

import { useState } from "react";
import { useShortlistStore } from "@/lib/shortlist-store";
import { Plus, Check, Loader2 } from "lucide-react";

interface ShortlistButtonProps {
  playerId: number;
  playerName: string;
  playerImage: string;
  playerPosition: string;
  playerTeam: string;
}

const PRESET_TAGS = ["priority", "backup", "monitored"];

export function ShortlistButton({
  playerId,
  playerName,
  playerImage,
  playerPosition,
  playerTeam,
}: ShortlistButtonProps) {
  const {
    shortlists,
    addPlayerToShortlist,
    removePlayerFromShortlist,
    getPlayerShortlists,
    updatePlayerTags,
  } = useShortlistStore();
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});

  const playerShortlists = getPlayerShortlists(playerId);
  const isInAnyShortlist = playerShortlists.length > 0;

  const toggleTag = (shortlistId: string, tag: string) => {
    setSelectedTags((prev) => {
      const current = prev[shortlistId] || [];
      const next = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return { ...prev, [shortlistId]: next };
    });
  };

  const handleToggle = async (shortlistId: string) => {
    setLoadingId(shortlistId);
    const isIn = playerShortlists.some((s) => s.id === shortlistId);

    if (isIn) {
      removePlayerFromShortlist(shortlistId, playerId);
    } else {
      const tags = selectedTags[shortlistId] || [];
      addPlayerToShortlist(shortlistId, {
        playerId,
        playerName,
        playerImage,
        playerPosition,
        playerTeam,
        tags,
      });
    }
    await new Promise((r) => setTimeout(r, 150));
    setLoadingId(null);
  };

  const handleTagUpdate = (shortlistId: string, tag: string) => {
    const existingPlayer = playerShortlists
      .find((s) => s.id === shortlistId)
      ?.players.find((p) => p.playerId === playerId);

    if (existingPlayer) {
      const currentTags = existingPlayer.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      updatePlayerTags(shortlistId, playerId, newTags);
    }
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
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className="absolute top-full mt-2 left-0 z-20 w-72 rounded-xl p-3 shadow-xl"
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
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {shortlists.map((sl) => {
                  const isIn = playerShortlists.some((s) => s.id === sl.id);
                  const existingPlayer = playerShortlists
                    .find((s) => s.id === sl.id)
                    ?.players.find((p) => p.playerId === playerId);
                  const activeTags = isIn
                    ? existingPlayer?.tags || []
                    : selectedTags[sl.id] || [];

                  return (
                    <div
                      key={sl.id}
                      className="rounded-lg border p-2.5"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <button
                        onClick={() => handleToggle(sl.id)}
                        className="w-full flex items-center gap-2 text-xs text-left"
                        style={{ color: "var(--color-text)" }}
                      >
                        {loadingId === sl.id ? (
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

                      {/* Tag selection */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {PRESET_TAGS.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => {
                              if (isIn) {
                                handleTagUpdate(sl.id, tag);
                              } else {
                                toggleTag(sl.id, tag);
                              }
                            }}
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium border transition-colors"
                            style={{
                              background: activeTags.includes(tag)
                                ? "var(--color-primary)"
                                : "var(--color-surface-2)",
                              borderColor: activeTags.includes(tag)
                                ? "var(--color-primary-dark)"
                                : "var(--color-border)",
                              color: activeTags.includes(tag)
                                ? "var(--color-primary-text)"
                                : "var(--color-text-muted)",
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
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
