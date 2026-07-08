"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameView, PlayerState, WorldId, GameStats } from "./types";
import { ITEMS, checkNewAchievements } from "./items";

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
    coinsGained: number;
    correctCount: number;
    totalCount: number;
    bestCombo: number;
    itemsGained: string[];
    badgesGained: string[];
    achievementsGained: string[];
  } | null;

  // Player state
  player: PlayerState;
  // Game stats (for achievements)
  stats: GameStats;

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
    coins?: number;
    items?: string[];
    badges?: string[];
    unlockWorld?: WorldId;
    restoreHp?: boolean;
    bestCombo?: number;
    correctCount?: number;
  }) => string[]; // returns new achievement IDs
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  resetPlayer: () => void;
  toggleSound: () => void;
  toggleCrt: () => void;
  setPlayerName: (name: string) => void;

  // Shop
  buyItem: (itemId: string) => boolean;
  consumeItem: (itemId: string) => "heal" | "fullheal" | "hint" | "shield" | "damage" | null;
  hasItem: (itemId: string) => boolean;

  // Stats
  recordAnswer: (correct: boolean) => void;
  recordCombo: (combo: number) => void;
  recordBossDefeat: () => void;
  recordPerfectStage: () => void;
  recordItemUsed: () => void;

  // Difficulty
  setDifficulty: (d: "easy" | "normal" | "hard") => void;
  recordStageLoss: (stageId: string) => void;
}

const INITIAL_PLAYER: PlayerState = {
  name: "Hero",
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 20,
  maxHp: 20,
  coins: 50,
  badges: [],
  items: [],
  itemCounts: {},
  completedStages: [],
  unlockedWorlds: ["hajimari"],
  achievements: [],
  difficulty: "normal",
  stageLosses: {},
};

