"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameView, PlayerState, WorldId } from "./types";

interface GameState {
  // View routing
  view: GameView;
  selectedWorldId: WorldId | null;
  selectedStageId: string | null;
  // Last battle result
  lastResult: {
    stageId: string;
    victory: boolean;
    xpGained: number;
    correctCount: number;
    totalCount: number;
    itemsGained: string[];
    badgesGained: string[];
  } | null;

  // Player state
  player: PlayerState;

  // Settings
  soundEnabled: boolean;
  crtEnabled: boolean;

  // Actions
  setView: (v: GameView) => void;
  selectWorld: (id: WorldId) => void;
  selectStage: (id: string) => void;
  setLastResult: (r: GameState["lastResult"]) => void;

  completeStage: (params: {
    stageId: string;
    xp: number;
    items?: string[];
    badges?: string[];
    unlockWorld?: WorldId;
    restoreHp?: boolean;
  }) => void;
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  resetPlayer: () => void;
  toggleSound: () => void;
  toggleCrt: () => void;
  setPlayerName: (name: string) => void;
}

const INITIAL_PLAYER: PlayerState = {
  name: "Hero",
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 20,
  maxHp: 20,
  badges: [],
  items: [],
  completedStages: [],
  unlockedWorlds: ["hajimari"],
};

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      view: "title",
      selectedWorldId: null,
      selectedStageId: null,
      lastResult: null,
      player: INITIAL_PLAYER,
      soundEnabled: true,
      crtEnabled: true,

      setView: (v) => set({ view: v }),
      selectWorld: (id) => set({ selectedWorldId: id }),
      selectStage: (id) => set({ selectedStageId: id }),
      setLastResult: (r) => set({ lastResult: r }),

      completeStage: ({
        stageId,
        xp,
        items = [],
        badges = [],
        unlockWorld,
        restoreHp,
      }) => {
        const player = { ...get().player };
        if (!player.completedStages.includes(stageId)) {
          player.completedStages.push(stageId);
        }
        player.xp += xp;
        // Level up
        while (player.xp >= player.xpToNext) {
          player.xp -= player.xpToNext;
          player.level += 1;
          player.xpToNext = Math.floor(player.xpToNext * 1.4);
          player.maxHp += 5;
          if (restoreHp !== false) player.hp = player.maxHp;
        }
        for (const item of items) {
          if (!player.items.includes(item)) player.items.push(item);
        }
        for (const badge of badges) {
          if (!player.badges.includes(badge)) player.badges.push(badge);
        }
        if (unlockWorld && !player.unlockedWorlds.includes(unlockWorld)) {
          player.unlockedWorlds.push(unlockWorld);
        }
        if (restoreHp !== false && player.hp < player.maxHp) {
          player.hp = player.maxHp;
        }
        set({ player });
      },

      damagePlayer: (amount) => {
        const player = { ...get().player };
        player.hp = Math.max(0, player.hp - amount);
        set({ player });
      },

      healPlayer: (amount) => {
        const player = { ...get().player };
        player.hp = Math.min(player.maxHp, player.hp + amount);
        set({ player });
      },

      resetPlayer: () => {
        set({
          player: { ...INITIAL_PLAYER, unlockedWorlds: ["hajimari"] },
          view: "title",
          selectedWorldId: null,
          selectedStageId: null,
          lastResult: null,
        });
      },

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleCrt: () => set((s) => ({ crtEnabled: !s.crtEnabled })),

      setPlayerName: (name) =>
        set((s) => ({ player: { ...s.player, name: name.slice(0, 12) || "Hero" } })),
    }),
    {
      name: "kotobaquest-save",
      // Persist player + settings, not view state
      partialize: (s) => ({
        player: s.player,
        soundEnabled: s.soundEnabled,
        crtEnabled: s.crtEnabled,
      }),
    },
  ),
);
