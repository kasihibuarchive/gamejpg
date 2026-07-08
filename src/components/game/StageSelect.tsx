"use client";

import { useEffect, Fragment } from "react";
import { useGame } from "@/lib/game/store";
import { getStagesByWorld } from "@/lib/game/stages";
import { getWorld } from "@/lib/game/worlds";
import { PixelButton, PixelPanel } from "./PixelUI";
import { audio } from "@/lib/game/audio";

const STAGE_TYPE_META = {
  lesson: { label: " PELAJARAN ", icon: "📖", color: "var(--kq-n4)" },
  battle: { label: "  PERTARUNGAN  ", icon: "⚔", color: "var(--kq-attack)" },
  "mini-boss": { label: " MINI-BOSS ", icon: "🛡", color: "var(--kq-n5)" },
  boss: { label: " BOS AKHIR ", icon: "👑", color: "var(--kq-n1)" },
};

export function StageSelect() {
  const {
    selectedWorldId,
    setView,
    selectStage,
    player,
  } = useGame();

  const world = selectedWorldId ? getWorld(selectedWorldId) : null;
  const stages = selectedWorldId ? getStagesByWorld(selectedWorldId) : [];

  useEffect(() => {
    audio.resume();
    audio.playMusic("world");
  }, []);

  if (!world) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PixelButton onClick={() => setView("world-map")}>
          ← Kembali ke Peta
        </PixelButton>
      </div>
    );
  }

  const handleStageClick = (stageId: string, unlocked: boolean) => {
    if (!unlocked) {
      audio.wrong();
      return;
    }
    audio.click();
    selectStage(stageId);
    setView("story");
  };

  // Determine unlock: stage N unlocked if stage N-1 completed OR stage N itself completed
  const isStageUnlocked = (stageId: string, index: number): boolean => {
    if (player.completedStages.includes(stageId)) return true;
    if (index === 0) return true;
    const prevStage = stages[index - 1];
    return prevStage ? player.completedStages.includes(prevStage.id) : false;
  };

  const completedCount = stages.filter((s) =>
    player.completedStages.includes(s.id),
  ).length;

  return (
    <div
      className="min-h-screen px-4 py-6 md:py-8"
      style={{
        background: `radial-gradient(ellipse at top, ${world.colorDark} 0%, var(--kq-bg) 70%)`,
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => {
            audio.click();
            setView("world-map");
          }}
          className="font-pixel text-[0.55rem] mb-4 inline-flex items-center gap-2 hover:opacity-80"
          style={{ color: "var(--kq-fg)" }}
        >
          ← PETA DUNIA
        </button>

        {/* World header */}
        <div className="text-center mb-8">
          <div className="text-5xl md:text-6xl mb-2 kq-bob">{world.icon}</div>
          <h2
            className="font-pixel text-xl md:text-2xl mb-1 kq-text-outline"
            style={{ color: world.color }}
          >
            {world.name}
          </h2>
          <div
            className="font-vt text-xl mb-2"
            style={{ color: "var(--kq-fg)" }}
          >
            {world.nameJp}
          </div>
          <p
            className="font-vt text-base max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {world.description}
          </p>
          <div className="mt-3 inline-block px-4 py-1.5" style={{ background: "var(--kq-bg-2)", border: "2px solid var(--kq-fg)" }}>
            <span className="font-pixel text-[0.55rem]" style={{ color: "var(--kq-accent)" }}>
              PROGRES: {completedCount}/{world.stageCount}
            </span>
          </div>
        </div>

        {/* Stage path */}
        <div className="relative">
          {/* Connecting path line */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-0"
            style={{
              width: 4,
              background: `repeating-linear-gradient(to bottom, ${world.color} 0 8px, transparent 8px 16px)`,
            }}
          />

          <div className="relative z-10 flex flex-col gap-4 md:gap-6">
            {stages.map((stage, idx) => {
              const isUnlocked = isStageUnlocked(stage.id, idx);
              const isCompleted = player.completedStages.includes(stage.id);
              const isCurrent = isUnlocked && !isCompleted;
              const meta = STAGE_TYPE_META[stage.type];
              const isLeft = idx % 2 === 0;
              const showChapterDivider =
                stage.chapter &&
                (idx === 0 ||
                  (stages[idx - 1] && stages[idx - 1].chapter !== stage.chapter));

              return (
                <Fragment key={stage.id}>
                  {showChapterDivider && (
                    <div className="flex items-center gap-3 my-2">
                      <span
                        style={{
                          flex: 1,
                          height: 3,
                          background: world.color,
                        }}
                      />
                      <span
                        className="font-pixel text-[0.55rem] px-3 py-1 whitespace-nowrap"
                        style={{
                          background: world.color,
                          color: "var(--kq-panel-border)",
                          border: "3px solid var(--kq-panel-border)",
                        }}
                      >
                        BAB {stage.chapter}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          height: 3,
                          background: world.color,
                        }}
                      />
                    </div>
                  )}
                  <div
                    className={`flex ${isLeft ? "md:justify-start" : "md:justify-end"}`}
                  >
                    <button
                      onClick={() => handleStageClick(stage.id, isUnlocked)}
                      onMouseEnter={() => isUnlocked && audio.hover()}
                      disabled={!isUnlocked}
                      className={`block w-full md:w-[60%] text-left transition-transform ${isUnlocked ? "hover:-translate-y-1" : "cursor-not-allowed"} ${isCurrent ? "kq-pulse-glow" : ""}`}
                      aria-label={`Stage ${stage.index}: ${stage.title}`}
                      aria-disabled={!isUnlocked}
                    >
                      <PixelPanel
                        variant="light"
                        className={`p-0 overflow-hidden ${!isUnlocked ? "opacity-60 grayscale" : ""}`}
                      >
                        {/* Stage number badge + type */}
                        <div
                          className="px-3 py-2 flex items-center justify-between gap-2"
                          style={{
                            background: isCompleted
                              ? "var(--kq-correct)"
                              : meta.color,
                            borderBottom: "3px solid var(--kq-panel-border)",
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="font-pixel text-[0.55rem] px-2 py-1 shrink-0"
                              style={{
                                background: "var(--kq-panel-border)",
                                color: isCompleted
                                  ? "var(--kq-correct)"
                                  : meta.color,
                              }}
                            >
                              STAGE {String(stage.index).padStart(2, "0")}
                            </span>
                            <span className="font-pixel text-[0.5rem] text-black truncate">
                              {meta.icon} {meta.label}
                            </span>
                          </div>
                          {isCompleted && (
                            <span className="font-pixel text-[0.6rem] text-black shrink-0">
                              ✓
                            </span>
                          )}
                          {!isUnlocked && (
                            <span className="font-pixel text-[0.6rem] text-black/70 shrink-0">
                              🔒
                            </span>
                          )}
                        </div>

                        {/* Stage content */}
                        <div className="p-4 flex items-center gap-4">
                          <div
                            className="shrink-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center font-pixel text-2xl"
                            style={{
                              background: isCompleted
                                ? "var(--kq-correct)"
                                : "var(--kq-panel-2)",
                              border: "3px solid var(--kq-panel-border)",
                              color: "var(--kq-panel-border)",
                            }}
                          >
                            {isCompleted ? "★" : isUnlocked ? stage.index : "🔒"}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="font-pixel text-[0.75rem] mb-1"
                              style={{ color: "var(--kq-panel-border)" }}
                            >
                              {stage.title}
                            </div>
                            <div className="font-vt text-base text-black/80">
                              {stage.subtitle}
                            </div>
                            {isUnlocked && stage.enemies.length > 0 && (
                              <div className="mt-2 flex items-center gap-1 flex-wrap">
                                <span className="font-pixel text-[0.4rem] text-black/60">
                                  MUSUH:
                                </span>
                                {stage.enemies.map((e) => (
                                  <span
                                    key={e.id}
                                    className="text-lg"
                                    style={{
                                      filter: "drop-shadow(1px 1px 0 rgba(0,0,0,0.3))",
                                    }}
                                    title={e.name}
                                  >
                                    {e.sprite}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="shrink-0">
                            {isUnlocked ? (
                              <span
                                className="font-pixel text-[0.55rem] hidden sm:inline"
                                style={{ color: meta.color }}
                              >
                                ▶
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </PixelPanel>
                    </button>
                  </div>
                </Fragment>
              );
            })}

            {stages.length === 0 && (
              <div className="text-center py-12">
                <PixelPanel variant="light" className="p-8 max-w-md mx-auto">
                  <div className="text-5xl mb-3">🏗</div>
                  <h3
                    className="font-pixel text-sm mb-2"
                    style={{ color: "var(--kq-panel-border)" }}
                  >
                    MODUL DALAM PENGEMBANGAN
                  </h3>
                  <p className="font-vt text-base text-black/80">
                    Bab {world.jlpt} akan segera hadir! Sementara itu, kuasai
                    dulu bab-bab sebelumnya dengan sempurna.
                  </p>
                </PixelPanel>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
