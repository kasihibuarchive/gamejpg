"use client";

import { useEffect } from "react";
import { useGame } from "@/lib/game/store";
import { audio } from "@/lib/game/audio";
import { HUD } from "@/components/game/HUD";
import { TitleScreen } from "@/components/game/TitleScreen";
import { WorldMap } from "@/components/game/WorldMap";
import { StageSelect } from "@/components/game/StageSelect";
import { StoryCutscene } from "@/components/game/StoryCutscene";
import { BattleScreen } from "@/components/game/BattleScreen";
import { Codex } from "@/components/game/Codex";

export default function Page() {
  const { view, soundEnabled, crtEnabled } = useGame();

  // Initialize audio mute state from persisted setting
  useEffect(() => {
    audio.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Resume audio context on first user interaction (autoplay policy)
  useEffect(() => {
    const onFirstClick = () => {
      audio.resume();
      if (soundEnabled) {
        // music will start when entering a view
      }
    };
    window.addEventListener("click", onFirstClick, { once: true });
    window.addEventListener("keydown", onFirstClick, { once: true });
    return () => {
      window.removeEventListener("click", onFirstClick);
      window.removeEventListener("keydown", onFirstClick);
    };
  }, [soundEnabled]);

  // Title screen has its own full layout
  if (view === "title") {
    return (
      <div className={crtEnabled ? "kq-crt" : ""}>
        <TitleScreen />
      </div>
    );
  }

  // All other views get HUD on top
  return (
    <div className={`min-h-screen flex flex-col ${crtEnabled ? "kq-crt" : ""}`}>
      <HUD />
      <main className="flex-1">
        {view === "world-map" && <WorldMap />}
        {view === "stage-select" && <StageSelect />}
        {view === "story" && <StoryCutscene />}
        {view === "battle" && <BattleScreen />}
        {view === "codex" && <Codex />}
      </main>
    </div>
  );
}
