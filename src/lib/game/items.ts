import type { ItemDef, Achievement, AbilityPerk } from "./types";

// ===== KOTOBAQUEST ITEMS =====
// Two categories:
// 1. Consumables - used in battle (potions)
// 2. Abilities - equipable perks (Dicero-style)

export const ITEMS: Record<string, ItemDef> = {
  // === CONSUMABLES (potions, used once) ===
  potion: {
    id: "potion",
    name: "Ramuan Penyembuh",
    icon: "🧪",
    description: "Pulihkan 10 HP saat bertarung.",
    type: "consumable",
    effect: "heal",
    value: 10,
    price: 30,
  },
  hipotion: {
    id: "hipotion",
    name: "Ramuan Besar",
    icon: "💉",
    description: "Pulihkan 25 HP saat bertarung.",
    type: "consumable",
    effect: "heal",
    value: 25,
    price: 75,
  },
  elixir: {
    id: "elixir",
    name: "Eliksir Penuh",
    icon: "✨",
    description: "Pulihkan HP hingga penuh.",
    type: "consumable",
    effect: "fullheal",
    value: 999,
    price: 150,
  },
  hint: {
    id: "hint",
    name: "Gulaman Petunjuk",
    icon: "📜",
    description: "Tampilkan petunjuk untuk soal saat ini.",
    type: "consumable",
    effect: "hint",
    value: 1,
    price: 20,
  },
  shield: {
    id: "shield",
    name: "Jimat Perisai",
    icon: "🛡",
    description: "Blokir 1 serangan musuh berikutnya.",
    type: "consumable",
    effect: "shield",
    value: 1,
    price: 50,
  },
  bomb: {
    id: "bomb",
    name: "Gulaman Petir",
    icon: "⚡",
    description: "Serang musuh langsung -3 HP.",
    type: "consumable",
    effect: "damage",
    value: 3,
    price: 60,
  },

  // === ABILITIES (equipable perks, Dicero-style) ===
  vampire_scroll: {
    id: "vampire_scroll",
    name: "Gulaman Vampir",
    icon: "🦇",
    description: "Pulihkan 1 HP setiap jawaban benar.",
    type: "ability",
    perk: "vampire",
    price: 120,
  },
  berserker_mask: {
    id: "berserker_mask",
    name: "Topeng Berserker",
    icon: "👹",
    description: "+50% damage, tapi max HP -25%.",
    type: "ability",
    perk: "berserker",
    price: 150,
  },
  lucky_charm: {
    id: "lucky_charm",
    name: "Jimat Keberuntungan",
    icon: "🍀",
    description: "+15% peluang critical hit.",
    type: "ability",
    perk: "lucky_charm",
    price: 100,
  },
  swift_boots: {
    id: "swift_boots",
    name: "Sepatu Cepat",
    icon: "👟",
    description: "+3 detik timer per soal.",
    type: "ability",
    perk: "swift_boots",
    price: 90,
  },
  iron_shield: {
    id: "iron_shield",
    name: "Perisai Besi",
    icon: "🛡️",
    description: "Kurangi 1 damage dari semua serangan.",
    type: "ability",
    perk: "iron_shield",
    price: 110,
  },
  scholar_glasses: {
    id: "scholar_glasses",
    name: "Kacamata Sarjana",
    icon: "🤓",
    description: "Petunjuk selalu terlihat di battle.",
    type: "ability",
    perk: "scholar",
    price: 80,
  },
  thorns_armor: {
    id: "thorns_armor",
    name: "Baju Duri",
    icon: "🌵",
    description: "Pantulkan 2 damage saat diserang.",
    type: "ability",
    perk: "thorns",
    price: 130,
  },
  executioner_axe: {
    id: "executioner_axe",
    name: "Kapal algojo",
    icon: "🪓",
    description: "+100% damage ke musuh di bawah 30% HP.",
    type: "ability",
    perk: "executioner",
    price: 180,
  },
  time_freeze_watch: {
    id: "time_freeze_watch",
    name: "Jam Pembeku Waktu",
    icon: "⏸",
    description: "+5 detik timer untuk 3 soal pertama.",
    type: "ability",
    perk: "time_freeze",
    price: 100,
  },
  combo_master_ring: {
    id: "combo_master_ring",
    name: "Cincin Master Combo",
    icon: "💍",
    description: "Bonus damage combo dinaikkan 2x.",
    type: "ability",
    perk: "combo_master",
    price: 160,
  },
  regen_amulet: {
    id: "regen_amulet",
    name: "Jimat Regen",
    icon: "💚",
    description: "Pulihkan 1 HP setiap 3 giliran.",
    type: "ability",
    perk: "regen_player",
    price: 100,
  },
  shield_start_charm: {
    id: "shield_start_charm",
    name: "Jimat Perisai Awal",
    icon: "🔰",
    description: "Mulai battle dengan perisai aktif.",
    type: "ability",
    perk: "shield_start",
    price: 90,
  },
  double_strike_gauntlet: {
    id: "double_strike_gauntlet",
    name: "Sarung Tangan Pukulan Ganda",
    icon: "👊",
    description: "20% peluang serang 2x saat jawaban benar.",
    type: "ability",
    perk: "double_strike",
    price: 200,
  },
  golden_touch: {
    id: "golden_touch",
    name: "Sentuhan Emas",
    icon: "💰",
    description: "+50% koin dari setiap battle.",
    type: "ability",
    perk: "golden_touch",
    price: 140,
  },
  xp_boost_crystal: {
    id: "xp_boost_crystal",
    name: "Kristal XP",
    icon: "🔮",
    description: "+25% XP dari setiap battle.",
    type: "ability",
    perk: "xp_boost",
    price: 140,
  },

  // === STORY REWARD ITEMS (non-equippable, non-consumable) ===
  passport: {
    id: "passport",
    name: "Paspor Petualang",
    icon: "🎫",
    description: "Tiket masuk ke Vassal Kingdom (N5).",
    type: "consumable",
    effect: "revive",
    value: 0,
    price: 0,
  },
  fox_charm: {
    id: "fox_charm",
    name: "Jimat Rubah Api",
    icon: "🦊",
    description: "Pelindung dari bayangan gelap.",
    type: "consumable",
    effect: "revive",
    value: 0,
    price: 0,
  },
  time_key: {
    id: "time_key",
    name: "Kunci Segel Waktu",
    icon: "🗝",
    description: "Membuka segel waktu di menara jam.",
    type: "consumable",
    effect: "revive",
    value: 0,
    price: 0,
  },
  village_notes: {
    id: "village_notes",
    name: "Catatan Penduduk Desa",
    icon: "📒",
    description: "Daftar penduduk desa Hajimari.",
    type: "consumable",
    effect: "revive",
    value: 0,
    price: 0,
  },
};

