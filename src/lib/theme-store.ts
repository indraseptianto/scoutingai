import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "light" | "dark" | "system";

type ThemeStore = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
      toggleMode: () => {
        const nextMode = get().mode === "dark" ? "light" : "dark";
        set({ mode: nextMode });
      },
    }),
    { name: "scoutvision-theme" }
  )
);
