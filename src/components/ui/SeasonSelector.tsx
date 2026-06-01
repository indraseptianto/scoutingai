"use client";

interface SeasonSelectorProps {
  seasons: string[];
  current: string;
  onChange: (season: string) => void;
  disabled?: boolean;
}

export function SeasonSelector({ seasons, current, onChange, disabled }: SeasonSelectorProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider mr-1" style={{ color: "var(--color-text-muted)" }}>
        Season:
      </span>
      {seasons.map((season) => (
        <button
          key={season}
          onClick={() => !disabled && onChange(season)}
          disabled={disabled}
          className="rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
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
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {season}
        </button>
      ))}
      {disabled && (
        <span className="text-xs animate-pulse" style={{ color: "var(--color-text-dim)" }}>
          Loading...
        </span>
      )}
    </div>
  );
}
