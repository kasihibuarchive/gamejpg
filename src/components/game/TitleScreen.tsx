"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/game/store";
import { PixelButton } from "./PixelUI";
import { audio } from "@/lib/game/audio";

export function TitleScreen() {
  const { setView, player, resetPlayer, soundEnabled } = useGame();
  const [showReset, setShowReset] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    if (soundEnabled) {
      audio.resume();
      audio.playMusic("title");
    }
    return () => {
      // music keeps playing into world-map etc.
    };
  }, [soundEnabled]);

  useEffect(() => {
    const i = setInterval(() => setBlink((b) => !b), 700);
    return () => clearInterval(i);
  }, []);

  const hasProgress = player.completedStages.length > 0;

  const startGame = () => {
    audio.click();
    setView("world-map");
  };

  const newGame = () => {
    audio.click();
    if (hasProgress) {
      setShowReset(true);
    } else {
      resetPlayer();
      setView("world-map");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 kq-grid-bg"
      style={{
        background:
          "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
      }}
    >
      {/* Floating decorative sprites */}
      <div
        className="absolute top-10 left-6 text-4xl opacity-40 kq-float"
        style={{ animationDelay: "0s" }}
      >
        🍃
      </div>
      <div
        className="absolute top-20 right-10 text-4xl opacity-40 kq-float"
        style={{ animationDelay: "0.4s" }}
      >
        ⭐
      </div>
      <div
        className="absolute bottom-20 left-12 text-4xl opacity-40 kq-float"
        style={{ animationDelay: "0.8s" }}
      >
        🌙
      </div>
      <div
        className="absolute bottom-32 right-16 text-4xl opacity-40 kq-float"
        style={{ animationDelay: "1.2s" }}
      >
        🗡️
      </div>

      {/* Logo block */}
      <div className="text-center mb-8 kq-pop">
        <div
          className="font-pixel text-2xl md:text-4xl mb-3 kq-text-outline"
          style={{ color: "var(--kq-accent)" }}
        >
          ことば
        </div>
        <h1
          className="font-pixel text-4xl md:text-6xl kq-text-outline"
          style={{ color: "var(--kq-fg)" }}
        >
          KOTOBA
          <span style={{ color: "var(--kq-accent)" }}>QUEST</span>
        </h1>
        <div className="mt-4 flex items-center justify-center gap-3">
          <span
            style={{
              height: 2,
              width: 40,
              background: "var(--kq-accent)",
            }}
          />
          <p className="font-vt text-lg md:text-xl text-white/80">
            Petualangan RPG 8-bit Belajar Bahasa Jepang
          </p>
          <span
            style={{
              height: 2,
              width: 40,
              background: "var(--kq-accent)",
            }}
          />
        </div>
        <p
          className="font-pixel text-[0.55rem] md:text-[0.7rem] mt-4 text-white/60"
          style={{ letterSpacing: "0.15em" }}
        >
          DASAR · N5 · N4 · N3 · N2 · N1
        </p>
      </div>

      {/* Pixel scene illustration */}
      <div className="mb-10 relative">
        <div
          className="flex items-end justify-center gap-2 md:gap-4"
          style={{ filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.5))" }}
        >
          {/* Hero sprite */}
          <div
            className="kq-bob"
            style={{ animationDelay: "0s" }}
          >
            <img
              src="/sprites/hero.png"
              alt="Hero"
              width={96}
              height={96}
              className="md:!w-[140px] md:!h-[140px]"
              style={{ imageRendering: "pixelated", width: 96, height: 96 }}
              draggable={false}
            />
          </div>
          {/* VS */}
          <div
            className="font-pixel text-base md:text-xl kq-rainbow"
            style={{ marginBottom: "0.5rem" }}
          >
            VS
          </div>
          {/* Enemy */}
          <div
            className="kq-bob"
            style={{ animationDelay: "0.7s" }}
          >
            <img
              src="/sprites/shadow_king.png"
              alt="Shadow King"
              width={96}
              height={96}
              className="md:!w-[140px] md:!h-[140px]"
              style={{ imageRendering: "pixelated", width: 96, height: 96 }}
              draggable={false}
            />
          </div>
        </div>
        {/* Ground shadow */}
        <div
          className="mx-auto mt-1"
          style={{
            width: 280,
            height: 8,
            background:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 4px, transparent 4px 8px)",
          }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col items-center gap-3">
        {hasProgress ? (
          <>
            <PixelButton
              variant="accent"
              size="lg"
              onClick={startGame}
              className="kq-pulse-glow"
            >
              ▶ Lanjutkan Petualangan
            </PixelButton>
            <div className="font-vt text-base text-white/70 mt-1">
              Hero <span className="text-white">{player.name}</span> · LV{" "}
              <span className="text-white">{player.level}</span> ·{" "}
              {player.completedStages.length} stage selesai
            </div>
            <button
              onClick={() => {
                audio.click();
                setShowReset(true);
              }}
              className="font-pixel text-[0.5rem] text-white/50 hover:text-white/80 mt-3 underline"
            >
              Mulai game baru (reset progres)
            </button>
          </>
        ) : (
          <PixelButton
            variant="accent"
            size="lg"
            onClick={newGame}
            className="kq-pulse-glow"
          >
            ▶ Mulai Petualangan
          </PixelButton>
        )}

        <div
          className={`font-vt text-base text-white/60 mt-6 ${blink ? "opacity-100" : "opacity-0"}`}
        >
          ▼ Tekan tombol untuk memulai ▼
        </div>
      </div>

      {/* Footer credits */}
      <div className="mt-12 text-center">
        <p className="font-pixel text-[0.45rem] text-white/40">
          © 2026 KOTOBAQUEST · BERTUALANG · BELAJAR · MENAKLUKKAN
        </p>
      </div>

      {/* Reset confirmation modal */}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)" }}
          onClick={() => setShowReset(false)}
        >
          <div
            className="kq-panel p-6 max-w-sm w-full kq-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="font-pixel text-sm mb-3"
              style={{ color: "var(--kq-panel-border)" }}
            >
              ⚠ Mulai Game Baru?
            </h3>
            <p className="font-vt text-base mb-5 text-black">
              Semua progres ({player.completedStages.length} stage, level{" "}
              {player.level}) akan hilang permanen. Yakin?
            </p>
            <div className="flex gap-3 justify-end">
              <PixelButton
                size="sm"
                onClick={() => {
                  audio.click();
                  setShowReset(false);
                }}
              >
                Batal
              </PixelButton>
              <PixelButton
                size="sm"
                variant="danger"
                onClick={() => {
                  audio.click();
                  resetPlayer();
                  setShowReset(false);
                  setView("world-map");
                }}
              >
                Reset & Mulai
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
