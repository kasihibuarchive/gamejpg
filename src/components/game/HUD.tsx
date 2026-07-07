"use client";

import { useGame } from "@/lib/game/store";
import { StatBar } from "./PixelUI";
import { audio } from "@/lib/game/audio";

export function HUD() {
  const { player, soundEnabled, crtEnabled, toggleSound, toggleCrt, setView } =
    useGame();

  return (
    <header
      className="sticky top-0 z-50 px-3 py-2 md:px-6 md:py-3"
      style={{
        background: "var(--kq-bg-2)",
        borderBottom: "4px solid var(--kq-panel-border)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
        {/* Logo / Title */}
        <button
          onClick={() => {
            audio.click();
            setView("world-map");
          }}
          className="flex items-center gap-2 shrink-0"
          aria-label="Kembali ke peta dunia"
        >
          <span
            className="font-pixel text-sm md:text-base"
            style={{
              color: "var(--kq-accent)",
              textShadow: "2px 2px 0 var(--kq-panel-border)",
            }}
          >
            ことば
          </span>
          <span
            className="font-pixel text-sm md:text-base"
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
            <div className="font-pixel text-[0.5rem] text-center opacity-70">
              LV
            </div>
            <div className="font-pixel text-sm text-center text-white">
              {player.level}
            </div>
          </div>

          <div className="min-w-0 flex-1 max-w-xs">
            <div className="font-vt text-base leading-none mb-0.5 truncate text-white">
              {player.name}
            </div>
            <StatBar
              current={player.hp}
              max={player.maxHp}
              color="var(--kq-hp)"
              label="HP"
              height={10}
            />
          </div>

          <div className="hidden sm:block min-w-[80px] max-w-[120px]">
            <StatBar
              current={player.xp}
              max={player.xpToNext}
              color="var(--kq-xp)"
              label="XP"
              height={10}
            />
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              audio.click();
              setView("codex");
            }}
            className="p-2 hover:opacity-80"
            style={{
              background: "var(--kq-bg-3)",
              border: "2px solid var(--kq-fg)",
              color: "var(--kq-fg)",
            }}
            aria-label="Codex / Inventory"
            title="Codex"
          >
            <span className="font-pixel text-[0.55rem]">📜</span>
          </button>
          <button
            onClick={() => {
              audio.click();
              toggleSound();
              audio.setMuted(soundEnabled); // if currently enabled, after toggle it's off
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
            <span className="font-pixel text-[0.55rem]">
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
            <span className="font-pixel text-[0.55rem]">📺</span>
          </button>
        </div>
      </div>
    </header>
  );
}
