"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/theme-store";

function applyTheme(mode: "light" | "dark" | "system") {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && prefersDark));
}

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeStore();

  useEffect(() => {
    applyTheme(mode);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme(mode);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [mode]);

  return (
    <button
      onClick={toggleMode}
      className="rounded-full h-8 min-w-8 px-2 flex items-center justify-center text-xs font-semibold transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      aria-label="Toggle dark mode"
      title={`Theme: ${mode}`}
      style={{ color: "var(--color-text-muted)" }}
    >
      {mode === "dark" ? "Dark" : "Light"}
    </button>
  );
}
