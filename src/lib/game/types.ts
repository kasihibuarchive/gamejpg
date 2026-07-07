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
  index: number; // 1-10
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
  locked?: boolean;
}

// ===== PLAYER STATE =====
export interface PlayerState {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  badges: string[];
  items: string[];
  completedStages: string[]; // stage IDs
  unlockedWorlds: WorldId[];
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
  | "settings";