export function getItem(id: string): ItemDef | undefined {
  return ITEMS[id];
}

// ===== ABILITY PERK INFO (for UI display) =====
export const PERK_INFO: Record<AbilityPerk, { name: string; description: string; color: string }> = {
  vampire: { name: "Vampir", description: "Heal 1 HP saat jawaban benar", color: "#9c27b0" },
  berserker: { name: "Berserker", description: "+50% damage, -25% max HP", color: "#e91e63" },
  lucky_charm: { name: "Hoki", description: "+15% crit chance", color: "#4caf50" },
  swift_boots: { name: "Cepat", description: "+3s timer", color: "#2196f3" },
  iron_shield: { name: "Besi", description: "-1 damage taken", color: "#607d8b" },
  scholar: { name: "Sarjana", description: "Petunjuk selalu tampil", color: "#3f51b5" },
  thorns: { name: "Duri", description: "Pantulkan 2 damage", color: "#795548" },
  executioner: { name: "Algojo", description: "+100% damage ke HP rendah", color: "#f44336" },
  time_freeze: { name: "Beku", description: "+5s timer 3 soal pertama", color: "#00bcd4" },
  combo_master: { name: "Combo", description: "Bonus combo 2x", color: "#ff9800" },
  regen_player: { name: "Regen", description: "+1 HP tiap 3 giliran", color: "#4caf50" },
  shield_start: { name: "Perisai Awal", description: "Mulai dengan perisai", color: "#3f51b5" },
  double_strike: { name: "Pukulan Ganda", description: "20% serang 2x", color: "#ff5722" },
  golden_touch: { name: "Emas", description: "+50% koin", color: "#ffc107" },
  xp_boost: { name: "XP Boost", description: "+25% XP", color: "#9c27b0" },
};

