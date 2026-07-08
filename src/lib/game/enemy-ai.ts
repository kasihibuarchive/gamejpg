// ===== ENEMY SCALING SYSTEM =====
// Scales enemy stats based on player level, stage index, world, and difficulty.
// Also provides enemy ability metadata for UI display.

import type { BattleEnemy, DifficultyConfig } from "./types";
import type { PlayerState } from "./types";
import { DIFFICULTY } from "./types";

type DifficultyKey = "easy" | "normal" | "hard";

/**
 * Compute scaled enemy stats for a battle.
 * Returns the enemy with hp/attack adjusted based on:
 *  - Player level (so higher-level players face tougher enemies)
 *  - Stage index within world
 *  - Difficulty setting
 */
export function scaleEnemy(
  enemy: BattleEnemy,
  playerLevel: number,
  stageIndex: number,
  difficulty: DifficultyKey,
): BattleEnemy & { scaledHp: number; scaledAttack: number; effectiveLevel: number } {
  const cfg = DIFFICULTY[difficulty];
  // Effective enemy level: base stage + half player level
  const effectiveLevel = (enemy.level ?? 1) + Math.floor(stageIndex / 2) + Math.floor(playerLevel * 0.5);

  // HP scales with: base * (1 + level * hpScale) * (1 + stageProgress)
  const stageProgress = stageIndex / 20; // 0 to 1
  const hpMult = 1 + effectiveLevel * cfg.hpScale + stageProgress * 0.3;
  const scaledHp = Math.ceil(enemy.hp * hpMult);

  // ATK scales similarly but gentler
  const atkMult = 1 + effectiveLevel * cfg.atkScale + stageProgress * 0.15;
  const scaledAttack = Math.ceil(enemy.attack * atkMult);

  return {
    ...enemy,
    hp: scaledHp,
    attack: scaledAttack,
    scaledHp,
    scaledAttack,
    effectiveLevel,
  };
}

/**
 * Ability metadata for display in UI.
 */
export const ABILITY_INFO: Record<
  string,
  { name: string; icon: string; description: string; color: string }
> = {
  heal: {
    name: "Self-Heal",
    icon: "💖",
    description: "Musuh menyembuhkan diri setiap 3 giliran.",
    color: "#66bb6a",
  },
  crit: {
    name: "Critical Strike",
    icon: "💢",
    description: "Musuh punya peluang critical hit (2x damage).",
    color: "#ef5350",
  },
  shield: {
    name: "Shield",
    icon: "🛡",
    description: "Musuh memblokir serangan berikutnya.",
    color: "#4fc3f7",
  },
  "multi-attack": {
    name: "Multi-Attack",
    icon: "⚡",
    description: "Saat jawaban salah, musuh menyerang 2x.",
    color: "#ffd54f",
  },
  enrage: {
    name: "Enrage",
    icon: "🔥",
    description: "Di bawah 30% HP, attack musuh naik 50%.",
    color: "#ff6f00",
  },
  regen: {
    name: "Regen",
    icon: "♻",
    description: "Musuh regen 1 HP tiap giliran.",
    color: "#26a69a",
  },
  poison: {
    name: "Poison",
    icon: "☠",
    description: "Jawaban salah = racun (DOT 2 giliran).",
    color: "#7e57c2",
  },
  "time-pressure": {
    name: "Time Pressure",
    icon: "⏱",
    description: "Timer soal dikurangi 5 detik.",
    color: "#ff7043",
  },
  counter: {
    name: "Counter",
    icon: "↩",
    description: "Pantulkan 25% damage dari seranganmu.",
    color: "#90a4ae",
  },
};

/**
 * Process enemy turn - returns events that should happen.
 */
export interface EnemyTurnResult {
  healAmount?: number;
  damageToPlayer?: number;
  isCrit?: boolean;
  isMultiAttack?: boolean;
  shieldGained?: boolean;
  enraged?: boolean;
  regenAmount?: number;
  poisonApplied?: boolean;
  counterDamage?: number;
  messages: string[];
}

