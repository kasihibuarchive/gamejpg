"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { WORLDS } from "@/lib/game/worlds";
import { PixelButton, PixelPanel } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import type { WorldId } from "@/lib/game/types";

export function WorldMap() {
  const {
    setView,
    selectWorld,
    player,
    soundEnabled,
  } = useGame();

  useEffect(() => {
    if (soundEnabled) {
      audio.resume();
      audio.playMusic("world");
    }
  }, [soundEnabled]);

  const enterWorld = (id: WorldId, locked: boolean) => {
    if (locked) {
      audio.wrong();
      return;
    }
    audio.click();
    selectWorld(id);
    setView("stage-select");
  };

  return (
    <div
      className="min-h-screen px-4 py-6 md:py-8 kq-grid-bg"
      style={{
        background:
          "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className="font-pixel text-xl md:text-2xl mb-2 kq-text-outline"
            style={{ color: "var(--kq-accent)" }}
          >
            🗺 PETA DUNIA
          </h2>
          <p className="font-vt text-lg text-white/80">
            Pilih wilayah untuk memulai petualanganmu
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 flex-wrap font-vt text-base text-white/60">
            <span>🏆 Badge: {player.badges.length}</span>
            <span>🎒 Item: {player.items.length}</span>
            <span>⭐ Total XP: {player.xp + (player.level - 1) * 100}</span>
          </div>
        </div>

        {/* World cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WORLDS.map((world, idx) => {
            const isUnlocked = player.unlockedWorlds.includes(world.id);
            const isCurrent = isUnlocked;
            const completedCount = player.completedStages.filter((sid) =>
              sid.startsWith(world.id + "-"),
            ).length;
            const isFullyComplete = completedCount >= world.stageCount;

            return (
              <button
                key={world.id}
                onClick={() => enterWorld(world.id, !isUnlocked)}
                onMouseEnter={() => audio.hover()}
                className="group text-left transition-transform hover:-translate-y-1 focus:outline-none"
                aria-label={`Masuki ${world.name}`}
                aria-disabled={!isUnlocked}
              >
                <PixelPanel
                  className={`p-0 overflow-hidden h-full ${isUnlocked ? "" : "opacity-60 grayscale"}`}
                  variant="light"
                >
                  {/* World header banner */}
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{
                      background: isUnlocked
                        ? world.color
                        : "var(--kq-muted)",
                      borderBottom: "4px solid var(--kq-panel-border)",
                    }}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="text-2xl md:text-3xl shrink-0"
                        style={{
                          filter: isUnlocked
                            ? "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))"
                            : "none",
                        }}
                      >
                        {isUnlocked ? world.icon : "🔒"}
                      </span>
                      <div className="min-w-0">
                        <div
                          className="font-pixel text-[0.55rem] mb-0.5"
                          style={{ color: "var(--kq-panel-border)" }}
                        >
                          CHAPTER {idx + 1} · {world.levelName}
                        </div>
                        <div
                          className="font-pixel text-[0.7rem] truncate"
                          style={{ color: "var(--kq-panel-border)" }}
                        >
                          {world.name}
                        </div>
                      </div>
                    </div>
                    {isFullyComplete && (
                      <span
                        className="font-pixel text-[0.5rem] px-2 py-1 shrink-0"
                        style={{
                          background: "var(--kq-panel-border)",
                          color: "var(--kq-accent)",
                        }}
                      >
                        ✓ CLEAR
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div
                      className="font-vt text-xl mb-2"
                      style={{ color: world.colorDark }}
                    >
                      {world.nameJp}
                    </div>
                    <p className="font-vt text-base text-black/80 mb-3 leading-snug">
                      {world.tagline}
                    </p>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between mb-1">
                        <span className="font-pixel text-[0.45rem] text-black/70">
                          PROGRES
                        </span>
                        <span
                          className="font-pixel text-[0.5rem] text-black"
                        >
                          {completedCount}/{world.stageCount}
                        </span>
                      </div>
                      <div
                        className="h-2 border-2"
                        style={{
                          borderColor: "var(--kq-panel-border)",
                          background: "var(--kq-panel-2)",
                        }}
                      >
                        <div
                          style={{
                            width: `${(completedCount / world.stageCount) * 100}%`,
                            height: "100%",
                            background: world.color,
                            transition: "width 0.3s steps(10)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Description preview */}
                    <p className="font-vt text-sm text-black/70 line-clamp-2">
                      {world.description}
                    </p>

                    {/* Status / CTA */}
                    <div className="mt-3 pt-3 border-t-2 border-dashed border-black/30">
                      {isUnlocked ? (
                        <span
                          className="font-pixel text-[0.55rem] group-hover:opacity-70"
                          style={{ color: world.colorDark }}
                        >
                          ▶ MASUKI WILAYAH INI
                        </span>
                      ) : (
                        <span className="font-pixel text-[0.55rem] text-black/50">
                          🔒 Terkunci - selesaikan bab sebelumnya
                        </span>
                      )}
                    </div>
                  </div>
                </PixelPanel>
              </button>
            );
          })}
        </div>

        {/* Footer with back to title */}
        <div className="text-center mt-8">
          <PixelButton size="sm" onClick={() => {
            audio.click();
            setView("title");
          }}>
            ← Kembali ke Judul
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
