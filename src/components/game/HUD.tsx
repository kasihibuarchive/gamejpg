"use client";

import { useState, useRef, useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { audio } from "@/lib/game/audio";

const MENU_ITEMS = [
  { id: "hero", icon: "🧙", label: "Hero", desc: "Character sheet" },
  { id: "stats", icon: "⚙", label: "Stats & Ability", desc: "Upgrade & equip" },
  { id: "shop", icon: "🏪", label: "Toko", desc: "Beli ramuan & ability" },
  { id: "endless", icon: "♾", label: "Endless Mode", desc: "Latihan vocab tanpa henti" },
  { id: "vocabbook", icon: "📚", label: "Vocab Book", desc: "Kamus vocab terkumpul" },
  { id: "practice", icon: "🎯", label: "Latihan", desc: "Review soal" },
  { id: "achievements", icon: "🏆", label: "Achievement", desc: "Goals & stats" },
  { id: "codex", icon: "📜", label: "Codex", desc: "Kana & item" },
] as const;

export function HUD() {
  const {
    player,
    soundEnabled,
    crtEnabled,
    toggleSound,
    toggleCrt,
    setView,
    view,
  } = useGame();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  // Don't show full HUD on title screen
  if (view === "title") return null;

  const handleMenuClick = (targetView: typeof MENU_ITEMS[number]["id"]) => {
    audio.click();
    setView(targetView as any);
    setMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 px-3 py-2 md:px-4 md:py-2"
      style={{
        background: "var(--kq-bg-2)",
        borderBottom: "4px solid var(--kq-panel-border)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center gap-2 md:gap-3 flex-wrap">
        {/* Logo / Title - clickable to world map */}
        <button
          onClick={() => {
            audio.click();
            setView("world-map");
          }}
          className="flex items-center gap-1 md:gap-2 shrink-0"
          aria-label="Kembali ke peta dunia"
        >
          <span
            className="font-pixel text-xs md:text-sm"
            style={{
              color: "var(--kq-accent)",
              textShadow: "2px 2px 0 var(--kq-panel-border)",
            }}
          >
            ことば
          </span>
          <span
            className="font-pixel text-xs md:text-sm"
            style={{ color: "var(--kq-fg)" }}
          >
            QUEST
          </span>
        </button>

        {/* Player quick stats - compact */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Level badge */}
          <div
            className="px-2 py-1 shrink-0 text-center"
            style={{
              background: "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
            }}
          >
            <div className="font-pixel text-[0.4rem] text-white/70">LV</div>
            <div className="font-pixel text-xs text-white">{player.level}</div>
          </div>

          {/* HP bar - compact */}
          <div className="min-w-0 flex-1 max-w-[140px]">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="font-pixel text-[0.4rem] text-white/70">HP</span>
              <div
                className="flex-1 h-2"
                style={{
                  background: "var(--kq-bg-3)",
                  border: "1px solid var(--kq-fg)",
                }}
              >
                <div
                  style={{
                    width: `${(player.hp / player.maxHp) * 100}%`,
                    height: "100%",
                    background: "var(--kq-hp)",
                  }}
                />
              </div>
            </div>
            <div className="font-vt text-xs text-white/80 leading-none">
              {player.hp}/{player.maxHp} HP
            </div>
          </div>

          {/* Coins - compact */}
          <div
            className="px-2 py-1 shrink-0 flex items-center gap-1"
            style={{
              background: "var(--kq-accent)",
              border: "2px solid var(--kq-panel-border)",
            }}
          >
            <span className="text-xs">💰</span>
            <span className="font-pixel text-[0.5rem] text-black">
              {player.coins}
            </span>
          </div>
        </div>

        {/* MENU BUTTON - opens dropdown */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => {
              audio.click();
              setMenuOpen(!menuOpen);
            }}
            className="px-3 py-2 flex items-center gap-2"
            style={{
              background: menuOpen ? "var(--kq-accent)" : "var(--kq-n3)",
              border: "2px solid var(--kq-fg)",
              color: "white",
            }}
            aria-label="Buka menu"
            aria-expanded={menuOpen}
          >
            <span className="font-pixel text-[0.6rem]">☰ MENU</span>
            {player.statPoints > 0 && (
              <span
                className="font-pixel text-[0.4rem] px-1 py-0.5 kq-blink"
                style={{
                  background: "var(--kq-attack)",
                  color: "white",
                  border: "1px solid white",
                }}
              >
                {player.statPoints}
              </span>
            )}
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-1 min-w-[220px] z-50 kq-pop"
              style={{
                background: "var(--kq-panel)",
                border: "4px solid var(--kq-panel-border)",
                boxShadow:
                  "0 0 0 4px var(--kq-panel), 0 0 0 8px var(--kq-panel-border), 6px 6px 0 rgba(0,0,0,0.5)",
              }}
            >
              {/* Menu items */}
              {MENU_ITEMS.map((item) => {
                const isActive = view === item.id;
                const showBadge = item.id === "stats" && player.statPoints > 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:opacity-90"
                    style={{
                      background: isActive
                        ? "var(--kq-accent)"
                        : "transparent",
                      borderBottom: "2px solid var(--kq-panel-border)",
                      color: "var(--kq-panel-border)",
                    }}
                  >
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-pixel text-[0.55rem] truncate">
                        {item.label}
                      </div>
                      <div className="font-vt text-xs text-black/60 truncate">
                        {item.desc}
                      </div>
                    </div>
                    {showBadge && (
                      <span
                        className="font-pixel text-[0.4rem] px-1.5 py-0.5 kq-blink shrink-0"
                        style={{
                          background: "var(--kq-attack)",
                          color: "white",
                          border: "1px solid var(--kq-panel-border)",
                        }}
                      >
                        {player.statPoints} PTS
                      </span>
                    )}
                    {isActive && (
                      <span className="font-pixel text-[0.5rem] shrink-0">✓</span>
                    )}
                  </button>
                );
              })}

              {/* Settings row */}
              <div
                className="flex items-center gap-2 px-3 py-2"
                style={{
                  background: "var(--kq-panel-2)",
                  borderBottom: "2px solid var(--kq-panel-border)",
                }}
              >
                <span className="font-pixel text-[0.5rem] text-black/70 shrink-0">
                  ⚙ SETTING:
                </span>
                <button
                  onClick={() => {
                    audio.click();
                    toggleSound();
                    audio.setMuted(soundEnabled);
                  }}
                  className="px-2 py-1 flex items-center gap-1"
                  style={{
                    background: soundEnabled
                      ? "var(--kq-correct)"
                      : "var(--kq-muted)",
                    border: "2px solid var(--kq-panel-border)",
                  }}
                  title={soundEnabled ? "Sound: ON" : "Sound: OFF"}
                >
                  <span className="text-sm">{soundEnabled ? "🔊" : "🔇"}</span>
                  <span className="font-pixel text-[0.4rem] text-black">
                    {soundEnabled ? "ON" : "OFF"}
                  </span>
                </button>
                <button
                  onClick={() => {
                    audio.click();
                    toggleCrt();
                  }}
                  className={`px-2 py-1 flex items-center gap-1 ${crtEnabled ? "" : "opacity-50"}`}
                  style={{
                    background: crtEnabled
                      ? "var(--kq-n4)"
                      : "var(--kq-muted)",
                    border: "2px solid var(--kq-panel-border)",
                  }}
                  title="CRT Effect"
                >
                  <span className="text-sm">📺</span>
                  <span className="font-pixel text-[0.4rem] text-black">
                    {crtEnabled ? "ON" : "OFF"}
                  </span>
                </button>
              </div>

              {/* World map shortcut */}
              <button
                onClick={() => {
                  audio.click();
                  setView("world-map");
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:opacity-90"
                style={{
                  background: "var(--kq-bg-2)",
                  color: "var(--kq-accent)",
                }}
              >
                <span className="text-xl shrink-0">🗺</span>
                <span className="font-pixel text-[0.55rem]">PETA DUNIA</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
