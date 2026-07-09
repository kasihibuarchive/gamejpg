"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useGame } from "@/lib/game/store";
import { getPlayerVocab, type VocabEntry } from "@/lib/game/stages";
import { getWorld } from "@/lib/game/worlds";
import { checkTypingAnswer, getPrimaryAnswer } from "@/lib/game/answer-check";
import { PixelButton, PixelPanel } from "./PixelUI";
import { audio } from "@/lib/game/audio";

interface EndlessQuestion {
  vocab: VocabEntry;
  prompt: string;
  kana?: string;
  type: "romaji" | "meaning" | "kana";
  acceptableAnswers: string[];
}

const QUESTION_TYPES: Array<"romaji" | "meaning" | "kana"> = [
  "romaji",
  "meaning",
  "kana",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(vocab: VocabEntry, allVocab: VocabEntry[]): EndlessQuestion | null {
  if (!vocab.romaji || !vocab.meaning) return null;
  const qType = QUESTION_TYPES[Math.floor(Math.random() * QUESTION_TYPES.length)];

  if (qType === "romaji") {
    return {
      vocab,
      prompt: "Ketik romaji untuk huruf ini:",
      kana: vocab.kana,
      type: "romaji",
      acceptableAnswers: vocab.romaji.split("/").map((s) => s.trim()).filter(Boolean),
    };
  }

  if (qType === "meaning") {
    // Multiple choice: which meaning matches this kana?
    const distractors = shuffle(
      allVocab.filter((v) => v.meaning && v.kana !== vocab.kana),
    ).slice(0, 3);
    if (distractors.length < 3) return null;
    const options = shuffle([vocab, ...distractors]);
    return {
      vocab,
      prompt: `Apa arti dari "${vocab.kana}"?`,
      kana: vocab.kana,
      type: "meaning",
      acceptableAnswers: options.map((v) => v.meaning),
    };
  }

  // kana: which kana matches this meaning/romaji
  const distractors = shuffle(
    allVocab.filter((v) => v.kana !== vocab.kana),
  ).slice(0, 3);
  if (distractors.length < 3) return null;
  const options = shuffle([vocab, ...distractors]);
  return {
    vocab,
    prompt: `Huruf mana yang berarti "${vocab.meaning}"?`,
    type: "kana",
    acceptableAnswers: options.map((v) => v.kana),
  };
}

export function EndlessMode() {
  const { player, setView, recordAnswer } = useGame();

  const [phase, setPhase] = useState<"intro" | "playing" | "ended">("intro");
  const [questionPool, setQuestionPool] = useState<EndlessQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [lastFeedback, setLastFeedback] = useState<"correct" | "wrong" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [collectedThisRun, setCollectedThisRun] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Build vocab pool from completed stages
  const allVocab = useMemo(() => getPlayerVocab(player.completedStages), [player.completedStages]);

  useEffect(() => {
    audio.resume();
    audio.playMusic("battle");
    return () => audio.stopMusic();
  }, []);

  const startEndless = () => {
    if (allVocab.length === 0) return;
    // Build a shuffled pool of questions
    const shuffled = shuffle(allVocab);
    const questions: EndlessQuestion[] = [];
    for (const v of shuffled) {
      const q = buildQuestion(v, allVocab);
      if (q) questions.push(q);
      if (questions.length >= 50) break; // cap initial pool, will refill
    }
    // If pool too small, repeat
    while (questions.length < 10 && allVocab.length > 0) {
      const v = allVocab[Math.floor(Math.random() * allVocab.length)];
      const q = buildQuestion(v, allVocab);
      if (q) questions.push(q);
    }
    setQuestionPool(questions);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setLives(3);
    setTypedAnswer("");
    setSelectedChoice(null);
    setLastFeedback(null);
    setCorrectCount(0);
    setWrongCount(0);
    setCollectedThisRun([]);
    setPhase("playing");
  };

  const currentQuestion = questionPool[currentIdx];

  // Refill pool when running low
  useEffect(() => {
    if (phase !== "playing") return;
    if (currentIdx >= questionPool.length - 5 && allVocab.length > 0) {
      // Add 20 more questions - use microtask to defer setState
      const shuffled = shuffle(allVocab);
      const newQs: EndlessQuestion[] = [];
      for (const v of shuffled) {
        const q = buildQuestion(v, allVocab);
        if (q) newQs.push(q);
        if (newQs.length >= 20) break;
      }
      if (newQs.length > 0) {
        queueMicrotask(() => {
          setQuestionPool((prev) => [...prev, ...newQs]);
        });
      }
    }
  }, [currentIdx, phase]);

  // Focus input for romaji questions
  useEffect(() => {
    if (phase === "playing" && currentQuestion?.type === "romaji") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentIdx, phase, currentQuestion]);

  const handleAnswer = (isCorrect: boolean) => {
    if (lastFeedback) return;
    recordAnswer(isCorrect);

    if (isCorrect) {
      audio.correct();
      const newStreak = streak + 1;
      const points = 10 + Math.floor(newStreak * 2);
      setScore((s) => s + points);
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setCorrectCount((c) => c + 1);
      setLastFeedback("correct");
      // Collect vocab if not already
      setCollectedThisRun((prev) =>
        prev.includes(currentQuestion.vocab.kana) ? prev : [...prev, currentQuestion.vocab.kana],
      );
    } else {
      audio.wrong();
      setStreak(0);
      setWrongCount((w) => w + 1);
      setLives((l) => l - 1);
      setLastFeedback("wrong");
    }

    setTimeout(() => {
      if (!isCorrect && lives - 1 <= 0) {
        // Game over
        audio.gameOver();
        setPhase("ended");
        return;
      }
      setCurrentIdx((i) => i + 1);
      setTypedAnswer("");
      setSelectedChoice(null);
      setLastFeedback(null);
    }, 1200);
  };

  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lastFeedback || !typedAnswer.trim()) return;
    if (currentQuestion?.type === "romaji") {
      const correct = checkTypingAnswer(typedAnswer, currentQuestion.acceptableAnswers);
      handleAnswer(correct);
    }
  };

  const handleChoice = (idx: number) => {
    if (lastFeedback) return;
    if (currentQuestion?.type === "meaning" || currentQuestion?.type === "kana") {
      // Acceptable answers are the options; the FIRST acceptable is the correct one
      // Actually acceptableAnswers = all options, correct = vocab's value
      const correctValue =
        currentQuestion.type === "meaning" ? currentQuestion.vocab.meaning : currentQuestion.vocab.kana;
      setSelectedChoice(idx);
      const isCorrect = currentQuestion.acceptableAnswers[idx] === correctValue;
      setTimeout(() => handleAnswer(isCorrect), 200);
    }
  };

  // ===== INTRO SCREEN =====
  if (allVocab.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "radial-gradient(ellipse at top, var(--kq-bg-3), var(--kq-bg))" }}
      >
        <PixelPanel variant="light" className="p-6 max-w-md text-center">
          <div className="text-5xl mb-3">📚</div>
          <h3 className="font-pixel text-sm mb-3" style={{ color: "var(--kq-panel-border)" }}>
            BELUM ADA KOSAKATA
          </h3>
          <p className="font-vt text-base text-black/80 mb-4">
            Selesaikan minimal 1 stage dengan lesson untuk membuka Endless Mode. Mode ini pakai
            kosakata dari stage yang sudah kamu selesaikan!
          </p>
          <PixelButton size="sm" onClick={() => { audio.click(); setView("world-map"); }}>
            ← Mulai Petualangan
          </PixelButton>
        </PixelPanel>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div
        className="min-h-screen px-4 py-6 kq-grid-bg"
        style={{ background: "radial-gradient(ellipse at top, var(--kq-bg-3), var(--kq-bg))" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <button
              onClick={() => { audio.click(); setView("world-map"); }}
              className="font-pixel text-[0.5rem] mb-2 inline-block hover:opacity-80"
              style={{ color: "var(--kq-fg)" }}
            >
              ← PETA DUNIA
            </button>
            <h2 className="font-pixel text-xl md:text-2xl kq-text-outline mb-2" style={{ color: "var(--kq-accent)" }}>
              ♾ ENDLESS MODE
            </h2>
            <p className="font-vt text-base text-white/80">
              Belajar vocab tanpa henti! 3 nyawa, kumpulkan vocab sebanyak mungkin.
            </p>
          </div>

          <PixelPanel variant="light" className="p-5 mb-4">
            <div className="font-pixel text-[0.6rem] mb-3" style={{ color: "var(--kq-panel-border)" }}>
              📊 POOL KOSAKATA
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="p-2 text-center" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                <div className="font-pixel text-[0.4rem] text-black/60">TOTAL VOCAB</div>
                <div className="font-pixel text-xl text-black">{allVocab.length}</div>
              </div>
              <div className="p-2 text-center" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                <div className="font-pixel text-[0.4rem] text-black/60">DARI STAGE</div>
                <div className="font-pixel text-xl text-black">{player.completedStages.length}</div>
              </div>
            </div>
            <div className="font-vt text-sm text-black/70">
              Soal akan diacak dari semua vocab yang sudah kamu pelajari. 3 tipe: ketik romaji,
              pilih arti, pilih huruf.
            </div>
          </PixelPanel>

          <PixelPanel variant="light" className="p-4 mb-4">
            <div className="font-pixel text-[0.5rem] mb-2" style={{ color: "var(--kq-panel-border)" }}>
              📋 CARA MAIN
            </div>
            <ul className="font-vt text-sm text-black/80 space-y-1">
              <li>❤️ 3 nyawa - jawaban salah = -1 nyawa</li>
              <li>🔥 Streak = bonus poin (+2 per streak)</li>
              <li>📚 Vocab baru dikumpulkan ke Vocab Book</li>
              <li>♾ Pool soal tak terhingga (auto-refill)</li>
              <li>🎯 3 tipe soal acak: romaji, arti, huruf</li>
            </ul>
          </PixelPanel>

          <div className="text-center">
            <PixelButton size="lg" variant="accent" onClick={startEndless} className="kq-pulse-glow">
              ▶ MULAI ENDLESS
            </PixelButton>
          </div>
        </div>
      </div>
    );
  }

  // ===== END SCREEN =====
  if (phase === "ended") {
    const accuracy = correctCount + wrongCount > 0 ? Math.round((correctCount / (correctCount + wrongCount)) * 100) : 0;
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: "radial-gradient(ellipse at top, var(--kq-attack), var(--kq-bg))" }}
      >
        <PixelPanel variant="light" className="p-6 max-w-md w-full text-center kq-pop">
          <div className="text-5xl mb-3">💀</div>
          <h2 className="font-pixel text-lg mb-2" style={{ color: "var(--kq-attack)" }}>
            GAME OVER!
          </h2>
          <div className="p-3 mb-4" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
            <div className="grid grid-cols-2 gap-2 font-vt text-base text-black">
              <div>Skor:</div>
              <div className="font-pixel text-[0.55rem] text-right">{score}</div>
              <div>Benar:</div>
              <div className="font-pixel text-[0.55rem] text-right">{correctCount}</div>
              <div>Salah:</div>
              <div className="font-pixel text-[0.55rem] text-right">{wrongCount}</div>
              <div>Akurasi:</div>
              <div className="font-pixel text-[0.55rem] text-right">{accuracy}%</div>
              <div>Best Streak:</div>
              <div className="font-pixel text-[0.55rem] text-right">{bestStreak}x</div>
              <div>Vocab Kumpul:</div>
              <div className="font-pixel text-[0.55rem] text-right">+{collectedThisRun.length}</div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <PixelButton size="sm" variant="accent" onClick={startEndless}>🔄 Main Lagi</PixelButton>
            <PixelButton size="sm" onClick={() => { audio.click(); setView("world-map"); }}>← Peta Dunia</PixelButton>
          </div>
        </PixelPanel>
      </div>
    );
  }

  // ===== PLAYING =====
  if (!currentQuestion) return null;
  const world = getWorld(currentQuestion.vocab.worldId);

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-4"
      style={{ background: "radial-gradient(ellipse at top, var(--kq-bg-3), var(--kq-bg))" }}
    >
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => { audio.click(); setView("world-map"); }}
            className="font-pixel text-[0.5rem] hover:opacity-80"
            style={{ color: "var(--kq-fg)" }}
          >
            ← KELUAR
          </button>
          <div className="font-pixel text-[0.55rem]" style={{ color: "var(--kq-accent)" }}>♾ ENDLESS</div>
          <div className="font-pixel text-[0.55rem]" style={{ color: "var(--kq-fg)" }}>Q {currentIdx + 1}</div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">SKOR</div>
            <div className="font-pixel text-sm text-white">{score}</div>
          </div>
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">STREAK</div>
            <div className="font-pixel text-sm" style={{ color: streak >= 3 ? "var(--kq-accent)" : "white" }}>{streak}x</div>
          </div>
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">NYAWA</div>
            <div className="font-pixel text-sm" style={{ color: lives <= 1 ? "var(--kq-attack)" : "var(--kq-hp)" }}>
              {"❤️".repeat(lives) || "💀"}
            </div>
          </div>
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">VOCAB</div>
            <div className="font-pixel text-sm text-white">{collectedThisRun.length}</div>
          </div>
        </div>

        {/* Source badge */}
        <div className="text-center mb-3">
          <span
            className="font-pixel text-[0.45rem] px-2 py-1"
            style={{ background: world?.color || "var(--kq-muted)", color: "var(--kq-panel-border)", border: "2px solid var(--kq-panel-border)" }}
          >
            {world?.icon} {currentQuestion.vocab.sourceStageTitle}
          </span>
        </div>

        {/* Question card */}
        <PixelPanel variant="light" className="p-5 flex-1 flex flex-col">
          <div className="text-center mb-4">
            <div className="font-pixel text-[0.55rem] mb-2" style={{ color: "var(--kq-panel-border)" }}>
              {currentQuestion.type === "romaji" && "⌨ KETIK ROMAJI"}
              {currentQuestion.type === "meaning" && "🎯 PILIH ARTI"}
              {currentQuestion.type === "kana" && "📚 PILIH HURUF"}
            </div>
            <p className="font-vt text-lg mb-2" style={{ color: "var(--kq-panel-border)" }}>
              {currentQuestion.prompt}
            </p>
            {currentQuestion.kana && (
              <div className="font-gothic text-6xl my-3 kq-pop" style={{ color: "var(--kq-panel-border)" }}>
                {currentQuestion.kana}
              </div>
            )}
          </div>

          {/* Answer area */}
          {currentQuestion.type === "romaji" ? (
            <form onSubmit={handleTypingSubmit} className="max-w-md mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={lastFeedback !== null}
                placeholder="Ketik romaji..."
                autoComplete="off"
                spellCheck={false}
                className="w-full px-4 py-3 font-vt text-2xl text-center text-black"
                style={{
                  background: "var(--kq-panel-2)",
                  border: `4px solid ${lastFeedback === "wrong" ? "var(--kq-attack)" : lastFeedback === "correct" ? "var(--kq-correct)" : "var(--kq-panel-border)"}`,
                  outline: "none",
                }}
              />
              {!lastFeedback && (
                <div className="text-center mt-3">
                  <PixelButton type="submit" variant="accent" size="sm" disabled={!typedAnswer.trim()}>
                    ✓ Periksa
                  </PixelButton>
                </div>
              )}
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.acceptableAnswers.map((opt, idx) => {
                const isSelected = selectedChoice === idx;
                const correctValue = currentQuestion.type === "meaning" ? currentQuestion.vocab.meaning : currentQuestion.vocab.kana;
                const showResult = lastFeedback !== null;
                const isThisCorrect = opt === correctValue;
                return (
                  <button
                    key={idx}
                    onClick={() => handleChoice(idx)}
                    disabled={showResult}
                    className="kq-btn normal-case h-auto py-3"
                    style={{
                      background: showResult && isThisCorrect
                        ? "var(--kq-correct)"
                        : showResult && isSelected && !isThisCorrect
                          ? "var(--kq-attack)"
                          : "var(--kq-panel)",
                      color: "var(--kq-panel-border)",
                      fontFamily: currentQuestion.type === "kana" ? "var(--font-gothic), var(--font-noto-jp), \"Noto Sans JP\", sans-serif" : "var(--font-vt), var(--font-noto-jp), \"Noto Sans JP\", monospace",
                      fontSize: currentQuestion.type === "kana" ? "1.5rem" : "1rem",
                    }}
                  >
                    {opt}
                    {showResult && isThisCorrect && <span className="ml-2">✓</span>}
                  </button>
                );
              })}
            </div>
          )}

          {/* Feedback */}
          {lastFeedback && (
            <div className="text-center mt-4 font-vt text-base">
              {lastFeedback === "correct" ? (
                <span style={{ color: "var(--kq-correct)" }}>✓ Benar! +{10 + Math.floor((streak) * 2)} pts</span>
              ) : (
                <span style={{ color: "var(--kq-attack)" }}>
                  ✗ Salah! Jawaban: {currentQuestion.type === "romaji"
                    ? getPrimaryAnswer(currentQuestion.acceptableAnswers)
                    : currentQuestion.vocab.meaning}
                </span>
              )}
            </div>
          )}
        </PixelPanel>
      </div>
    </div>
  );
}
