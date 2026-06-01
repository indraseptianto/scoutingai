"use client";

interface SeasonSelectorProps {
  seasons: string[];
  current: string;
  onChange: (season: string) => void;
}

export function SeasonSelector({ seasons, current, onChange }: SeasonSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {seasons.map((season) => (
        <button
          key={season}
          onClick={() => onChange(season)}
          className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
          style={{
            backgroundColor:
              season === current
                ? "var(--color-primary-dark)"
                : "var(--color-surface-2)",
            color:
              season === current
                ? "var(--color-primary-text)"
                : "var(--color-text-muted)",
            border:
              season === current
                ? "1px solid var(--color-primary-dark)"
                : "1px solid var(--color-border)",
          }}
        >
          {season}
        </button>
      ))}
    </div>
  );
}
