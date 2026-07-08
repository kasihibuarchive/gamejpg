import type { ItemDef, Achievement } from "./types";

// ===== KOTOBAQUEST ITEMS =====
export const ITEMS: Record<string, ItemDef> = {
  potion: {
    id: "potion",
    name: "Ramuan Penyembuh",
    icon: "🧪",
    description: "Pulihkan 10 HP saat bertarung.",
    effect: "heal",
    value: 10,
    price: 30,
    consumable: true,
  },
  hipotion: {
    id: "hipotion",
    name: "Ramuan Besar",
    icon: "💉",
    description: "Pulihkan 25 HP saat bertarung.",
    effect: "heal",
    value: 25,
    price: 75,
    consumable: true,
  },
  elixir: {
    id: "elixir",
    name: "Eliksir Penuh",
    icon: "✨",
    description: "Pulihkan HP hingga penuh.",
    effect: "fullheal",
    value: 999,
    price: 150,
    consumable: true,
  },
  hint: {
    id: "hint",
    name: "Gulaman Petunjuk",
    icon: "📜",
    description: "Tampilkan petunjuk untuk soal saat ini.",
    effect: "hint",
    value: 1,
    price: 20,
    consumable: true,
  },
  shield: {
    id: "shield",
    name: "Jimat Perisai",
    icon: "🛡",
    description: "Blokir 1 serangan musuh berikutnya.",
    effect: "shield",
    value: 1,
    price: 50,
    consumable: true,
  },
  bomb: {
    id: "bomb",
    name: "Gulaman Petir",
    icon: "⚡",
    description: "Serang musuh langsung -3 HP.",
    effect: "damage",
    value: 3,
    price: 60,
    consumable: true,
  },
  // Non-consumable rewards
  passport: {
    id: "passport",
    name: "Paspor Petualang",
    icon: "🎫",
    description: "Tiket masuk ke Vassal Kingdom (N5).",
    effect: "revive",
    value: 0,
    price: 0,
    consumable: false,
  },
  fox_charm: {
    id: "fox_charm",
    name: "Jimat Rubah Api",
    icon: "🦊",
    description: "Pelindung dari bayangan gelap.",
    effect: "shield",
    value: 0,
    price: 0,
    consumable: false,
  },
  time_key: {
    id: "time_key",
    name: "Kunci Segel Waktu",
    icon: "🗝",
    description: "Membuka segel waktu di menara jam.",
    effect: "revive",
    value: 0,
    price: 0,
    consumable: false,
  },
  village_notes: {
    id: "village_notes",
    name: "Catatan Penduduk Desa",
    icon: "📒",
    description: "Daftar penduduk desa Hajimari.",
    effect: "revive",
    value: 0,
    price: 0,
    consumable: false,
  },
};

export function getItem(id: string): ItemDef | undefined {
  return ITEMS[id];
}

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
];

export function checkNewAchievements(
  player: { completedStages: string[]; unlockedWorlds: string[]; level: number; items: string[]; coins: number; badges: string[]; achievements: string[] },
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
