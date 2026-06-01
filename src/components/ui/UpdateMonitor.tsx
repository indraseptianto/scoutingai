"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { useShortlistStore } from "@/lib/shortlist-store";

const UPDATE_LOG_KEY = "scoutvision-update-log";

type UpdateLogItem = { id: number; name: string; message: string; checkedAt: string };

export function UpdateMonitor() {
  const { shortlists } = useShortlistStore();
  const [updates, setUpdates] = useState<UpdateLogItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(UPDATE_LOG_KEY);
      return stored ? (JSON.parse(stored) as UpdateLogItem[]) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (shortlists.length === 0) return;

    const playerIds = shortlists.flatMap((sl) => sl.players.map((p) => p.playerId));
    if (playerIds.length === 0) return;

    const checkUpdates = async () => {
      try {
        const res = await fetch("/api/players/latest");
        const data = await res.json();
        const latest = (data.data || []) as { id: number; display_name: string }[];

        const newUpdates = latest
          .filter((p) => playerIds.includes(p.id))
          .slice(0, 3)
          .map((p) => ({
            id: p.id,
            name: p.display_name,
            message: `${p.display_name} — stats updated`,
            checkedAt: new Date().toISOString(),
          }));

        if (newUpdates.length > 0) {
          setUpdates((prev) => {
            const merged = [...newUpdates, ...prev].slice(0, 20);
            window.localStorage.setItem(UPDATE_LOG_KEY, JSON.stringify(merged));
            return merged;
          });
        }
      } catch {
        // Silently fail
      }
    };

    checkUpdates();
    const interval = setInterval(checkUpdates, 7200000); // 2 hours

    return () => clearInterval(interval);
  }, [shortlists]);

  const unreadCount = updates.length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full h-8 w-8 flex items-center justify-center transition-colors hover:bg-black/5"
        aria-label="Notifications"
      >
        <Bell size={18} style={{ color: "var(--color-text-muted)" }} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ background: "var(--color-danger)", color: "white" }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 w-64 rounded-xl border p-3 shadow-xl z-20"
            style={{
              background: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <h4 className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              Updates
            </h4>
            {updates.length > 0 ? (
              <div className="space-y-2">
                {updates.map((u) => (
                  <div key={`${u.id}-${u.checkedAt}`} className="text-xs py-1" style={{ color: "var(--color-text)" }}>
                    {u.message}
                    <div className="text-[10px] mt-0.5" style={{ color: "var(--color-text-dim)" }}>
                      {new Date(u.checkedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "var(--color-text-dim)" }}>
                No recent updates for your shortlists
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
