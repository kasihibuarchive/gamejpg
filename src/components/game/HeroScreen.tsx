"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { ITEMS, PERK_INFO } from "@/lib/game/items";
import { computePlayerStatsEffect } from "@/lib/game/enemy-ai";
import { SCALING } from "@/lib/game/types";
import { PixelButton, PixelPanel, PixelDivider } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import type { AbilityPerk } from "@/lib/game/types";

const STAT_INFO = {
  atk: {
    name: "ATK (Attack)",
    icon: "⚔",
    color: "#ef5350",
    description: "+10% damage per point",
    detail: "Naikin damage tiap serangan ke musuh.",
  },
  def: {
    name: "DEF (Defense)",
    icon: "🛡",
    color: "#4fc3f7",
    description: "-8% damage taken per point",
    detail: "Kurangi damage yang diterima dari musuh.",
  },
  spd: {
    name: "SPD (Speed)",
    icon: "👟",
    color: "#66bb6a",
    description: "+0.5s timer per point",
    detail: "Tambah waktu menjawab soal di battle.",
  },
  luck: {
    name: "LUCK",
    icon: "🍀",
    color: "#ffd54f",
    description: "+3% crit chance per point",
    detail: "Naikin peluang critical hit (2x damage).",
  },
} as const;

export function HeroScreen() {
  const { player, stats, setView } = useGame();

  useEffect(() => {
    audio.resume();
    audio.playMusic("world");
  }, []);

  const playerEffect = computePlayerStatsEffect({
    atk: player.atk,
    def: player.def,
    spd: player.spd,
    luck: player.luck,
    maxHp: player.maxHp,
    equippedAbilities: player.equippedAbilities,
  });

  const equippedAbilities = player.equippedAbilities
    .map((id) => ITEMS[id])
    .filter(Boolean);

  const ownedAbilities = player.items
    .filter((id) => ITEMS[id]?.type === "ability")
    .map((id) => ITEMS[id])
    .filter(Boolean);

  const ownedConsumables = player.items
    .filter((id) => ITEMS[id]?.type === "consumable" && ITEMS[id].price > 0)
    .map((id) => ({ def: ITEMS[id], count: player.itemCounts[id] || 0 }))
    .filter((x) => x.count > 0);

  const winRate =
    stats.totalCorrect + stats.totalWrong > 0
      ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalWrong)) * 100)
      : 0;

  return (
    <div
      className="min-h-screen px-4 py-6 kq-grid-bg"
      style={{
        background:
          "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
            🧙 HERO
          </h2>
          <p className="font-vt text-base text-white/80">
            Character sheet - lihat semua stats & koleksi
          </p>
        </div>

        {/* Hero portrait card */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div
              className="w-24 h-24 shrink-0 flex items-center justify-center"
              style={{
                background: "var(--kq-accent)",
                border: "4px solid var(--kq-panel-border)",
              }}
            >
              <img
                src="/sprites/hero.png"
                alt="Hero"
                width={80}
                height={80}
                style={{ imageRendering: "pixelated" }}
                draggable={false}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-pixel text-base mb-1"
                style={{ color: "var(--kq-panel-border)" }}
              >
                {player.name}
              </div>
              <div className="font-vt text-base text-black/80 mb-2">
                Level {player.level} Hero
              </div>
              <div className="grid grid-cols-2 gap-2 font-pixel text-[0.45rem]">
                <div className="p-1.5 text-center" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                  <div className="text-black/60">XP</div>
                  <div className="text-sm text-black">
                    {player.xp}/{player.xpToNext}
                  </div>
                </div>
                <div className="p-1.5 text-center" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                  <div className="text-black/60">HP</div>
                  <div className="text-sm text-black">
                    {player.hp}/{playerEffect.effectiveMaxHp}
                  </div>
                </div>
                <div className="p-1.5 text-center" style={{ background: "var(--kq-accent)", border: "2px solid var(--kq-panel-border)" }}>
                  <div className="text-black/70">KOIN</div>
                  <div className="text-sm text-black">{player.coins}</div>
                </div>
                <div className="p-1.5 text-center" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                  <div className="text-black/60">STAT PTS</div>
                  <div className="text-sm text-black">
                    {player.statPoints > 0 ? (
                      <span style={{ color: "var(--kq-attack)" }} className="kq-blink">
                        {player.statPoints}!
                      </span>
                    ) : (
                      "0"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PixelPanel>

        {/* Detailed Stats */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            📊 STATS DETAIL
          </h3>
          <div className="space-y-3">
            {(["atk", "def", "spd", "luck"] as const).map((stat) => {
              const info = STAT_INFO[stat];
              const value = player[stat];
              // Cap visualization at 20 for bar width
              const pct = Math.min(100, (value / 20) * 100);
              return (
                <div key={stat} className="flex items-center gap-3">
                  <span className="text-2xl shrink-0">{info.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-0.5">
                      <span
                        className="font-pixel text-[0.55rem]"
                        style={{ color: info.color }}
                      >
                        {info.name}
                      </span>
                      <span
                        className="font-pixel text-sm"
                        style={{ color: "var(--kq-panel-border)" }}
                      >
                        {value}
                      </span>
                    </div>
                    <div className="font-vt text-xs text-black/70 mb-1">
                      {info.detail}
                    </div>
                    <div
                      className="h-2"
                      style={{
                        background: "var(--kq-panel-2)",
                        border: "1px solid var(--kq-panel-border)",
                      }}
                    >
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: info.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <PixelDivider />
          {/* Computed effects */}
          <div className="grid grid-cols-2 gap-2 mt-3 font-vt text-sm">
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60">DMG MULT</div>
              <div className="text-black">
                {(playerEffect.damageMult * 100).toFixed(0)}%
              </div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60">DMG REDUC</div>
              <div className="text-black">
                {(playerEffect.damageReduction * 100).toFixed(0)}%
              </div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60">TIMER BONUS</div>
              <div className="text-black">+{playerEffect.timerBonus.toFixed(1)}s</div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60">CRIT CHANCE</div>
              <div className="text-black">
                {(playerEffect.critChance * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </PixelPanel>

        {/* Equipped Abilities */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🎭 ABILITY TERPASANG ({player.equippedAbilities.length}/3)
          </h3>
          {equippedAbilities.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Belum ada ability terpasang.{" "}
              <button
                onClick={() => {
                  audio.click();
                  setView("stats");
                }}
                className="underline text-black hover:opacity-70"
              >
                Pasang di Stats →
              </button>
            </p>
          ) : (
            <div className="space-y-2">
              {equippedAbilities.map((def) => {
                const perk = def.perk as AbilityPerk;
                const info = PERK_INFO[perk];
                return (
                  <div
                    key={def.id}
                    className="p-2 flex items-center gap-3"
                    style={{
                      background: info?.color || "var(--kq-accent)",
                      border: "2px solid var(--kq-panel-border)",
                    }}
                  >
                    <span className="text-2xl shrink-0">{def.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-pixel text-[0.55rem] text-white truncate">
                        {def.name}
                      </div>
                      <div className="font-vt text-sm text-white/90">
                        {def.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PixelPanel>

        {/* Owned Abilities Collection */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🎒 KOLEKSI ABILITY ({ownedAbilities.length})
          </h3>
          {ownedAbilities.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Belum punya ability.{" "}
              <button
                onClick={() => {
                  audio.click();
                  setView("shop");
                }}
                className="underline text-black hover:opacity-70"
              >
                Beli di Toko →
              </button>
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {ownedAbilities.map((def) => {
                const isEquipped = player.equippedAbilities.includes(def.id);
                return (
                  <div
                    key={def.id}
                    className="aspect-square flex flex-col items-center justify-center p-1"
                    style={{
                      background: isEquipped
                        ? "var(--kq-correct)"
                        : "var(--kq-panel-2)",
                      border: `2px solid ${isEquipped ? "var(--kq-correct)" : "var(--kq-panel-border)"}`,
                      opacity: isEquipped ? 1 : 0.7,
                    }}
                    title={def.name + ": " + def.description}
                  >
                    <span className="text-2xl">{def.icon}</span>
                    {isEquipped && (
                      <span className="font-pixel text-[0.35rem] text-white">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </PixelPanel>

        {/* Consumables Inventory */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🧪 RAMUAN ({ownedConsumables.length})
          </h3>
          {ownedConsumables.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Tas ramuan kosong. Beli dari Toko.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ownedConsumables.map(({ def, count }) => (
                <div
                  key={def.id}
                  className="p-2 flex items-center gap-2"
                  style={{
                    background: "var(--kq-panel-2)",
                    border: "2px solid var(--kq-panel-border)",
                  }}
                >
                  <span className="text-xl shrink-0">{def.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel text-[0.45rem] text-black truncate">
                      {def.name}
                    </div>
                    <div className="font-vt text-xs text-black/70">
                      x{count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </PixelPanel>

        {/* Battle Statistics */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            📈 STATISTIK BATTLE
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3" style={{ background: "var(--kq-correct)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/70 text-center">JAWABAN BENAR</div>
              <div className="font-pixel text-2xl text-black text-center">{stats.totalCorrect}</div>
            </div>
            <div className="p-3" style={{ background: "var(--kq-attack)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-white/90 text-center">JAWABAN SALAH</div>
              <div className="font-pixel text-2xl text-white text-center">{stats.totalWrong}</div>
            </div>
            <div className="p-3" style={{ background: "var(--kq-accent)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/70 text-center">AKURASI</div>
              <div className="font-pixel text-2xl text-black text-center">{winRate}%</div>
            </div>
            <div className="p-3" style={{ background: "var(--kq-n3)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-white/90 text-center">BEST COMBO</div>
              <div className="font-pixel text-2xl text-white text-center">{stats.bestCombo}x</div>
            </div>
            <div className="p-3" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60 text-center">STAGE CLEARED</div>
              <div className="font-pixel text-2xl text-black text-center">{stats.stagesCleared}</div>
            </div>
            <div className="p-3" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60 text-center">BOS DIKALAHKAN</div>
              <div className="font-pixel text-2xl text-black text-center">{stats.bossesDefeated}</div>
            </div>
            <div className="p-3" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60 text-center">PERFECT STAGE</div>
              <div className="font-pixel text-2xl text-black text-center">{stats.perfectStages}</div>
            </div>
            <div className="p-3" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60 text-center">ITEM DIPAKAI</div>
              <div className="font-pixel text-2xl text-black text-center">{stats.totalItemsUsed}</div>
            </div>
          </div>
        </PixelPanel>

        {/* Badges */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🏆 BADGE ({player.badges.length})
          </h3>
          {player.badges.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Belum ada badge. Kalahkan mini-boss & boss untuk mendapatkannya.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {player.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-2 py-1"
                  style={{
                    background: "var(--kq-accent)",
                    border: "2px solid var(--kq-panel-border)",
                  }}
                >
                  <span className="font-pixel text-[0.5rem] text-black">
                    🏅 {badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </PixelPanel>

        {/* Quick links */}
        <div className="flex gap-2 justify-center flex-wrap">
          <PixelButton
            size="sm"
            onClick={() => {
              audio.click();
              setView("stats");
            }}
          >
            ⚙ Upgrade Stats
          </PixelButton>
          <PixelButton
            size="sm"
            onClick={() => {
              audio.click();
              setView("shop");
            }}
          >
            🏪 Toko
          </PixelButton>
          <PixelButton
            size="sm"
            onClick={() => {
              audio.click();
              setView("achievements");
            }}
          >
            🏆 Achievement
          </PixelButton>
        </div>

        <div className="text-center mt-6">
          <PixelButton
            size="sm"
            onClick={() => {
              audio.click();
              setView("world-map");
            }}
          >
            ← KEMBALI
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
