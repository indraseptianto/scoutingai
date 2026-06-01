"use client";

interface TagBadgeProps {
  tag: string;
  size?: "sm" | "md";
  onRemove?: () => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  priority: { bg: "#FEE2E2", text: "#DC2626", border: "#EF4444" },
  backup: { bg: "#FEF3C7", text: "#D97706", border: "#F59E0B" },
  monitored: { bg: "#DBEAFE", text: "#1E3A8A", border: "#3B82F6" },
  default: { bg: "#E8F0F7", text: "#4B5563", border: "#80A1C1" },
};

export function TagBadge({ tag, size = "sm", onRemove }: TagBadgeProps) {
  const colors = TAG_COLORS[tag.toLowerCase()] || TAG_COLORS.default;
  const sizeClass = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[10px]";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium border ${sizeClass}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {tag}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:opacity-70 ml-0.5"
          aria-label={`Remove ${tag} tag`}
        >
          ×
        </button>
      )}
    </span>
  );
}
