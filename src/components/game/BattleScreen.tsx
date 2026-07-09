"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useGame } from "@/lib/game/store";
import { getStage } from "@/lib/game/stages";
import { getWorld } from "@/lib/game/worlds";
import { ITEMS, getItem } from "@/lib/game/items";
import { getEnemySprite, getHeroSprite } from "@/lib/game/sprites";
import { scaleEnemy, processEnemyTurn, computePlayerDamage, computePlayerStatsEffect, processAbilitiesOnCorrect, hasPerk, ABILITY_INFO } from "@/lib/game/enemy-ai";
import { getBattleQuestions } from "@/lib/game/question-randomizer";
import { checkTypingAnswer, getPrimaryAnswer } from "@/lib/game/answer-check";
import { SCALING } from "@/lib/game/types";
import { PixelButton, PixelPanel, PixelSprite, StatBar } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import type { Question } from "@/lib/game/types";

interface BattleState {
  enemyHp: number;
  enemyMaxHp: number;
  playerHp: number;
  questionIdx: number;
  totalCorrect: number;
  // Combo & crit
  combo: number;
  bestCombo: number;
  isCritical: boolean;
  // Shield (blocks next enemy hit)
  shieldActive: boolean;
  // Enemy shield (blocks player's next hit)
  enemyShieldActive: boolean;
  // Poison (player DOT)
  poisonTurns: number;
  // Enrage flag
  enemyEnraged: boolean;
  // Turn counter
  turnNumber: number;
  // Timer
  timeRemaining: number;
  timerActive: boolean;
  // animation flags
  enemyShake: boolean;
  enemyFlashRed: boolean;
  playerShake: boolean;
  // damage floaters
  enemyDamageText: string | null;
  playerDamageText: string | null;
  comboText: string | null;
  enemyActionText: string | null;
  // status message (above question)
  statusMessage: string;
  // answer feedback
  lastAnswerCorrect: boolean | null;
  // game over states
  battleEnded: boolean;
  victory: boolean;
  // achievements gained during battle
  newAchievements: string[];
  // coins gained
  coinsGained: number;
}

const INITIAL_PLAYER_HP_KEY = "kq-temp-player-hp";

