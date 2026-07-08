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
import { Shop } from "@/components/game/Shop";
import { Practice } from "@/components/game/Practice";
import { Achievements } from "@/components/game/Achievements";
import { StatsScreen } from "@/components/game/StatsScreen";
import { HeroScreen } from "@/components/game/HeroScreen";

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
    };
    window.addEventListener("click", onFirstClick, { once: true });
    window.addEventListener("keydown", onFirstClick, { once: true });
    return () => {
      window.removeEventListener("click", onFirstClick);
      window.removeEventListener("keydown", onFirstClick);
    };
  }, []);

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
        {view === "shop" && <Shop />}
        {view === "practice" && <Practice />}
        {view === "achievements" && <Achievements />}
        {view === "stats" && <StatsScreen />}
        {view === "hero" && <HeroScreen />}
      </main>
    </div>
  );
}
