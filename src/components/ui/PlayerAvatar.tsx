"use client";

interface PlayerAvatarProps {
  src: string;
  name: string;
  size?: 40 | 64 | 120;
  withFlag?: boolean;
  nationality?: string;
  className?: string;
}

export function PlayerAvatar({
  src,
  name,
  size = 64,
  withFlag = false,
  nationality,
  className = "",
}: PlayerAvatarProps) {
  const sizeMap = {
    40: { container: 40, border: 2 },
    64: { container: 64, border: 2 },
    120: { container: 120, border: 4 },
  };

  const { container, border } = sizeMap[size];

  return (
    <div className={`relative inline-block ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || "/placeholder.svg"}
        alt={name}
        width={container}
        height={container}
        className="rounded-full object-cover flex-shrink-0"
        style={{
          width: container,
          height: container,
          border: `${border}px solid var(--color-primary)`,
        }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
      {withFlag && nationality && (
        <span
          className="absolute -bottom-1 -right-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium border"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
          title={nationality}
        >
          {nationality.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );
}
