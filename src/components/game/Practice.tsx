"use client";

import { useEffect, useState, useMemo } from "react";
import { useGame } from "@/lib/game/store";
import { getAllStages } from "@/lib/game/stages";
import { getWorld } from "@/lib/game/worlds";
import { checkTypingAnswer, getPrimaryAnswer } from "@/lib/game/answer-check";
import { PixelButton, PixelPanel } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import type { Question, Stage } from "@/lib/game/types";

// Practice mode: pull random questions from completed stages
// Useful for review / spaced repetition

interface PracticeQuestion {
  question: Question;
  sourceStageId: string;
  sourceStageTitle: string;
}

export function Practice() {
  const { player, setView, recordAnswer, recordCombo } = useGame();
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<boolean | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [poolSize, setPoolSize] = useState(10);

  useEffect(() => {
    audio.resume();
    audio.playMusic("world");
  }, []);

  // Build question pool from completed stages
  const availableStages = useMemo(() => {
    return getAllStages().filter((s) =>
      player.completedStages.includes(s.id),
    );
  }, [player.completedStages]);

  const startPractice = (size: number) => {
    if (availableStages.length === 0) return;
    const pool: PracticeQuestion[] = [];
    for (const stage of availableStages) {
      for (const q of stage.questions) {
        pool.push({
          question: q,
          sourceStageId: stage.id,
          sourceStageTitle: stage.title,
        });
      }
    }
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const selected = pool.slice(0, Math.min(size, pool.length));
    setQuestions(selected);
    setPoolSize(selected.length);
    setCurrentIdx(0);
    setCorrect(0);
    setWrong(0);
    setCombo(0);
    setBestCombo(0);
    setLastAnswer(null);
    setSelectedChoice(null);
    setTypedAnswer("");
    setShowResult(false);
    setFinished(false);
  };

  const current = questions[currentIdx];

  const handleAnswer = (isCorrect: boolean) => {
    if (lastAnswer !== null) return;
    setLastAnswer(isCorrect);
    setShowResult(true);
    recordAnswer(isCorrect);
    if (isCorrect) {
      audio.correct();
      const newCombo = combo + 1;
      setCombo(newCombo);
      setBestCombo((b) => Math.max(b, newCombo));
      setCorrect((c) => c + 1);
      recordCombo(newCombo);
    } else {
      audio.wrong();
      setCombo(0);
      setWrong((w) => w + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
      audio.victory();
      return;
    }
    setCurrentIdx((i) => i + 1);
    setLastAnswer(null);
    setSelectedChoice(null);
    setTypedAnswer("");
    setShowResult(false);
  };

  // ===== EMPTY STATE (no completed stages) =====
  if (availableStages.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-6"
        style={{
          background:
            "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
        }}
      >
        <PixelPanel variant="light" className="p-6 max-w-md w-full text-center">
          <div className="text-5xl mb-3">📚</div>
          <h3
            className="font-pixel text-sm mb-3"
            style={{ color: "var(--kq-panel-border)" }}
          >
            BELUM ADA STAGE SELESAI
          </h3>
          <p className="font-vt text-base text-black/80 mb-4">
            Selesaikan minimal 1 stage untuk membuka Mode Latihan. Latihan
            mengambil soal dari stage yang sudah kamu selesaikan - bagus untuk
            review!
          </p>
          <PixelButton
            size="sm"
            onClick={() => {
              audio.click();
              setView("world-map");
            }}
          >
            ← Mulai Petualangan
          </PixelButton>
        </PixelPanel>
      </div>
    );
  }

  // ===== FINISHED STATE =====
  if (finished) {
    const pct = Math.round((correct / questions.length) * 100);
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-6"
        style={{
          background:
            "radial-gradient(ellipse at top, var(--kq-correct) 0%, var(--kq-bg) 70%)",
        }}
      >
        <PixelPanel variant="light" className="p-6 max-w-md w-full text-center kq-pop">
          <div className="text-5xl mb-3 kq-bob">
            {pct >= 80 ? "🏆" : pct >= 50 ? "🎉" : "💪"}
          </div>
          <h2
            className="font-pixel text-lg mb-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            LATIHAN SELESAI!
          </h2>
          <div
            className="p-3 mb-4"
            style={{
              background: "var(--kq-panel-2)",
              border: "2px solid var(--kq-panel-border)",
            }}
          >
            <div className="grid grid-cols-2 gap-2 font-vt text-base text-black">
              <div>Benar:</div>
              <div className="font-pixel text-[0.55rem] text-right">
                {correct}/{questions.length}
              </div>
              <div>Salah:</div>
              <div className="font-pixel text-[0.55rem] text-right">{wrong}</div>
              <div>Akurasi:</div>
              <div className="font-pixel text-[0.55rem] text-right">{pct}%</div>
              <div>Best Combo:</div>
              <div className="font-pixel text-[0.55rem] text-right">
                {bestCombo}x
              </div>
            </div>
          </div>
          <p className="font-vt text-base text-black/80 mb-4">
            {pct >= 80
              ? "Luar biasa! Kamu menguasai materi ini dengan baik!"
              : pct >= 50
                ? "Bagus! Terus berlatih untuk meningkatkan akurasi."
                : "Jangan menyerah! Ulangi materi stage-stage sebelumnya."}
          </p>
          <div className="flex gap-3 justify-center">
            <PixelButton
              size="sm"
              variant="accent"
              onClick={() => startPractice(poolSize)}
            >
              🔄 Latihan Lagi
            </PixelButton>
            <PixelButton
              size="sm"
              onClick={() => {
                audio.click();
                setView("world-map");
              }}
            >
              ← Peta Dunia
            </PixelButton>
          </div>
        </PixelPanel>
      </div>
    );
  }

  // ===== INTRO STATE (choose length) =====
  if (questions.length === 0) {
    return (
      <div
        className="min-h-screen px-4 py-6"
        style={{
          background:
            "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <button
              onClick={() => {
                audio.click();
                setView("world-map");
              }}
              className="font-pixel text-[0.5rem] mb-2 inline-block hover:opacity-80"
              style={{ color: "var(--kq-fg)" }}
            >
              ← PETA DUNIA
            </button>
            <h2
              className="font-pixel text-xl md:text-2xl kq-text-outline mb-2"
              style={{ color: "var(--kq-accent)" }}
            >
              🎯 MODE LATIHAN
            </h2>
            <p className="font-vt text-base text-white/80">
              Review soal-soal dari stage yang sudah selesai. Tanpa HP, tanpa
              tekanan - murni latihan!
            </p>
          </div>

          <PixelPanel variant="light" className="p-5">
            <div
              className="font-pixel text-[0.6rem] mb-3"
              style={{ color: "var(--kq-panel-border)" }}
            >
              📊 POOL TERSEDIA
            </div>
            <div
              className="p-3 mb-4"
              style={{
                background: "var(--kq-panel-2)",
                border: "2px solid var(--kq-panel-border)",
              }}
            >
              <div className="font-vt text-base text-black">
                Stage selesai:{" "}
                <span className="font-pixel text-[0.55rem]">
                  {availableStages.length}
                </span>
              </div>
              <div className="font-vt text-base text-black">
                Total soal tersedia:{" "}
                <span className="font-pixel text-[0.55rem]">
                  {availableStages.reduce(
                    (sum, s) => sum + s.questions.length,
                    0,
                  )}
                </span>
              </div>
            </div>

            <div
              className="font-pixel text-[0.6rem] mb-3"
              style={{ color: "var(--kq-panel-border)" }}
            >
              ⚙ PILIH PANJANG LATIHAN
            </div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <PixelButton size="sm" onClick={() => startPractice(5)}>
                5 Soal
                <div className="font-vt text-xs opacity-80">Cepat</div>
              </PixelButton>
              <PixelButton
                size="sm"
                variant="accent"
                onClick={() => startPractice(10)}
              >
                10 Soal
                <div className="font-vt text-xs opacity-80">Standar</div>
              </PixelButton>
              <PixelButton size="sm" onClick={() => startPractice(20)}>
                20 Soal
                <div className="font-vt text-xs opacity-80">Intens</div>
              </PixelButton>
            </div>
            <p className="font-vt text-sm text-black/70 text-center">
              💡 Latihan tidak memberi XP/koin, tapi achievement combo bisa
              terbuka di sini!
            </p>
          </PixelPanel>
        </div>
      </div>
    );
  }

  // ===== ACTIVE PRACTICE =====
  const currentQuestion = current?.question;
  if (!current || !currentQuestion) {
    return null;
  }
  const stage = getAllStages().find((s) => s.id === current.sourceStageId);
  const world = stage ? getWorld(stage.worldId) : null;

  const handleChoice = (idx: number) => {
    if (lastAnswer !== null) return;
    setSelectedChoice(idx);
    if (currentQuestion.type === "choice") {
      const isCorrect = idx === currentQuestion.answer;
      setTimeout(() => handleAnswer(isCorrect), 200);
    }
  };

  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lastAnswer !== null) return;
    if (!typedAnswer.trim()) return;
    if (currentQuestion.type === "typing") {
      const isCorrect = checkTypingAnswer(typedAnswer, currentQuestion.answer);
      handleAnswer(isCorrect);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-4"
      style={{
        background:
          "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
      }}
    >
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              audio.click();
              setView("world-map");
            }}
            className="font-pixel text-[0.5rem] hover:opacity-80"
            style={{ color: "var(--kq-fg)" }}
          >
            ← KELUAR
          </button>
          <div className="font-pixel text-[0.55rem]" style={{ color: "var(--kq-accent)" }}>
            🎯 LATIHAN
          </div>
          <div className="font-pixel text-[0.55rem] text-white">
            {currentIdx + 1}/{questions.length}
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">BENAR</div>
            <div className="font-pixel text-sm text-white">{correct}</div>
          </div>
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">SALAH</div>
            <div className="font-pixel text-sm text-white">{wrong}</div>
          </div>
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">COMBO</div>
            <div className="font-pixel text-sm" style={{ color: combo >= 2 ? "var(--kq-accent)" : "white" }}>
              {combo}x
            </div>
          </div>
          <div className="p-2 text-center" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <div className="font-pixel text-[0.4rem] text-white/60">BEST</div>
            <div className="font-pixel text-sm text-white">{bestCombo}x</div>
          </div>
        </div>

        {/* Source badge */}
        <div className="text-center mb-3">
          <span
            className="font-pixel text-[0.45rem] px-2 py-1"
            style={{
              background: world?.color || "var(--kq-muted)",
              color: "var(--kq-panel-border)",
              border: "2px solid var(--kq-panel-border)",
            }}
          >
            {world?.icon} {current.sourceStageTitle}
          </span>
        </div>

        {/* Question card */}
        <PixelPanel variant="light" className="p-5 flex-1 flex flex-col">
          <div className="text-center mb-4">
            <div className="font-pixel text-[0.55rem] mb-2" style={{ color: "var(--kq-panel-border)" }}>
              {currentQuestion.type === "choice" && "🎯 PILIH JAWABAN"}
              {currentQuestion.type === "typing" && "⌨ KETIK ROMAJI"}
              {currentQuestion.type === "matching" && "🔗 PASANGKAN"}
            </div>
            <p className="font-vt text-lg md:text-xl mb-2 text-black">
              {currentQuestion.prompt}
            </p>
            {currentQuestion.kana && (
              <div
                className="font-gothic text-6xl my-3 kq-pop"
                style={{ color: "var(--kq-panel-border)" }}
              >
                {currentQuestion.kana}
              </div>
            )}
          </div>

          {/* Choice */}
          {currentQuestion.type === "choice" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedChoice === idx;
                const isCorrectAns = idx === currentQuestion.answer;
                const showResult = showResult && isSelected;
                const showAsCorrect = showResult && isCorrectAns;
                return (
                  <button
                    key={idx}
                    onClick={() => handleChoice(idx)}
                    disabled={showResult}
                    className="kq-btn normal-case"
                    style={{
                      background: showResult
                        ? lastAnswer
                          ? "var(--kq-correct)"
                          : "var(--kq-attack)"
                        : showAsCorrect
                          ? "var(--kq-correct)"
                          : "var(--kq-panel)",
                      color: "var(--kq-panel-border)",
                      fontFamily: "var(--font-gothic)",
                      fontSize: "1rem",
                    }}
                  >
                    <span className="font-pixel text-[0.5rem] mr-2">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                    {showAsCorrect && <span className="ml-2">✓</span>}
                    {showResult && !lastAnswer && (
                      <span className="ml-2">✗</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Typing */}
          {currentQuestion.type === "typing" && (
            <form onSubmit={handleTypingSubmit} className="max-w-md mx-auto">
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={showResult}
                placeholder="Ketik di sini..."
                autoComplete="off"
                spellCheck={false}
                className="w-full px-4 py-3 font-vt text-2xl text-center text-black"
                style={{
                  background: "var(--kq-panel-2)",
                  border: "4px solid var(--kq-panel-border)",
                  outline: "none",
                }}
              />
              {!showResult && (
                <div className="text-center mt-3">
                  <PixelButton type="submit" variant="accent" size="sm">
                    ✓ Periksa
                  </PixelButton>
                </div>
              )}
              {showResult && (
                <div className="text-center mt-3 font-vt text-base">
                  {lastAnswer ? (
                    <span style={{ color: "var(--kq-correct)" }}>✓ Benar!</span>
                  ) : (
                    <span style={{ color: "var(--kq-attack)" }}>
                      ✗ Jawaban: {getPrimaryAnswer(currentQuestion.answer)}
                    </span>
                  )}
                </div>
              )}
            </form>
          )}

          {/* Matching - simplified for practice (just show as choice) */}
          {currentQuestion.type === "matching" && (
            <div className="text-center font-vt text-base text-black/70 p-4">
              Matching questions are shown as the first pair to identify. (For
              full matching, play the original stage!)
              <div className="mt-4 font-gothic text-4xl">
                {currentQuestion.pairs[0].left}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 max-w-xs mx-auto">
                {currentQuestion.pairs
                  .map((p, i) => ({ p, i }))
                  .sort(() => Math.random() - 0.5)
                  .map(({ p, i }) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (showResult) return;
                        const isCorrect = p.right === currentQuestion.pairs[0].right;
                        handleAnswer(isCorrect);
                      }}
                      disabled={showResult}
                      className="kq-btn normal-case text-base"
                      style={{
                        background: showResult && p.right === currentQuestion.pairs[0].right
                          ? "var(--kq-correct)"
                          : "var(--kq-panel)",
                        color: "var(--kq-panel-border)",
                      }}
                    >
                      {p.right}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Next button */}
          {showResult && (
            <div className="text-center mt-4">
              <PixelButton
                variant="accent"
                size="sm"
                onClick={handleNext}
                className="kq-pulse-glow"
              >
                {currentIdx + 1 >= questions.length ? "🏁 Selesai" : "▶ Lanjut"}
              </PixelButton>
            </div>
          )}
        </PixelPanel>
      </div>
    </div>
  );
}
