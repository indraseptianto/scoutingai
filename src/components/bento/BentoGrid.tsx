"use client";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className = "" }: BentoGridProps) {
  return <div className={`bento-grid ${className}`}>{children}</div>;
}
