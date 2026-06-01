"use client";

import { X } from "lucide-react";

interface ComparePlayer {
  id: number;
  display_name: string;
  image_path: string;
  position: { name: string; code: string };
  detailed_position?: { name: string };
  nationality?: { name: string; image_path?: string };
  date_of_birth: string;
  teams?: { name: string }[];
}

interface PlayerCompareColumnProps {
  player: ComparePlayer;
  stats: { label: string; value: number; isBest?: boolean; isWorst?: boolean }[];
  onRemove?: () => void;
}

function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}

export function PlayerCompareColumn({
  player,
  stats,
  onRemove,
}: PlayerCompareColumnProps) {
  const age = calculateAge(player.date_of_birth);
  const imageUrl = player.image_path || "/placeholder.svg";

  return (
    <div className="relative">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 rounded-full p-1 shadow-sm hover:shadow transition-shadow"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <X size={14} />
        </button>
      )}

      <div
        className="rounded-xl p-4 text-center mb-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={player.display_name}
          width={72}
          height={72}
          className="rounded-full border-2 object-cover mx-auto"
          style={{
            borderColor: "var(--color-primary)",
            width: 72,
            height: 72,
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <h3
          className="mt-2 text-sm font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          {player.display_name}
        </h3>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {player.detailed_position?.name || player.position.name} ·{" "}
          {player.teams?.[0]?.name || "—"}
        </p>
        <div className="mt-1 flex items-center justify-center gap-1.5">
          {player.nationality && (
            <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
              {player.nationality.name}
            </span>
          )}
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            Age {age}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg px-3 py-2 text-center"
            style={{
              background: stat.isBest
                ? "#F0FFF4"
                : stat.isWorst
                ? "var(--color-surface-2)"
                : "transparent",
              color: stat.isBest
                ? "var(--color-success)"
                : "var(--color-text)",
            }}
          >
            <span
              className="text-xs block truncate"
              style={{ color: "var(--color-text-muted)" }}
            >
              {stat.label}
            </span>
            <span
              className={`text-sm font-mono font-semibold tabular-nums ${
                stat.isBest ? "font-bold" : ""
              }`}
            >
              {stat.value}
              {stat.isBest && (
                <span className="ml-1 text-xs" style={{ color: "var(--color-success)" }}>
                  🟢
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