export function processEnemyTurn(
  enemy: BattleEnemy & { scaledHp?: number; scaledAttack?: number; effectiveLevel?: number },
  currentHp: number,
  maxHp: number,
  turnNumber: number,
  difficulty: DifficultyKey,
  playerAnsweredWrong: boolean,
): EnemyTurnResult {
  const cfg = DIFFICULTY[difficulty];
  const abilities = enemy.abilities ?? [];
  const result: EnemyTurnResult = { messages: [] };
  const effectiveAttack = enemy.attack;

  // === PASSIVE ABILITIES (always active) ===

  // Regen: heal 1 HP per turn (but only every 2nd turn to avoid stalemate)
  if (
    abilities.includes("regen") &&
    currentHp > 0 &&
    currentHp < maxHp &&
    turnNumber % 2 === 1
  ) {
    result.regenAmount = 1;
    result.messages.push(`♻ ${enemy.name} regen 1 HP`);
  }

  // Self-heal: every 3rd turn, heal 15% of max HP
  if (
    abilities.includes("heal") &&
    turnNumber > 0 &&
    turnNumber % 3 === 0 &&
    currentHp < maxHp * 0.6
  ) {
    const heal = Math.ceil(maxHp * 0.15);
    result.healAmount = heal;
    result.messages.push(`💖 ${enemy.name} menyembuhkan diri +${heal} HP!`);
  }

  // Enrage: at low HP, attack increases (visual indicator only - actual damage calc handles it)
  if (abilities.includes("enrage") && currentHp <= maxHp * 0.3) {
    result.enraged = true;
  }

  // === ACTIVE ABILITIES (trigger on player wrong answer) ===

  if (playerAnsweredWrong) {
    let baseDamage = effectiveAttack;
    let isCrit = false;
    let isMulti = false;

    // Crit chance
    const critChance = enemy.critChance ?? cfg.enemyCritChance;
    if (abilities.includes("crit") || Math.random() < critChance) {
      isCrit = true;
      baseDamage = Math.ceil(baseDamage * cfg.enemyCritMult);
      result.messages.push(`💢 CRITICAL HIT! ${enemy.name} menghantam keras!`);
    }

    // Multi-attack: deal damage twice
    if (abilities.includes("multi-attack")) {
      isMulti = true;
      baseDamage = baseDamage + Math.ceil(effectiveAttack * 0.5);
      result.messages.push(`⚡ ${enemy.name} menyerang 2x!`);
    }

    // Enrage bonus damage
    if (result.enraged) {
      baseDamage = Math.ceil(baseDamage * 1.5);
      if (!result.messages.some((m) => m.includes("enrage"))) {
        result.messages.push(`🔥 ${enemy.name} mengamuk! +50% damage!`);
      }
    }

    result.damageToPlayer = baseDamage;
    result.isCrit = isCrit;
    result.isMultiAttack = isMulti;

    // Poison: apply DOT effect
    if (abilities.includes("poison")) {
      result.poisonApplied = true;
      result.messages.push(`☠ ${enemy.name} meracunimu! (-1 HP/turn)`);
    }
  } else {
    // Player answered correctly - counter ability
    if (abilities.includes("counter")) {
      result.counterDamage = 1; // small chip damage
      result.messages.push(`↩ ${enemy.name} memantulkan serangan! -1 HP`);
    }
  }

  // Shield: enemy gains shield periodically
  if (
    abilities.includes("shield") &&
    turnNumber > 0 &&
    turnNumber % 4 === 0 &&
    !playerAnsweredWrong
  ) {
    result.shieldGained = true;
    result.messages.push(`🛡 ${enemy.name} mengaktifkan perisai!`);
  }

  return result;
}

/**
 * Compute damage dealt by player based on timing & combo.
 */
export function computePlayerDamage(
  baseDamage: number,
  combo: number,
  isCritical: boolean,
  timeRemaining: number,
  maxTime: number,
  difficulty: DifficultyKey,
): { damage: number; isFast: boolean; isSlow: boolean; timingMult: number } {
  const cfg = DIFFICULTY[difficulty];
  const timePct = timeRemaining / maxTime;

  let timingMult = 1;
  let isFast = false;
  let isSlow = false;

  if (timePct >= 0.7) {
    // answered fast
    timingMult = cfg.fastBonus;
    isFast = true;
  } else if (timePct <= 0.3) {
    // answered slow
    timingMult = cfg.slowPenalty;
    isSlow = true;
  }

  // Combo bonus: +10% per combo, max +50%
  const comboMult = 1 + Math.min(combo * 0.1, 0.5);

  // Crit mult: 2x
  const critMult = isCritical ? 2 : 1;

  const damage = Math.ceil(baseDamage * timingMult * comboMult * critMult);

  return { damage, isFast, isSlow, timingMult };
}
