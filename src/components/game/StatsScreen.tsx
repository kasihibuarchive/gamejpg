"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/game/store";
import { ITEMS, PERK_INFO } from "@/lib/game/items";
import { hasPerk } from "@/lib/game/enemy-ai";
import { PixelButton, PixelPanel, PixelDivider } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import type { AbilityPerk } from "@/lib/game/types";

const STAT_INFO = {
  atk: {
    name: "ATK",
    icon: "⚔",
    color: "#ef5350",
    description: "+10% damage per point",
    detail: "Naikin damage tiap serangan.",
  },
  def: {
    name: "DEF",
    icon: "🛡",
    color: "#4fc3f7",
    description: "-8% damage taken per point",
    detail: "Kurangi damage yang diterima.",
  },
  spd: {
    name: "SPD",
    icon: "👟",
    color: "#66bb6a",
    description: "+0.5s timer per point",
    detail: "Tambah waktu menjawab soal.",
  },
  luck: {
    name: "LUCK",
    icon: "🍀",
    color: "#ffd54f",
    description: "+3% crit chance per point",
    detail: "Naikin peluang critical hit 2x.",
  },
} as const;

export function StatsScreen() {
  const { player, setView, allocateStat, equipAbility, unequipAbility } = useGame();
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    audio.resume();
    audio.playMusic("world");
  }, []);

  const handleAllocate = (stat: "atk" | "def" | "spd" | "luck") => {
    if (player.statPoints <= 0) {
      audio.wrong();
      return;
    }
    audio.correct();
    allocateStat(stat);
    setFlash(stat);
    setTimeout(() => setFlash(null), 500);
  };

  const handleEquip = (itemId: string) => {
    audio.click();
    if (player.equippedAbilities.includes(itemId)) {
      unequipAbility(itemId);
    } else {
      const ok = equipAbility(itemId);
      if (!ok) {
        audio.wrong();
      } else {
        audio.correct();
      }
    }
  };

  // Player's owned abilities
  const ownedAbilities = player.items.filter(
    (id) => ITEMS[id]?.type === "ability",
  );

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
            ⚙ STATUS & ABILITY
          </h2>
          <p className="font-vt text-base text-white/80">
            Upgrade stats & pasang ability perk (maks 3)
          </p>
        </div>

        {/* Stat Points Banner */}
        <PixelPanel
          variant={player.statPoints > 0 ? "accent" : "light"}
          className="p-4 mb-5 text-center"
        >
          <div
            className="font-pixel text-sm mb-1"
            style={{ color: "var(--kq-panel-border)" }}
          >
            {player.statPoints > 0
              ? `✨ ${player.statPoints} STAT POINTS TERSEDIA!`
              : "✨ 0 STAT POINTS - naik level untuk dapat"}
          </div>
          <p className="font-vt text-sm text-black/70">
            Naik level = +3 stat points. Pilih stat untuk di-upgrade.
          </p>
        </PixelPanel>

        {/* Stat Allocation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {(["atk", "def", "spd", "luck"] as const).map((stat) => {
            const info = STAT_INFO[stat];
            const value = player[stat];
            const isFlash = flash === stat;
            return (
              <div
                key={stat}
                className={`p-4 ${isFlash ? "kq-pop" : ""}`}
                style={{
                  background: "var(--kq-panel)",
                  border: `4px solid ${info.color}`,
                  boxShadow: `0 0 0 4px var(--kq-panel), 0 0 0 8px ${info.color}, 4px 4px 0 rgba(0,0,0,0.4)`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{info.icon}</span>
                    <div>
                      <div
                        className="font-pixel text-[0.7rem]"
                        style={{ color: info.color }}
                      >
                        {info.name}
                      </div>
                      <div className="font-vt text-xs text-black/70">
                        {info.description}
                      </div>
                    </div>
                  </div>
                  <div
                    className="font-pixel text-2xl"
                    style={{ color: "var(--kq-panel-border)" }}
                  >
                    {value}
                  </div>
                </div>
                <button
                  onClick={() => handleAllocate(stat)}
                  disabled={player.statPoints <= 0}
                  className="kq-btn w-full text-sm"
                  style={{
                    background: player.statPoints > 0 ? info.color : "var(--kq-muted)",
                    color: "white",
                    opacity: player.statPoints > 0 ? 1 : 0.6,
                  }}
                >
                  + UPGRADE
                </button>
              </div>
            );
          })}
        </div>

        <PixelDivider char="🎭" />

        {/* Equipped Abilities */}
        <PixelPanel variant="light" className="p-4 mb-4 mt-4">
          <h3
            className="font-pixel text-sm mb-2 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🎭 ABILITY TERPASANG ({player.equippedAbilities.length}/3)
          </h3>
          {player.equippedAbilities.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Belum ada ability terpasang. Pilih dari koleksi di bawah.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {player.equippedAbilities.map((id) => {
                const def = ITEMS[id];
                if (!def) return null;
                const perk = def.perk as AbilityPerk;
                const info = PERK_INFO[perk];
                return (
                  <div
                    key={id}
                    className="p-2 text-center"
                    style={{
                      background: info?.color || "var(--kq-accent)",
                      border: "2px solid var(--kq-panel-border)",
                    }}
                  >
                    <div className="text-2xl mb-1">{def.icon}</div>
                    <div className="font-pixel text-[0.5rem] text-white truncate">
                      {def.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PixelPanel>

        {/* Owned Abilities - Equip/Unequip */}
        <PixelPanel variant="light" className="p-4 mb-4">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🎒 KOLEKSI ABILITY ({ownedAbilities.length})
          </h3>
          {ownedAbilities.length === 0 ? (
            <p className="font-vt text-base text-black/60 mb-2">
              Belum punya ability. Beli dari 🏪 Toko Ramuan atau dapat dari stage bos!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ownedAbilities.map((id) => {
                const def = ITEMS[id];
                if (!def) return null;
                const perk = def.perk as AbilityPerk;
                const info = PERK_INFO[perk];
                const isEquipped = player.equippedAbilities.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => handleEquip(id)}
                    className="p-2 text-left transition-transform hover:-translate-y-0.5"
                    style={{
                      background: isEquipped
                        ? info?.color || "var(--kq-correct)"
                        : "var(--kq-panel-2)",
                      border: `3px solid ${info?.color || "var(--kq-panel-border)"}`,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl shrink-0">{def.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-pixel text-[0.55rem] truncate"
                          style={{
                            color: isEquipped ? "white" : "var(--kq-panel-border)",
                          }}
                        >
                          {def.name}
                        </div>
                        <div
                          className="font-vt text-xs truncate"
                          style={{
                            color: isEquipped ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.7)",
                          }}
                        >
                          {def.description}
                        </div>
                      </div>
                      {isEquipped ? (
                        <span className="font-pixel text-[0.5rem] text-white shrink-0">
                          ✓
                        </span>
                      ) : (
                        <span
                          className="font-pixel text-[0.4rem] shrink-0"
                          style={{ color: "var(--kq-panel-border)" }}
                        >
                          PASANG
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </PixelPanel>

        {/* Active Perks Summary */}
        {player.equippedAbilities.length > 0 && (
          <PixelPanel variant="light" className="p-4 mb-4">
            <h3
              className="font-pixel text-sm mb-2"
              style={{ color: "var(--kq-panel-border)" }}
            >
              ⚡ PERK AKTIF
            </h3>
            <ul className="space-y-1">
              {player.equippedAbilities.map((id) => {
                const def = ITEMS[id];
                const perk = def?.perk as AbilityPerk;
                const info = PERK_INFO[perk];
                if (!info) return null;
                return (
                  <li
                    key={id}
                    className="font-vt text-base flex items-center gap-2 text-black"
                  >
                    <span
                      className="inline-block w-3 h-3 shrink-0"
                      style={{ background: info.color }}
                    />
                    <strong>{info.name}:</strong> {info.description}
                  </li>
                );
              })}
            </ul>
          </PixelPanel>
        )}

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
