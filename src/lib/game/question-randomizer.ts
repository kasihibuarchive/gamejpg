// ===== QUESTION RANDOMIZER =====
// Shuffles question order and choice options each battle.
// Smart distractors: picks similar items (same consonant group) to be more challenging.

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
 * Get the "consonant group" of a romaji for smart distractor selection.
 * e.g. "ka" → "k", "shi" → "s", "chi" → "t", "fu" → "h"
 * For multi-char romaji (konnichiwa), returns the whole string (no grouping).
 */
function getConsonantGroup(romaji: string): string {
  // For single-syllable kana (ka, shi, tsu, etc.), extract leading consonant
  const r = romaji.split("/")[0].trim().toLowerCase(); // take first variant
  // Single vowel (a, i, u, e, o) - group "vowel"
  if (/^[aiueo]$/.test(r)) return "vowel";
  // Consonant + vowel pattern (ka, ki, ku, shi, chi, tsu, etc.)
  const match = r.match(/^([kgsztcdnhbpmyrwj])[a-z]+/);
  if (match) return match[1];
  // For long words (konnichiwa, ohayou), no grouping
  return r;
}

/**
 * Smart distractor selection: prefer items from the SAME consonant group,
 * then fall back to similar groups, then random.
 *
 * Strategy:
 * 1. Filter rows in same consonant group (e.g. for "ka": ki, ku, ke, ko)
 * 2. If not enough, add from adjacent groups
 * 3. Fall back to random
 */
function pickSmartDistractors<T>(
  target: T,
  allItems: T[],
  targetRomaji: string,
  count: number,
  getRomaji: (item: T) => string,
): T[] {
  const targetGroup = getConsonantGroup(targetRomaji);
  const others = allItems.filter((item) => item !== target);

  // Group others by consonant group
  const sameGroup = others.filter((item) => getConsonantGroup(getRomaji(item)) === targetGroup);
  // For vowel group, "adjacent" doesn't apply - just shuffle
  const otherGroups = others.filter((item) => getConsonantGroup(getRomaji(item)) !== targetGroup);

  // Take as many as possible from same group first (most challenging)
  const shuffledSame = shuffle(sameGroup);
  const shuffledOther = shuffle(otherGroups);

  // Mix: prefer same group, but ensure variety
  const distractors: T[] = [];
  // Take 2-3 from same group if available
  const sameCount = Math.min(shuffledSame.length, count - 1);
  distractors.push(...shuffledSame.slice(0, sameCount));
  // Fill rest from other groups
  const remaining = count - distractors.length;
  distractors.push(...shuffledOther.slice(0, remaining));

  // Shuffle the final distractors so position is random
  return shuffle(distractors).slice(0, count);
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
 */
export function randomizeStageQuestions(stage: Stage, count?: number): Question[] {
  const pool = stage.questions;
  const targetCount = count ?? pool.length;
  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(targetCount, shuffled.length));
  return selected.map(randomizeQuestion);
}

/**
 * Generate extra variations of a question by creating "reverse" questions.
 * Now uses SMART distractors (same consonant group) for more challenging battles.
 */
export function expandQuestionPool(stage: Stage): Question[] {
  const extra: Question[] = [];

  if (!stage.lesson) return stage.questions;
  const rows = stage.lesson.rows;

  for (const row of rows) {
    // "find the kana for this romaji" - SMART distractors from same consonant group
    if (rows.length >= 4) {
      const distractors = pickSmartDistractors(
        row.kana,
        rows.map((r) => r.kana),
        row.romaji,
        3,
        (k) => {
          const r = rows.find((row) => row.kana === k);
          return r?.romaji || "";
        },
      );
      const options = shuffle([row.kana, ...distractors]);
      extra.push({
        type: "choice",
        prompt: `Pilih huruf untuk romaji "${row.romaji}"`,
        options,
        answer: options.indexOf(row.kana),
        hint: row.meaning,
      });
    }

    // "meaning" question - SMART distractors from similar meaning patterns
    if (row.meaning) {
      const othersWithMeaning = rows.filter((r) => r.meaning && r.kana !== row.kana);
      if (othersWithMeaning.length >= 3) {
        // For meaning, prefer items with similar romaji length or same group
        const distractors = pickSmartDistractors(
          row.meaning,
          othersWithMeaning.map((r) => r.meaning!),
          row.romaji,
          3,
          (m) => {
            const r = rows.find((row) => row.meaning === m);
            return r?.romaji || "";
          },
        );
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

    // "find the romaji for this kana" (reverse typing)
    if (row.romaji) {
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

    // "which kana matches this meaning" - SMART distractors
    if (row.meaning && rows.length >= 4) {
      const othersWithMeaning = rows.filter((r) => r.meaning && r.kana !== row.kana);
      if (othersWithMeaning.length >= 3) {
        const distractors = pickSmartDistractors(
          row.kana,
          othersWithMeaning.map((r) => r.kana),
          row.romaji,
          3,
          (k) => {
            const r = rows.find((row) => row.kana === k);
            return r?.romaji || "";
          },
        );
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
 * Scales question count based on stage type:
 * - Regular: 8 questions
 * - Mini-boss: 10 questions
 * - Boss: 12 questions
 */
export function getBattleQuestions(stage: Stage): Question[] {
  const expanded = expandQuestionPool(stage);
  let count = 8;
  if (stage.type === "mini-boss") count = 10;
  if (stage.type === "boss") count = 12;
  count = Math.min(count, expanded.length);
  count = Math.max(count, stage.questions.length);
  const fakeStage = { ...stage, questions: expanded };
  return randomizeStageQuestions(fakeStage, count);
}
