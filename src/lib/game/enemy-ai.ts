// ===== ENEMY SCALING + PLAYER STATS SYSTEM (Dicero-style) =====
// Stage-based scaling (no difficulty selector).
// Player stats (ATK/DEF/SPD/LUCK) + equipped abilities modify battle.

import type { BattleEnemy, AbilityPerk } from "./types";
import { SCALING } from "./types";

/**
 * Scale enemy stats based on STAGE INDEX (steeper growth per stage).
 * This forces player to upgrade their stats & buy abilities.
 */
export function scaleEnemy(
  enemy: BattleEnemy,
  _playerLevel: number,
  stageIndex: number,
): BattleEnemy & { scaledHp: number; scaledAttack: number; effectiveLevel: number } {
  // Steeper scaling: stage 1 = 1x, stage 5 = ~1.8x, stage 10 = ~2.6x, stage 20 = ~4.2x
  const hpMult = 1 + (stageIndex - 1) * SCALING.hpGrowth;
  const atkMult = 1 + (stageIndex - 1) * SCALING.atkGrowth;
  const scaledHp = Math.ceil(enemy.hp * hpMult);
  const scaledAttack = Math.ceil(enemy.attack * atkMult);
  const effectiveLevel = stageIndex;

  return {
    ...enemy,
    hp: scaledHp,
    attack: scaledAttack,
    scaledHp,
    scaledAttack,
    effectiveLevel,
  };
}

// ===== PLAYER STATS EFFECTS =====
export interface PlayerStatsEffect {
  damageMult: number; // ATK: each point = +10% damage
  damageReduction: number; // DEF: each point = -8% damage taken
  timerBonus: number; // SPD: each point = +0.5s timer
  critChance: number; // LUCK: each point = +3% crit chance
  // Effective max HP (after berserker penalty if equipped)
  effectiveMaxHp: number;
}

export function computePlayerStatsEffect(
  player: {
    atk: number;
    def: number;
    spd: number;
    luck: number;
    maxHp: number;
    equippedAbilities: string[];
  },
): PlayerStatsEffect {
  const damageMult = 1 + player.atk * 0.1;
  const damageReduction = player.def * 0.08;
  const timerBonus = player.spd * 0.5;
  const critChance = SCALING.playerCritChance + player.luck * 0.03;

  let effectiveMaxHp = player.maxHp;
  // Berserker ability: +50% damage but -25% max HP
  if (hasPerk(player.equippedAbilities, "berserker")) {
    effectiveMaxHp = Math.floor(player.maxHp * 0.75);
  }

  return {
    damageMult,
    damageReduction: Math.min(0.8, damageReduction), // cap 80%
    timerBonus,
    critChance: Math.min(0.8, critChance), // cap 80%
    effectiveMaxHp,
  };
}

// ===== ABILITY HELPERS =====
const ABILITY_PERK_MAP: Record<string, AbilityPerk> = {
  vampire_scroll: "vampire",
  berserker_mask: "berserker",
  lucky_charm: "lucky_charm",
  swift_boots: "swift_boots",
  iron_shield: "iron_shield",
  scholar_glasses: "scholar",
  thorns_armor: "thorns",
  executioner_axe: "executioner",
  time_freeze_watch: "time_freeze",
  combo_master_ring: "combo_master",
  regen_amulet: "regen_player",
  shield_start_charm: "shield_start",
  double_strike_gauntlet: "double_strike",
  golden_touch: "golden_touch",
  xp_boost_crystal: "xp_boost",
};

export function getAbilityPerk(itemId: string): AbilityPerk | undefined {
  return ABILITY_PERK_MAP[itemId];
}

export function hasPerk(equippedAbilities: string[], perk: AbilityPerk): boolean {
  return equippedAbilities.some((id) => ABILITY_PERK_MAP[id] === perk);
}

// ===== ABILITY INFO FOR UI =====
export const ABILITY_INFO: Record<
  string,
  { name: string; icon: string; description: string; color: string }
> = {
  heal: { name: "Self-Heal", icon: "💖", description: "Musuh menyembuhkan diri setiap 3 giliran.", color: "#66bb6a" },
  crit: { name: "Critical Strike", icon: "💢", description: "Musuh punya peluang critical hit (2x damage).", color: "#ef5350" },
  shield: { name: "Shield", icon: "🛡", description: "Musuh memblokir serangan berikutnya.", color: "#4fc3f7" },
  "multi-attack": { name: "Multi-Attack", icon: "⚡", description: "Saat jawaban salah, musuh menyerang 2x.", color: "#ffd54f" },
  enrage: { name: "Enrage", icon: "🔥", description: "Di bawah 30% HP, attack musuh naik 50%.", color: "#ff6f00" },
  regen: { name: "Regen", icon: "♻", description: "Musuh regen 1 HP tiap 2 giliran.", color: "#26a69a" },
  poison: { name: "Poison", icon: "☠", description: "Jawaban salah = racun (DOT 2 giliran).", color: "#7e57c2" },
  "time-pressure": { name: "Time Pressure", icon: "⏱", description: "Timer soal dikurangi 5 detik.", color: "#ff7043" },
  counter: { name: "Counter", icon: "↩", description: "Pantulkan 1 damage dari seranganmu.", color: "#90a4ae" },
};

