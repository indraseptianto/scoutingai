"use client";

import { useEffect, useRef, useState } from "react";
import { StatTrendBadge } from "@/components/ui/StatTrendBadge";

interface PlayerKPICellProps {
  label: string;
  value: string | number;
  trend?: number;
  subtitle?: string;
  format?: "number" | "percentage" | "rating" | "time";
}

function formatValueRaw(
  value: number,
  format: "number" | "percentage" | "rating" | "time"
): string {
  switch (format) {
    case "percentage":
      return `${value}%`;
    case "rating":
      return value.toFixed(1);
    case "time":
      return value.toLocaleString();
    default:
      return String(Math.round(value));
  }
}

function AnimatedCounter({
  target,
  format,
}: {
  target: number;
  format: "number" | "percentage" | "rating" | "time";
}) {
  const [current, setCurrent] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    if (prevTarget.current === target) {
      setCurrent(target);
      return;
    }
    prevTarget.current = target;

    const start = 0;
    const duration = 800;
    const steps = 30;
    const increment = target / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step >= steps) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(start + Math.round(increment * step * 10) / 10);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <span>{formatValueRaw(current, format)}</span>;
}

export function PlayerKPICell({
  label,
  value,
  trend,
  subtitle,
  format = "number",
}: PlayerKPICellProps) {
  const isUnavailable = value === "—" || value === "-" || value === "";
  const numericValue = typeof value === "string" ? parseFloat(value) || 0 : value;

  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <p
          className="text-xs uppercase tracking-wider font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="mt-1 text-4xl font-black font-mono tabular-nums leading-none"
          style={{ color: "var(--color-text)" }}
          title={isUnavailable ? "Not available for this season" : undefined}
        >
          {isUnavailable ? "—" : <AnimatedCounter target={numericValue} format={format} />}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        {trend !== undefined && <StatTrendBadge value={trend} />}
        {subtitle && (
          <span className="text-xs" style={{ color: "var(--color-text-dim)" }}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
