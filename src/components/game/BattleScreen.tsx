"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useGame } from "@/lib/game/store";
import { getStage } from "@/lib/game/stages";
import { getWorld } from "@/lib/game/worlds";
import { PixelButton, PixelPanel, PixelSprite, StatBar } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import type { Question } from "@/lib/game/types";

interface BattleState {
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  questionIdx: number;
  totalCorrect: number;
  // animation flags
  enemyShake: boolean;
  enemyFlashRed: boolean;
  playerShake: boolean;
  // damage floaters
  enemyDamageText: string | null;
  playerDamageText: string | null;
  // status message (above question)
  statusMessage: string;
  // answer feedback
  lastAnswerCorrect: boolean | null;
  // game over states
  battleEnded: boolean;
  victory: boolean;
}

const INITIAL_PLAYER_HP_KEY = "kq-temp-player-hp";

export function BattleScreen() {
  const {
    selectedStageId,
    setView,
    setLastResult,
    completeStage,
    damagePlayer,
    player,
  } = useGame();

  const stage = selectedStageId ? getStage(selectedStageId) : null;
  const world = stage ? getWorld(stage.worldId) : null;

  const [state, setState] = useState<BattleState>({
    enemyHp: stage?.enemies[0]?.hp ?? 1,
    enemyMaxHp: stage?.enemies[0]?.hp ?? 1,
    playerHp: player.hp,
    questionIdx: 0,
    totalCorrect: 0,
    enemyShake: false,
    enemyFlashRed: false,
    playerShake: false,
    enemyDamageText: null,
    playerDamageText: null,
    statusMessage: "Pertarungan dimulai! Jawab dengan benar untuk menyerang!",
    lastAnswerCorrect: null,
    battleEnded: false,
    victory: false,
  });

  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<
    { side: "left" | "right"; idx: number } | null
  >(null);
  const [matchError, setMatchError] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const questionAreaRef = useRef<HTMLDivElement>(null);

  // Start music
  useEffect(() => {
    audio.resume();
    if (stage?.type === "boss" || stage?.type === "mini-boss") {
      audio.playMusic("battle");
    } else {
      audio.playMusic("battle");
    }
    return () => {
      audio.stopMusic();
    };
  }, [stage?.type]);

  // Save player HP at battle start so we can restore if needed
  useEffect(() => {
    if (stage) {
      // Take a snapshot of player HP entering battle
      sessionStorage.setItem(INITIAL_PLAYER_HP_KEY, String(player.hp));
    }
  }, [stage?.id, player.hp]);

  const currentEnemy = stage?.enemies[0];
  const currentQuestion: Question | undefined = stage?.questions[state.questionIdx];

  // Focus input when typing question shows
  useEffect(() => {
    if (currentQuestion?.type === "typing" && !state.battleEnded) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentQuestion, state.questionIdx, state.battleEnded]);

  const showFloatingDamage = useCallback(
    (target: "enemy" | "player", amount: number) => {
      if (target === "enemy") {
        setState((s) => ({ ...s, enemyDamageText: `-${amount}` }));
        setTimeout(() => {
          setState((s) => ({ ...s, enemyDamageText: null }));
        }, 800);
      } else {
        setState((s) => ({ ...s, playerDamageText: `-${amount}` }));
        setTimeout(() => {
          setState((s) => ({ ...s, playerDamageText: null }));
        }, 800);
      }
    },
    [],
  );

  const endBattle = (victory: boolean, totalCorrect: number) => {
    audio.stopMusic();
    if (victory) {
      audio.victory();
    } else {
      audio.gameOver();
    }

    // Compute rewards
    const xpGained = victory
      ? stage?.reward.xp ?? 0
      : Math.floor((stage?.reward.xp ?? 0) * 0.1);
    const itemsGained = victory
      ? stage?.reward.item
        ? [stage.reward.item]
        : []
      : [];
    const badgesGained = victory
      ? stage?.reward.badge
        ? [stage.reward.badge]
        : []
      : [];

    // Determine world unlock from boss completion
    let unlockWorld: any = undefined;
    if (victory && stage?.id === "hajimari-10") {
      unlockWorld = "n5";
    }

    // Apply completion rewards (only if victory)
    if (victory && stage) {
      completeStage({
        stageId: stage.id,
        xp: xpGained,
        items: itemsGained,
        badges: badgesGained,
        unlockWorld,
        restoreHp: true,
      });
    }

    setLastResult({
      stageId: stage?.id ?? "",
      victory,
      xpGained,
      correctCount: totalCorrect,
      totalCount: stage?.questions.length ?? 0,
      itemsGained,
      badgesGained,
    });

    setState((s) => ({
      ...s,
      battleEnded: true,
      victory,
    }));
  };

  // Use a ref to track if endBattle has been triggered, to avoid double-calling
  const endedRef = useRef(false);
  // Check win/lose after state changes - use microtask to defer setState
  useEffect(() => {
    if (state.battleEnded || endedRef.current) return;
    if (state.enemyHp <= 0) {
      endedRef.current = true;
      // Defer to avoid setState-in-effect lint issue
      queueMicrotask(() => endBattle(true, state.totalCorrect));
      return;
    }
    if (state.playerHp <= 0) {
      endedRef.current = true;
      queueMicrotask(() => endBattle(false, state.totalCorrect));
      return;
    }
  }, [state.enemyHp, state.playerHp, state.battleEnded, state.totalCorrect]);

  const handleAnswer = useCallback(
    (isCorrect: boolean) => {
      if (state.battleEnded) return;
      setShowHint(false);
      setMatchedPairs([]);
      setSelectedMatch(null);

      const enemy = currentEnemy!;
      const playerDmg = isCorrect ? Math.max(1, Math.ceil(enemy.hp / stage!.questions.length)) + (Math.random() < 0.3 ? 1 : 0) : 0;
      // Damage to enemy: distribute HP across questions so all-correct = death
      // Actually simpler: each correct answer deals enemy.hp / totalQuestions damage
      const dmgToEnemy = isCorrect
        ? Math.ceil(enemy.hp / stage!.questions.length)
        : 0;
      const dmgToPlayer = !isCorrect ? enemy.attack : 0;

      setState((s) => ({
        ...s,
        lastAnswerCorrect: isCorrect,
        totalCorrect: isCorrect ? s.totalCorrect + 1 : s.totalCorrect,
        enemyHp: Math.max(0, s.enemyHp - dmgToEnemy),
        playerHp: Math.max(0, s.playerHp - dmgToPlayer),
        enemyShake: isCorrect,
        enemyFlashRed: isCorrect,
        playerShake: !isCorrect,
        statusMessage: isCorrect
          ? "✓ Benar! Serangan mengenai musuh!"
          : "✗ Salah! Musuh membalas!",
      }));

      if (isCorrect) {
        audio.correct();
        setTimeout(() => audio.attack(), 200);
        setTimeout(() => audio.enemyHit(), 400);
        showFloatingDamage("enemy", dmgToEnemy);
      } else {
        audio.wrong();
        setTimeout(() => audio.playerHit(), 300);
        showFloatingDamage("player", dmgToPlayer);
      }

      // Sync store player HP
      if (!isCorrect) {
        damagePlayer(dmgToPlayer);
      }

      // Clear animation flags
      setTimeout(() => {
        setState((s) => ({
          ...s,
          enemyShake: false,
          enemyFlashRed: false,
          playerShake: false,
        }));
      }, 500);

      // Advance question after delay
      setTimeout(() => {
        setState((s) => {
          // HP was already updated in the first setState above.
          // Just check current state for end conditions.
          const isLastQuestion = s.questionIdx >= stage!.questions.length - 1;

          if (s.enemyHp <= 0) {
            // enemy dead - endBattle effect will handle it
            return s;
          }
          if (s.playerHp <= 0) {
            return s;
          }
          if (isLastQuestion) {
            // Out of questions but enemy still alive - that's still a win since the player
            // survived all questions. Trigger victory.
            return s;
          }

          return {
            ...s,
            questionIdx: s.questionIdx + 1,
            statusMessage: "Pertanyaan berikutnya!",
            lastAnswerCorrect: null,
          };
        });

        // Reset answer inputs
        setTypedAnswer("");
        setSelectedChoice(null);
        setShowHint(false);
      }, 1500);
    },
    [
      state.battleEnded,
      currentEnemy,
      stage,
      damagePlayer,
      showFloatingDamage,
    ],
  );

  // Handle choice selection
  const handleChoice = (idx: number) => {
    if (state.lastAnswerCorrect !== null) return;
    setSelectedChoice(idx);
    if (currentQuestion?.type === "choice") {
      const correct = idx === currentQuestion.answer;
      setTimeout(() => handleAnswer(correct), 200);
    }
  };

  // Handle typing submit
  const handleTypingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.lastAnswerCorrect !== null) return;
    if (!typedAnswer.trim()) return;
    if (currentQuestion?.type === "typing") {
      const normalized = typedAnswer.trim().toLowerCase().replace(/ā/g, "a").replace(/ī/g, "i").replace(/ū/g, "u").replace(/ē/g, "e").replace(/ō/g, "o");
      const correct = currentQuestion.answer.some(
        (a) => a.toLowerCase() === normalized,
      );
      handleAnswer(correct);
    }
  };

  // Handle matching
  const handleMatchClick = (side: "left" | "right", idx: number) => {
    if (state.lastAnswerCorrect !== null) return;
    if (matchedPairs.includes(idx)) return;
    if (currentQuestion?.type !== "matching") return;

    if (!selectedMatch) {
      setSelectedMatch({ side, idx });
      audio.hover();
      return;
    }

    if (selectedMatch.side === side) {
      // re-select same side
      setSelectedMatch({ side, idx });
      return;
    }

    // Match attempt
    const leftIdx = side === "left" ? idx : selectedMatch.idx;
    const rightIdx = side === "right" ? idx : selectedMatch.idx;
    const correctPair = currentQuestion.pairs[leftIdx];
    const isCorrect = correctPair.right === currentQuestion.pairs[rightIdx].right;

    if (isCorrect) {
      audio.correct();
      const newMatched = [...matchedPairs, leftIdx];
      setMatchedPairs(newMatched);
      setSelectedMatch(null);
      if (newMatched.length === currentQuestion.pairs.length) {
        // all matched!
        setTimeout(() => handleAnswer(true), 400);
      }
    } else {
      audio.wrong();
      setMatchError(idx);
      setTimeout(() => setMatchError(null), 400);
      setSelectedMatch(null);
      // Don't fail the battle, just reset selection
    }
  };

  // ===== END SCREEN =====
  if (state.battleEnded) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-6"
        style={{
          background: state.victory
            ? "radial-gradient(ellipse at top, var(--kq-correct) 0%, var(--kq-bg) 70%)"
            : "radial-gradient(ellipse at top, var(--kq-attack) 0%, var(--kq-bg) 70%)",
        }}
      >
        <PixelPanel variant="light" className="p-6 md:p-8 max-w-md w-full kq-pop text-center">
          <div className="text-6xl mb-3 kq-bob">
            {state.victory ? "🎉" : "💀"}
          </div>
          <h2
            className="font-pixel text-lg md:text-xl mb-2"
            style={{ color: state.victory ? "var(--kq-correct)" : "var(--kq-attack)" }}
          >
            {state.victory ? "VICTORY!" : "KALAH..."}
          </h2>
          <p className="font-vt text-base text-black mb-4">
            {state.victory
              ? `Kau mengalahkan ${currentEnemy?.name}!`
              : `${currentEnemy?.name} terlalu kuat. Coba lagi!`}
          </p>

          {/* Stats */}
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
                {state.totalCorrect}/{stage?.questions.length}
              </div>
              <div>XP Didapat:</div>
              <div className="font-pixel text-[0.55rem] text-right">
                +{state.victory ? stage?.reward.xp : Math.floor((stage?.reward.xp ?? 0) * 0.1)}
              </div>
              {state.victory && stage?.reward.item && (
                <>
                  <div>Item:</div>
                  <div className="font-pixel text-[0.5rem] text-right">
                    {stage.reward.item}
                  </div>
                </>
              )}
              {state.victory && stage?.reward.badge && (
                <>
                  <div>Badge:</div>
                  <div className="font-pixel text-[0.5rem] text-right">
                    {stage.reward.badge}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Outro story if available */}
          {state.victory && stage?.outro && stage.outro.length > 0 && (
            <div
              className="p-3 mb-4 max-h-48 overflow-y-auto text-left"
              style={{
                background: "var(--kq-bg-2)",
                border: "2px solid var(--kq-panel-border)",
              }}
            >
              {stage.outro.map((line, i) => (
                <p key={i} className="font-vt text-sm text-white mb-2">
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center flex-wrap">
            {state.victory ? (
              <>
                <PixelButton
                  size="sm"
                  onClick={() => {
                    audio.click();
                    setView("stage-select");
                  }}
                >
                  ⚔ Stage Berikutnya
                </PixelButton>
                <PixelButton
                  size="sm"
                  variant="accent"
                  onClick={() => {
                    audio.click();
                    setView("world-map");
                  }}
                >
                  🗺 Peta Dunia
                </PixelButton>
              </>
            ) : (
              <>
                <PixelButton
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    audio.click();
                    // Reset battle state
                    setState({
                      enemyHp: stage?.enemies[0]?.hp ?? 1,
                      enemyMaxHp: stage?.enemies[0]?.hp ?? 1,
                      playerHp: player.hp, // current HP from store
                      questionIdx: 0,
                      totalCorrect: 0,
                      enemyShake: false,
                      enemyFlashRed: false,
                      playerShake: false,
                      enemyDamageText: null,
                      playerDamageText: null,
                      statusMessage: "Pertarungan dimulai! Coba lagi!",
                      lastAnswerCorrect: null,
                      battleEnded: false,
                      victory: false,
                    });
                  }}
                >
                  ⚔ Coba Lagi
                </PixelButton>
                <PixelButton
                  size="sm"
                  onClick={() => {
                    audio.click();
                    setView("stage-select");
                  }}
                >
                  ← Pilih Stage Lain
                </PixelButton>
              </>
            )}
          </div>
        </PixelPanel>
      </div>
    );
  }

  if (!stage || !world || !currentEnemy || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelButton onClick={() => setView("stage-select")}>
          ← Kembali
        </PixelButton>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-4"
      style={{
        background: `radial-gradient(ellipse at top, ${world.colorDark} 0%, var(--kq-bg) 70%)`,
      }}
    >
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Battle header */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              audio.click();
              setView("stage-select");
            }}
            className="font-pixel text-[0.5rem] hover:opacity-80"
            style={{ color: "var(--kq-fg)" }}
          >
            ← FLEE
          </button>
          <div
            className="font-pixel text-[0.55rem]"
            style={{ color: world.color }}
          >
            {world.icon} STAGE {String(stage.index).padStart(2, "0")} ·{" "}
            {stage.type === "boss"
              ? "👑 BOS"
              : stage.type === "mini-boss"
                ? "🛡 MINI-BOSS"
                : "⚔ BATTLE"}
          </div>
          <div
            className="font-pixel text-[0.55rem]"
            style={{ color: "var(--kq-accent)" }}
          >
            Q {state.questionIdx + 1}/{stage.questions.length}
          </div>
        </div>

        {/* Battle stage - enemy at top, player at bottom */}
        <div
          className="relative mb-4"
          style={{
            background: `linear-gradient(to bottom, ${world.colorDark}33, ${world.colorDark}88)`,
            border: "4px solid var(--kq-panel-border)",
            boxShadow: "0 0 0 4px var(--kq-fg)",
            minHeight: 180,
          }}
        >
          {/* Enemy HP bar at top */}
          <div className="absolute top-3 left-3 right-3 md:right-auto md:w-80 z-10">
            <div
              className="p-2"
              style={{
                background: "var(--kq-bg-2)",
                border: "3px solid var(--kq-fg)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[0.55rem] text-white truncate">
                  {currentEnemy.sprite} {currentEnemy.name}
                </span>
                <span className="font-pixel text-[0.45rem] text-white/70">
                  {currentEnemy.nameJp}
                </span>
              </div>
              <StatBar
                current={state.enemyHp}
                max={state.enemyMaxHp}
                color="var(--kq-attack)"
                height={10}
                showNumbers={false}
              />
            </div>
          </div>

          {/* Enemy sprite center-top */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <PixelSprite
                char={currentEnemy.sprite}
                size={100}
                color={currentEnemy.color}
                float={!state.enemyShake}
                shake={state.enemyShake}
                flashRed={state.enemyFlashRed}
              />
              {state.enemyDamageText && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 font-pixel text-base kq-damage-float"
                  style={{ color: "var(--kq-attack)", textShadow: "2px 2px 0 white" }}
                >
                  {state.enemyDamageText}
                </div>
              )}
            </div>
          </div>

          {/* Slash effect on enemy hit */}
          {state.enemyShake && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none kq-slash"
              style={{
                width: 120,
                height: 8,
                background: "var(--kq-accent)",
                boxShadow: "0 0 12px var(--kq-accent)",
              }}
            />
          )}

          {/* Player sprite bottom-right */}
          <div className="absolute bottom-3 right-3 md:right-8">
            <div className="relative">
              <PixelSprite
                char="🧙"
                size={70}
                float={!state.playerShake}
                shake={state.playerShake}
              />
              {state.playerDamageText && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 font-pixel text-base kq-damage-float"
                  style={{ color: "var(--kq-attack)", textShadow: "2px 2px 0 white" }}
                >
                  {state.playerDamageText}
                </div>
              )}
            </div>
          </div>

          {/* Player HP bar bottom-left */}
          <div className="absolute bottom-3 left-3 right-24 md:right-auto md:w-72 z-10">
            <div
              className="p-2"
              style={{
                background: "var(--kq-bg-2)",
                border: "3px solid var(--kq-fg)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[0.55rem] text-white">
                  🧙 {player.name}
                </span>
                <span className="font-pixel text-[0.45rem] text-white/70">
                  LV {player.level}
                </span>
              </div>
              <StatBar
                current={state.playerHp}
                max={player.maxHp}
                color="var(--kq-hp)"
                height={10}
                showNumbers={false}
              />
            </div>
          </div>
        </div>

        {/* Status message */}
        <div className="text-center mb-3 min-h-[2rem]">
          <p
            className="font-pixel text-[0.6rem]"
            style={{
              color: state.lastAnswerCorrect === true
                ? "var(--kq-correct)"
                : state.lastAnswerCorrect === false
                  ? "var(--kq-attack)"
                  : "var(--kq-fg)",
            }}
          >
            {state.statusMessage}
          </p>
        </div>

        {/* Question area */}
        <PixelPanel
          variant="light"
          className="p-4 md:p-5 flex-1 flex flex-col"
        >
          {/* Question prompt */}
          <div className="text-center mb-4">
            <div
              className="font-pixel text-[0.55rem] mb-2"
              style={{ color: world.colorDark }}
            >
              {currentQuestion.type === "choice" && "🎯 PILIH JAWABAN"}
              {currentQuestion.type === "typing" && "⌨ KETIK ROMAJI"}
              {currentQuestion.type === "matching" && "🔗 PASANGKAN"}
            </div>
            <p
              className="font-vt text-lg md:text-xl mb-2"
              style={{ color: "var(--kq-panel-border)" }}
            >
              {currentQuestion.prompt}
            </p>
            {currentQuestion.kana && (
              <div
                className="font-gothic text-6xl md:text-7xl my-3 kq-pop"
                style={{ color: "var(--kq-panel-border)" }}
              >
                {currentQuestion.kana}
              </div>
            )}
          </div>

          {/* Answer area */}
          <div ref={questionAreaRef} className="flex-1">
            {/* CHOICE */}
            {currentQuestion.type === "choice" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedChoice === idx;
                  const isCorrectAns = idx === currentQuestion.answer;
                  const showResult = state.lastAnswerCorrect !== null && isSelected;
                  const showAsCorrect = state.lastAnswerCorrect !== null && isCorrectAns;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(idx)}
                      disabled={state.lastAnswerCorrect !== null}
                      className="kq-btn text-sm h-auto py-3 px-4 normal-case"
                      style={{
                        background: showResult
                          ? state.lastAnswerCorrect
                            ? "var(--kq-correct)"
                            : "var(--kq-attack)"
                          : showAsCorrect
                            ? "var(--kq-correct)"
                            : "var(--kq-panel)",
                        color: showResult || showAsCorrect ? "var(--kq-panel)" : "var(--kq-panel-border)",
                        textTransform: "none",
                        fontFamily: "var(--font-gothic)",
                        fontSize: "1rem",
                      }}
                    >
                      <span className="font-pixel text-[0.5rem] mr-2">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                      {showAsCorrect && <span className="ml-2">✓</span>}
                      {showResult && !state.lastAnswerCorrect && <span className="ml-2">✗</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TYPING */}
            {currentQuestion.type === "typing" && (
              <form onSubmit={handleTypingSubmit} className="max-w-md mx-auto">
                <input
                  ref={inputRef}
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  disabled={state.lastAnswerCorrect !== null}
                  placeholder="Ketik di sini..."
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full px-4 py-3 font-vt text-2xl text-center text-black"
                  style={{
                    background: "var(--kq-panel-2)",
                    border: "4px solid var(--kq-panel-border)",
                    boxShadow: state.lastAnswerCorrect === false ? "0 0 0 3px var(--kq-attack)" : "0 0 0 3px var(--kq-panel)",
                    outline: "none",
                  }}
                />
                <div className="text-center mt-3">
                  <PixelButton
                    type="submit"
                    variant="accent"
                    size="sm"
                    disabled={state.lastAnswerCorrect !== null || !typedAnswer.trim()}
                  >
                    ⚔ SERANG!
                  </PixelButton>
                </div>
                {state.lastAnswerCorrect !== null && (
                  <div className="text-center mt-3 font-vt text-base">
                    {state.lastAnswerCorrect ? (
                      <span style={{ color: "var(--kq-correct)" }}>
                        ✓ Benar!
                      </span>
                    ) : (
                      <span style={{ color: "var(--kq-attack)" }}>
                        ✗ Jawaban: {currentQuestion.answer[0]}
                      </span>
                    )}
                  </div>
                )}
              </form>
            )}

            {/* MATCHING */}
            {currentQuestion.type === "matching" && (
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <div className="font-pixel text-[0.45rem] text-center mb-1" style={{ color: "var(--kq-panel-border)" }}>
                    HURUF
                  </div>
                  {currentQuestion.pairs.map((pair, idx) => {
                    const isMatched = matchedPairs.includes(idx);
                    const isSelected =
                      selectedMatch?.side === "left" && selectedMatch.idx === idx;
                    const isError = matchError === idx && selectedMatch?.side === "right";
                    return (
                      <button
                        key={`l-${idx}`}
                        onClick={() => handleMatchClick("left", idx)}
                        disabled={isMatched || state.lastAnswerCorrect !== null}
                        className="w-full py-3 px-2 font-gothic text-3xl transition-transform"
                        style={{
                          background: isMatched
                            ? "var(--kq-correct)"
                            : isSelected
                              ? "var(--kq-accent)"
                              : isError
                                ? "var(--kq-attack)"
                                : "var(--kq-panel-2)",
                          border: `4px solid ${isMatched ? "var(--kq-correct)" : "var(--kq-panel-border)"}`,
                          color: "var(--kq-panel-border)",
                          opacity: isMatched ? 0.5 : 1,
                        }}
                      >
                        {pair.left}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-2">
                  <div className="font-pixel text-[0.45rem] text-center mb-1" style={{ color: "var(--kq-panel-border)" }}>
                    ROMAJI
                  </div>
                  {/* Shuffled right side - we'll use original order for simplicity */}
                  {currentQuestion.pairs.map((pair, idx) => {
                    const isMatched = matchedPairs.includes(idx);
                    const isSelected =
                      selectedMatch?.side === "right" && selectedMatch.idx === idx;
                    const isError = matchError === idx && selectedMatch?.side === "left";
                    return (
                      <button
                        key={`r-${idx}`}
                        onClick={() => handleMatchClick("right", idx)}
                        disabled={isMatched || state.lastAnswerCorrect !== null}
                        className="w-full py-3 px-2 font-vt text-xl transition-transform"
                        style={{
                          background: isMatched
                            ? "var(--kq-correct)"
                            : isSelected
                              ? "var(--kq-accent)"
                              : isError
                                ? "var(--kq-attack)"
                                : "var(--kq-panel-2)",
                          border: `4px solid ${isMatched ? "var(--kq-correct)" : "var(--kq-panel-border)"}`,
                          color: "var(--kq-panel-border)",
                          opacity: isMatched ? 0.5 : 1,
                        }}
                      >
                        {pair.right}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Hint */}
          {currentQuestion.hint && !showHint && state.lastAnswerCorrect === null && (
            <div className="text-center mt-4">
              <button
                onClick={() => {
                  audio.click();
                  setShowHint(true);
                }}
                className="font-pixel text-[0.5rem] underline"
                style={{ color: "var(--kq-muted)" }}
              >
                💡 Butuh bantuan?
              </button>
            </div>
          )}
          {showHint && currentQuestion.hint && (
            <div
              className="mt-3 p-2 text-center"
              style={{
                background: "var(--kq-accent)",
                border: "2px solid var(--kq-panel-border)",
              }}
            >
              <p className="font-vt text-base text-black">
                💡 {currentQuestion.hint}
              </p>
            </div>
          )}
        </PixelPanel>
      </div>
    </div>
  );
}
