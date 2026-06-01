"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-6">
      <h1
        className="text-6xl font-black font-mono mb-4"
        style={{ color: "var(--color-primary-dark)" }}
      >
        404
      </h1>
      <p className="text-xl font-semibold mb-2" style={{ color: "var(--color-text)" }}>
        Player Not Found
      </p>
      <p className="text-sm mb-8 text-center max-w-md" style={{ color: "var(--color-text-muted)" }}>
        The player you are looking for does not exist in our database or the URL may be incorrect.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
          style={{
            background: "var(--color-primary-dark)",
            color: "white",
          }}
        >
          Go Home
        </Link>
        <Link
          href="/players"
          className="rounded-full px-6 py-2.5 text-sm font-medium border transition-colors"
          style={{
            borderColor: "var(--color-border-strong)",
            color: "var(--color-text)",
            background: "var(--color-surface)",
          }}
        >
          Browse Players
        </Link>
      </div>
    </div>
  );
}