// ===== ENEMY TURN PROCESSING =====
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
  playerAnsweredWrong: boolean,
  playerDefReduction: number, // 0-0.8
  ironShieldEquipped: boolean, // -1 damage flat
): EnemyTurnResult {
  const abilities = enemy.abilities ?? [];
  const result: EnemyTurnResult = { messages: [] };
  const effectiveAttack = enemy.attack;

  // === PASSIVE ABILITIES ===
  if (
    abilities.includes("regen") &&
    currentHp > 0 &&
    currentHp < maxHp &&
    turnNumber % 2 === 1
  ) {
    result.regenAmount = 1;
    result.messages.push(`♻ ${enemy.name} regen 1 HP`);
  }

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

  if (abilities.includes("enrage") && currentHp <= maxHp * 0.3) {
    result.enraged = true;
  }

  // === ACTIVE ABILITIES (on player wrong answer) ===
  if (playerAnsweredWrong) {
    let baseDamage = effectiveAttack;
    let isCrit = false;
    let isMulti = false;

    // Enemy crit chance (inherent)
    const enemyCritChance = enemy.critChance ?? 0.1;
    if (abilities.includes("crit") || Math.random() < enemyCritChance) {
      isCrit = true;
      baseDamage = Math.ceil(baseDamage * 2);
      result.messages.push(`💢 CRITICAL! ${enemy.name} menghantam keras!`);
    }

    if (abilities.includes("multi-attack")) {
      isMulti = true;
      baseDamage = baseDamage + Math.ceil(effectiveAttack * 0.5);
      result.messages.push(`⚡ ${enemy.name} menyerang 2x!`);
    }

    if (result.enraged) {
      baseDamage = Math.ceil(baseDamage * 1.5);
      if (!result.messages.some((m) => m.includes("enrage"))) {
        result.messages.push(`🔥 ${enemy.name} mengamuk! +50% damage!`);
      }
    }

    // Apply player DEF reduction
    baseDamage = Math.max(1, Math.ceil(baseDamage * (1 - playerDefReduction)));
    // Apply iron shield flat reduction
    if (ironShieldEquipped) {
      baseDamage = Math.max(0, baseDamage - 1);
    }

    result.damageToPlayer = baseDamage;
    result.isCrit = isCrit;
    result.isMultiAttack = isMulti;

    if (abilities.includes("poison")) {
      result.poisonApplied = true;
      result.messages.push(`☠ ${enemy.name} meracunimu!`);
    }
  } else {
    if (abilities.includes("counter")) {
      result.counterDamage = 1;
      result.messages.push(`↩ ${enemy.name} memantulkan serangan! -1 HP`);
    }
  }

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

// ===== PLAYER DAMAGE COMPUTATION (with stats + abilities) =====
export interface PlayerDamageResult {
  damage: number;
  isFast: boolean;
  isSlow: boolean;
  isCrit: boolean;
  isDoubleStrike: boolean;
  timingMult: number;
}

export function computePlayerDamage(
  baseDamage: number,
  combo: number,
  timeRemaining: number,
  maxTime: number,
  playerEffect: PlayerStatsEffect,
  enemyCurrentHp: number,
  enemyMaxHp: number,
  equippedAbilities: string[],
): PlayerDamageResult {
  const timePct = timeRemaining / maxTime;

  let timingMult = 1;
  let isFast = false;
  let isSlow = false;

  if (timePct >= 0.7) {
    timingMult = 1.3; // reduced from 1.8
    isFast = true;
  } else if (timePct <= 0.3) {
    timingMult = 0.7; // reduced penalty from 0.5
    isSlow = true;
  }

  // Combo bonus: +5% per combo, max +25% (was 10%/50%)
  let comboBonus = Math.min(combo * 0.05, 0.25);
  // Combo master ability: doubles combo bonus (max 50%)
  if (hasPerk(equippedAbilities, "combo_master")) {
    comboBonus = comboBonus * 2;
  }
  const comboMult = 1 + comboBonus;

  // Crit chance (base + LUCK + lucky_charm ability)
  let critChance = playerEffect.critChance;
  if (hasPerk(equippedAbilities, "lucky_charm")) {
    critChance += 0.15;
  }
  const isCrit = Math.random() < critChance;
  const critMult = isCrit ? SCALING.playerCritMult : 1;

  // Player ATK stat multiplier
  const atkMult = playerEffect.damageMult;

  // Executioner ability: +50% damage to enemies below 30% HP (was 100%)
  let execMult = 1;
  if (hasPerk(equippedAbilities, "executioner") && enemyCurrentHp <= enemyMaxHp * 0.3) {
    execMult = 1.5;
  }

  // Double strike: 15% chance to deal damage twice (was 20%)
  const isDoubleStrike = hasPerk(equippedAbilities, "double_strike") && Math.random() < 0.15;

  const damage = Math.ceil(
    baseDamage * timingMult * comboMult * critMult * atkMult * execMult,
  );

  return { damage, isFast, isSlow, isCrit, isDoubleStrike, timingMult };
}

// ===== ABILITY TRIGGERS DURING BATTLE =====
// Returns additional effects to apply on correct answer
export interface AbilityOnCorrectResult {
  vampireHeal?: number; // HP healed from vampire ability
  doubleStrikeDamage?: number; // extra damage from double strike
  regenHeal?: number; // HP healed from regen_player
  messages: string[];
}

export function processAbilitiesOnCorrect(
  turnNumber: number,
  baseDamage: number,
  equippedAbilities: string[],
): AbilityOnCorrectResult {
  const result: AbilityOnCorrectResult = { messages: [] };

  if (hasPerk(equippedAbilities, "vampire")) {
    result.vampireHeal = 1;
    result.messages.push("🦇 Vampir! +1 HP");
  }

  if (hasPerk(equippedAbilities, "regen_player") && turnNumber > 0 && turnNumber % 3 === 0) {
    result.regenHeal = 1;
    result.messages.push("💚 Regen! +1 HP");
  }

  return result;
}
