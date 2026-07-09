// ===== KOTOBAQUEST GAME TYPES =====

export type WorldId = "hajimari" | "n5" | "n4" | "n3" | "n2" | "n1";

export type QuestionType = "choice" | "typing" | "matching";

export interface ChoiceQuestion {
  type: "choice";
  prompt: string;
  promptSub?: string; // small subtitle / hint
  kana?: string; // big kana display
  options: string[];
  answer: number; // index
  hint?: string;
}

export interface TypingQuestion {
  type: "typing";
  prompt: string;
  kana?: string;
  romaji?: string; // expected romaji
  meaning?: string;
  answer: string[]; // acceptable answers (lowercase romaji)
  hint?: string;
}

export interface MatchingQuestion {
  type: "matching";
  prompt: string;
  pairs: { left: string; right: string }[];
  hint?: string;
}

export type Question = ChoiceQuestion | TypingQuestion | MatchingQuestion;

// ===== ENEMY ABILITIES =====
export type EnemyAbility =
  | "heal" // enemy heals self periodically
  | "crit" // enemy has chance to crit (2x damage)
  | "shield" // enemy blocks player's next hit
  | "multi-attack" // enemy attacks twice on wrong answer
  | "enrage" // boss: gains attack power below 30% HP
  | "regen" // enemy regens HP each turn
  | "poison" // wrong answer poisons player (DOT)
  | "time-pressure" // reduces player's timer
  | "counter"; // enemy reflects some damage on correct hits

export interface BattleEnemy {
  id: string;
  name: string;
  nameJp?: string;
  sprite: string;
  hp: number;
  attack: number; // base damage to player on wrong answer
  description?: string;
  color?: string;
  // New: abilities
  abilities?: EnemyAbility[];
  // New: optional level override (default: scaled by stage index & world)
  level?: number;
  // New: crit chance (0-1, default 0)
  critChance?: number;
}

// ===== DIFFICULTY / SCALING (stage-based, no difficulty selector) =====
// Enemy stats scale STEEPLY per stage to force player to upgrade their stats.
export interface ScalingConfig {
  // Per-stage HP/ATK growth multipliers
  hpGrowth: number; // enemy HP multiplier per stage index
  atkGrowth: number; // enemy ATK multiplier per stage index
  // Timer settings (seconds per question)
  baseTimer: number;
  fastBonus: number; // damage multiplier if answered in first 30% of timer
  slowPenalty: number; // damage multiplier if answered in last 30%
  // Player crit (base + LUCK stat)
  playerCritChance: number;
  playerCritMult: number;
}

export const SCALING: ScalingConfig = {
  // Steeper growth: stage 1 = 1x, stage 5 = 1.8x, stage 10 = 2.6x, stage 20 = 4.2x
  hpGrowth: 0.16, // +16% per stage
  atkGrowth: 0.12, // +12% per stage
  baseTimer: 15,
  fastBonus: 1.8,
  slowPenalty: 0.5,
  playerCritChance: 0.1,
  playerCritMult: 2,
};

export interface Stage {
  id: string; // e.g. "hajimari-1"
  worldId: WorldId;
  index: number; // 1-20 (within world, can span chapters)
  chapter?: number; // chapter number within world (1, 2, etc.)
  title: string;
  subtitle: string;
  type: "lesson" | "battle" | "mini-boss" | "boss";
  intro: string[]; // story cutscene lines
  outro?: string[]; // closing cutscene lines on victory
  // Lesson content (taught before battle)
  lesson?: {
    title: string;
    rows: { kana: string; romaji: string; meaning?: string }[];
    note?: string;
  };
  // Battle setup
  enemies: BattleEnemy[];
  questions: Question[];
  reward: {
    xp: number;
    item?: string;
    badge?: string;
  };
}

export interface World {
  id: WorldId;
  name: string;
  nameJp: string;
  level: number; // 1-6 (bukan JLPT, hanya tingkat kesulitan game)
  levelName: string; // "Pemula", "Dasar", "Madya", dll
  tagline: string;
  description: string;
  color: string;
  colorDark: string;
  icon: string; // emoji
  stageCount: number;
  chapterCount?: number; // how many story arcs in this world
  locked?: boolean;
}

// ===== ITEMS SYSTEM =====
// Two types of items:
// 1. Consumable - potions used in battle (heal, shield, etc.)
// 2. Ability - equipable perks that give passive bonuses (Dicero-style)
export type ItemType = "consumable" | "ability";
export type ItemEffect =
  | "heal"
  | "fullheal"
  | "hint"
  | "shield"
  | "revive"
  | "damage";

// === ABILITY PERK EFFECTS (passive, only active when equipped) ===
export type AbilityPerk =
  | "vampire" // heal 1 HP on correct answer
  | "berserker" // +50% damage but -25% max HP
  | "lucky_charm" // +15% crit chance
  | "swift_boots" // +3s timer
  | "iron_shield" // -1 damage taken from all sources
  | "scholar" // hints always visible
  | "thorns" // reflect 2 damage when hit
  | "executioner" // +100% damage to enemies below 30% HP
  | "time_freeze" // first 3 questions have +5s timer
  | "combo_master" // combo damage bonus doubled
  | "regen_player" // heal 1 HP every 3 turns
  | "shield_start" // start battle with shield active
  | "double_strike" // 20% chance to attack twice on correct answer
  | "golden_touch" // +50% coins from battles
  | "xp_boost"; // +25% XP from battles

export interface ItemDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  type: ItemType;
  // For consumable
  effect?: ItemEffect;
  value?: number; // amount of effect (HP restored, damage dealt, etc.)
  // For ability
  perk?: AbilityPerk;
  price: number; // shop price (0 = not for sale, only from rewards)
}

// ===== ACHIEVEMENTS =====
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  // condition checked against player state
  check: (p: PlayerState, stats: GameStats) => boolean;
}

// ===== PLAYER STATE =====
export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  coins: number;
  badges: string[];
  items: string[]; // item IDs (consumable + ability owned)
  itemCounts: Record<string, number>; // item id -> count (for consumables)
  completedStages: string[];
  unlockedWorlds: WorldId[];
  achievements: string[];

  // === PLAYER STATS (Dicero-style, upgradeable) ===
  // Base stats that can be increased by allocating stat points on level up
  statPoints: number; // unspent stat points
  atk: number; // damage multiplier (each point = +10% damage)
  def: number; // damage reduction (each point = -8% damage taken)
  spd: number; // timer bonus (each point = +0.5s timer)
  luck: number; // crit chance (each point = +3% crit chance)

  // === EQUIPPED ABILITIES (Dicero-style perks) ===
  // Max 3 equipped at once. Each gives passive effect in battle.
  equippedAbilities: string[]; // item IDs of equipped ability items

  // Anti-frustration: track losses per stage for mercy mechanic
  stageLosses: Record<string, number>;
}

// ===== GAME STATS (for achievements) =====
export interface GameStats {
  totalCorrect: number;
  totalWrong: number;
  bestCombo: number;
  stagesCleared: number;
  bossesDefeated: number;
  perfectStages: number; // stages with all correct
  totalItemsUsed: number;
  daysPlayed: number;
  lastPlayedDate: string;
}

// ===== GAME VIEWS =====
export type GameView =
  | "title"
  | "world-map"
  | "stage-select"
  | "story"
  | "battle"
  | "result"
  | "codex"
  | "shop"
  | "practice"
  | "achievements"
  | "stats"
  | "hero"
  | "endless"
  | "vocabbook"
  | "settings";
