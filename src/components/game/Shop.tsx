"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/lib/game/store";
import { ITEMS } from "@/lib/game/items";
import { PixelButton, PixelPanel, PixelDivider } from "./PixelUI";
import { audio } from "@/lib/game/audio";
import { useToast } from "@/hooks/use-toast";

export function Shop() {
  const { player, buyItem, setView } = useGame();
  const { toast } = useToast();
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    audio.resume();
    audio.playMusic("world");
  }, []);

  const handleBuy = (itemId: string) => {
    const def = ITEMS[itemId];
    if (!def) return;
    if (player.coins < def.price) {
      audio.wrong();
      toast({
        title: "Koin Tidak Cukup!",
        description: `Butuh ${def.price - player.coins} koin lagi untuk ${def.name}.`,
        variant: "destructive",
      });
      return;
    }
    const ok = buyItem(itemId);
    if (ok) {
      audio.correct();
      setFlash(itemId);
      setTimeout(() => setFlash(null), 600);
      toast({
        title: "Item Dibeli!",
        description: `${def.icon} ${def.name} ditambahkan ke tas.`,
      });
    }
  };

  // Get all consumable items available in shop
  // Split into consumables and abilities
  const consumableItems = Object.values(ITEMS).filter(
    (i) => i.price > 0 && i.type === "consumable",
  );
  const abilityItems = Object.values(ITEMS).filter(
    (i) => i.price > 0 && i.type === "ability",
  );

  return (
    <div
      className="min-h-screen px-4 py-6 kq-grid-bg"
      style={{
        background:
          "radial-gradient(ellipse at top, var(--kq-bg-3) 0%, var(--kq-bg) 70%)",
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
            🏪 TOKO RAMUAN
          </h2>
          <p className="font-vt text-base text-white/80 mb-2">
            Beli ramuan & item untuk membantu petualanganmu
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2"
            style={{
              background: "var(--kq-accent)",
              border: "3px solid var(--kq-panel-border)",
            }}
          >
            <span className="font-pixel text-[0.6rem] text-black">
              💰 KOIN:
            </span>
            <span className="font-pixel text-base text-black">
              {player.coins}
            </span>
          </div>
        </div>

        {/* Consumables section */}
        <h3
          className="font-pixel text-sm mb-3 mt-2"
          style={{ color: "var(--kq-accent)" }}
        >
          🧪 RAMUAN (CONSUMABLE)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {consumableItems.map((item) => {
            const owned = player.itemCounts[item.id] || 0;
            const canAfford = player.coins >= item.price;
            const isFlash = flash === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 flex flex-col ${isFlash ? "kq-pop" : ""}`}
                style={{
                  background: "var(--kq-panel)",
                  border: "4px solid var(--kq-panel-border)",
                  boxShadow: "0 0 0 4px var(--kq-panel), 0 0 0 8px var(--kq-panel-border), 4px 4px 0 rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="text-4xl shrink-0"
                    style={{
                      filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.3))",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel text-[0.6rem] text-black mb-1">
                      {item.name}
                    </div>
                    <p className="font-vt text-sm text-black/70">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div
                  className="p-2 mb-3"
                  style={{
                    background: "var(--kq-panel-2)",
                    border: "2px solid var(--kq-panel-border)",
                  }}
                >
                  <div className="font-vt text-sm text-black flex justify-between">
                    <span>Effect:</span>
                    <span className="font-pixel text-[0.45rem]">
                      {item.effect === "heal" && `+${item.value} HP`}
                      {item.effect === "fullheal" && "HP Penuh"}
                      {item.effect === "hint" && "Tampilkan petunjuk"}
                      {item.effect === "shield" && "Blokir 1 serangan"}
                      {item.effect === "damage" && `-${item.value} HP musuh`}
                    </span>
                  </div>
                  <div className="font-vt text-sm text-black flex justify-between">
                    <span>Milik:</span>
                    <span className="font-pixel text-[0.45rem]">x{owned}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(item.id)}
                  disabled={!canAfford}
                  className="kq-btn w-full text-sm"
                  style={{
                    background: canAfford
                      ? "var(--kq-accent)"
                      : "var(--kq-muted)",
                    color: "var(--kq-panel-border)",
                    opacity: canAfford ? 1 : 0.7,
                  }}
                >
                  💰 BELI ({item.price})
                </button>
              </div>
            );
          })}
        </div>

        {/* Abilities section */}
        <h3
          className="font-pixel text-sm mb-3"
          style={{ color: "var(--kq-n3)" }}
        >
          🎭 ABILITY (EQUIPABLE PERK) - maks 3 dipasang
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {abilityItems.map((item) => {
            const owned = player.items.includes(item.id);
            const equipped = player.equippedAbilities.includes(item.id);
            const canAfford = player.coins >= item.price;
            const isFlash = flash === item.id;
            return (
              <div
                key={item.id}
                className={`p-4 flex flex-col ${isFlash ? "kq-pop" : ""}`}
                style={{
                  background: owned ? "var(--kq-accent)" : "var(--kq-panel)",
                  border: `4px solid ${equipped ? "var(--kq-correct)" : "var(--kq-panel-border)"}`,
                  boxShadow: "0 0 0 4px var(--kq-panel), 0 0 0 8px var(--kq-panel-border), 4px 4px 0 rgba(0,0,0,0.4)",
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="text-4xl shrink-0"
                    style={{
                      filter: "drop-shadow(2px 2px 0 rgba(0,0,0,0.3))",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-pixel text-[0.6rem] text-black mb-1">
                      {item.name}
                    </div>
                    <p className="font-vt text-sm text-black/80">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div
                  className="p-2 mb-3"
                  style={{
                    background: "var(--kq-panel-2)",
                    border: "2px solid var(--kq-panel-border)",
                  }}
                >
                  <div className="font-vt text-sm text-black flex justify-between">
                    <span>Status:</span>
                    <span className="font-pixel text-[0.45rem]">
                      {equipped ? "✓ TERPASANG" : owned ? "MILIK" : "BELUM"}
                    </span>
                  </div>
                </div>

                {!owned ? (
                  <button
                    onClick={() => handleBuy(item.id)}
                    disabled={!canAfford}
                    className="kq-btn w-full text-sm"
                    style={{
                      background: canAfford
                        ? "var(--kq-n3)"
                        : "var(--kq-muted)",
                      color: "white",
                      opacity: canAfford ? 1 : 0.7,
                    }}
                  >
                    💰 BELI ({item.price})
                  </button>
                ) : (
                  <div
                    className="font-pixel text-[0.5rem] text-center p-2"
                    style={{
                      background: "var(--kq-correct)",
                      color: "white",
                      border: "2px solid var(--kq-panel-border)",
                    }}
                  >
                    ✓ MILIK - PASANG DI ⚙ STATUS
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <PixelDivider />

        {/* Tip */}
        <PixelPanel variant="light" className="p-4 mt-6">
          <div className="font-pixel text-[0.5rem] mb-2 flex items-center gap-2">
            💡 <span>TIPS MENDAPAT KOIN</span>
          </div>
          <ul className="font-vt text-base text-black space-y-1">
            <li>• Selesaikan stage: dapat koin dari XP/3</li>
            <li>• Perfect stage (semua benar): bonus +30 koin</li>
            <li>• Combo tinggi: bonus +5 koin per combo</li>
            <li>• Level up: bonus 20 × level baru</li>
          </ul>
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
