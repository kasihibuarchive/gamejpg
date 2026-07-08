"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { ACHIEVEMENTS } from "@/lib/game/items";
import { PixelButton, PixelPanel, PixelDivider } from "./PixelUI";
import { audio } from "@/lib/game/audio";

export function Achievements() {
  const { player, stats, setView } = useGame();

  useEffect(() => {
    audio.resume();
  }, []);

  const unlocked = ACHIEVEMENTS.filter((a) =>
    player.achievements.includes(a.id),
  );
  const locked = ACHIEVEMENTS.filter(
    (a) => !player.achievements.includes(a.id),
  );
  const pct = Math.round(
    (unlocked.length / ACHIEVEMENTS.length) * 100,
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
            🏆 ACHIEVEMENT
          </h2>
          <p className="font-vt text-base text-white/80 mb-3">
            {unlocked.length}/{ACHIEVEMENTS.length} terbuka ({pct}%)
          </p>
          {/* Progress bar */}
          <div
            className="max-w-md mx-auto h-3"
            style={{
              background: "var(--kq-bg-2)",
              border: "2px solid var(--kq-fg)",
            }}
          >
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "var(--kq-accent)",
                transition: "width 0.3s steps(20)",
              }}
            />
          </div>
        </div>

        {/* Unlocked */}
        {unlocked.length > 0 && (
          <>
            <h3
              className="font-pixel text-sm mb-3"
              style={{ color: "var(--kq-correct)" }}
            >
              ✓ TERBUKA
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {unlocked.map((a) => (
                <div
                  key={a.id}
                  className="p-3 flex items-center gap-3 kq-pop"
                  style={{
                    background: "var(--kq-accent)",
                    border: "3px solid var(--kq-panel-border)",
                  }}
                >
                  <span className="text-3xl shrink-0">{a.icon}</span>
                  <div className="min-w-0">
                    <div className="font-pixel text-[0.55rem] text-black truncate">
                      {a.name}
                    </div>
                    <p className="font-vt text-sm text-black/80">
                      {a.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Locked */}
        {locked.length > 0 && (
          <>
            <PixelDivider char="🔒" />
            <h3
              className="font-pixel text-sm mb-3 mt-4"
              style={{ color: "var(--kq-muted)" }}
            >
              🔒 TERKUNCI
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {locked.map((a) => (
                <div
                  key={a.id}
                  className="p-3 flex items-center gap-3 opacity-60"
                  style={{
                    background: "var(--kq-bg-2)",
                    border: "3px solid var(--kq-muted)",
                  }}
                >
                  <span className="text-3xl shrink-0 grayscale">
                    {a.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="font-pixel text-[0.55rem] text-white/70 truncate">
                      {a.name}
                    </div>
                    <p className="font-vt text-sm text-white/60">
                      {a.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Game stats summary */}
        <PixelDivider />
        <PixelPanel variant="light" className="p-4 mt-6">
          <h3
            className="font-pixel text-sm mb-3"
            style={{ color: "var(--kq-panel-border)" }}
          >
            📊 STATISTIK PERMAINAN
          </h3>
          <div className="grid grid-cols-2 gap-3 font-vt text-base text-black">
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.45rem] text-black/60">JAWABAN BENAR</div>
              <div className="text-xl">{stats.totalCorrect}</div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.45rem] text-black/60">JAWABAN SALAH</div>
              <div className="text-xl">{stats.totalWrong}</div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.45rem] text-black/60">BEST COMBO</div>
              <div className="text-xl">{stats.bestCombo}x</div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.45rem] text-black/60">STAGE CLEARED</div>
              <div className="text-xl">{stats.stagesCleared}</div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.45rem] text-black/60">BOS DIKALAHKAN</div>
              <div className="text-xl">{stats.bossesDefeated}</div>
            </div>
            <div className="p-2" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.45rem] text-black/60">PERFECT STAGE</div>
              <div className="text-xl">{stats.perfectStages}</div>
            </div>
          </div>
        </PixelPanel>

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
