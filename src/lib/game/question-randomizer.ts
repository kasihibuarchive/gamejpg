// ===== QUESTION RANDOMIZER =====
// Shuffles question order and choice options each battle.
// Smart distractors: picks similar items (same consonant group) to be more challenging.
// Clean answers: removes parenthetical notes, simplifies for kid-friendly options.

import type { Question, ChoiceQuestion, TypingQuestion, MatchingQuestion, Stage } from "./types";
import { generateKanjiReadingQuestions } from "./kanji-compounds";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Clean a meaning string: remove parenthetical notes, extra info.
 * "H + A (partikel topik)" → "partikel topik"
 * "4 (yon lebih umum)" → "4"
 * "H + U (fu, bukan hu!)" → "fu, bukan hu!"
 */
function cleanMeaning(meaning: string): string {
  // If meaning has format "X (Y)", prefer Y if it's more descriptive
  // Otherwise just return as-is without the parenthetical
  const parenMatch = meaning.match(/^(.+?)\s*\((.+)\)$/);
  if (parenMatch) {
    const before = parenMatch[1].trim();
    const inside = parenMatch[2].trim();
    // If before is like "H + A" or "K + A" (consonant pattern), use inside
    if (/^[A-Z]\s*\+\s*[A-Z]$/i.test(before)) {
      return inside;
    }
    // If before is a number, keep number (e.g. "4 (yon lebih umum)" → "4")
    if (/^\d+$/.test(before)) {
      return before;
    }
    // Otherwise keep the before part
    return before;
  }
  return meaning;
}

/**
 * Clean romaji: take first variant, remove notes.
 * "shi/yon" → "shi" (for display)
 * "hi/ka" → "hi"
 */
function cleanRomaji(romaji: string): string {
  return romaji.split("/")[0].trim();
}

/**
 * Get all acceptable romaji answers from a romaji string.
 * "shi/yon" → ["shi", "yon"]
 * "kyuu/ku" → ["kyuu", "ku"]
 */
function getAcceptableRomaji(romaji: string): string[] {
  return romaji
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
}

function getConsonantGroup(romaji: string): string {
  const r = romaji.split("/")[0].trim().toLowerCase();
  if (/^[aiueo]$/.test(r)) return "vowel";
  const match = r.match(/^([kgsztcdnhbpmyrwj])[a-z]+/);
  if (match) return match[1];
  return r;
}

function pickSmartDistractors<T>(
  target: T,
  allItems: T[],
  targetRomaji: string,
  count: number,
  getRomaji: (item: T) => string,
): T[] {
  const targetGroup = getConsonantGroup(targetRomaji);
  const others = allItems.filter((item) => item !== target);
  const sameGroup = others.filter((item) => getConsonantGroup(getRomaji(item)) === targetGroup);
  const otherGroups = others.filter((item) => getConsonantGroup(getRomaji(item)) !== targetGroup);
  const shuffledSame = shuffle(sameGroup);
  const shuffledOther = shuffle(otherGroups);
  const distractors: T[] = [];
  const sameCount = Math.min(shuffledSame.length, count - 1);
  distractors.push(...shuffledSame.slice(0, sameCount));
  const remaining = count - distractors.length;
  distractors.push(...shuffledOther.slice(0, remaining));
  return shuffle(distractors).slice(0, count);
}

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

function shuffleMatchingPairs(q: MatchingQuestion): MatchingQuestion {
  if (q.type !== "matching") return q;
  const rightSide = shuffle(q.pairs.map((p) => p.right));
  return {
    ...q,
    pairs: q.pairs.map((p, i) => ({ left: p.left, right: rightSide[i] })),
  };
}

function randomizeQuestion(q: Question): Question {
  if (q.type === "choice") return shuffleChoiceOptions(q);
  if (q.type === "matching") return shuffleMatchingPairs(q);
  return q;
}

export function randomizeStageQuestions(stage: Stage, count?: number): Question[] {
  const pool = stage.questions;
  const targetCount = count ?? pool.length;
  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(targetCount, shuffled.length));
  return selected.map(randomizeQuestion);
}

/**
 * Generate extra variations of a question.
 * CLEAN answers (no parenthetical notes).
 * SMART distractors (same consonant group).
 * NO kana display when kana is the answer.
 */
