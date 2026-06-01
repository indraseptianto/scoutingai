import { create } from "zustand";
import { persist } from "zustand/middleware";

export type QueryPresetValues = {
  position: string;
  detailedPos: string;
  ageMin: number;
  ageMax: number;
  league: string;
  season: string;
  nationality: string;
  goalsMin: number;
  assistsMin: number;
  passMin: number;
  ratingMin: number;
  appsMin: number;
  tacklesMin: number;
};

export type QueryPreset = {
  id: string;
  name: string;
  values: QueryPresetValues;
  createdAt: string;
};

type QueryStore = {
  presets: QueryPreset[];
  addPreset: (name: string, values: QueryPresetValues) => void;
  removePreset: (id: string) => void;
};

export const useQueryStore = create<QueryStore>()(
  persist(
    (set) => ({
      presets: [],
      addPreset: (name, values) => {
        set((state) => ({
          presets: [
            {
              id: crypto.randomUUID(),
              name,
              values,
              createdAt: new Date().toISOString(),
            },
            ...state.presets,
          ],
        }));
      },
      removePreset: (id) => {
        set((state) => ({ presets: state.presets.filter((preset) => preset.id !== id) }));
      },
    }),
    { name: "scoutvision-query-presets" }
  )
);