const INITIAL_STATS: GameStats = {
  totalCorrect: 0,
  totalWrong: 0,
  bestCombo: 0,
  stagesCleared: 0,
  bossesDefeated: 0,
  perfectStages: 0,
  totalItemsUsed: 0,
  daysPlayed: 1,
  lastPlayedDate: new Date().toDateString(),
};

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      view: "title",
      selectedWorldId: null,
      selectedStageId: null,
      lastResult: null,
      player: INITIAL_PLAYER,
      stats: INITIAL_STATS,
      soundEnabled: true,
      crtEnabled: true,

      setView: (v) => set({ view: v }),
      selectWorld: (id) => set({ selectedWorldId: id }),
      selectStage: (id) => set({ selectedStageId: id }),
      setLastResult: (r) => set({ lastResult: r }),

      completeStage: ({
        stageId,
        xp,
        coins = 0,
        items = [],
        badges = [],
        unlockWorld,
        restoreHp,
        bestCombo = 0,
        correctCount = 0,
      }) => {
        const player = { ...get().player };
        const stats = { ...get().stats };

        if (!player.completedStages.includes(stageId)) {
          player.completedStages.push(stageId);
          stats.stagesCleared += 1;
          if (correctCount > 0) {
            // will be set externally
          }
        }
        player.xp += xp;
        player.coins += coins;

        // Level up
        while (player.xp >= player.xpToNext) {
          player.xp -= player.xpToNext;
          player.level += 1;
          player.xpToNext = Math.floor(player.xpToNext * 1.4);
          player.maxHp += 5;
          if (restoreHp !== false) player.hp = player.maxHp;
          // Bonus coins on level up
          player.coins += 20 * player.level;
        }
        for (const item of items) {
          if (!player.items.includes(item)) player.items.push(item);
          player.itemCounts[item] = (player.itemCounts[item] || 0) + 1;
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

        // Update stats
        if (bestCombo > stats.bestCombo) stats.bestCombo = bestCombo;
        if (badges.length > 0) stats.bossesDefeated += 1;

        // Check achievements
        const newAchievements = checkNewAchievements(player, stats);
        for (const id of newAchievements) {
          if (!player.achievements.includes(id)) {
            player.achievements.push(id);
          }
        }

        set({ player, stats });
        return newAchievements;
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
          stats: { ...INITIAL_STATS, lastPlayedDate: new Date().toDateString() },
          view: "title",
          selectedWorldId: null,
          selectedStageId: null,
          lastResult: null,
        });
      },

      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleCrt: () => set((s) => ({ crtEnabled: !s.crtEnabled })),

      setPlayerName: (name) =>
        set((s) => ({
          player: { ...s.player, name: name.slice(0, 12) || "Hero" },
        })),

      buyItem: (itemId) => {
        const def = ITEMS[itemId];
        if (!def) return false;
        const player = { ...get().player };
        if (player.coins < def.price) return false;
        player.coins -= def.price;
        if (!player.items.includes(itemId)) player.items.push(itemId);
        player.itemCounts[itemId] = (player.itemCounts[itemId] || 0) + 1;
        set({ player });
        return true;
      },

      consumeItem: (itemId) => {
        const def = ITEMS[itemId];
        if (!def || !def.consumable) return null;
        const player = { ...get().player };
        const count = player.itemCounts[itemId] || 0;
        if (count <= 0) return null;

        player.itemCounts[itemId] = count - 1;
        if (player.itemCounts[itemId] <= 0) {
          delete player.itemCounts[itemId];
          player.items = player.items.filter((i) => i !== itemId);
        }

        // Apply effect
        if (def.effect === "heal") {
          player.hp = Math.min(player.maxHp, player.hp + def.value);
        } else if (def.effect === "fullheal") {
          player.hp = player.maxHp;
        }

        const stats = { ...get().stats };
        stats.totalItemsUsed += 1;
        set({ player, stats });
        return def.effect;
      },

      hasItem: (itemId) => {
        const player = get().player;
        return (player.itemCounts[itemId] || 0) > 0;
      },

      recordAnswer: (correct) => {
        const stats = { ...get().stats };
        if (correct) stats.totalCorrect += 1;
        else stats.totalWrong += 1;
        set({ stats });
      },

      recordCombo: (combo) => {
        const stats = { ...get().stats };
        if (combo > stats.bestCombo) stats.bestCombo = combo;
        set({ stats });
      },

      recordBossDefeat: () => {
        const stats = { ...get().stats };
        stats.bossesDefeated += 1;
        set({ stats });
      },

      recordPerfectStage: () => {
        const stats = { ...get().stats };
        stats.perfectStages += 1;
        set({ stats });
      },

      recordItemUsed: () => {
        const stats = { ...get().stats };
        stats.totalItemsUsed += 1;
        set({ stats });
      },

      setDifficulty: (d) => {
        const player = { ...get().player, difficulty: d };
        set({ player });
      },

      recordStageLoss: (stageId) => {
        const player = { ...get().player };
        player.stageLosses = { ...player.stageLosses };
        player.stageLosses[stageId] = (player.stageLosses[stageId] || 0) + 1;
        // Mercy: heal player 30% on 3rd loss to avoid frustration
        if (player.stageLosses[stageId] >= 3) {
          player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * 0.3));
          player.stageLosses[stageId] = 0; // reset
        }
        set({ player });
      },
    }),
    {
      name: "kotobaquest-save-v2",
      partialize: (s) => ({
        player: s.player,
        stats: s.stats,
        soundEnabled: s.soundEnabled,
        crtEnabled: s.crtEnabled,
      }),
      version: 3,
      // Migrate from older versions
      migrate: (persisted: any, version: number) => {
        if (!persisted) return persisted;
        if (version < 2) {
          if (persisted.player) {
            persisted.player.coins = persisted.player.coins ?? 50;
            persisted.player.itemCounts = persisted.player.itemCounts ?? {};
            persisted.player.achievements = persisted.player.achievements ?? [];
          }
          if (!persisted.stats) {
            persisted.stats = { ...INITIAL_STATS, lastPlayedDate: new Date().toDateString() };
          }
        }
        if (version < 3) {
          // v3: add difficulty & stageLosses
          if (persisted.player) {
            persisted.player.difficulty = persisted.player.difficulty ?? "normal";
            persisted.player.stageLosses = persisted.player.stageLosses ?? {};
          }
        }
        return persisted;
      },
    },
  ),
);
