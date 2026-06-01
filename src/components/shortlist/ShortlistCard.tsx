"use client";

import Link from "next/link";

interface ShortlistCardProps {
  shortlist: {
    id: string;
    name: string;
    description: string;
    priority: "High" | "Medium" | "Low";
    players: { playerName: string; playerImage: string }[];
  };
}

export function ShortlistCard({ shortlist }: ShortlistCardProps) {
  const priorityColors = {
    High: { bg: "#FEE2E2", text: "#DC2626" },
    Medium: { bg: "#FEF3C7", text: "#D97706" },
    Low: { bg: "#E8F0F7", text: "#4B5563" },
  };

  return (
    <Link
      href={`/shortlists?id=${shortlist.id}`}
      className="block"
    >
      <div
        className="rounded-xl p-5 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <h3
            className="text-lg font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {shortlist.name}
          </h3>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: priorityColors[shortlist.priority].bg,
              color: priorityColors[shortlist.priority].text,
            }}
          >
            {shortlist.priority}
          </span>
        </div>

        <p className="text-sm mb-4" style={{ color: "var(--color-text-muted)" }}>
          {shortlist.players.length} players · {shortlist.description}
        </p>

        {shortlist.players.length > 0 && (
          <div className="flex -space-x-2 mb-4">
            {shortlist.players.slice(0, 4).map((player, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={player.playerImage || "/placeholder.svg"}
                alt={player.playerName}
                width={32}
                height={32}
                className="rounded-full border-2 object-cover"
                style={{
                  borderColor: "var(--color-surface)",
                  width: 32,
                  height: 32,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            ))}
            {shortlist.players.length > 4 && (
              <div
                className="rounded-full border-2 flex items-center justify-center text-xs font-medium"
                style={{
                  width: 32,
                  height: 32,
                  background: "var(--color-surface-2)",
                  borderColor: "var(--color-surface)",
                  color: "var(--color-text-muted)",
                }}
              >
                +{shortlist.players.length - 4}
              </div>
            )}
          </div>
        )}

        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-primary-dark)" }}
        >
          Open →
        </span>
      </div>
    </Link>
  );
}