// ===== ACHIEVEMENTS =====
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    name: "Langkah Pertama",
    description: "Selesaikan stage pertamamu.",
    icon: "👣",
    check: (p) => p.completedStages.length >= 1,
  },
  {
    id: "village-hero",
    name: "Pahlawan Desa",
    description: "Kalahkan Raja Bayangan Huruf (Bab 1).",
    icon: "👑",
    check: (p) => p.completedStages.includes("hajimari-10"),
  },
  {
    id: "katakana-master",
    name: "Master Katakana",
    description: "Selesaikan semua stage Katakana.",
    icon: "🔪",
    check: (p) => p.completedStages.includes("hajimari-20"),
  },
  {
    id: "n5-traveler",
    name: "Pengelana N5",
    description: "Tiba di Vassal Kingdom.",
    icon: "🏰",
    check: (p) => p.unlockedWorlds.includes("n5"),
  },
  {
    id: "n5-master",
    name: "Lulusan N5",
    description: "Selesaikan semua stage Vassal Kingdom.",
    icon: "🏅",
    check: (p) => p.completedStages.includes("n5-10"),
  },
  {
    id: "level-5",
    name: "Berpengalaman",
    description: "Capai level 5.",
    icon: "⭐",
    check: (p) => p.level >= 5,
  },
  {
    id: "level-10",
    name: "Veteran",
    description: "Capai level 10.",
    icon: "🌟",
    check: (p) => p.level >= 10,
  },
  {
    id: "collector",
    name: "Kolektor",
    description: "Kumpulkan 5 item atau lebih.",
    icon: "🎒",
    check: (p) => p.items.length >= 5,
  },
  {
    id: "rich",
    name: "Kaya Raya",
    description: "Punya 200 koin atau lebih.",
    icon: "💰",
    check: (p) => p.coins >= 200,
  },
  {
    id: "badge-half",
    name: "Pengumpul Badge",
    description: "Kumpulkan 3 badge.",
    icon: "🏆",
    check: (p) => p.badges.length >= 3,
  },
  {
    id: "perfect-strike",
    name: "Pemogok Sempurna",
    description: "Raih combo 5x atau lebih.",
    icon: "🔥",
    check: (_p, s) => s.bestCombo >= 5,
  },
  {
    id: "combo-master",
    name: "Master Combo",
    description: "Raih combo 10x atau lebih.",
    icon: "💥",
    check: (_p, s) => s.bestCombo >= 10,
  },
  {
    id: "scholar",
    name: "Sarjana",
    description: "Jawab 50 soal dengan benar.",
    icon: "📚",
    check: (_p, s) => s.totalCorrect >= 50,
  },
  {
    id: "century",
    name: "Seratus Kemenangan",
    description: "Jawab 100 soal dengan benar.",
    icon: "💯",
    check: (_p, s) => s.totalCorrect >= 100,
  },
  {
    id: "ability-collector",
    name: "Pengumpul Ability",
    description: "Miliki 3 ability atau lebih.",
    icon: "🎭",
    check: (p) => {
      const abilityCount = p.items.filter((id) => ITEMS[id]?.type === "ability").length;
      return abilityCount >= 3;
    },
  },
  {
    id: "fully-equipped",
    name: "Lengkap",
    description: "Pasang 3 ability sekaligus.",
    icon: "⚙",
    check: (p) => p.equippedAbilities.length >= 3,
  },
  {
    id: "stat-maxed",
    name: "Maksimal",
    description: "Salah satu stat (ATK/DEF/SPD/LUCK) capai 10.",
    icon: "💪",
    check: (p) => p.atk >= 10 || p.def >= 10 || p.spd >= 10 || p.luck >= 10,
  },
];

export function checkNewAchievements(
  player: { completedStages: string[]; unlockedWorlds: string[]; level: number; items: string[]; coins: number; badges: string[]; achievements: string[]; equippedAbilities: string[]; atk: number; def: number; spd: number; luck: number },
  stats: { bestCombo: number; totalCorrect: number },
): string[] {
  const newOnes: string[] = [];
  for (const a of ACHIEVEMENTS) {
    if (player.achievements.includes(a.id)) continue;
    if (a.check(player as any, stats as any)) {
      newOnes.push(a.id);
    }
  }
  return newOnes;
}
