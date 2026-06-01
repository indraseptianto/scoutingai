"use client";

interface StatTrendBadgeProps {
  value: number;
  label?: string;
}

export function StatTrendBadge({ value, label }: StatTrendBadgeProps) {
  const isUp = value > 0;
  const isDown = value < 0;
  const modifier = isUp ? "up" : isDown ? "down" : "flat";
  const arrow = isUp ? "↑" : isDown ? "↓" : "→";
  const prefix = isUp ? "+" : "";

  const bgColor =
    modifier === "up" ? "#F0FFF4" : modifier === "down" ? "#FFF0F0" : "#F3F4F6";
  const textColor =
    modifier === "up"
      ? "var(--color-success)"
      : modifier === "down"
      ? "var(--color-danger)"
      : "var(--color-neutral)";

  return (
    <span
      className="trend-badge"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {arrow} {prefix}{value}
      {label && <span className="ml-1 opacity-70">{label}</span>}
    </span>
  );
}
