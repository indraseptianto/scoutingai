"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface BentoCellProps {
  children: React.ReactNode;
  size?: "1x1" | "1x2" | "2x1" | "2x2" | "3x1" | "4x1" | "4x2";
  variant?: "default" | "primary" | "secondary" | "dark" | "ghost";
  className?: string;
  animate?: boolean;
  delay?: number;
  onClick?: () => void;
  href?: string;
}

export function BentoCell({
  children,
  size = "1x1",
  variant = "default",
  className = "",
  animate = true,
  delay = 0,
  onClick,
  href,
}: BentoCellProps) {
  const cellRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cellRef.current) {
      observer.observe(cellRef.current);
    }

    return () => observer.disconnect();
  }, [animate, delay]);

  const variantClass =
    variant !== "default" ? `bento-cell--${variant}` : "";

  const cellClasses = [
    "bento-cell",
    `cell-${size}`,
    variantClass,
    isVisible ? "bento-cell-enter" : "opacity-0",
    onClick ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div
      ref={cellRef}
      className={cellClasses}
      onClick={onClick}
      style={animate ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );

  if (href) {
    return <Link href={href} className="contents">{content}</Link>;
  }

  return content;
}
