"use client";

import Link from "next/link";
import { PositionBadge } from "@/components/ui/PositionBadge";
import { PlayerAvatar } from "@/components/ui/PlayerAvatar";
import { getPositionCategory } from "@/lib/stat-categories";

interface PlayerCardProps {
  player: {
    id: number;
    display_name: string;
    common_name?: string;
    image_path: string;
    position: { name: string; code: string };
    detailed_position?: { name: string };
    nationality?: { name: string; image_path?: string };
    teams?: { name: string; image_path?: string }[];
    statistics?: { stat_type_id: number; value: number }[];
  };
}

export function PlayerCard({ player }: PlayerCardProps) {
  const positionCategory = getPositionCategory(player.position.code);
  const team = player.teams?.[0];
  const imageUrl = player.image_path || "/placeholder.svg";

  const getStat = (statId: number) =>
    player.statistics?.find((s) => s.stat_type_id === statId)?.value ?? "—";

  return (
    <Link
      href={`/players/${player.id}`}
      className="block rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-start gap-3">
        <PlayerAvatar
          src={imageUrl}
          name={player.display_name}
          size={64}
          withFlag={!!player.nationality}
          nationality={player.nationality?.name}
        />
        <div className="min-w-0 flex-1">
          <h3
            className="truncate text-base font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {player.display_name}
          </h3>
          <div className="mt-1 flex items-center gap-1.5">
            <PositionBadge
              position={player.detailed_position?.name || player.position.name}
              category={positionCategory}
            />
            {player.nationality && (
              <span
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {player.nationality.name}
              </span>
            )}
          </div>
          {team && (
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {team.name}
            </p>
          )}
        </div>
      </div>

      {player.statistics && (
        <div
          className="mt-3 grid grid-cols-3 gap-2 border-t pt-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="text-center">
            <div
              className="text-lg font-mono font-black tabular-nums"
              style={{ color: "var(--color-text)" }}
            >
              {getStat(52)}
            </div>
            <div
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Goals
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-lg font-mono font-black tabular-nums"
              style={{ color: "var(--color-text)" }}
            >
              {getStat(79)}
            </div>
            <div
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Assists
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-lg font-mono font-black tabular-nums"
              style={{ color: "var(--color-text)" }}
            >
              {typeof getStat(118) === "number"
                ? (getStat(118) as number).toFixed(1)
                : getStat(118)}
            </div>
            <div
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--color-text-muted)" }}
            >
              Rating
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