export function expandQuestionPool(stage: Stage): Question[] {
  const extra: Question[] = [];

  if (!stage.lesson) return stage.questions;
  const rows = stage.lesson.rows;

  for (const row of rows) {
    const cleanMeaningVal = row.meaning ? cleanMeaning(row.meaning) : null;

    // 1. "Pilih huruf untuk romaji X" - NO kana display (kana is answer!)
    if (rows.length >= 4) {
      const distractors = pickSmartDistractors(
        row.kana,
        rows.map((r) => r.kana),
        row.romaji,
        3,
        (k) => rows.find((row) => row.kana === k)?.romaji || "",
      );
      const options = shuffle([row.kana, ...distractors]);
      extra.push({
        type: "choice",
        prompt: `Pilih huruf untuk romaji "${cleanRomaji(row.romaji)}"`,
        // NO kana field - don't reveal answer!
        options,
        answer: options.indexOf(row.kana),
        hint: cleanMeaningVal || undefined,
      });
    }

    // 2. "Apa arti dari X?" - SHOW kana (asking meaning, kana is the question)
    if (cleanMeaningVal && rows.length >= 4) {
      const othersWithMeaning = rows.filter((r) => r.meaning && r.kana !== row.kana);
      if (othersWithMeaning.length >= 3) {
        // Use CLEANED meanings as distractors
        const distractorMeanings = pickSmartDistractors(
          cleanMeaningVal,
          othersWithMeaning.map((r) => cleanMeaning(r.meaning!)),
          row.romaji,
          3,
          (m) => {
            const r = rows.find((row) => cleanMeaning(row.meaning || "") === m);
            return r?.romaji || "";
          },
        );
        const options = shuffle([cleanMeaningVal, ...distractorMeanings]);
        extra.push({
          type: "choice",
          prompt: `Apa arti dari "${row.kana}"?`,
          kana: row.kana, // Show kana - it's the QUESTION, not the answer
          options,
          answer: options.indexOf(cleanMeaningVal),
        });
      }
    }

    // 3. "Ketik romaji untuk huruf ini" - SHOW kana (asking to type romaji)
    if (row.romaji) {
      extra.push({
        type: "typing",
        prompt: `Ketik romaji untuk huruf ini:`,
        kana: row.kana, // Show kana - it's the QUESTION
        answer: getAcceptableRomaji(row.romaji),
        hint: cleanMeaningVal || undefined,
      });
    }

    // 4. "Huruf mana yang berarti X?" - NO kana display (kana is answer!)
    if (cleanMeaningVal && rows.length >= 4) {
      const othersWithMeaning = rows.filter((r) => r.meaning && r.kana !== row.kana);
      if (othersWithMeaning.length >= 3) {
        const distractors = pickSmartDistractors(
          row.kana,
          othersWithMeaning.map((r) => r.kana),
          row.romaji,
          3,
          (k) => rows.find((row) => row.kana === k)?.romaji || "",
        );
        const options = shuffle([row.kana, ...distractors]);
        extra.push({
          type: "choice",
          prompt: `Huruf mana yang berarti "${cleanMeaningVal}"?`,
          // NO kana field - don't reveal answer!
          options,
          answer: options.indexOf(row.kana),
        });
      }
    }

    // 5. NEW: Fill-in-the-blank question (lengkapi kalimat)
    // Only for lesson rows that have simple meanings (not kanji descriptions)
    if (cleanMeaningVal && rows.length >= 4) {
      const distractors = pickSmartDistractors(
        row.kana,
        rows.map((r) => r.kana),
        row.romaji,
        3,
        (k) => rows.find((row) => row.kana === k)?.romaji || "",
      );
      const options = shuffle([row.kana, ...distractors]);
      extra.push({
        type: "choice",
        prompt: `Lengkapi: ___ = "${cleanMeaningVal}"`,
        // NO kana - the answer is hidden in the blank!
        options,
        answer: options.indexOf(row.kana),
        hint: `Romaji: ${cleanRomaji(row.romaji)}`,
      });
    }
  }

  // 6. NEW: JLPT-style kanji compound reading questions
  // "「一人ぼっちで すんでいます」の中の「一人」の読み方は?"
  // Pick 5 kanji reading questions based on stage's world level
  const worldLevelMap: Record<string, number> = {
    hajimari: 1, n5: 2, n4: 3, n3: 4, n2: 5, n1: 6,
  };
  const worldLevel = worldLevelMap[stage.worldId] || 2;
  if (worldLevel >= 2) {
    const kanjiQuestions = generateKanjiReadingQuestions(worldLevel, 5);
    extra.push(...kanjiQuestions);
  }

  // Combine original + extra, dedup by prompt
  const seen = new Set<string>();
  const combined = [...stage.questions, ...extra].filter((q) => {
    const key = q.prompt + (q.type === "choice" || q.type === "typing" ? q.kana ?? "" : "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return combined;
}

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
