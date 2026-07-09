import type { World, WorldId } from "./types";

// ===== KOTOBAQUEST WORLDS =====
// 6 tingkat kesulitan (BUKAN JLPT resmi - ini level game RPG).
// Inspired by PDF section "Arsitektur Kurikulum & Alur Progres".

export const WORLDS: World[] = [
  {
    id: "hajimari",
    name: "Hajimari Village",
    nameJp: "はじまりの里",
    level: 1,
    levelName: "Pemula",
    tagline: "Desa Awal - Hutan Magis Tempat Aksara Tersembunyi",
    description:
      "Petualangan dimulai! Pelajari fondasi huruf Jepang: Hiragana & Katakana. Bab 1 (Hiragana) & Bab 2 (Katakana) - total 20 stage. Lalu ujian akhir untuk naik ke tingkat berikutnya.",
    color: "var(--kq-hajimari)",
    colorDark: "var(--kq-hajimari-dark)",
    icon: "🍃",
    stageCount: 20,
    chapterCount: 2,
  },
  {
    id: "n5",
    name: "Vassal Kingdom",
    nameJp: "家来王国",
    level: 2,
    levelName: "Dasar",
    tagline: "Kerajaan Lembah - Bertransaksi & Menyapa Penduduk",
    description:
      "Kerajaan ramai di lembah subur. Kosakata dasar, tata bahasa esensial, partikel, dan Kanji pertama. Bab 1 (Stage 1-10): Belajar modul. Bab 2 (Stage 11-20): Ujian adaptif dengan huruf Jepang penuh.",
    color: "var(--kq-n5)",
    colorDark: "var(--kq-n5-dark)",
    icon: "🏰",
    stageCount: 20,
    chapterCount: 2,
  },
  {
    id: "n4",
    name: "Minato Port",
    nameJp: "湊の港",
    level: 3,
    levelName: "Madya Bawah",
    tagline: "Pelabuhan Transaksi - Bernegosiasi & Berlayar",
    description:
      "Pelabuhan ramai tempat pedagang berkumpul. Konjugasi kata kerja, partikel kompleks, dan Kanji lanjutan. Bab 1 (Stage 1-10): Verb forms. Bab 2 (Stage 11-20): Kanji & grammar. Bab 3 (Stage 21-30): Ujian adaptif. Bab 4 (Stage 31-40): Ujian akhir & kosakata sehari-hari.",
    color: "var(--kq-n4)",
    colorDark: "var(--kq-n4-dark)",
    icon: "⚓",
    stageCount: 40,
    chapterCount: 4,
  },
  {
    id: "n3",
    name: "Kage Clan",
    nameJp: "影一族",
    level: 4,
    levelName: "Madya",
    tagline: "Klan Ninja Bayangan - Membaca Gulungan Rahasia",
    description:
      "Desa ninja tersembunyi di pegunungan berkabut. Bahasa menengah, artikel berita, dan Kanji lanjutan. Baca gulungan rahasia, kuasai taktik strategi, dan ungkap konspirasi bayangan.",
    color: "var(--kq-n3)",
    colorDark: "var(--kq-n3-dark)",
    icon: "🥷",
    stageCount: 20,
    chapterCount: 2,
  },
  {
    id: "n2",
    name: "Tenno Citadel",
    nameJp: "天皇の砦",
    level: 5,
    levelName: "Madya Atas",
    tagline: "Benteng Kaisar - Bahasa Formal & Bisnis",
    description:
      "Benteng megah di puncak gunung. Bahasa formal, bisnis, dan Kanji tingkat tinggi. Hadiri rapat dewan kaisar, susun dokumen negara, dan bersiap menghadapi bos akhir.",
    color: "var(--kq-n2)",
    colorDark: "var(--kq-n2-dark)",
    icon: "🏯",
    stageCount: 20,
    chapterCount: 2,
  },
  {
    id: "n1",
    name: "Emperor's Throne",
    nameJp: "帝の玉座",
    level: 6,
    levelName: "Mahir",
    tagline: "Tahta Kaisar - Ujian Tertinggi & Literatur Kuno",
    description:
      "Aula tahta suci di langit. Tingkat mahir penuh, literatur kuno, Kanji tingkat ahli. Hadapi bos akhir absolut dan kuasai seluruh negeri bahasa Jepang.",
    color: "var(--kq-n1)",
    colorDark: "var(--kq-n1-dark)",
    icon: "👑",
    stageCount: 20,
    chapterCount: 2,
  },
];

export function getWorld(id: WorldId): World | undefined {
  return WORLDS.find((w) => w.id === id);
}
