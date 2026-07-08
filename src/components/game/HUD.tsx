"use client";

import { useGame } from "@/lib/game/store";
import { StatBar } from "./PixelUI";
import { audio } from "@/lib/game/audio";

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

  // Don't show full HUD on title screen (handled separately)
  if (view === "title") return null;

  return (
    <header
      className="sticky top-0 z-50 px-2 py-2 md:px-4 md:py-2"
      style={{
        background: "var(--kq-bg-2)",
        borderBottom: "4px solid var(--kq-panel-border)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center gap-2 md:gap-3 flex-wrap">
        {/* Logo / Title */}
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

        {/* Player info */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
          <div
            className="px-2 py-1 shrink-0"
            style={{
              background: "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
            }}
          >
            <div className="font-pixel text-[0.4rem] text-center opacity-70 text-white">
              LV
            </div>
            <div className="font-pixel text-xs md:text-sm text-center text-white">
              {player.level}
            </div>
          </div>

          <div className="min-w-0 flex-1 max-w-[120px] md:max-w-xs">
            <div className="font-vt text-sm md:text-base leading-none mb-0.5 truncate text-white">
              {player.name}
            </div>
            <StatBar
              current={player.hp}
              max={player.maxHp}
              color="var(--kq-hp)"
              label="HP"
              height={8}
              showNumbers={false}
            />
          </div>

          <div className="hidden sm:block min-w-[70px] max-w-[100px]">
            <StatBar
              current={player.xp}
              max={player.xpToNext}
              color="var(--kq-xp)"
              label="XP"
              height={8}
              showNumbers={false}
            />
          </div>

          {/* Coins */}
          <div
            className="px-2 py-1 shrink-0 flex items-center gap-1"
            style={{
              background: "var(--kq-accent)",
              border: "2px solid var(--kq-panel-border)",
            }}
          >
            <span className="text-xs md:text-sm">💰</span>
            <span
              className="font-pixel text-[0.55rem] md:text-xs text-black"
            >
              {player.coins}
            </span>
          </div>
        </div>

        {/* Quick actions - shop, achievements, practice, codex */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              audio.click();
              setView("practice");
            }}
            className="p-2 hover:opacity-80"
            style={{
              background:
                view === "practice" ? "var(--kq-accent)" : "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
              color: view === "practice" ? "black" : "var(--kq-fg)",
            }}
            aria-label="Mode Latihan"
            title="Mode Latihan"
          >
            <span className="font-pixel text-[0.5rem]">🎯</span>
          </button>
          <button
            onClick={() => {
              audio.click();
              setView("shop");
            }}
            className="p-2 hover:opacity-80"
            style={{
              background:
                view === "shop" ? "var(--kq-accent)" : "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
              color: view === "shop" ? "black" : "var(--kq-fg)",
            }}
            aria-label="Toko"
            title="Toko Ramuan"
          >
            <span className="font-pixel text-[0.5rem]">🏪</span>
          </button>
          <button
            onClick={() => {
              audio.click();
              setView("achievements");
            }}
            className="p-2 hover:opacity-80"
            style={{
              background:
                view === "achievements"
                  ? "var(--kq-accent)"
                  : "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
              color: view === "achievements" ? "black" : "var(--kq-fg)",
            }}
            aria-label="Achievement"
            title="Achievement"
          >
            <span className="font-pixel text-[0.5rem]">🏆</span>
          </button>
          <button
            onClick={() => {
              audio.click();
              setView("codex");
            }}
            className="p-2 hover:opacity-80"
            style={{
              background:
                view === "codex" ? "var(--kq-accent)" : "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
              color: view === "codex" ? "black" : "var(--kq-fg)",
            }}
            aria-label="Codex"
            title="Codex"
          >
            <span className="font-pixel text-[0.5rem]">📜</span>
          </button>
          <button
            onClick={() => {
              audio.click();
              toggleSound();
              audio.setMuted(soundEnabled);
            }}
            className="p-2 hover:opacity-80"
            style={{
              background: "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
              color: "var(--kq-fg)",
            }}
            aria-label="Toggle sound"
            title={soundEnabled ? "Sound: ON" : "Sound: OFF"}
          >
            <span className="font-pixel text-[0.5rem]">
              {soundEnabled ? "🔊" : "🔇"}
            </span>
          </button>
          <button
            onClick={() => {
              audio.click();
              toggleCrt();
            }}
            className="p-2 hover:opacity-80 hidden sm:block"
            style={{
              background: "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
              color: "var(--kq-fg)",
            }}
            aria-label="Toggle CRT effect"
            title="CRT Effect"
          >
            <span className="font-pixel text-[0.5rem]">📺</span>
          </button>
        </div>
      </div>
    </header>
  );
}
