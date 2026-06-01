"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/theme-store";

function applyTheme(mode: "light" | "dark" | "system") {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && prefersDark));
}

export function ThemeToggle() {
  const { mode, setMode } = useThemeStore();

  useEffect(() => {
    applyTheme(mode);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme(mode);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [mode]);

  return (
    <div className="flex rounded-full border p-0.5" style={{ borderColor: "var(--color-border)" }} aria-label="Theme mode">
      {(["light", "dark", "system"] as const).map((item) => (
        <button
          key={item}
          onClick={() => setMode(item)}
          className="rounded-full px-2 py-1 text-[10px] font-semibold capitalize transition-colors"
          style={{
            background: mode === item ? "var(--color-primary-dark)" : "transparent",
            color: mode === item ? "white" : "var(--color-text-muted)",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
