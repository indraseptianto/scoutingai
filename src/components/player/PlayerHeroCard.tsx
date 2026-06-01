"use client";

import { PositionBadge } from "@/components/ui/PositionBadge";
import { PlayerAvatar } from "@/components/ui/PlayerAvatar";
import { ShortlistButton } from "@/components/shortlist/ShortlistButton";
import { getPositionCategory } from "@/lib/stat-categories";

interface PlayerHeroCardProps {
  player: {
    id: number;
    display_name: string;
    common_name?: string;
    image_path: string;
    date_of_birth: string;
    height?: number;
    weight?: number;
    position: { name: string; code: string };
    detailed_position?: { name: string; code?: string };
    preferred_foot?: string;
    nationality?: { id: number; name: string; image_path?: string };
    teams?: { id: number; name: string; image_path: string }[];
    joinYear?: number | null;
  };
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

export function PlayerHeroCard({ player }: PlayerHeroCardProps) {
  const age = calculateAge(player.date_of_birth);
  const positionCategory = getPositionCategory(player.position.code);
  const team = player.teams?.[0];
  const imageUrl = player.image_path || "/placeholder.svg";

  return (
    <div
      className="rounded-2xl p-8 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
        color: "#F9FAFB",
      }}
    >
      <div className="flex flex-wrap items-start gap-6">
        <PlayerAvatar
          src={imageUrl}
          name={player.display_name}
          size={120}
          withFlag={!!player.nationality}
          nationality={player.nationality?.name}
        />

        <div className="flex-1 min-w-0">
          <h1
            className="text-3xl font-bold"
            style={{ color: "#F9FAFB" }}
          >
            {player.display_name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PositionBadge
              position={player.detailed_position?.name || player.position.name}
              category={positionCategory}
              size="md"
            />
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-white/10">
              #{player.id} · Age {age}
            </span>
            {player.nationality && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-white/10">
                {player.nationality.name}
              </span>
            )}
            {team && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium bg-white/10">
                {team.name}
              </span>
            )}
          </div>

          <div className="mt-1">
            <span style={{ color: "#9CA3AF" }}>
              DOB:{" "}
              {new Date(player.date_of_birth).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <ShortlistButton playerId={player.id} />
            <button className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium hover:bg-white/20 transition-colors">
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
            Physical
          </p>
          <p className="mt-1 text-lg font-semibold font-mono">
            {player.height ? `${player.height}cm` : "—"} /{" "}
            {player.weight ? `${player.weight}kg` : "—"}
          </p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
            Preferred Foot
          </p>
          <p className="mt-1 text-lg font-semibold font-mono capitalize">
            {player.preferred_foot || "—"}
          </p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs uppercase tracking-wider" style={{ color: "#9CA3AF" }}>
            Career
          </p>
          <p className="mt-1 text-lg font-semibold font-mono">
            {team ? `Joined: ${player.joinYear || "—"}` : `Age ${age}`}
          </p>
        </div>
      </div>
    </div>
  );
}
