"use client";

import { useEffect, useState, useMemo } from "react";
import { useGame } from "@/lib/game/store";
import { getStage } from "@/lib/game/stages";
import { getWorld } from "@/lib/game/worlds";
import { PixelButton, PixelPanel, PixelSprite } from "./PixelUI";
import { getEnemySprite, getHeroSprite } from "@/lib/game/sprites";
import { audio } from "@/lib/game/audio";

/** Parse markdown-like inline bold (**text**) */
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIdx = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    parts.push(
      <strong key={key++} style={{ color: "var(--kq-accent)" }}>
        {match[1]}
      </strong>,
    );
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
}

export function StoryCutscene() {
  const { selectedStageId, setView, selectStage } = useGame();
  const stage = selectedStageId ? getStage(selectedStageId) : null;
  const world = stage ? getWorld(stage.worldId) : null;

  const [lineIdx, setLineIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showLesson, setShowLesson] = useState(false);

  // Reset when stage changes
  useEffect(() => {
    setLineIdx(0);
    setShowLesson(false);
  }, [selectedStageId]);

  // Typewriter effect
  const currentLine = stage?.intro[lineIdx] ?? "";
  useEffect(() => {
    if (showLesson) return;
    setDisplayedText("");
    setIsTyping(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(currentLine.slice(0, i));
      if (i >= currentLine.length) {
        setIsTyping(false);
        clearInterval(interval);
        // tiny blip on each line complete
        audio.click();
      }
    }, 18);
    return () => clearInterval(interval);
  }, [currentLine, showLesson]);

  const handleAdvance = () => {
    if (showLesson) return;

    if (isTyping) {
      // skip typewriter
      setDisplayedText(currentLine);
      setIsTyping(false);
      audio.click();
      return;
    }

    audio.click();
    if (lineIdx < stage!.intro.length - 1) {
      setLineIdx(lineIdx + 1);
    } else {
      // Intro done - show lesson OR go to battle
      if (stage!.lesson) {
        setShowLesson(true);
      } else {
        // direct battle (mini-boss / boss may have no lesson)
        setView("battle");
      }
    }
  };

  const startBattle = () => {
    audio.click();
    setView("battle");
  };

  const goBack = () => {
    audio.click();
    selectStage("");
    setView("stage-select");
  };

  // Determine "speaker" for the line - simple heuristic from line content
  const speaker = useMemo(() => {
    if (!currentLine) return null;
    if (currentLine.startsWith("**")) {
      // location header
      const m = currentLine.match(/^\*\*([^*]+)\*\*/);
      return { name: m?.[1] ?? "", isHeader: true };
    }
    if (currentLine.startsWith("「")) {
      // dialogue - extract speaker hint by checking known names
      if (currentLine.includes("Yuki")) return { name: "Yuki", isHeader: false };
      return { name: "???", isHeader: false };
    }
    if (currentLine.startsWith("Gardo") || currentLine.includes("Gardo"))
      return { name: "Gardo", isHeader: false };
    if (currentLine.includes("Rokku")) return { name: "Rokku", isHeader: false };
    if (currentLine.includes("Raja Bayangan"))
      return { name: "Raja Bayangan", isHeader: false };
    return { name: "Narator", isHeader: false };
  }, [currentLine]);

  if (!stage || !world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelButton onClick={() => setView("world-map")}>
          ← Kembali ke Peta
        </PixelButton>
      </div>
    );
  }

  // ===== LESSON VIEW =====
  if (showLesson && stage.lesson) {
    return (
      <div
        className="min-h-screen px-4 py-6"
        style={{
          background: `radial-gradient(ellipse at top, ${world.colorDark} 0%, var(--kq-bg) 70%)`,
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <div
              className="font-pixel text-[0.55rem] mb-2"
              style={{ color: world.color }}
            >
              📖 PELAJARAN · STAGE {String(stage.index).padStart(2, "0")}
            </div>
            <h2
              className="font-pixel text-lg md:text-xl kq-text-outline"
              style={{ color: "var(--kq-accent)" }}
            >
              {stage.lesson.title}
            </h2>
          </div>

          <PixelPanel variant="light" className="p-5 md:p-6">
            {/* Lesson rows - big kana cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5">
              {stage.lesson.rows.map((row, idx) => (
                <div
                  key={idx}
                  className="text-center p-3 kq-pop"
                  style={{
                    background: "var(--kq-panel-2)",
                    border: "3px solid var(--kq-panel-border)",
                    animationDelay: `${idx * 0.08}s`,
                  }}
                >
                  <div
                    className="font-gothic text-4xl md:text-5xl mb-2"
                    style={{ color: "var(--kq-panel-border)" }}
                  >
                    {row.kana}
                  </div>
                  <div
                    className="font-pixel text-[0.55rem] mb-1"
                    style={{ color: world.colorDark }}
                  >
                    {row.romaji}
                  </div>
                  {row.meaning && (
                    <div className="font-vt text-sm text-black/70">
                      {row.meaning}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Note */}
            {stage.lesson.note && (
              <div
                className="p-3 mb-5"
                style={{
                  background: "var(--kq-accent)",
                  border: "3px solid var(--kq-panel-border)",
                }}
              >
                <div className="font-pixel text-[0.5rem] mb-1 flex items-center gap-2">
                  💡 <span>CATATAN PENTING</span>
                </div>
                <p className="font-vt text-base text-black">
                  {stage.lesson.note}
                </p>
              </div>
            )}

            {/* Enemy preview */}
            <div
              className="p-3 mb-5"
              style={{
                background: "var(--kq-bg-2)",
                border: "3px solid var(--kq-panel-border)",
              }}
            >
              <div className="font-pixel text-[0.5rem] mb-2 text-white">
                ⚔ MUSUH YANG AKAN DIHADAPI:
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {stage.enemies.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-2 px-3 py-1"
                    style={{
                      background: "var(--kq-bg-3)",
                      border: "2px solid var(--kq-fg)",
                    }}
                  >
                    <PixelSprite src={getEnemySprite(e.id) || undefined} char={e.sprite} size={40} color={e.color} />
                    <div>
                      <div className="font-pixel text-[0.55rem] text-white">
                        {e.name}
                      </div>
                      <div className="font-vt text-xs text-white/70">
                        HP {e.hp} · ATK {e.attack}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="font-vt text-base text-black mb-3">
                Sudah siap? Jawab pertanyaan dengan benar untuk menyerang musuh!
              </p>
              <div className="flex gap-3 justify-center">
                <PixelButton size="sm" onClick={goBack}>
                  ← Mundur
                </PixelButton>
                <PixelButton
                  size="lg"
                  variant="danger"
                  onClick={startBattle}
                  className="kq-pulse-glow"
                >
                  ⚔ MULAI PERTARUNGAN
                </PixelButton>
              </div>
            </div>
          </PixelPanel>
        </div>
      </div>
    );
  }

  // ===== STORY DIALOGUE VIEW =====
  return (
    <div
      className="min-h-screen flex flex-col px-4 py-6 cursor-pointer"
      onClick={handleAdvance}
      style={{
        background: `radial-gradient(ellipse at top, ${world.colorDark} 0%, var(--kq-bg) 70%)`,
      }}
    >
      {/* Scene header */}
      <div className="max-w-3xl mx-auto w-full text-center mb-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            goBack();
          }}
          className="font-pixel text-[0.5rem] mb-2 inline-block hover:opacity-80"
          style={{ color: "var(--kq-fg)" }}
        >
          ← KELUAR
        </button>
        <div
          className="font-pixel text-[0.55rem] mb-1"
          style={{ color: world.color }}
        >
          {world.icon} {world.name}
        </div>
        <div className="font-pixel text-base md:text-lg kq-text-outline" style={{ color: "var(--kq-accent)" }}>
          STAGE {String(stage.index).padStart(2, "0")} · {stage.title}
        </div>
      </div>

      {/* Scene illustration - varies by stage */}
      <div className="flex-1 flex items-center justify-center max-w-3xl mx-auto w-full mb-6">
        <div className="relative w-full">
          {/* Background scene pixelated */}
          <div
            className="aspect-[16/9] w-full relative overflow-hidden"
            style={{
              background: `linear-gradient(to bottom, ${world.colorDark}33 0%, ${world.colorDark}66 60%, var(--kq-panel-border) 100%)`,
              border: "4px solid var(--kq-panel-border)",
              boxShadow: "0 0 0 4px var(--kq-fg)",
            }}
          >
            {/* Pixel sun/moon */}
            <div
              className="absolute top-4 right-6 text-3xl kq-float"
              style={{ filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))" }}
            >
              {stage.index >= 9 ? "🌕" : "🌅"}
            </div>
            {/* Pixel mountains/trees */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end opacity-70">
              {stage.type === "boss" ? (
                <>
                  <span className="text-5xl kq-bob" style={{ animationDelay: "0s" }}>🌲</span>
                  <span className="text-6xl kq-bob" style={{ animationDelay: "0.3s" }}>👑</span>
                  <span className="text-5xl kq-bob" style={{ animationDelay: "0.6s" }}>🌲</span>
                </>
              ) : stage.type === "mini-boss" ? (
                <>
                  <span className="text-4xl">⛰</span>
                  <span className="text-5xl kq-bob">🛡</span>
                  <span className="text-4xl">⛰</span>
                </>
              ) : (
                <>
                  <span className="text-4xl">🌲</span>
                  <span className="text-4xl">🏠</span>
                  <span className="text-4xl">🌲</span>
                </>
              )}
            </div>
            {/* Hero sprite always present */}
            <div
              className="absolute bottom-2 left-4 kq-bob"
              style={{ filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.4))" }}
            >
              <PixelSprite src={getHeroSprite()} char="🧙" size={48} />
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue box */}
      <div className="max-w-3xl mx-auto w-full">
        <PixelPanel variant="light" className="p-4 md:p-5 relative kq-arrow-down">
          {/* Speaker label */}
          {speaker && (
            <div className="mb-2 flex items-center gap-2">
              <span
                className="font-pixel text-[0.55rem] px-2 py-1"
                style={{
                  background: speaker.isHeader
                    ? "var(--kq-bg-2)"
                    : world.color,
                  color: speaker.isHeader
                    ? "var(--kq-fg)"
                    : "var(--kq-panel-border)",
                  border: "2px solid var(--kq-panel-border)",
                }}
              >
                {speaker.isHeader ? "📍 LOKASI" : `💬 ${speaker.name}`}
              </span>
              <span className="font-pixel text-[0.45rem] text-black/50">
                {lineIdx + 1}/{stage.intro.length}
              </span>
            </div>
          )}
          {/* Dialogue text */}
          <p className="font-vt text-lg md:text-xl leading-relaxed min-h-[4.5rem] text-black">
            {parseInline(displayedText)}
            {isTyping && (
              <span className="kq-blink" style={{ color: "var(--kq-panel-border)" }}>
                ▋
              </span>
            )}
          </p>
          {/* Continue hint */}
          {!isTyping && (
            <div className="mt-2 text-right">
              <span
                className="font-pixel text-[0.5rem] text-black/60 kq-blink"
              >
                ▼ KLIK / ENTER
              </span>
            </div>
          )}
        </PixelPanel>

        {/* Skip button */}
        <div className="text-center mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              audio.click();
              if (stage.lesson) {
                setShowLesson(true);
              } else {
                setView("battle");
              }
            }}
            className="font-pixel text-[0.5rem] text-white/60 hover:text-white underline"
          >
            ⏩ LEWATI CERITA
          </button>
        </div>
      </div>
    </div>
  );
}
