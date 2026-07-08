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

// ===== DIFFICULTY / SCALING =====
export interface DifficultyConfig {
  // Multipliers applied to enemy stats based on player level & stage
  hpScale: number; // enemy HP = base * (1 + playerLevel * hpScale)
  atkScale: number; // enemy ATK = base * (1 + playerLevel * atkScale)
  // Timer settings (seconds per question)
  baseTimer: number;
  fastBonus: number; // damage multiplier if answered in first 30% of timer
  slowPenalty: number; // damage multiplier if answered in last 30%
  // Enemy crit settings
  enemyCritChance: number;
  enemyCritMult: number;
}

export const DIFFICULTY: Record<"easy" | "normal" | "hard", DifficultyConfig> = {
  easy: {
    hpScale: 0.05,
    atkScale: 0.05,
    baseTimer: 20,
    fastBonus: 1.5,
    slowPenalty: 0.7,
    enemyCritChance: 0.05,
    enemyCritMult: 1.5,
  },
  normal: {
    hpScale: 0.1,
    atkScale: 0.1,
    baseTimer: 15,
    fastBonus: 1.8,
    slowPenalty: 0.5,
    enemyCritChance: 0.1,
    enemyCritMult: 2,
  },
  hard: {
    hpScale: 0.15,
    atkScale: 0.15,
    baseTimer: 10,
    fastBonus: 2,
    slowPenalty: 0.3,
    enemyCritChance: 0.2,
    enemyCritMult: 2.5,
  },
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
  jlpt: "DASAR" | "N5" | "N4" | "N3" | "N2" | "N1";
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
export interface ItemDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  effect: "heal" | "fullheal" | "hint" | "shield" | "revive" | "damage";
  value: number; // amount of effect (HP restored, damage dealt, etc.)
  price: number; // shop price
  consumable: boolean;
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
  coins: number; // currency for shop
  badges: string[];
  items: string[]; // item IDs
  itemCounts: Record<string, number>; // item id -> count
  completedStages: string[]; // stage IDs
  unlockedWorlds: WorldId[];
  achievements: string[]; // unlocked achievement IDs
  difficulty: "easy" | "normal" | "hard";
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
  | "settings";
