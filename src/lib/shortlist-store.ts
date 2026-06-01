import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ShortlistItem {
  playerId: number;
  playerName: string;
  playerImage: string;
  playerPosition: string;
  playerTeam: string;
  tags: string[];
  addedAt: string;
}

export interface Shortlist {
  id: string;
  name: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  players: ShortlistItem[];
  createdAt: string;
}

interface ShortlistStore {
  shortlists: Shortlist[];
  addShortlist: (name: string, description: string, priority: Shortlist["priority"]) => string;
  removeShortlist: (id: string) => void;
  addPlayerToShortlist: (
    shortlistId: string,
    player: Omit<ShortlistItem, "tags" | "addedAt"> & { tags?: string[] }
  ) => void;
  removePlayerFromShortlist: (shortlistId: string, playerId: number) => void;
  updatePlayerTags: (shortlistId: string, playerId: number, tags: string[]) => void;
  getPlayerShortlists: (playerId: number) => Shortlist[];
}

export const useShortlistStore = create<ShortlistStore>()(
  persist(
    (set, get) => ({
      shortlists: [],

      addShortlist: (name, description, priority) => {
        const id = crypto.randomUUID();
        set((state) => ({
          shortlists: [
            ...state.shortlists,
            {
              id,
              name,
              description,
              priority,
              players: [],
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return id;
      },

      removeShortlist: (id) => {
        set((state) => ({
          shortlists: state.shortlists.filter((s) => s.id !== id),
        }));
      },

      addPlayerToShortlist: (shortlistId, player) => {
        set((state) => ({
          shortlists: state.shortlists.map((s) => {
            if (s.id !== shortlistId) return s;
            if (s.players.some((p) => p.playerId === player.playerId)) return s;
            return {
              ...s,
              players: [
                ...s.players,
                {
                  ...player,
                  tags: player.tags || [],
                  addedAt: new Date().toISOString(),
                },
              ],
            };
          }),
        }));
      },

      removePlayerFromShortlist: (shortlistId, playerId) => {
        set((state) => ({
          shortlists: state.shortlists.map((s) => {
            if (s.id !== shortlistId) return s;
            return {
              ...s,
              players: s.players.filter((p) => p.playerId !== playerId),
            };
          }),
        }));
      },

      updatePlayerTags: (shortlistId, playerId, tags) => {
        set((state) => ({
          shortlists: state.shortlists.map((s) => {
            if (s.id !== shortlistId) return s;
            return {
              ...s,
              players: s.players.map((p) =>
                p.playerId === playerId ? { ...p, tags } : p
              ),
            };
          }),
        }));
      },

      getPlayerShortlists: (playerId) => {
        return get().shortlists.filter((s) =>
          s.players.some((p) => p.playerId === playerId)
        );
      },
    }),
    { name: "scoutvision-shortlists" }
  )
);
