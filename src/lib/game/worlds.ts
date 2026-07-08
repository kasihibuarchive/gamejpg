import type { World, WorldId } from "./types";

// ===== KOTOBAQUEST WORLDS =====
// Each world = one JLPT level region in the game.
// Inspired by PDF section "Arsitektur Kurikulum & Alur Progres".

export const WORLDS: World[] = [
  {
    id: "hajimari",
    name: "Hajimari Village",
    nameJp: "はじまりの里",
    jlpt: "DASAR",
    tagline: "Desa Awal - Hutan Magis Tempat Aksara Tersembunyi",
    description:
      "Petualangan dimulai! Di desa tersembunyi di tepi hutan magis, kamu akan mempelajari fondasi huruf Jepang: Hiragana & Katakana. Bab 1 (Hiragana) & Bab 2 (Katakana) - total 20 stage.",
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
    jlpt: "N5",
    tagline: "Kerajaan Lembah - Bertransaksi & Menyapa Penduduk",
    description:
      "Kerajaan yang ramai di lembah subur. Mempelajari kosakata dasar, tata bahasa esensial, partikel, dan ~100 Kanji pertama. Bantu penduduk kota bertransaksi, menyapa, dan menjalankan kehidupan sehari-hari. 10 stage penuh!",
    color: "var(--kq-n5)",
    colorDark: "var(--kq-n5-dark)",
    icon: "🏰",
    stageCount: 10,
    chapterCount: 1,
  },
  {
    id: "n4",
    name: "Minato Port",
    nameJp: "湊の港",
    jlpt: "N4",
    tagline: "Pelabuhan Transaksi - Bernegosiasi & Berlayar",
    description:
      "Pelabuhan ramai tempat pedagang dari seluruh negeri berkumpul. Percakapan sehari-hari, konjugasi kata kerja, dan ~300 Kanji. Negosiasikan harga dengan pelaut, perbaiki kapal, dan jelajahi pulau baru.",
    color: "var(--kq-n4)",
    colorDark: "var(--kq-n4-dark)",
    icon: "⚓",
    stageCount: 10,
  },
  {
    id: "n3",
    name: "Kage Clan",
    nameJp: "影一族",
    jlpt: "N3",
    tagline: "Klan Ninja Bayangan - Membaca Gulungan Rahasia",
    description:
      "Desa ninja tersembunyi di pegunungan berkabut. Bahasa Jepang tingkat menengah, artikel berita, dan ~650 Kanji. Baca gulungan rahasia, kuasai taktik strategi, dan ungkap konspirasi bayangan.",
    color: "var(--kq-n3)",
    colorDark: "var(--kq-n3-dark)",
    icon: "🥷",
    stageCount: 10,
  },
  {
    id: "n2",
    name: "Tenno Citadel",
    nameJp: "天皇の砦",
    jlpt: "N2",
    tagline: "Benteng Kaisar - Bahasa Formal & Bisnis",
    description:
      "Benteng megah di puncak gunung. Bahasa formal, bisnis, dan ~1000 Kanji. Hadiri rapat dewan kaisar, susun dokumen negara, dan bersiap menghadapi bos akhir.",
    color: "var(--kq-n2)",
    colorDark: "var(--kq-n2-dark)",
    icon: "🏯",
    stageCount: 10,
  },
  {
    id: "n1",
    name: "Emperor's Throne",
    nameJp: "帝の玉座",
    jlpt: "N1",
    tagline: "Tahta Kaisar - Ujian Tertinggi & Literatur Kuno",
    description:
      "Aula tahta suci di langit. Tingkat mahir penuh, literatur kuno, ~2000 Kanji. Hadapi bos akhir absolut dan kuasai seluruh negeri bahasa Jepang.",
    color: "var(--kq-n1)",
    colorDark: "var(--kq-n1-dark)",
    icon: "👑",
    stageCount: 10,
  },
];

export function getWorld(id: WorldId): World | undefined {
  return WORLDS.find((w) => w.id === id);
}