export function BattleScreen() {
  const {
    selectedStageId,
    setView,
    setLastResult,
    completeStage,
    consumeItem,
    hasItem,
    recordAnswer,
    recordStageLoss,
    healPlayer,
    player,
    stats,
  } = useGame();

  const stage = selectedStageId ? getStage(selectedStageId) : null;
  const world = stage ? getWorld(stage.worldId) : null;

  // Scale enemy based on stage index (steeper growth per stage)
  const scaledEnemy = useMemo(() => {
    if (!stage || !stage.enemies[0]) return null;
    return scaleEnemy(
      stage.enemies[0],
      player.level,
      stage.index,
    );
  }, [stage, player.level]);

  // Get randomized questions for this battle (memoized per stage)
  const battleQuestions = useMemo(() => {
    if (!stage) return [];
    return getBattleQuestions(stage);
  }, [stage]);

  // Compute player stats effect (ATK/DEF/SPD/LUCK + equipped abilities)
  const playerEffect = useMemo(() => {
    return computePlayerStatsEffect({
      atk: player.atk,
      def: player.def,
      spd: player.spd,
      luck: player.luck,
      maxHp: player.maxHp,
      equippedAbilities: player.equippedAbilities,
    });
  }, [player.atk, player.def, player.spd, player.luck, player.maxHp, player.equippedAbilities]);

  const baseTimer = SCALING.baseTimer
    + playerEffect.timerBonus  // SPD stat
    + (hasPerk(player.equippedAbilities, "swift_boots") ? 3 : 0)  // swift_boots ability
    - (scaledEnemy?.abilities?.includes("time-pressure") ? 5 : 0);  // enemy time-pressure

  // Time freeze ability: +5s for first 3 questions
  const hasTimeFreeze = hasPerk(player.equippedAbilities, "time_freeze");
  const hasScholar = hasPerk(player.equippedAbilities, "scholar");
  const hasIronShield = hasPerk(player.equippedAbilities, "iron_shield");
  const hasShieldStart = hasPerk(player.equippedAbilities, "shield_start");
  const hasThorns = hasPerk(player.equippedAbilities, "thorns");

  const [state, setState] = useState<BattleState>({
    enemyHp: scaledEnemy?.scaledHp ?? 1,
    enemyMaxHp: scaledEnemy?.scaledHp ?? 1,
    playerHp: Math.min(player.hp, playerEffect.effectiveMaxHp),
    questionIdx: 0,
    totalCorrect: 0,
    combo: 0,
    bestCombo: 0,
    isCritical: false,
    shieldActive: hasShieldStart, // shield_start ability
    enemyShieldActive: false,
    poisonTurns: 0,
    enemyEnraged: false,
    turnNumber: 0,
    timeRemaining: baseTimer + (hasTimeFreeze ? 5 : 0),
    timerActive: true,
    enemyShake: false,
    enemyFlashRed: false,
    playerShake: false,
    enemyDamageText: null,
    playerDamageText: null,
    comboText: null,
    enemyActionText: null,
    statusMessage: hasShieldStart
      ? "🛡 Perisai awal aktif! Jawab dengan benar untuk menyerang!"
      : "Pertarungan dimulai! Jawab dengan benar untuk menyerang!",
    lastAnswerCorrect: null,
    battleEnded: false,
    victory: false,
    newAchievements: [],
    coinsGained: 0,
  });

  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<
    { side: "left" | "right"; idx: number } | null
  >(null);
  const [matchError, setMatchError] = useState<number | null>(null);
  const [showItemMenu, setShowItemMenu] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const questionAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start music
  useEffect(() => {
    audio.resume();
    audio.playMusic("battle");
    return () => {
      audio.stopMusic();
    };
  }, [stage?.type]);

  // Save player HP at battle start (only when stage changes)
  // Use ref to avoid re-saving when player.hp changes during battle
  const stageIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (stage && stageIdRef.current !== stage.id) {
      stageIdRef.current = stage.id;
      sessionStorage.setItem(INITIAL_PLAYER_HP_KEY, String(player.hp));
    }
  }, [stage]);

  const currentEnemy = scaledEnemy;
  const currentQuestion: Question | undefined = battleQuestions[state.questionIdx];

  // Focus input when typing question shows
  useEffect(() => {
    if (currentQuestion?.type === "typing" && !state.battleEnded) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentQuestion, state.questionIdx, state.battleEnded]);

  const showFloatingDamage = useCallback(
    (target: "enemy" | "player", amount: number, isCrit = false) => {
      if (target === "enemy") {
        setState((s) => ({
          ...s,
          enemyDamageText: isCrit ? `CRIT! -${amount}` : `-${amount}`,
        }));
        setTimeout(() => {
          setState((s) => ({ ...s, enemyDamageText: null }));
        }, 1000);
      } else {
        setState((s) => ({ ...s, playerDamageText: `-${amount}` }));
        setTimeout(() => {
          setState((s) => ({ ...s, playerDamageText: null }));
        }, 800);
      }
    },
    [],
  );

  const endBattle = (victory: boolean, totalCorrect: number, bestCombo: number) => {
    audio.stopMusic();
    if (victory) {
      audio.victory();
    } else {
      audio.gameOver();
      // On defeat: restore store HP from snapshot (so retry/map shows correct HP)
      const snapshotHp = parseInt(
        sessionStorage.getItem(INITIAL_PLAYER_HP_KEY) || String(player.hp),
        10,
      );
      const currentStoreHp = player.hp;
      const diff = snapshotHp - currentStoreHp;
      if (diff > 0) {
        healPlayer(diff);
      }
      // Record loss for mercy mechanic
      if (stage) recordStageLoss(stage.id);
    }

    // Compute rewards
    const baseXp = stage?.reward.xp ?? 0;
    const xpGained = victory ? baseXp : Math.floor(baseXp * 0.1);
    // Coins: stage rewards give coins = xp/2 + bonus for perfect
    const perfect = victory && totalCorrect === battleQuestions.length;
    const baseCoins = victory
      ? Math.floor(baseXp / 3) + (perfect ? 30 : 0) + bestCombo * 5
      : 5;
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

    // Determine world unlock
    let unlockWorld: any = undefined;
    if (victory && stage) {
      if (stage.id === "hajimari-10" || stage.id === "hajimari-20") unlockWorld = "n5";
      else if (stage.id === "n5-20") unlockWorld = "n4";
      else if (stage.id === "n4-10" || stage.id === "n4-20") unlockWorld = "n3";
    }

    // Apply completion rewards
    let newAchievements: string[] = [];
    if (victory && stage) {
      newAchievements = completeStage({
        stageId: stage.id,
        xp: xpGained,
        coins: baseCoins,
        items: itemsGained,
        badges: badgesGained,
        unlockWorld,
        restoreHp: true,
        bestCombo,
        correctCount: totalCorrect,
      });
      if (newAchievements.length > 0) {
        audio.levelUp();
      }
    }

    setLastResult({
      stageId: stage?.id ?? "",
      victory,
      xpGained,
      coinsGained: baseCoins,
      correctCount: totalCorrect,
      totalCount: battleQuestions.length,
      bestCombo,
      itemsGained,
      badgesGained,
      achievementsGained: newAchievements,
    });

    setState((s) => ({
      ...s,
      battleEnded: true,
      victory,
      newAchievements,
      coinsGained: baseCoins,
    }));
  };

  // Use a ref to track if endBattle has been triggered
  const endedRef = useRef(false);
  // Check win/lose after state changes
  useEffect(() => {
    if (state.battleEnded || endedRef.current) return;
    if (state.enemyHp <= 0) {
      endedRef.current = true;
      queueMicrotask(() =>
        endBattle(true, state.totalCorrect, state.bestCombo),
      );
      return;
    }
    if (state.playerHp <= 0) {
      endedRef.current = true;
      queueMicrotask(() =>
        endBattle(false, state.totalCorrect, state.bestCombo),
      );
      return;
    }
  }, [
    state.enemyHp,
    state.playerHp,
    state.battleEnded,
    state.totalCorrect,
    state.bestCombo,
  ]);

  // ===== TIMER SYSTEM =====
  // Use a ref to call handleAnswer from timer effect without circular dep
  const handleAnswerRef = useRef<(isCorrect: boolean, isTimeout?: boolean) => void>(() => {});

  // Timer interval - runs continuously, but only ticks down when active
  useEffect(() => {
    const interval = setInterval(() => {
      setState((s) => {
        // Only tick if timer active, battle not ended, and no answer pending
        if (!s.timerActive || s.battleEnded || s.lastAnswerCorrect !== null) return s;
        const newTime = s.timeRemaining - 0.1;
        if (newTime <= 0) {
          return { ...s, timeRemaining: 0, timerActive: false };
        }
        return { ...s, timeRemaining: newTime };
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Handle timer hitting 0 (timeout = wrong answer)
  useEffect(() => {
    if (
      state.timeRemaining <= 0 &&
      !state.battleEnded &&
      state.lastAnswerCorrect === null &&
      state.timerActive === false
    ) {
      // Trigger wrong answer due to timeout via ref
      handleAnswerRef.current(false, true);
    }
  }, [state.timeRemaining, state.battleEnded, state.lastAnswerCorrect, state.timerActive]);

  const handleAnswer = useCallback(
    (isCorrect: boolean, isTimeout = false) => {
      if (state.battleEnded) return;
      if (state.lastAnswerCorrect !== null) return; // already answered
      setShowHint(false);
      setMatchedPairs([]);
      setSelectedMatch(null);

      const enemy = currentEnemy!;
      const numQuestions = battleQuestions.length;
      // Base damage = scaledEnemy.hp / totalQuestions so all-correct = death
      const baseDmg = Math.ceil(enemy.scaledHp / numQuestions);
      // Combo system: every consecutive correct adds combo
      const newCombo = isCorrect ? state.combo + 1 : 0;

      // Compute player damage with timing bonus + stats + abilities
      const timeRemaining = state.timeRemaining;
      // Time freeze: +5s for first 3 questions
      const effectiveMaxTime = baseTimer + (hasTimeFreeze && state.questionIdx < 3 ? 5 : 0);
      const playerDamageResult = isCorrect
        ? computePlayerDamage(
            baseDmg,
            newCombo - 1,
            timeRemaining,
            effectiveMaxTime,
            playerEffect,
            state.enemyHp,
            state.enemyMaxHp,
            player.equippedAbilities,
          )
        : { damage: 0, isFast: false, isSlow: false, isCrit: false, isDoubleStrike: false, timingMult: 1 };
      const { damage: dmgToEnemyBase, isFast, isSlow, isCrit, isDoubleStrike } = playerDamageResult;
      // Double strike: deal damage twice
      let dmgToEnemy = isDoubleStrike ? dmgToEnemyBase * 2 : dmgToEnemyBase;
      // CAP damage: max 2x the "fair share" per hit to prevent instakill
      // Fair share = enemyMaxHp / numQuestions. Cap at 2x that.
      const fairShare = Math.ceil(enemy.scaledHp / numQuestions);
      const dmgCap = fairShare * 2;
      dmgToEnemy = Math.min(dmgToEnemy, dmgCap);

      // Process enemy turn (abilities trigger) - with player DEF reduction
      const enemyTurn = processEnemyTurn(
        enemy,
        state.enemyHp,
        state.enemyMaxHp,
        state.turnNumber + 1,
        !isCorrect,
        playerEffect.damageReduction,
        hasIronShield,
      );

      // Apply enemy heal
      let actualEnemyHp = state.enemyHp;
      if (enemyTurn.healAmount) {
        actualEnemyHp = Math.min(state.enemyMaxHp, state.enemyHp + enemyTurn.healAmount);
      }
      if (enemyTurn.regenAmount) {
        actualEnemyHp = Math.min(state.enemyMaxHp, actualEnemyHp + enemyTurn.regenAmount);
      }
      // Apply enemy damage (player's hit)
      let dmgAfterEnemyHeal = Math.max(0, actualEnemyHp - dmgToEnemy);
      // Enemy shield blocks player's hit
      const enemyShieldBlocked = state.enemyShieldActive && isCorrect;

      // Shield blocks enemy damage to player
      const shieldBlocked = state.shieldActive && !isCorrect;
      let dmgToPlayer = enemyTurn.damageToPlayer ?? 0;
      if (shieldBlocked) dmgToPlayer = 0;
      // Counter damage (when player answers correctly)
      const counterDmg = enemyTurn.counterDamage ?? 0;

      // Poison: apply if enemy used poison
      const newPoisonTurns = enemyTurn.poisonApplied ? 2 : Math.max(0, state.poisonTurns - 1);
      // Poison ticks for 1 HP per turn
      const poisonDmg = newPoisonTurns > 0 ? 1 : 0;

      // Thorns: reflect 2 damage when hit
      const thornsDmg = hasThorns && dmgToPlayer > 0 ? 2 : 0;

      const totalPlayerDmg = dmgToPlayer + counterDmg + poisonDmg;

      // === ABILITY EFFECTS ON CORRECT ANSWER ===
      let abilityHeal = 0;
      const abilityMessages: string[] = [];
      if (isCorrect) {
        const abilityResult = processAbilitiesOnCorrect(
          state.turnNumber + 1,
          baseDmg,
          player.equippedAbilities,
        );
        if (abilityResult.vampireHeal) {
          abilityHeal += abilityResult.vampireHeal;
        }
        if (abilityResult.regenHeal) {
          abilityHeal += abilityResult.regenHeal;
        }
        abilityMessages.push(...abilityResult.messages);
      }

      // Update stats tracking
      recordAnswer(isCorrect);

      const finalEnemyHp = enemyShieldBlocked ? actualEnemyHp : dmgAfterEnemyHeal;
      // Apply thorns damage to enemy
      const finalEnemyHpWithThorns = Math.max(0, finalEnemyHp - thornsDmg);

      // Build status messages
      let statusMsg = "";
      if (isCorrect) {
        if (isDoubleStrike) statusMsg = `👊 DOUBLE STRIKE! ${newCombo}x combo!`;
        else if (isCrit) statusMsg = `💥 CRITICAL HIT! ${newCombo}x combo!`;
        else if (isFast) statusMsg = `⚡ FAST! ${newCombo}x combo!`;
        else if (newCombo >= 2) statusMsg = `✓ Benar! Combo ${newCombo}x!`;
        else statusMsg = "✓ Benar! Serangan mengenai musuh!";
        if (enemyShieldBlocked) statusMsg = "🛡 Seranganmu diblokir perisai musuh!";
      } else if (isTimeout) {
        statusMsg = "⏱ Waktu habis! Musuh menyerang!";
      } else if (shieldBlocked) {
        statusMsg = "🛡 Perisai memblokir serangan musuh!";
      } else {
        statusMsg = "✗ Salah! Musuh membalas!";
      }

      setState((s) => ({
        ...s,
        lastAnswerCorrect: isCorrect,
        totalCorrect: isCorrect ? s.totalCorrect + 1 : s.totalCorrect,
        combo: newCombo,
        bestCombo: Math.max(s.bestCombo, newCombo),
        isCritical: isCrit,
        enemyHp: finalEnemyHpWithThorns,
        playerHp: Math.max(0, Math.min(playerEffect.effectiveMaxHp, s.playerHp - totalPlayerDmg + abilityHeal)),
        shieldActive: shieldBlocked ? false : s.shieldActive,
        enemyShieldActive: enemyTurn.shieldGained ? true : (enemyShieldBlocked ? false : s.enemyShieldActive),
        poisonTurns: newPoisonTurns,
        enemyEnraged: enemyTurn.enraged ?? s.enemyEnraged,
        turnNumber: s.turnNumber + 1,
        timerActive: false,
        enemyShake: isCorrect && !enemyShieldBlocked,
        enemyFlashRed: isCorrect && !enemyShieldBlocked,
        playerShake: !isCorrect || counterDmg > 0 || poisonDmg > 0,
        enemyDamageText: null,
        playerDamageText: null,
        comboText: isCorrect && newCombo >= 2 ? `${newCombo}x COMBO!` : null,
        enemyActionText: enemyTurn.messages.length > 0 ? enemyTurn.messages[0] : (abilityMessages.length > 0 ? abilityMessages[0] : null),
        statusMessage: statusMsg,
      }));

      // Sounds & effects
      if (isCorrect) {
        if (isCrit) {
          audio.correct();
          setTimeout(() => audio.attack(), 100);
          setTimeout(() => audio.enemyHit(), 250);
          setTimeout(() => audio.enemyHit(), 400);
        } else {
          audio.correct();
          setTimeout(() => audio.attack(), 200);
          setTimeout(() => audio.enemyHit(), 400);
        }
        if (!enemyShieldBlocked) {
          showFloatingDamage("enemy", dmgToEnemy, isCrit);
        }
      } else {
        if (shieldBlocked) {
          audio.click();
        } else {
          audio.wrong();
          setTimeout(() => audio.playerHit(), 300);
          showFloatingDamage("player", totalPlayerDmg);
        }
      }

      // Clear combo text & enemy action text after a moment
      setTimeout(() => {
        setState((s) => ({ ...s, comboText: null, enemyActionText: null }));
      }, 1500);

      // NOTE: Do NOT sync damage to store during battle.
      // Local state.playerHp is source of truth during battle.
      // Store HP only syncs at battle end (victory restores full, defeat uses snapshot for retry).
      // This fixes the "Coba Lagi" bug where HP wasn't resetting properly.

      // Clear animation flags
      setTimeout(() => {
        setState((s) => ({
          ...s,
          enemyShake: false,
          enemyFlashRed: false,
          playerShake: false,
          isCritical: false,
        }));
      }, 600);

      // Advance question after delay
      setTimeout(() => {
        setState((s) => {
          const isLastQuestion = s.questionIdx >= battleQuestions.length - 1;

          if (s.enemyHp <= 0) return s;
          if (s.playerHp <= 0) return s;
          // If last question answered but enemy still alive, player loses
          // (out of ammo - must defeat enemy within question limit)
          if (isLastQuestion) {
            // Set player HP to 0 to trigger defeat
            return { ...s, playerHp: 0 };
          }

          return {
            ...s,
            questionIdx: s.questionIdx + 1,
            statusMessage: "Pertanyaan berikutnya!",
            lastAnswerCorrect: null,
            timeRemaining: baseTimer,
            timerActive: true,
          };
        });

        setTypedAnswer("");
        setSelectedChoice(null);
        setShowHint(false);
      }, 1900);
    },
    [
      state.battleEnded,
      state.combo,
      state.bestCombo,
      state.shieldActive,
      state.enemyShieldActive,
      state.poisonTurns,
      state.enemyHp,
      state.enemyMaxHp,
      state.turnNumber,
      state.timeRemaining,
      state.lastAnswerCorrect,
      state.questionIdx,
      currentEnemy,
      stage,
      battleQuestions,
      baseTimer,
      playerEffect,
      player.equippedAbilities,
      hasIronShield,
      hasThorns,
      hasTimeFreeze,
      hasScholar,
      showFloatingDamage,
      recordAnswer,
      recordStageLoss,
    ],
  );

  // Keep ref in sync with latest handleAnswer
  useEffect(() => {
    handleAnswerRef.current = handleAnswer;
  }, [handleAnswer]);

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
      const correct = checkTypingAnswer(typedAnswer, currentQuestion.answer);
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
      setSelectedMatch({ side, idx });
      return;
    }

    const leftIdx = side === "left" ? idx : selectedMatch.idx;
    const rightIdx = side === "right" ? idx : selectedMatch.idx;
    const correctPair = currentQuestion.pairs[leftIdx];
    const isCorrect =
      correctPair.right === currentQuestion.pairs[rightIdx].right;

    if (isCorrect) {
      audio.correct();
      const newMatched = [...matchedPairs, leftIdx];
      setMatchedPairs(newMatched);
      setSelectedMatch(null);
      if (newMatched.length === currentQuestion.pairs.length) {
        setTimeout(() => handleAnswer(true), 400);
      }
    } else {
      audio.wrong();
      setMatchError(idx);
      setTimeout(() => setMatchError(null), 400);
      setSelectedMatch(null);
    }
  };

  // ===== ITEM USAGE =====
  const handleUseItem = (itemId: string) => {
    if (state.battleEnded) return;
    if (!hasItem(itemId)) return;
    const def = getItem(itemId);
    if (!def || !def.consumable) return;

    audio.click();
    const effect = consumeItem(itemId);

    if (effect === "heal" || effect === "fullheal") {
      const healAmount = def.value === 999 ? state.playerHp : def.value;
      const newHp = Math.min(
        player.maxHp,
        state.playerHp + (def.value === 999 ? player.maxHp - state.playerHp : def.value),
      );
      setState((s) => ({
        ...s,
        playerHp: newHp,
        statusMessage: `${def.icon} ${def.name}! +${def.value === 999 ? player.maxHp - state.playerHp : def.value} HP!`,
        enemyDamageText: null,
        playerDamageText: null,
      }));
      // Show heal floater
      setTimeout(() => {
        setState((s) => ({ ...s, playerDamageText: `+${healAmount}` }));
        setTimeout(() => {
          setState((s) => ({ ...s, playerDamageText: null }));
        }, 800);
      }, 50);
    } else if (effect === "shield") {
      setState((s) => ({
        ...s,
        shieldActive: true,
        statusMessage: `${def.icon} Perisai aktif! Blokir 1 serangan berikutnya!`,
      }));
    } else if (effect === "damage") {
      // Damage enemy directly
      const dmg = def.value;
      setState((s) => ({
        ...s,
        enemyHp: Math.max(0, s.enemyHp - dmg),
        enemyShake: true,
        statusMessage: `${def.icon} ${def.name}! Musuh -${dmg} HP!`,
      }));
      audio.attack();
      showFloatingDamage("enemy", dmg, false);
      setTimeout(() => {
        setState((s) => ({ ...s, enemyShake: false }));
      }, 500);
    } else if (effect === "hint") {
      setShowHint(true);
      setState((s) => ({
        ...s,
        statusMessage: `${def.icon} Petunjuk ditampilkan!`,
      }));
    }

    setShowItemMenu(false);
  };

  // Get usable items player has
  const usableItems = player.items.filter(
    (id) => ITEMS[id]?.consumable && (player.itemCounts[id] || 0) > 0,
  );

  // ===== END SCREEN =====
  if (state.battleEnded) {
    const perfect = state.victory && state.totalCorrect === stage?.questions.length;
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4 py-6"
        style={{
          background: state.victory
            ? "radial-gradient(ellipse at top, var(--kq-correct) 0%, var(--kq-bg) 70%)"
            : "radial-gradient(ellipse at top, var(--kq-attack) 0%, var(--kq-bg) 70%)",
        }}
      >
        <PixelPanel
          variant="light"
          className="p-6 md:p-8 max-w-md w-full kq-pop text-center"
        >
          <div className="text-6xl mb-3 kq-bob">
            {state.victory ? (perfect ? "🏆" : "🎉") : "💀"}
          </div>
          <h2
            className="font-pixel text-lg md:text-xl mb-2"
            style={{
              color: state.victory
                ? "var(--kq-correct)"
                : "var(--kq-attack)",
            }}
          >
            {state.victory
              ? perfect
                ? "PERFECT VICTORY!"
                : "VICTORY!"
              : "KALAH..."}
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
              <div>Best Combo:</div>
              <div className="font-pixel text-[0.55rem] text-right">
                {state.bestCombo}x
              </div>
              <div>XP Didapat:</div>
              <div className="font-pixel text-[0.55rem] text-right">
                +{state.victory ? stage?.reward.xp : Math.floor((stage?.reward.xp ?? 0) * 0.1)}
              </div>
              <div>Koin:</div>
              <div className="font-pixel text-[0.55rem] text-right">
                +{state.coinsGained}
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

          {/* Achievements */}
          {state.newAchievements.length > 0 && (
            <div
              className="p-3 mb-4"
              style={{
                background: "var(--kq-accent)",
                border: "2px solid var(--kq-panel-border)",
              }}
            >
              <div className="font-pixel text-[0.5rem] mb-2 text-black">
                🏆 ACHIEVEMENT BARU!
              </div>
              {state.newAchievements.map((id) => {
                const a = ACHIEVEMENTS_MAP[id];
                return (
                  <div
                    key={id}
                    className="font-vt text-base text-black kq-pop"
                  >
                    {a?.icon} {a?.name}
                  </div>
                );
              })}
            </div>
          )}

          {/* Outro story */}
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
                    endedRef.current = false;
                    // Restore HP from snapshot (taken at battle start), not from store
                    // Store HP may have been damaged during previous battle attempt
                    const snapshotHp = parseInt(
                      sessionStorage.getItem(INITIAL_PLAYER_HP_KEY) || String(player.hp),
                      10,
                    );
                    const fullHp = Math.min(snapshotHp, playerEffect.effectiveMaxHp);
                    setState({
                      enemyHp: scaledEnemy?.scaledHp ?? 1,
                      enemyMaxHp: scaledEnemy?.scaledHp ?? 1,
                      playerHp: fullHp,
                      questionIdx: 0,
                      totalCorrect: 0,
                      combo: 0,
                      bestCombo: 0,
                      isCritical: false,
                      shieldActive: hasShieldStart,
                      enemyShieldActive: false,
                      poisonTurns: 0,
                      enemyEnraged: false,
                      turnNumber: 0,
                      timeRemaining: baseTimer + (hasTimeFreeze ? 5 : 0),
                      timerActive: true,
                      enemyShake: false,
                      enemyFlashRed: false,
                      playerShake: false,
                      enemyDamageText: null,
                      playerDamageText: null,
                      comboText: null,
                      enemyActionText: null,
                      statusMessage: hasShieldStart
                        ? "🛡 Perisai awal aktif! Coba lagi!"
                        : "Coba lagi! Semangat!",
                      lastAnswerCorrect: null,
                      battleEnded: false,
                      victory: false,
                      newAchievements: [],
                      coinsGained: 0,
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
            Q {state.questionIdx + 1}/{battleQuestions.length}
          </div>
        </div>

        {/* Timer bar - above battle stage */}
        <div className="mb-2 flex items-center gap-2">
          <span className="font-pixel text-[0.5rem] text-white/80 shrink-0">⏱</span>
          <div
            className="flex-1 h-3 relative overflow-hidden"
            style={{
              background: "var(--kq-bg-2)",
              border: "2px solid var(--kq-fg)",
            }}
          >
            <div
              style={{
                width: `${(state.timeRemaining / baseTimer) * 100}%`,
                height: "100%",
                background:
                  state.timeRemaining / baseTimer > 0.5
                    ? "var(--kq-correct)"
                    : state.timeRemaining / baseTimer > 0.25
                      ? "var(--kq-accent)"
                      : "var(--kq-attack)",
                transition: "width 0.1s linear",
              }}
            />
          </div>
          <span
            className="font-pixel text-[0.55rem] shrink-0 w-12 text-right"
            style={{
              color:
                state.timeRemaining / baseTimer > 0.5
                  ? "var(--kq-correct)"
                  : state.timeRemaining / baseTimer > 0.25
                    ? "var(--kq-accent)"
                    : "var(--kq-attack)",
            }}
          >
            {Math.ceil(state.timeRemaining)}s
          </span>
        </div>

        {/* Enemy ability indicators */}
        {currentEnemy.abilities && currentEnemy.abilities.length > 0 && (
          <div className="mb-2 flex items-center gap-1 flex-wrap">
            <span className="font-pixel text-[0.4rem] text-white/60 shrink-0">
              ABILITY:
            </span>
            {currentEnemy.abilities.map((ab) => {
              const info = ABILITY_INFO[ab];
              if (!info) return null;
              return (
                <span
                  key={ab}
                  className="font-pixel text-[0.4rem] px-1.5 py-0.5"
                  style={{
                    background: info.color,
                    color: "white",
                    border: `2px solid var(--kq-panel-border)`,
                    textShadow: "1px 1px 0 rgba(0,0,0,0.6)",
                  }}
                  title={info.description}
                >
                  {info.icon} {info.name}
                </span>
              );
            })}
            {state.enemyEnraged && (
              <span
                className="font-pixel text-[0.4rem] px-1.5 py-0.5 kq-blink"
                style={{
                  background: "var(--kq-attack)",
                  color: "white",
                  border: "2px solid var(--kq-panel-border)",
                }}
              >
                🔥 ENRAGED!
              </span>
            )}
            {state.enemyShieldActive && (
              <span
                className="font-pixel text-[0.4rem] px-1.5 py-0.5"
                style={{
                  background: "var(--kq-n4)",
                  color: "white",
                  border: "2px solid var(--kq-panel-border)",
                }}
              >
                🛡 SHIELDED
              </span>
            )}
          </div>
        )}

        {/* Enemy action announcement (when enemy uses ability) */}
        {state.enemyActionText && (
          <div className="mb-2 text-center">
            <span
              className="font-pixel text-[0.55rem] inline-block px-3 py-1 kq-pop"
              style={{
                background: "var(--kq-attack)",
                color: "white",
                border: "2px solid var(--kq-panel-border)",
              }}
            >
              {state.enemyActionText}
            </span>
          </div>
        )}

        {/* Battle stage - enemy at top, player at bottom */}
        <div
          className="relative mb-4"
          style={{
            background: `linear-gradient(to bottom, ${world.colorDark}33, ${world.colorDark}88)`,
            border: "4px solid var(--kq-panel-border)",
            boxShadow: "0 0 0 4px var(--kq-fg)",
            minHeight: 200,
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

          {/* Combo indicator (when active) */}
          {state.combo >= 2 && (
            <div className="absolute top-3 right-3 z-20">
              <div
                className="px-3 py-1.5 kq-pop"
                style={{
                  background: "var(--kq-accent)",
                  border: "3px solid var(--kq-panel-border)",
                }}
              >
                <div className="font-pixel text-[0.5rem] text-black">
                  🔥 COMBO
                </div>
                <div className="font-pixel text-base text-black text-center">
                  {state.combo}x
                </div>
              </div>
            </div>
          )}

          {/* Combo floating text */}
          {state.comboText && (
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none z-30"
              style={{ animation: "kq-pop 0.3s ease-out 1" }}
            >
              <div
                className="font-pixel text-2xl md:text-3xl kq-text-outline"
                style={{ color: "var(--kq-accent)" }}
              >
                {state.comboText}
              </div>
            </div>
          )}

          {/* Enemy sprite center-top */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <PixelSprite
                src={getEnemySprite(currentEnemy.id) || undefined}
                char={currentEnemy.sprite}
                size={120}
                color={currentEnemy.color}
                float={!state.enemyShake}
                shake={state.enemyShake}
                flashRed={state.enemyFlashRed}
              />
              {state.enemyDamageText && (
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 font-pixel kq-damage-float whitespace-nowrap ${
                    state.isCritical ? "text-base" : "text-base"
                  }`}
                  style={{
                    color: state.isCritical
                      ? "var(--kq-accent)"
                      : "var(--kq-attack)",
                    textShadow: "2px 2px 0 white",
                  }}
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
                width: 140,
                height: 8,
                background: state.isCritical
                  ? "var(--kq-accent)"
                  : "white",
                boxShadow: `0 0 ${state.isCritical ? 20 : 12}px ${
                  state.isCritical ? "var(--kq-accent)" : "white"
                }`,
              }}
            />
          )}

          {/* Player sprite bottom-right */}
          <div className="absolute bottom-3 right-3 md:right-8">
            <div className="relative">
              <PixelSprite
                src={getHeroSprite(state.shieldActive)}
                char={state.shieldActive ? "🧙‍♂️" : "🧙"}
                size={90}
                float={!state.playerShake}
                shake={state.playerShake}
              />
              {/* Shield aura */}
              {state.shieldActive && (
                <div
                  className="absolute -inset-2 pointer-events-none"
                  style={{
                    border: "3px dashed var(--kq-n4)",
                    borderRadius: "50%",
                    animation: "kq-bob 1s ease-in-out infinite",
                  }}
                />
              )}
              {state.playerDamageText && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 font-pixel text-base kq-damage-float whitespace-nowrap"
                  style={{
                    color: state.playerDamageText.startsWith("+")
                      ? "var(--kq-correct)"
                      : "var(--kq-attack)",
                    textShadow: "2px 2px 0 white",
                  }}
                >
                  {state.playerDamageText}
                </div>
              )}
            </div>
          </div>

          {/* Player HP bar bottom-left */}
          <div className="absolute bottom-3 left-3 right-24 md:right-auto md:w-80 z-10">
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
                max={playerEffect.effectiveMaxHp}
                color="var(--kq-hp)"
                height={10}
                showNumbers={false}
              />
              {/* Player stats row */}
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                <span
                  className="font-pixel text-[0.4rem] px-1"
                  style={{ background: "#ef5350", color: "white" }}
                  title="ATK: +10% damage per point"
                >
                  ⚔{player.atk}
                </span>
                <span
                  className="font-pixel text-[0.4rem] px-1"
                  style={{ background: "#4fc3f7", color: "white" }}
                  title="DEF: -8% damage taken per point"
                >
                  🛡{player.def}
                </span>
                <span
                  className="font-pixel text-[0.4rem] px-1"
                  style={{ background: "#66bb6a", color: "white" }}
                  title="SPD: +0.5s timer per point"
                >
                  👟{player.spd}
                </span>
                <span
                  className="font-pixel text-[0.4rem] px-1"
                  style={{ background: "#ffd54f", color: "black" }}
                  title="LUCK: +3% crit chance per point"
                >
                  🍀{player.luck}
                </span>
                {/* Equipped abilities */}
                {player.equippedAbilities.length > 0 && (
                  <span className="font-pixel text-[0.35rem] text-white/60 ml-1">
                    PERK:
                  </span>
                )}
                {player.equippedAbilities.map((id) => {
                  const def = ITEMS[id];
                  if (!def) return null;
                  return (
                    <span
                      key={id}
                      className="text-sm"
                      title={def.name + ": " + def.description}
                      style={{ filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.5))" }}
                    >
                      {def.icon}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Status message */}
        <div className="text-center mb-3 min-h-[2rem]">
          <p
            className="font-pixel text-[0.6rem]"
            style={{
              color:
                state.lastAnswerCorrect === true
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
          className="p-4 md:p-5 flex-1 flex flex-col relative"
        >
          {/* Item menu button - top right of question panel */}
          {usableItems.length > 0 && (
            <button
              onClick={() => {
                audio.click();
                setShowItemMenu(!showItemMenu);
              }}
              className="absolute top-2 right-2 z-10 px-2 py-1"
              style={{
                background: showItemMenu
                  ? "var(--kq-accent)"
                  : "var(--kq-panel-2)",
                border: "2px solid var(--kq-panel-border)",
              }}
              aria-label="Item menu"
            >
              <span className="font-pixel text-[0.5rem] text-black">
                🎒 ITEM
              </span>
            </button>
          )}

          {/* Item dropdown */}
          {showItemMenu && usableItems.length > 0 && (
            <div
              className="absolute top-10 right-2 z-20 p-2 max-w-[280px] kq-pop"
              style={{
                background: "var(--kq-panel)",
                border: "3px solid var(--kq-panel-border)",
                boxShadow: "4px 4px 0 rgba(0,0,0,0.4)",
              }}
            >
              <div className="font-pixel text-[0.5rem] mb-2 text-black">
                PILIH ITEM:
              </div>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {usableItems.map((itemId) => {
                  const def = ITEMS[itemId];
                  const count = player.itemCounts[itemId] || 0;
                  return (
                    <button
                      key={itemId}
                      onClick={() => handleUseItem(itemId)}
                      disabled={state.lastAnswerCorrect !== null}
                      className="w-full flex items-center gap-2 p-2 text-left disabled:opacity-50"
                      style={{
                        background: "var(--kq-panel-2)",
                        border: "2px solid var(--kq-panel-border)",
                      }}
                    >
                      <span className="text-xl shrink-0">{def.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-pixel text-[0.5rem] text-black truncate">
                          {def.name}
                        </div>
                        <div className="font-vt text-xs text-black/70 truncate">
                          {def.description}
                        </div>
                      </div>
                      <span className="font-pixel text-[0.5rem] text-black shrink-0">
                        x{count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                  const showResult =
                    state.lastAnswerCorrect !== null && isSelected;
                  const showAsCorrect =
                    state.lastAnswerCorrect !== null && isCorrectAns;

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
                        color:
                          showResult || showAsCorrect
                            ? "var(--kq-panel)"
                            : "var(--kq-panel-border)",
                        textTransform: "none",
                        fontFamily: "var(--font-gothic), var(--font-noto-jp), \"Noto Sans JP\", \"IPAGothic\", \"Noto Sans SC\", sans-serif",
                        fontSize: "1rem",
                      }}
                    >
                      <span className="font-pixel text-[0.5rem] mr-2">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                      {showAsCorrect && <span className="ml-2">✓</span>}
                      {showResult && !state.lastAnswerCorrect && (
                        <span className="ml-2">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* TYPING */}
            {currentQuestion.type === "typing" && (
              <form
                onSubmit={handleTypingSubmit}
                className="max-w-md mx-auto"
              >
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
                    boxShadow:
                      state.lastAnswerCorrect === false
                        ? "0 0 0 3px var(--kq-attack)"
                        : "0 0 0 3px var(--kq-panel)",
                    outline: "none",
                  }}
                />
                <div className="text-center mt-3">
                  <PixelButton
                    type="submit"
                    variant="accent"
                    size="sm"
                    disabled={
                      state.lastAnswerCorrect !== null ||
                      !typedAnswer.trim()
                    }
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
                        ✗ Jawaban: {getPrimaryAnswer(currentQuestion.answer)}
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
                  <div
                    className="font-pixel text-[0.45rem] text-center mb-1"
                    style={{ color: "var(--kq-panel-border)" }}
                  >
                    HURUF
                  </div>
                  {currentQuestion.pairs.map((pair, idx) => {
                    const isMatched = matchedPairs.includes(idx);
                    const isSelected =
                      selectedMatch?.side === "left" &&
                      selectedMatch.idx === idx;
                    const isError =
                      matchError === idx &&
                      selectedMatch?.side === "right";
                    return (
                      <button
                        key={`l-${idx}`}
                        onClick={() => handleMatchClick("left", idx)}
                        disabled={
                          isMatched || state.lastAnswerCorrect !== null
                        }
                        className="w-full py-3 px-2 font-gothic text-3xl transition-transform"
                        style={{
                          background: isMatched
                            ? "var(--kq-correct)"
                            : isSelected
                              ? "var(--kq-accent)"
                              : isError
                                ? "var(--kq-attack)"
                                : "var(--kq-panel-2)",
                          border: `4px solid ${
                            isMatched
                              ? "var(--kq-correct)"
                              : "var(--kq-panel-border)"
                          }`,
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
                  <div
                    className="font-pixel text-[0.45rem] text-center mb-1"
                    style={{ color: "var(--kq-panel-border)" }}
                  >
                    ROMAJI
                  </div>
                  {currentQuestion.pairs.map((pair, idx) => {
                    const isMatched = matchedPairs.includes(idx);
                    const isSelected =
                      selectedMatch?.side === "right" &&
                      selectedMatch.idx === idx;
                    const isError =
                      matchError === idx &&
                      selectedMatch?.side === "left";
                    return (
                      <button
                        key={`r-${idx}`}
                        onClick={() => handleMatchClick("right", idx)}
                        disabled={
                          isMatched || state.lastAnswerCorrect !== null
                        }
                        className="w-full py-3 px-2 font-vt text-xl transition-transform"
                        style={{
                          background: isMatched
                            ? "var(--kq-correct)"
                            : isSelected
                              ? "var(--kq-accent)"
                              : isError
                                ? "var(--kq-attack)"
                                : "var(--kq-panel-2)",
                          border: `4px solid ${
                            isMatched
                              ? "var(--kq-correct)"
                              : "var(--kq-panel-border)"
                          }`,
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
          {currentQuestion.hint &&
            !showHint &&
            !hasScholar &&
            state.lastAnswerCorrect === null && (
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
          {(showHint || hasScholar) && currentQuestion.hint && (
            <div
              className="mt-3 p-2 text-center"
              style={{
                background: "var(--kq-accent)",
                border: "2px solid var(--kq-panel-border)",
              }}
            >
              <p className="font-vt text-base text-black">
                💡 {currentQuestion.hint}
                {hasScholar && (
                  <span className="font-pixel text-[0.4rem] ml-2 text-black/60">
                    (🤓 SCHOLAR)
                  </span>
                )}
              </p>
            </div>
          )}
        </PixelPanel>
      </div>
    </div>
  );
}

// Achievement lookup map
import { ACHIEVEMENTS } from "@/lib/game/items";
const ACHIEVEMENTS_MAP: Record<string, { id: string; name: string; icon: string; description: string }> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);
