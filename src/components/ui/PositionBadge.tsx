"use client";

import { POSITION_COLORS } from "@/lib/stat-categories";

interface PositionBadgeProps {
  position: string;
  category: "goalkeeper" | "defender" | "midfielder" | "attacker";
  size?: "sm" | "md";
}

export function PositionBadge({ position, category, size = "sm" }: PositionBadgeProps) {
  const colors = POSITION_COLORS[category];
  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${sizeClass}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {position}
    </span>
  );
}
