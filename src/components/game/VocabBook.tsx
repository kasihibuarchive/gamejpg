"use client";

import { useEffect, useState, useMemo } from "react";
import { useGame } from "@/lib/game/store";
import { getPlayerVocab } from "@/lib/game/stages";
import { getWorld } from "@/lib/game/worlds";
import { WORLDS } from "@/lib/game/worlds";
import { PixelButton, PixelPanel, PixelDivider } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import type { WorldId } from "@/lib/game/types";

type FilterType = "all" | WorldId;

export function VocabBook() {
  const { player, setView } = useGame();
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    audio.resume();
  }, []);

  const allVocab = useMemo(
    () => getPlayerVocab(player.completedStages),
    [player.completedStages],
  );

  const filteredVocab = useMemo(() => {
    let result = allVocab;
    if (filter !== "all") {
      result = result.filter((v) => v.worldId === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.kana.toLowerCase().includes(q) ||
          v.romaji.toLowerCase().includes(q) ||
          v.meaning.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allVocab, filter, search]);

  // Group by world
  const byWorld = useMemo(() => {
    const groups: Record<string, typeof filteredVocab> = {};
    for (const v of filteredVocab) {
      if (!groups[v.worldId]) groups[v.worldId] = [];
      groups[v.worldId].push(v);
    }
    return groups;
  }, [filteredVocab]);

  // Count per world
  const worldCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of allVocab) {
      counts[v.worldId] = (counts[v.worldId] || 0) + 1;
    }
    return counts;
  }, [allVocab]);

  return (
    <div
      className="min-h-screen px-4 py-6 kq-grid-bg"
      style={{ background: "radial-gradient(ellipse at top, var(--kq-bg-3), var(--kq-bg))" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <button
            onClick={() => { audio.click(); setView("world-map"); }}
            className="font-pixel text-[0.5rem] mb-2 inline-block hover:opacity-80"
            style={{ color: "var(--kq-fg)" }}
          >
            ← PETA DUNIA
          </button>
          <h2 className="font-pixel text-xl md:text-2xl kq-text-outline mb-2" style={{ color: "var(--kq-accent)" }}>
            📚 VOCAB BOOK
          </h2>
          <p className="font-vt text-base text-white/80">
            Kamus kosakata yang sudah kamu kumpulkan ({allVocab.length} total)
          </p>
        </div>

        {/* Stats summary */}
        <PixelPanel variant="light" className="p-4 mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 text-center" style={{ background: "var(--kq-panel-2)", border: "2px solid var(--kq-panel-border)" }}>
              <div className="font-pixel text-[0.4rem] text-black/60">TOTAL</div>
              <div className="font-pixel text-lg text-black">{allVocab.length}</div>
            </div>
            {WORLDS.filter((w) => worldCounts[w.id]).map((w) => (
              <div key={w.id} className="p-2 text-center" style={{ background: w.color, border: `2px solid var(--kq-panel-border)` }}>
                <div className="font-pixel text-[0.4rem] text-black/70">{w.icon} {w.levelName}</div>
                <div className="font-pixel text-lg text-black">{worldCounts[w.id]}</div>
              </div>
            ))}
          </div>
        </PixelPanel>

        {/* Search & filter */}
        <PixelPanel variant="light" className="p-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Cari: kana, romaji, atau arti..."
            className="w-full px-3 py-2 font-vt text-base text-black mb-3"
            style={{
              background: "var(--kq-panel-2)",
              border: "3px solid var(--kq-panel-border)",
              outline: "none",
            }}
          />
          <div className="flex gap-1 flex-wrap">
            <button
              onClick={() => { audio.click(); setFilter("all"); }}
              className="px-2 py-1"
              style={{
                background: filter === "all" ? "var(--kq-accent)" : "var(--kq-panel-2)",
                border: "2px solid var(--kq-panel-border)",
                color: "var(--kq-panel-border)",
              }}
            >
              <span className="font-pixel text-[0.45rem]">SEMUA ({allVocab.length})</span>
            </button>
            {WORLDS.filter((w) => worldCounts[w.id]).map((w) => (
              <button
                key={w.id}
                onClick={() => { audio.click(); setFilter(w.id); }}
                className="px-2 py-1"
                style={{
                  background: filter === w.id ? w.color : "var(--kq-panel-2)",
                  border: "2px solid var(--kq-panel-border)",
                  color: "var(--kq-panel-border)",
                }}
              >
                <span className="font-pixel text-[0.45rem]">{w.icon} {w.levelName} ({worldCounts[w.id]})</span>
              </button>
            ))}
          </div>
        </PixelPanel>

        {/* Vocab list grouped by world */}
        {filteredVocab.length === 0 ? (
          <PixelPanel variant="light" className="p-6 text-center">
            <div className="text-4xl mb-2">📭</div>
            <p className="font-vt text-base text-black/70">
              {allVocab.length === 0
                ? "Belum ada vocab. Mainkan stage untuk mengumpulkan!"
                : "Tidak ada hasil untuk filter/pencarian ini."}
            </p>
          </PixelPanel>
        ) : (
          <div className="space-y-4">
            {Object.entries(byWorld).map(([wid, vocabList]) => {
              const world = getWorld(wid as WorldId);
              if (!world) return null;
              return (
                <PixelPanel key={wid} variant="light" className="p-4">
                  <h3
                    className="font-pixel text-sm mb-3 flex items-center gap-2"
                    style={{ color: world.color }}
                  >
                    {world.icon} {world.name} ({vocabList.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {vocabList.map((v, idx) => (
                      <div
                        key={`${v.kana}-${idx}`}
                        className="p-2"
                        style={{
                          background: "var(--kq-panel-2)",
                          border: `2px solid ${world.color}`,
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div
                            className="font-gothic text-2xl"
                            style={{ color: "var(--kq-panel-border)" }}
                          >
                            {v.kana}
                          </div>
                          <div
                            className="font-pixel text-[0.45rem] px-1.5 py-0.5"
                            style={{ background: world.color, color: "var(--kq-panel-border)" }}
                          >
                            {v.romaji.split("/")[0]}
                          </div>
                        </div>
                        <div className="font-vt text-sm text-black/80">{v.meaning}</div>
                        <div className="font-pixel text-[0.35rem] text-black/50 mt-1">
                          📍 {v.sourceStageTitle}
                        </div>
                      </div>
                    ))}
                  </div>
                </PixelPanel>
              );
            })}
          </div>
        )}

        {/* Endless mode CTA */}
        <PixelPanel variant="accent" className="p-4 mt-6 text-center">
          <h3 className="font-pixel text-sm mb-2 text-black">♻ MAU LATIHAN TANPA HENTI?</h3>
          <p className="font-vt text-base text-black/80 mb-3">
            Main Endless Mode untuk latihan semua vocab yang sudah kamu kumpulkan!
          </p>
          <PixelButton
            size="sm"
            onClick={() => { audio.click(); setView("endless"); }}
          >
            ♾ ENDLESS MODE
          </PixelButton>
        </PixelPanel>

        <div className="text-center mt-6">
          <PixelButton size="sm" onClick={() => { audio.click(); setView("world-map"); }}>
            ← KEMBALI
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
