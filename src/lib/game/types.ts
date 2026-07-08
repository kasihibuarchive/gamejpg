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

export interface BattleEnemy {
  id: string;
  name: string;
  nameJp?: string;
  sprite: string; // emoji or short text used as pixel sprite
  hp: number;
  attack: number; // damage to player on wrong answer
  description?: string;
  color?: string;
}

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
