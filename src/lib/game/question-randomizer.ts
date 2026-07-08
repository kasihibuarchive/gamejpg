// ===== QUESTION RANDOMIZER =====
// Shuffles question order and choice options each battle.
// Also expands the question pool with variations.

import type { Question, ChoiceQuestion, TypingQuestion, MatchingQuestion, Stage } from "./types";

/**
 * Fisher-Yates shuffle (in-place).
 */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Shuffle choice options for a single choice question.
 * Updates the `answer` index to match the new position.
 */
function shuffleChoiceOptions(q: ChoiceQuestion): ChoiceQuestion {
  if (q.type !== "choice") return q;
  const optionsWithIdx = q.options.map((opt, idx) => ({ opt, isAnswer: idx === q.answer }));
  const shuffled = shuffle(optionsWithIdx);
  return {
    ...q,
    options: shuffled.map((x) => x.opt),
    answer: shuffled.findIndex((x) => x.isAnswer),
  };
}

/**
 * Shuffle matching question pairs (right side only).
 */
function shuffleMatchingPairs(q: MatchingQuestion): MatchingQuestion {
  if (q.type !== "matching") return q;
  const rightSide = shuffle(q.pairs.map((p) => p.right));
  return {
    ...q,
    pairs: q.pairs.map((p, i) => ({ left: p.left, right: rightSide[i] })),
  };
}

/**
 * Randomize a single question (shuffle options without changing content).
 */
function randomizeQuestion(q: Question): Question {
  if (q.type === "choice") return shuffleChoiceOptions(q);
  if (q.type === "matching") return shuffleMatchingPairs(q);
  return q;
}

/**
 * Pick N random questions from a stage's question pool.
 * If pool size > N, shuffles and picks subset.
 * Also shuffles options within each question.
 */
export function randomizeStageQuestions(stage: Stage, count?: number): Question[] {
  const pool = stage.questions;
  const targetCount = count ?? pool.length;

  // Shuffle order
  const shuffled = shuffle(pool);

  // Take subset if count < pool length
  const selected = shuffled.slice(0, Math.min(targetCount, shuffled.length));

  // Randomize options within each question
  return selected.map(randomizeQuestion);
}

/**
 * Generate extra variations of a question by creating "reverse" questions.
 * E.g., "Huruf apa ini? あ" → "Pilih huruf 'a':" with あ as one option.
 * This expands the pool without manual authoring.
 * Now generates MORE variations for better battle length.
 */
export function expandQuestionPool(stage: Stage): Question[] {
  const extra: Question[] = [];

  if (!stage.lesson) return stage.questions;
  const rows = stage.lesson.rows;

  // For each lesson row, generate ALL possible variations (not random)
  for (const row of rows) {
    // Always add: "find the kana for this romaji" (if 4+ rows for distractors)
    if (rows.length >= 4) {
      const others = rows.filter((r) => r.kana !== row.kana);
      const distractors = shuffle(others).slice(0, 3).map((r) => r.kana);
      const options = shuffle([row.kana, ...distractors]);
      extra.push({
        type: "choice",
        prompt: `Pilih huruf untuk romaji "${row.romaji}"`,
        options,
        answer: options.indexOf(row.kana),
        hint: row.meaning,
      });
    }

    // Always add: "meaning" question if meaning exists
    if (row.meaning) {
      const others = rows.filter((r) => r.meaning && r.kana !== row.kana);
      if (others.length >= 3) {
        const distractors = shuffle(others).slice(0, 3).map((r) => r.meaning!);
        const options = shuffle([row.meaning!, ...distractors]);
        extra.push({
          type: "choice",
          prompt: `Apa arti dari "${row.kana}"?`,
          kana: row.kana,
          options,
          answer: options.indexOf(row.meaning!),
        });
      }
    }

    // Always add: "find the romaji for this kana" (reverse typing)
    if (row.romaji) {
      // Split romaji on "/" to support multiple acceptable answers
      // e.g. "kyuu/ku" → ["kyuu", "ku"]
      const acceptableAnswers = row.romaji
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean);
      extra.push({
        type: "typing",
        prompt: `Ketik romaji untuk huruf ini:`,
        kana: row.kana,
        answer: acceptableAnswers,
        hint: row.meaning,
      });
    }

    // Add: "which kana matches this meaning" question
    if (row.meaning && rows.length >= 4) {
      const others = rows.filter((r) => r.meaning && r.kana !== row.kana);
      if (others.length >= 3) {
        const distractors = shuffle(others).slice(0, 3).map((r) => r.kana);
        const options = shuffle([row.kana, ...distractors]);
        extra.push({
          type: "choice",
          prompt: `Huruf mana yang berarti "${row.meaning}"?`,
          options,
          answer: options.indexOf(row.kana),
        });
      }
    }
  }

  // Combine original + extra, dedup by prompt+kana
  const seen = new Set<string>();
  const combined = [...stage.questions, ...extra].filter((q) => {
    const key = q.prompt + (q.type === "choice" || q.type === "typing" ? q.kana ?? "" : "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return combined;
}

/**
 * Get a randomized, expanded question set for a stage.
 * Now scales question count based on stage type:
 * - Regular: 8 questions
 * - Mini-boss: 10 questions
 * - Boss: 12 questions
 */
export function getBattleQuestions(stage: Stage): Question[] {
  const expanded = expandQuestionPool(stage);
  // Scale question count by stage type
  let count = 8; // default
  if (stage.type === "mini-boss") count = 10;
  if (stage.type === "boss") count = 12;
  count = Math.min(count, expanded.length); // can't exceed pool
  count = Math.max(count, stage.questions.length); // at least original count
  const fakeStage = { ...stage, questions: expanded };
  return randomizeStageQuestions(fakeStage, count);
}
