"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameView, PlayerState, WorldId, GameStats, AbilityPerk } from "./types";
import { ITEMS, checkNewAchievements } from "./items";

interface GameState {
  view: GameView;
  selectedWorldId: WorldId | null;
  selectedStageId: string | null;
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

  player: PlayerState;
  stats: GameStats;
  soundEnabled: boolean;
  crtEnabled: boolean;

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
  }) => string[];
  damagePlayer: (amount: number) => void;
  healPlayer: (amount: number) => void;
  resetPlayer: () => void;
  toggleSound: () => void;
  toggleCrt: () => void;
  setPlayerName: (name: string) => void;

  buyItem: (itemId: string) => boolean;
  consumeItem: (itemId: string) => "heal" | "fullheal" | "hint" | "shield" | "damage" | null;
  hasItem: (itemId: string) => boolean;

  allocateStat: (stat: "atk" | "def" | "spd" | "luck") => void;
  equipAbility: (itemId: string) => boolean;
  unequipAbility: (itemId: string) => void;

  recordAnswer: (correct: boolean) => void;
  recordCombo: (combo: number) => void;
  recordBossDefeat: () => void;
  recordPerfectStage: () => void;
  recordItemUsed: () => void;
  recordStageLoss: (stageId: string) => void;
}

const INITIAL_PLAYER: PlayerState = {
  name: "Hero",
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 20,
  maxHp: 20,
  coins: 80,
  badges: [],
  items: [],
  itemCounts: {},
  completedStages: [],
  unlockedWorlds: ["hajimari"],
  achievements: [],
  statPoints: 0,
  atk: 0,
  def: 0,
  spd: 0,
  luck: 0,
  equippedAbilities: [],
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
        }
        player.xp += xp;
        player.coins += coins;

        while (player.xp >= player.xpToNext) {
          player.xp -= player.xpToNext;
          player.level += 1;
          player.xpToNext = Math.floor(player.xpToNext * 1.4);
          player.maxHp += 5;
          player.statPoints += 3;
          if (restoreHp !== false) player.hp = player.maxHp;
          player.coins += 20 * player.level;
        }
        for (const item of items) {
          if (!player.items.includes(item)) player.items.push(item);
          const def = ITEMS[item];
          if (def?.type === "consumable") {
            player.itemCounts[item] = (player.itemCounts[item] || 0) + 1;
          }
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

        if (bestCombo > stats.bestCombo) stats.bestCombo = bestCombo;
        if (badges.length > 0) stats.bossesDefeated += 1;

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
        if (def.type === "consumable") {
          player.itemCounts[itemId] = (player.itemCounts[itemId] || 0) + 1;
        }
        set({ player });
        return true;
      },

      consumeItem: (itemId) => {
        const def = ITEMS[itemId];
        if (!def || def.type !== "consumable") return null;
        const player = { ...get().player };
        const count = player.itemCounts[itemId] || 0;
        if (count <= 0) return null;

        player.itemCounts[itemId] = count - 1;
        if (player.itemCounts[itemId] <= 0) {
          delete player.itemCounts[itemId];
          if (def.price > 0) {
            player.items = player.items.filter((i) => i !== itemId);
          }
        }

        if (def.effect === "heal") {
          player.hp = Math.min(player.maxHp, player.hp + (def.value ?? 0));
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
        const def = ITEMS[itemId];
        if (!def) return false;
        if (def.type === "consumable") {
          return (player.itemCounts[itemId] || 0) > 0;
        }
        return player.items.includes(itemId);
      },

      allocateStat: (stat) => {
        const player = { ...get().player };
        if (player.statPoints <= 0) return;
        if (stat === "atk") player.atk += 1;
        else if (stat === "def") player.def += 1;
        else if (stat === "spd") player.spd += 1;
        else if (stat === "luck") player.luck += 1;
        player.statPoints -= 1;
        set({ player });
      },

      equipAbility: (itemId) => {
        const def = ITEMS[itemId];
        if (!def || def.type !== "ability") return false;
        const player = { ...get().player };
        if (!player.items.includes(itemId)) return false;
        if (player.equippedAbilities.includes(itemId)) return false;
        if (player.equippedAbilities.length >= 3) return false;
        player.equippedAbilities = [...player.equippedAbilities, itemId];
        set({ player });
        return true;
      },

      unequipAbility: (itemId) => {
        const player = { ...get().player };
        player.equippedAbilities = player.equippedAbilities.filter((id) => id !== itemId);
        set({ player });
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

      recordStageLoss: (stageId) => {
        const player = { ...get().player };
        player.stageLosses = { ...player.stageLosses };
        player.stageLosses[stageId] = (player.stageLosses[stageId] || 0) + 1;
        if (player.stageLosses[stageId] >= 3) {
          player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * 0.3));
          player.stageLosses[stageId] = 0;
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
      version: 4,
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
          if (persisted.player) {
            persisted.player.difficulty = persisted.player.difficulty ?? "normal";
            persisted.player.stageLosses = persisted.player.stageLosses ?? {};
          }
        }
        if (version < 4) {
          // v4: add stats, abilities, remove difficulty
          if (persisted.player) {
            persisted.player.statPoints = persisted.player.statPoints ?? 0;
            persisted.player.atk = persisted.player.atk ?? 0;
            persisted.player.def = persisted.player.def ?? 0;
            persisted.player.spd = persisted.player.spd ?? 0;
            persisted.player.luck = persisted.player.luck ?? 0;
            persisted.player.equippedAbilities = persisted.player.equippedAbilities ?? [];
            delete persisted.player.difficulty;
          }
        }
        return persisted;
      },
    },
  ),
);
