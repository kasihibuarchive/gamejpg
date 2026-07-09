"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { WORLDS } from "@/lib/game/worlds";
import { HAJIMARI_STAGES } from "@/lib/game/stages";
import { KATAKANA_STAGES } from "@/lib/game/katakana-stages";
import { N5_STAGES } from "@/lib/game/n5-stages";
import { ITEMS } from "@/lib/game/items";
import { PixelButton, PixelPanel, PixelDivider } from "./PixelUI";
import { audio } from "@/lib/game/audio";

export function Codex() {
  const { player, setView } = useGame();

  useEffect(() => {
    audio.resume();
  }, []);

  // Collect all unique kana learned from completed stages
  const learnedKana: { kana: string; romaji: string; meaning?: string }[] = [];
  const allStages = [...HAJIMARI_STAGES, ...KATAKANA_STAGES, ...N5_STAGES];
  for (const stage of allStages) {
    if (player.completedStages.includes(stage.id) && stage.lesson) {
      for (const row of stage.lesson.rows) {
        if (!learnedKana.find((k) => k.kana === row.kana)) {
          learnedKana.push(row);
        }
      }
    }
  }

  return (
    <div
      className="min-h-screen px-4 py-6 kq-grid-bg"
      style={{
        background: "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
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
            📜 CODEX PETUALANG
          </h2>
          <p className="font-vt text-base text-white/80">
            Catatan perjalanan, koleksi, dan kemajuan
          </p>
        </div>

        {/* Player card */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <div
              className="w-20 h-20 flex items-center justify-center text-5xl shrink-0"
              style={{
                background: "var(--kq-accent)",
                border: "4px solid var(--kq-panel-border)",
              }}
            >
              🧙
            </div>
            <div className="flex-1 min-w-0">
              <div
                className="font-pixel text-base mb-1"
                style={{ color: "var(--kq-panel-border)" }}
              >
                {player.name}
              </div>
              <div className="font-vt text-base text-black/80 mb-2">
                Level {player.level} · {player.xp}/{player.xpToNext} XP
              </div>
              <div className="grid grid-cols-3 gap-2 font-pixel text-[0.45rem]">
                <div className="text-center p-1.5" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                  <div className="text-black/60">STAGE</div>
                  <div className="text-sm text-black">{player.completedStages.length}</div>
                </div>
                <div className="text-center p-1.5" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                  <div className="text-black/60">BADGE</div>
                  <div className="text-sm text-black">{player.badges.length}</div>
                </div>
                <div className="text-center p-1.5" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
                  <div className="text-black/60">ITEM</div>
                  <div className="text-sm text-black">{player.items.length}</div>
                </div>
              </div>
            </div>
          </div>
        </PixelPanel>

        {/* Badges */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🏆 BADGE
          </h3>
          {player.badges.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Belum ada badge. Selesaikan mini-boss dan boss untuk mendapatkannya!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {player.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="p-3 text-center kq-pop"
                  style={{
                    background: "var(--kq-accent)",
                    border: "3px solid var(--kq-panel-border)",
                    animationDelay: `${idx * 0.05}s`,
                  }}
                >
                  <div className="text-3xl mb-1">🏅</div>
                  <div className="font-pixel text-[0.5rem] text-black">
                    {badge}
                  </div>
                </div>
              ))}
            </div>
          )}
        </PixelPanel>

        {/* Items */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🎒 ITEM ({player.items.length})
          </h3>
          {player.items.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Tas kosong. Kumpulkan item dari stage-stage yang kau selesaikan,
              atau beli dari 🏪 Toko Ramuan!
            </p>
          ) : (
            <div className="space-y-2">
              {player.items.map((itemId, idx) => {
                const def = ITEMS[itemId];
                const count = player.itemCounts[itemId] || 0;
                return (
                  <div
                    key={idx}
                    className="p-2 flex items-center gap-3"
                    style={{
                      background: def?.consumable
                        ? "var(--kq-panel-2)"
                        : "var(--kq-accent)",
                      border: "2px solid var(--kq-panel-border)",
                    }}
                  >
                    <span className="text-2xl shrink-0">{def?.icon ?? "📦"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-pixel text-[0.55rem] text-black truncate">
                        {def?.name ?? itemId}
                      </div>
                      <div className="font-vt text-sm text-black/70 truncate">
                        {def?.description ?? "Item misterius"}
                      </div>
                    </div>
                    {def?.consumable && (
                      <span
                        className="font-pixel text-[0.5rem] text-black px-2 py-1 shrink-0"
                        style={{
                          background: "var(--kq-panel)",
                          border: "2px solid var(--kq-panel-border)",
                        }}
                      >
                        x{count}
                      </span>
                    )}
                    {!def?.consumable && (
                      <span
                        className="font-pixel text-[0.4rem] text-black px-2 py-1 shrink-0"
                        style={{
                          background: "var(--kq-panel-border)",
                          color: "var(--kq-accent)",
                        }}
                      >
                        LANGKA
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </PixelPanel>

        {/* Kana Library */}
        <PixelPanel variant="light" className="p-5 mb-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            📚 KANA TERKUASAI ({learnedKana.length})
          </h3>
          {learnedKana.length === 0 ? (
            <p className="font-vt text-base text-black/60">
              Belum ada huruf terkuasai. Selesaikan stage Hajimari untuk mengumpulkan kana!
            </p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {learnedKana.map((k, idx) => (
                <div
                  key={idx}
                  className="aspect-square flex flex-col items-center justify-center p-1"
                  style={{
                    background: "var(--kq-panel-2)",
                    border: "2px solid var(--kq-panel-border)",
                  }}
                  title={k.meaning}
                >
                  <div
                    className="font-gothic text-2xl md:text-3xl"
                    style={{ color: "var(--kq-panel-border)" }}
                  >
                    {k.kana}
                  </div>
                  <div className="font-pixel text-[0.4rem] text-black/70 mt-0.5">
                    {k.romaji}
                  </div>
                </div>
              ))}
            </div>
          )}
        </PixelPanel>

        {/* World progress overview */}
        <PixelPanel variant="light" className="p-5">
          <h3
            className="font-pixel text-sm mb-3 flex items-center gap-2"
            style={{ color: "var(--kq-panel-border)" }}
          >
            🗺 PROGRES DUNIA
          </h3>
          <div className="space-y-2">
            {WORLDS.map((world) => {
              const completed = player.completedStages.filter((sid) =>
                sid.startsWith(world.id + "-"),
              ).length;
              const isUnlocked = player.unlockedWorlds.includes(world.id);
              const pct = (completed / world.stageCount) * 100;
              return (
                <div
                  key={world.id}
                  className="p-2 flex items-center gap-3"
                  style={{
                    background: "var(--kq-panel-2)",
                    border: "2px solid var(--kq-panel-border)",
                    opacity: isUnlocked ? 1 : 0.5,
                  }}
                >
                  <span className="text-2xl">{isUnlocked ? world.icon : "🔒"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel text-[0.55rem] truncate" style={{ color: "var(--kq-panel-border)" }}>
                      {world.name} · {world.levelName}
                    </div>
                    <div className="font-vt text-sm text-black/70">
                      {completed}/{world.stageCount} stage selesai
                    </div>
                  </div>
                  <div
                    className="w-16 h-2"
                    style={{
                      background: "var(--kq-panel-border)",
                      border: "1px solid var(--kq-panel-border)",
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: "100%",
                        background: world.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </PixelPanel>

        <PixelDivider />

        <div className="text-center">
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
