interface SkeletonCellProps {
  size?: "1x1" | "1x2" | "2x1" | "2x2" | "3x1" | "4x1";
}

export function SkeletonCell({ size = "1x1" }: SkeletonCellProps) {
  const sizeClass = `cell-${size}`;

  return (
    <div className={`bento-cell ${sizeClass}`}>
      <div className="skeleton-line w-1/2 h-4 mb-2" />
      <div className="skeleton-line w-full h-8 mb-2" />
      <div className="skeleton-line w-3/4 h-3 mb-1" />
      <div className="skeleton-line w-1/2 h-3" />
    </div>
  );
}

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`skeleton-line h-4 rounded-sm ${className}`} />;
}
