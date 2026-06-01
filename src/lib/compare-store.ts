import { create } from "zustand";

export interface ComparePlayer {
  id: number;
  display_name: string;
  image_path: string;
  position: { name: string; code: string };
  detailed_position: { name: string };
  nationality: { name: string; image_path: string };
  date_of_birth: string;
  teams: { id: number; name: string; image_path: string }[];
  statistics: { stat_type_id: number; value: number }[];
}

interface CompareStore {
  players: ComparePlayer[];
  addPlayer: (player: ComparePlayer) => void;
  removePlayer: (id: number) => void;
  clearAll: () => void;
}

export const useCompareStore = create<CompareStore>()((set) => ({
  players: [],

  addPlayer: (player) => {
    set((state) => {
      if (state.players.length >= 4) return state;
      if (state.players.some((p) => p.id === player.id)) return state;
      return { players: [...state.players, player] };
    });
  },

  removePlayer: (id) => {
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    }));
  },

  clearAll: () => {
    set({ players: [] });
  },
}));
