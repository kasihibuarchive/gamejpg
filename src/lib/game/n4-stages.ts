import type { Stage } from "./types";

// ===== MINATO PORT - Tingkat Madya Bawah (20 STAGES, 2 CHAPTERS) =====
// Chapter 1 (Stage 1-10): Verb forms (te/nai/ta), daily conversation, basic kanji 100-200
// Chapter 2 (Stage 11-20): Advanced grammar, more kanji 200-300, complex sentences
// Story: Player arrives at Minato Port, helps sailors & merchants, fixes ships, explores islands

export const N4_STAGES: Stage[] = [
  // ===== STAGE 1: Tiba di Minato Port =====
  {
    id: "n4-1",
    worldId: "n4",
    index: 1,
    chapter: 1,
    title: "Tiba di Minato Port",
    subtitle: "Salam & Perkenalan Lanjutan",
    type: "lesson",
    intro: [
      "**Dermaga Minato Port - Pagi**",
      "Setelah perjalanan dari Vassal Kingdom, kau tiba di pelabuhan ramai Minato. Bau garam laut dan ikan segar menyapa.",
      "Pelaut tua menyapa: 「いらっしゃいませ! Selamat datang, pengelana!」",
      "「Di sini orang pakai bahasa lebih sopan. Pelajari salam formal & percakapan pelaut.」",
    ],
    outro: [
      "Pelaut tersenyum. 「いらっしゃいませ! Silakan masuk ke pelabuhan.」",
      "**Stage 1 selesai! +80 XP**",
    ],
    lesson: {
      title: "Salam Formal N4",
      rows: [
        { kana: "いらっしゃいませ", romaji: "irasshaimase", meaning: "selamat datang (formal, toko)" },
        { kana: "いただきます", romaji: "itadakimasu", meaning: "selamat makan (sebelum)" },
        { kana: "ごちそうさま", romaji: "gochisousama", meaning: "terima kasih untuk makanan" },
        { kana: "おやすみなさい", romaji: "oyasuminasai", meaning: "selamat malam (sebelum tidur)" },
        { kana: "はじめまして", romaji: "hajimemashite", meaning: "senang berkenalan" },
        { kana: "おげんきですか", romaji: "ogenki desu ka", meaning: "apa kabar (formal)" },
        { kana: "おかけください", romaji: "okake kudasai", meaning: "silakan duduk" },
        { kana: "しつれいします", romaji: "shitsurei shimasu", meaning: "permisi / maaf (masuk ruangan)" },
      ],
      note: "Salam formal N4 lebih panjang dari N5. 'irasshaimase' dipakai di toko/restoran.",
    },
    enemies: [
      {
        id: "dock-guard",
        name: "Penjaga Dermaga",
        sprite: "🧑‍✈️",
        hp: 8,
        attack: 3,
        color: "#4fc3f7",
        abilities: ["regen"],
      },
    ],
    questions: [
      { type: "choice", prompt: "「いらっしゃいませ」 dipakai di?", kana: "いらっしゃいませ", options: ["Toko/restoran", "Sekolah", "Rumah", "Kuil"], answer: 0 },
      { type: "typing", prompt: "Romaji 'selamat makan (sebelum)':", kana: "いただきます", answer: ["itadakimasu"] },
      { type: "choice", prompt: "「ごちそうさま」 artinya?", kana: "ごちそうさま", options: ["Selamat makan sebelum", "Terima kasih makanan", "Selamat malam", "Selamat tinggal"], answer: 1 },
      { type: "typing", prompt: "Romaji 'selamat malam (sebelum tidur)':", kana: "おやすみなさい", answer: ["oyasuminasai"] },
      { type: "choice", prompt: "「おげんきですか」 artinya?", kana: "おげんきですか", options: ["Apa kabar (formal)", "Siapa kamu", "Dimana", "Kapan"], answer: 0 },
    ],
    reward: { xp: 80 },
  },

  // ===== STAGE 2: Verb te-form basics =====
  {
    id: "n4-2",
    worldId: "n4",
    index: 2,
    chapter: 1,
    title: "Bentuk て (te-form)",
    subtitle: "Kata Kerja Bentuk te",
    type: "battle",
    intro: [
      "**Toko Perbekalan Pelaut**",
      "Pemilik toko: 「これを みて ください! Lihat ini!」",
      "「Bentuk て (te) penting untuk: permintaan, urutan aksi, hubungan. Pelajari!」",
    ],
    outro: ["Pemilik toko: 「Sekarang kau bisa minta & cerita urutan!」", "**Stage 2 selesai! +90 XP**"],
    lesson: {
      title: "te-form Dasar",
      rows: [
        { kana: "たべて", romaji: "tabete", meaning: "makan (te-form)" },
        { kana: "のんで", romaji: "nonde", meaning: "minum (te-form)" },
        { kana: "いって", romaji: "itte", meaning: "pergi (te-form)" },
        { kana: "きて", romaji: "kite", meaning: "datang (te-form)" },
        { kana: "みて", romaji: "mite", meaning: "lihat (te-form)" },
        { kana: "して", romaji: "shite", meaning: "lakukan (te-form)" },
        { kana: "かいて", romaji: "kaite", meaning: "tulis (te-form)" },
        { kana: "よんで", romaji: "yonde", meaning: "baca (te-form)" },
      ],
      note: "te-form dipakai untuk: permintaan (〜て ください), urutan (〜て、〜), sedang (〜ている).",
    },
    enemies: [
      { id: "verb-spirit", name: "Roh Kata Kerja", sprite: "👻", hp: 10, attack: 4, color: "#7e57c2", abilities: ["multi-attack"] },
    ],
    questions: [
      { type: "typing", prompt: "te-form dari たべる (makan):", kana: "たべて", answer: ["tabete"] },
      { type: "typing", prompt: "te-form dari のむ (minum):", kana: "のんで", answer: ["nonde"] },
      { type: "typing", prompt: "te-form dari いく (pergi):", kana: "いって", answer: ["itte"] },
      { type: "typing", prompt: "te-form dari みる (lihat):", kana: "みて", answer: ["mite"] },
      { type: "typing", prompt: "te-form dari する (lakukan):", kana: "して", answer: ["shite"] },
      { type: "typing", prompt: "te-form dari かく (tulis):", kana: "かいて", answer: ["kaite"] },
    ],
    reward: { xp: 90 },
  },

  // ===== STAGE 3: te-form request =====
  {
    id: "n4-3",
    worldId: "n4",
    index: 3,
    chapter: 1,
    title: "Permintaan dengan て",
    subtitle: "〜て ください (mohon)",
    type: "battle",
    intro: [
      "**Dermaga Perbaikan Kapal**",
      "Tukang kayu: 「これを なおして ください! Perbaiki ini!»",
      "「Bentuk 〜て ください = mohon/permintaan sopan. Pelajari!»",
    ],
    outro: ["Kapal terpasang. Tukang: «Terima kasih, pengelana!»", "**Stage 3 selesai! +100 XP**"],
    lesson: {
      title: "〜て ください (Permintaan)",
      rows: [
        { kana: "たべて ください", romaji: "tabete kudasai", meaning: "mohon makan" },
        { kana: "のんで ください", romaji: "nonde kudasai", meaning: "mohon minum" },
        { kana: "いって ください", romaji: "itte kudasai", meaning: "mohon pergi" },
        { kana: "みて ください", romaji: "mite kudasai", meaning: "mohon lihat" },
        { kana: "きいて ください", romaji: "kiite kudasai", meaning: "mohon dengar" },
        { kana: "まって ください", romaji: "matte kudasai", meaning: "mohon tunggu" },
      ],
      note: "〜て ください = mohon/silakan (permintaan sopan). Lebih sopan dari perintah langsung.",
    },
    enemies: [
      { id: "ship-breaker", name: "Penghancur Kapal", sprite: "🦑", hp: 12, attack: 4, color: "#26a69a", abilities: ["enrage"] },
    ],
    questions: [
      { type: "choice", prompt: "「たべて ください」 artinya?", kana: "たべて ください", options: ["Mohon makan", "Mohon minum", "Mohon pergi", "Mohon tunggu"], answer: 0 },
      { type: "typing", prompt: "Romaji 'mohon tunggu':", kana: "まって ください", answer: ["matte kudasai"] },
      { type: "typing", prompt: "te-form + kudasai dari のむ:", kana: "のんで ください", answer: ["nonde kudasai"] },
      { type: "choice", prompt: "「みて ください」 artinya?", kana: "みて ください", options: ["Mohon lihat", "Mohon dengar", "Mohon tunggu", "Mohon pergi"], answer: 0 },
      { type: "typing", prompt: "te-form + kudasai dari きく (dengar):", kana: "きいて ください", answer: ["kiite kudasai"] },
    ],
    reward: { xp: 100 },
  },

  // ===== STAGE 4: nai-form (negative) =====
  {
    id: "n4-4",
    worldId: "n4",
    index: 4,
    chapter: 1,
    title: "Bentuk Negatif ない",
    subtitle: "〜ない (tidak)",
    type: "battle",
    intro: [
      "**Pasar Ikan**",
      "Pedagang ikan: 「さかなを たべない? Tidak makan ikan?»",
      "「Bentuk 〜ない = negatif kata kerja. Pelajari!»",
    ],
    outro: ["Pedagang: «Paham negatif sekarang!»", "**Stage 4 selesai! +110 XP**"],
    lesson: {
      title: "nai-form (Negatif)",
      rows: [
        { kana: "たべない", romaji: "tabenai", meaning: "tidak makan" },
        { kana: "のまない", romaji: "nomanai", meaning: "tidak minum" },
        { kana: "いかない", romaji: "ikanai", meaning: "tidak pergi" },
        { kana: "こない", romaji: "konai", meaning: "tidak datang" },
        { kana: "みない", romaji: "minai", meaning: "tidak lihat" },
        { kana: "しない", romaji: "shinai", meaning: "tidak lakukan" },
        { kana: "かかない", romaji: "kakanai", meaning: "tidak tulis" },
        { kana: "よまない", romaji: "yomanai", meaning: "tidak baca" },
      ],
      note: "nai-form = negatif. Pola: ganti akhir → 〜ない. Untuk 〜ます: tabeMASU → tabeNAI.",
    },
    enemies: [
      { id: "negation-shade", name: "Bayangan Negasi", sprite: "🌫", hp: 14, attack: 5, color: "#607d8b", abilities: ["poison", "shield"] },
    ],
    questions: [
      { type: "typing", prompt: "nai-form dari たべる:", kana: "たべない", answer: ["tabenai"] },
      { type: "typing", prompt: "nai-form dari のむ:", kana: "のまない", answer: ["nomanai"] },
      { type: "typing", prompt: "nai-form dari いく:", kana: "いかない", answer: ["ikanai"] },
      { type: "typing", prompt: "nai-form dari くる (datang):", kana: "こない", answer: ["konai"] },
      { type: "typing", prompt: "nai-form dari する:", kana: "しない", answer: ["shinai"] },
      { type: "choice", prompt: "「よまない」 artinya?", kana: "よまない", options: ["Tidak baca", "Tidak tulis", "Tidak lihat", "Tidak dengar"], answer: 0 },
    ],
    reward: { xp: 110 },
  },

  // ===== STAGE 5: ta-form (past) =====
  {
    id: "n4-5",
    worldId: "n4",
    index: 5,
    chapter: 1,
    title: "Bentuk Lampau た",
    subtitle: "〜た (sudah)",
    type: "lesson",
    intro: [
      "**Warung Soba**",
      "Pelayan: 「もう たべた? Sudah makan?»",
      "「Bentuk 〜た = lampau (sudah). Pelajari!»",
    ],
    outro: ["Pelayan: «Sekarang bisa cerita masa lalu!»", "**Stage 5 selesai! +120 XP**"],
    lesson: {
      title: "ta-form (Lampau)",
      rows: [
        { kana: "たべた", romaji: "tabeta", meaning: "sudah makan" },
        { kana: "のんだ", romaji: "nonda", meaning: "sudah minum" },
        { kana: "いった", romaji: "itta", meaning: "sudah pergi" },
        { kana: "きた", romaji: "kita", meaning: "sudah datang" },
        { kana: "みた", romaji: "mita", meaning: "sudah lihat" },
        { kana: "した", romaji: "shita", meaning: "sudah lakukan" },
        { kana: "かいた", romaji: "kaita", meaning: "sudah tulis" },
        { kana: "よんだ", romaji: "yonda", meaning: "sudah baca" },
      ],
      note: "ta-form = lampau. Pola: te-form ganti て→た. tabete→tabeta, nonde→nonda.",
    },
    enemies: [
      { id: "time-echo", name: "Gema Waktu", sprite: "⏳", hp: 16, attack: 5, color: "#cddc39", abilities: ["shield", "regen"] },
    ],
    questions: [
      { type: "typing", prompt: "ta-form dari たべる:", kana: "たべた", answer: ["tabeta"] },
      { type: "typing", prompt: "ta-form dari のむ:", kana: "のんだ", answer: ["nonda"] },
      { type: "typing", prompt: "ta-form dari いく:", kana: "いった", answer: ["itta"] },
      { type: "typing", prompt: "ta-form dari くる:", kana: "きた", answer: ["kita"] },
      { type: "typing", prompt: "ta-form dari する:", kana: "した", answer: ["shita"] },
      { type: "choice", prompt: "「よんだ」 artinya?", kana: "よんだ", options: ["Sudah baca", "Sudah tulis", "Sudah lihat", "Sudah dengar"], answer: 0 },
    ],
    reward: { xp: 120 },
  },

  // ===== STAGE 6: Mini-boss - verb conjugation master =====
  {
    id: "n4-6",
    worldId: "n4",
    index: 6,
    chapter: 1,
    title: "Ujian Konjugasi",
    subtitle: "Mini-Boss: Master Konjugasi",
    type: "mini-boss",
    intro: [
      "**Gudang Pelabuhan**",
      "Sesosok pria tua berjanggut muncul: 「Aku **Konju**, master konjugasi. Lemati ujianku!»",
      "「Kau harus menguasai semua bentuk: ます, て, ない, た. Mulai!»",
    ],
    outro: ["Konju: «Kau lulus! Lanjut ke pulau utama.»", "**Stage 6 selesai! +180 XP, Badge: Lulus Konjugasi**"],
    lesson: undefined,
    enemies: [
      { id: "konju", name: "Konju Master Konjugasi", sprite: "🧙‍♂️", hp: 40, attack: 6, color: "#7c4dff", abilities: ["enrage", "shield", "counter"] },
    ],
    questions: [
      { type: "choice", prompt: "「te-form dari たべる」", options: ["たべて", "たべた", "たべない", "たべます"], answer: 0 },
      { type: "choice", prompt: "「nai-form dari のむ」", options: ["のんで", "のまない", "のんだ", "のみます"], answer: 1 },
      { type: "choice", prompt: "「ta-form dari いく」", options: ["いって", "いかない", "いった", "いきます"], answer: 2 },
      { type: "typing", prompt: "te-form + kudasai dari みる:", kana: "みて ください", answer: ["mite kudasai"] },
      { type: "typing", prompt: "nai-form dari する:", kana: "しない", answer: ["shinai"] },
      { type: "typing", prompt: "ta-form dari かく:", kana: "かいた", answer: ["kaita"] },
      { type: "choice", prompt: "「まって ください」 artinya?", kana: "まって ください", options: ["Mohon tunggu", "Mohon lihat", "Mohon dengar", "Mohon pergi"], answer: 0 },
      { type: "typing", prompt: "nai-form dari よむ:", kana: "よまない", answer: ["yomanai"] },
    ],
    reward: { xp: 180, badge: "Lulus Konjugasi" },
  },

  // ===== STAGE 7: Particles に, で, へ =====
  {
    id: "n4-7",
    worldId: "n4",
    index: 7,
    chapter: 1,
    title: "Partikel Arah & Lokasi",
    subtitle: "に, で, へ",
    type: "battle",
    intro: [
      "**Peta Pelabuhan**",
      "Navigator: 「どこへ いきますか? Mau ke mana?»",
      "「Partikel に (tujuan), で (lokasi aksi), へ (arah). Pelajari!»",
    ],
    outro: ["Navigator: «Sekarang kau bisa cari arah!»", "**Stage 7 selesai! +130 XP**"],
    lesson: {
      title: "Partikel に・で・へ",
      rows: [
        { kana: "がっこうに いく", romaji: "gakkou ni iku", meaning: "pergi ke sekolah (tujuan)" },
        { kana: "みせで かう", romaji: "mise de kau", meaning: "beli di toko (lokasi aksi)" },
        { kana: "うみへ いく", romaji: "umi e iku", meaning: "pergi ke laut (arah)" },
        { kana: "いえに かえる", romaji: "ie ni kaeru", meaning: "pulang ke rumah" },
        { kana: "としょかんで べんきょうする", romaji: "toshokan de benkyou suru", meaning: "belajar di perpustakaan" },
      ],
      note: "に = tujuan/waktu, で = lokasi aksi/tempat, へ = arah (dibaca 'e').",
    },
    enemies: [
      { id: "lost-sailor", name: "Pelaut Tersesat", sprite: "🧭", hp: 18, attack: 5, color: "#4fc3f7", abilities: ["time-pressure"] },
    ],
    questions: [
      { type: "choice", prompt: "「がっこう___いく」 partikel yang benar?", kana: "がっこうに いく", options: ["に", "で", "を", "が"], answer: 0 },
      { type: "choice", prompt: "「みせ___かう」 partikel yang benar?", kana: "みせで かう", options: ["に", "で", "へ", "が"], answer: 1 },
      { type: "choice", prompt: "「うみ___いく」 partikel yang benar?", kana: "うみへ いく", options: ["に", "で", "へ", "を"], answer: 2 },
      { type: "choice", prompt: "Partikel 'tujuan/waktu':", options: ["に", "で", "へ", "を"], answer: 0 },
      { type: "choice", prompt: "Partikel 'lokasi aksi':", options: ["に", "で", "へ", "が"], answer: 1 },
      { type: "typing", prompt: "Romaji 'pulang ke rumah':", kana: "いえに かえる", answer: ["ie ni kaeru"] },
    ],
    reward: { xp: 130 },
  },

  // ===== STAGE 8: Adjective past form =====
  {
    id: "n4-8",
    worldId: "n4",
    index: 8,
    chapter: 1,
    title: "Kata Sifat Lampau",
    subtitle: "Sifat -i & -na bentuk lampau",
    type: "battle",
    intro: [
      "**Toko Pakaian**",
      "Penjahit: 「この ふくは たかかった! Baju ini mahal!»",
      "「Sifat -i bentuk lampau: 〜かった. Sifat -na: 〜だった. Pelajari!»",
    ],
    outro: ["Penjahit: «Sekarang bisa deskripsi masa lalu!»", "**Stage 8 selesai! +140 XP**"],
    lesson: {
      title: "Sifat Lampau",
      rows: [
        { kana: "たかかった", romaji: "takakatta", meaning: "mahal (lampau -i)" },
        { kana: "たのしかった", romaji: "tanoshikatta", meaning: "seru (lampau -i)" },
        { kana: "おいしかった", romaji: "oishikatta", meaning: "enak (lampau -i)" },
        { kana: "しずかだった", romaji: "shizuka datta", meaning: "tenang (lampau -na)" },
        { kana: "きれいだった", romaji: "kirei datta", meaning: "cantik (lampau -na)" },
        { kana: "げんきだった", romaji: "genki datta", meaning: "sehat (lampau -na)" },
      ],
      note: "Sifat -i lampau: ganti い→かった (たかい→たかかった). Sifat -na lampau: 〜だった.",
    },
    enemies: [
      { id: "fashion-critic", name: "Kritikus Mode", sprite: "👘", hp: 20, attack: 6, color: "#e91e63", abilities: ["crit", "shield"] },
    ],
    questions: [
      { type: "typing", prompt: "Lampau dari たかい (mahal):", kana: "たかかった", answer: ["takakatta"] },
      { type: "typing", prompt: "Lampau dari たのしい (seru):", kana: "たのしかった", answer: ["tanoshikatta"] },
      { type: "typing", prompt: "Lampau dari きれい (cantik, -na):", kana: "きれいだった", answer: ["kirei datta"] },
      { type: "choice", prompt: "Lampau dari sifat -i, polanya?", options: ["〜かった", "〜だった", "〜た", "〜た"], answer: 0 },
      { type: "choice", prompt: "Lampau dari sifat -na, polanya?", options: ["〜かった", "〜だった", "〜た", "〜て"], answer: 1 },
      { type: "typing", prompt: "Lampau dari げんき (sehat, -na):", kana: "げんきだった", answer: ["genki datta"] },
    ],
    reward: { xp: 140 },
  },

  // ===== STAGE 9: Want to / want to do =====
  {
    id: "n4-9",
    worldId: "n4",
    index: 9,
    chapter: 1,
    title: "Keinginan たい",
    subtitle: "〜たい (ingin)",
    type: "battle",
    intro: [
      "**Kafe Pelabuhan**",
      "Anak kecil: 「アイスクリームを たべたい! Ingin makan es krim!»",
      "「Bentuk 〜たい = ingin. Pelajari!»",
    ],
    outro: ["Anak kecil tersenyum: «Paham keinginan sekarang!»", "**Stage 9 selesai! +150 XP**"],
    lesson: {
      title: "〜たい (Ingin)",
      rows: [
        { kana: "たべたい", romaji: "tabetai", meaning: "ingin makan" },
        { kana: "のみたい", romaji: "nomitai", meaning: "ingin minum" },
        { kana: "いきたい", romaji: "ikitai", meaning: "ingin pergi" },
        { kana: "みたい", romaji: "mitai", meaning: "ingin lihat" },
        { kana: "かいものを したい", romaji: "kaimono o shitai", meaning: "ingin belanja" },
      ],
      note: "〜たい = ingin. Pola: stem + たい. Bisa konjugasi: たかった (lampau), たくない (negatif).",
    },
    enemies: [
      { id: "wish-thief", name: "Pencuri Keinginan", sprite: "💭", hp: 22, attack: 6, color: "#9c27b0", abilities: ["poison", "multi-attack"] },
    ],
    questions: [
      { type: "typing", prompt: "「ingin makan」:", kana: "たべたい", answer: ["tabetai"] },
      { type: "typing", prompt: "「ingin minum」:", kana: "のみたい", answer: ["nomitai"] },
      { type: "typing", prompt: "「ingin pergi」:", kana: "いきたい", answer: ["ikitai"] },
      { type: "choice", prompt: "「みたい」 artinya?", kana: "みたい", options: ["Ingin lihat", "Ingin makan", "Ingin pergi", "Ingin minum"], answer: 0 },
      { type: "typing", prompt: "Romaji 'ingin belanja':", kana: "かいものを したい", answer: ["kaimono o shitai"] },
    ],
    reward: { xp: 150 },
  },

  // ===== STAGE 10: Boss Chapter 1 =====
  {
    id: "n4-10",
    worldId: "n4",
    index: 10,
    chapter: 1,
    title: "Captain Maru",
    subtitle: "Bos Akhir Bab 1 N4",
    type: "boss",
    intro: [
      "**Kapal Besar di Dermaga**",
      "Di kapal terbesar, **Captain Maru** menunggu. 「Pengelana, kalahkan aku untuk dapat tiket ke pulau utama!»",
      "「Ujian akhir Bab 1: gabungan verb forms, particles, sifat, keinginan!»",
      "**PERTARUNGAN AKHIR BAB 1 N4**",
    ],
    outro: [
      "Captain Maru tertawa: «Kau hebat! Tiket ke pulau utama adalah milikmu!»",
      "**BAB 1 N4 SELESAI! +500 XP, Badge: Pengelana Pelabuhan, Item: Tiket Pulau**",
    ],
    lesson: undefined,
    enemies: [
      { id: "captain-maru", name: "Captain Maru", sprite: "🧑‍🦲", hp: 108, attack: 8, color: "#ff9800", abilities: ["enrage", "heal", "crit", "shield", "multi-attack", "counter"] },
    ],
    questions: [
      { type: "typing", prompt: "te-form dari たべる:", kana: "たべて", answer: ["tabete"] },
      { type: "typing", prompt: "nai-form dari のむ:", kana: "のまない", answer: ["nomanai"] },
      { type: "typing", prompt: "ta-form dari いく:", kana: "いった", answer: ["itta"] },
      { type: "choice", prompt: "「みせ___かう」 partikel?", kana: "みせで かう", options: ["に", "で", "へ", "を"], answer: 1 },
      { type: "typing", prompt: "Lampau dari たのしい (seru):", kana: "たのしかった", answer: ["tanoshikatta"] },
      { type: "typing", prompt: "「ingin pergi」:", kana: "いきたい", answer: ["ikitai"] },
      { type: "typing", prompt: "te-form + kudasai dari まつ (tunggu):", kana: "まって ください", answer: ["matte kudasai"] },
      { type: "choice", prompt: "「たかかった」 artinya?", kana: "たかかった", options: ["Mahal (lampau)", "Mahal (sekarang)", "Murah (lampau)", "Tinggi (sekarang)"], answer: 0 },
      { type: "typing", prompt: "nai-form dari する:", kana: "しない", answer: ["shinai"] },
      { type: "choice", prompt: "「いらっしゃいませ」 dipakai di?", kana: "いらっしゃいませ", options: ["Toko", "Rumah", "Sekolah", "Kuil"], answer: 0 },
    ],
    reward: { xp: 500, badge: "Pengelana Pelabuhan", item: "Tiket Pulau" },
  },

  // ===== STAGE 11: Kanji angka lanjut (100, 1000) =====
  {
    id: "n4-11",
    worldId: "n4",
    index: 11,
    chapter: 2,
    title: "Pulau Utama - Kanji Angka Besar",
    subtitle: "百 千 万",
    type: "lesson",
    intro: [
      "**Pulau Utama - Pasar Besar**",
      "Setelah sampai pulau utama, kau lihat pedagang pakai angka besar: 「百円! 千円! 万円!»",
      "「Kanji angka besar: 百 (100), 千 (1000), 万 (10000). Pelajari!»",
    ],
    outro: ["Pedagang: «Sekarang kau bisa baca harga!»", "**Stage 11 selesai! +160 XP**"],
    lesson: {
      title: "Kanji Angka Besar",
      rows: [
        { kana: "百", romaji: "hyaku", meaning: "100 (seratus)" },
        { kana: "千", romaji: "sen", meaning: "1000 (seribu)" },
        { kana: "万", romaji: "man", meaning: "10000 (sepuluh ribu)" },
        { kana: "百万", romaji: "hyakuman", meaning: "1,000,000 (satu juta)" },
        { kana: "三百", romaji: "sanbyaku", meaning: "300 (perhatikan: byaku)" },
        { kana: "六百", romaji: "roppyaku", meaning: "600 (perhatikan: ppyaku)" },
        { kana: "八百", romaji: "happyaku", meaning: "800 (perhatikan: ppyaku)" },
        { kana: "三千", romaji: "sanzen", meaning: "3000 (perhatikan: zen)" },
      ],
      note: "百 dibaca hyaku, tapi 300=sanbyaku, 600=roppyaku, 800=happyaku. 千 dibaca sen, tapi 3000=sanzen.",
    },
    enemies: [
      { id: "price-math", name: "Matematika Harga", sprite: "🔢", hp: 24, attack: 7, color: "#ff9800", abilities: ["time-pressure"] },
    ],
    questions: [
      { type: "choice", prompt: "Kanji '百' berarti?", kana: "百", options: ["10", "100", "1000", "10000"], answer: 1 },
      { type: "choice", prompt: "Kanji '千' berarti?", kana: "千", options: ["100", "1000", "10000", "100000"], answer: 1 },
      { type: "choice", prompt: "Kanji '万' berarti?", kana: "万", options: ["1000", "10000", "100000", "1000000"], answer: 1 },
      { type: "typing", prompt: "Romaji '三百' (hati-hati!):", kana: "三百", answer: ["sanbyaku"] },
      { type: "typing", prompt: "Romaji '六百':", kana: "六百", answer: ["roppyaku"] },
      { type: "typing", prompt: "Romaji '三千':", kana: "三千", answer: ["sanzen"] },
    ],
    reward: { xp: 160 },
  },

  // ===== STAGE 12: Kanji waktu/tanggal =====
  {
    id: "n4-12",
    worldId: "n4",
    index: 12,
    chapter: 2,
    title: "Kanji Waktu & Tanggal",
    subtitle: "年 月 日 時 分",
    type: "battle",
    intro: [
      "**Menara Jam Pulau**",
      "Penjaga jam: 「何時ですか? Pukul berapa?»",
      "「Kanji waktu: 年 (tahun), 月 (bulan), 日 (hari), 時 (jam), 分 (menit).»",
    ],
    outro: ["Penjaga: «Sekarang bisa baca tanggal & jam!»", "**Stage 12 selesai! +170 XP**"],
    lesson: {
      title: "Kanji Waktu",
      rows: [
        { kana: "年", romaji: "nen/toshi", meaning: "tahun" },
        { kana: "月", romaji: "tsuki/getsu", meaning: "bulan (kalender/moon)" },
        { kana: "日", romaji: "hi/nichi", meaning: "hari (tanggal/sun)" },
        { kana: "時", romaji: "ji/toki", meaning: "jam / waktu" },
        { kana: "分", romaji: "fun/pun", meaning: "menit / bagian" },
        { kana: "時間", romaji: "jikan", meaning: "durasi waktu (jam)" },
        { kana: "今朝", romaji: "kesa", meaning: "tadi pagi" },
        { kana: "今晩", romaji: "konban", meaning: "nanti malam" },
      ],
      note: "時 (ji) untuk jam, 分 (fun/pun) untuk menit. 3時 = pukul 3, 3時半 = pukul 3.30.",
    },
    enemies: [
      { id: "clock-phantom", name: "Hantu Jam", sprite: "🕐", hp: 26, attack: 7, color: "#cddc39", abilities: ["time-pressure", "shield"] },
    ],
    questions: [
      { type: "choice", prompt: "Kanji '年' berarti?", kana: "年", options: ["Hari", "Bulan", "Tahun", "Jam"], answer: 2 },
      { type: "choice", prompt: "Kanji '日' berarti?", kana: "日", options: ["Hari/tanggal", "Bulan", "Tahun", "Menit"], answer: 0 },
      { type: "choice", prompt: "Kanji '時' berarti?", kana: "時", options: ["Menit", "Jam", "Hari", "Tahun"], answer: 1 },
      { type: "typing", prompt: "Romaji 'durasi waktu':", kana: "時間", answer: ["jikan"] },
      { type: "typing", prompt: "Romaji 'tadi pagi':", kana: "今朝", answer: ["kesa"] },
      { type: "choice", prompt: "「分」 dibaca sebagai?", kana: "分", options: ["fun/pun", "ji", "nen", "hi"], answer: 0 },
    ],
    reward: { xp: 170 },
  },

  // ===== STAGE 13: Kanji keluarga =====
  {
    id: "n4-13",
    worldId: "n4",
    index: 13,
    chapter: 2,
    title: "Kanji Keluarga",
    subtitle: "父 母 兄 姉 弟 妹",
    type: "lesson",
    intro: [
      "**Rumah Keluarga Pelaut**",
      "Keluarga pelaut menyambut: 「ちちとははとあにとあねと...»",
      "「Kanji keluarga: 父 (ayah), 母 (ibu), 兄 (kakak laki), 姉 (kakak perempuan). Pelajari!»",
    ],
    outro: ["Keluarga: «Sekarang kenal keluarga Jepang!»", "**Stage 13 selesai! +180 XP**"],
    lesson: {
      title: "Kanji Keluarga",
      rows: [
        { kana: "父", romaji: "chichi/otousan", meaning: "ayah" },
        { kana: "母", romaji: "haha/okaasan", meaning: "ibu" },
        { kana: "兄", romaji: "ani/oniisan", meaning: "kakak laki-laki" },
        { kana: "姉", romaji: "ane/oneesan", meaning: "kakak perempuan" },
        { kana: "弟", romaji: "otouto", meaning: "adik laki-laki" },
        { kana: "妹", romaji: "imouto", meaning: "adik perempuan" },
        { kana: "祖父", romaji: "sofu", meaning: "kakek" },
        { kana: "祖母", romaji: "sobo", meaning: "nenek" },
      ],
      note: "Versi sendiri: chichi/haha (ayah/ibu). Versi orang lain: otousan/okaasan. 兄=ani, 姉=ane.",
    },
    enemies: [
      { id: "family-tree", name: "Pohon Keluarga", sprite: "🌳", hp: 28, attack: 7, color: "#4caf50", abilities: ["regen", "shield"] },
    ],
    questions: [
      { type: "choice", prompt: "Kanji '父' berarti?", kana: "父", options: ["Ibu", "Ayah", "Kakak", "Adik"], answer: 1 },
      { type: "choice", prompt: "Kanji '母' berarti?", kana: "母", options: ["Ibu", "Ayah", "Nenek", "Tante"], answer: 0 },
      { type: "choice", prompt: "Kanji '兄' berarti?", kana: "兄", options: ["Adik laki", "Kakak laki", "Adik perempuan", "Kakak perempuan"], answer: 1 },
      { type: "choice", prompt: "Kanji '姉' berarti?", kana: "姉", options: ["Adik laki", "Kakak laki", "Adik perempuan", "Kakak perempuan"], answer: 3 },
      { type: "typing", prompt: "Romaji 'adik perempuan':", kana: "妹", answer: ["imouto"] },
      { type: "typing", prompt: "Romaji 'kakek':", kana: "祖父", answer: ["sofu"] },
    ],
    reward: { xp: 180 },
  },

  // ===== STAGE 14: Kanji alam =====
  {
    id: "n4-14",
    worldId: "n4",
    index: 14,
    chapter: 2,
    title: "Kanji Alam",
    subtitle: "山 川 海 空 雨",
    type: "battle",
    intro: [
      "**Bukit Pulau**",
      "Pemandu: 「やまとうみとそら! Gunung, laut, langit!»",
      "「Kanji alam: 山 (gunung), 川 (sungai), 海 (laut), 空 (langit), 雨 (hujan).»",
    ],
    outro: ["Pemandu: «Pemandangan pulau kini bisa deskripsikan!»", "**Stage 14 selesai! +190 XP**"],
    lesson: {
      title: "Kanji Alam",
      rows: [
        { kana: "山", romaji: "yama", meaning: "gunung" },
        { kana: "川", romaji: "kawa", meaning: "sungai" },
        { kana: "海", romaji: "umi", meaning: "laut" },
        { kana: "空", romaji: "sora", meaning: "langit" },
        { kana: "雨", romaji: "ame", meaning: "hujan" },
        { kana: "風", romaji: "kaze", meaning: "angin" },
        { kana: "雪", romaji: "yuki", meaning: "salju" },
        { kana: "森", romaji: "mori", meaning: "hutan" },
      ],
      note: "山 (gunung), 川 (sungai - 3 garis air), 海 (laut - air + setiap), 森 (hutan - 3 pohon).",
    },
    enemies: [
      { id: "storm-spirit", name: "Roh Badai", sprite: "⛈", hp: 30, attack: 8, color: "#2196f3", abilities: ["crit", "multi-attack"] },
    ],
    questions: [
      { type: "choice", prompt: "Kanji '山' berarti?", kana: "山", options: ["Sungai", "Gunung", "Laut", "Hutan"], answer: 1 },
      { type: "choice", prompt: "Kanji '海' berarti?", kana: "海", options: ["Sungai", "Danau", "Laut", "Hujan"], answer: 2 },
      { type: "typing", prompt: "Romaji 'langit':", kana: "空", answer: ["sora"] },
      { type: "typing", prompt: "Romaji 'hujan':", kana: "雨", answer: ["ame"] },
      { type: "typing", prompt: "Romaji 'hutan':", kana: "森", answer: ["mori"] },
      { type: "choice", prompt: "Kanji '風' berarti?", kana: "風", options: ["Hujan", "Angin", "Salju", "Petir"], answer: 1 },
    ],
    reward: { xp: 190 },
  },

  // ===== STAGE 15: Kanji tubuh =====
  {
    id: "n4-15",
    worldId: "n4",
    index: 15,
    chapter: 2,
    title: "Kanji Tubuh",
    subtitle: "目 口 手 足 心",
    type: "battle",
    intro: [
      "**Klinik Pulau**",
      "Dokter: 「めとくちとて! Mata, mulut, tangan!»",
      "「Kanji tubuh: 目 (mata), 口 (mulut), 手 (tangan), 足 (kaki), 心 (hati).»",
    ],
    outro: ["Dokter: «Sekarang bisa periksa bagian tubuh!»", "**Stage 15 selesai! +200 XP**"],
    lesson: {
      title: "Kanji Tubuh",
      rows: [
        { kana: "目", romaji: "me", meaning: "mata" },
        { kana: "口", romaji: "kuchi", meaning: "mulut" },
        { kana: "手", romaji: "te", meaning: "tangan" },
        { kana: "足", romaji: "ashi", meaning: "kaki / cukup" },
        { kana: "心", romaji: "kokoro", meaning: "hati (jiwa)" },
        { kana: "耳", romaji: "mimi", meaning: "telinga" },
        { kana: "鼻", romaji: "hana", meaning: "hidung" },
        { kana: "頭", romaji: "atama", meaning: "kepala" },
      ],
      note: "目 (mata - gambar mata), 口 (mulut - gambar mulut), 手 (tangan), 足 (kaki).",
    },
    enemies: [
      { id: "body-mage", name: "Penyihir Tubuh", sprite: "🧟", hp: 32, attack: 8, color: "#7e57c2", abilities: ["poison", "regen"] },
    ],
    questions: [
      { type: "choice", prompt: "Kanji '目' berarti?", kana: "目", options: ["Mulut", "Mata", "Telinga", "Hidung"], answer: 1 },
      { type: "choice", prompt: "Kanji '手' berarti?", kana: "手", options: ["Kaki", "Tangan", "Kepala", "Hati"], answer: 1 },
      { type: "typing", prompt: "Romaji 'mulut':", kana: "口", answer: ["kuchi"] },
      { type: "typing", prompt: "Romaji 'kaki':", kana: "足", answer: ["ashi"] },
      { type: "typing", prompt: "Romaji 'hati (jiwa)':", kana: "心", answer: ["kokoro"] },
      { type: "choice", prompt: "Kanji '頭' berarti?", kana: "頭", options: ["Wajah", "Kepala", "Rambut", "Leher"], answer: 1 },
    ],
    reward: { xp: 200 },
  },

  // ===== STAGE 16: Conditional たら =====
  {
    id: "n4-16",
    worldId: "n4",
    index: 16,
    chapter: 2,
    title: "Kondisional たら",
    subtitle: "〜たら (jika)",
    type: "lesson",
    intro: [
      "**Tavern Pulau**",
      "Pemilik tavern: 「あめが ふったら、 いかない! Kalau hujan, tidak pergi!»",
      "「Bentuk 〜たら = jika. Pelajari!»",
    ],
    outro: ["Pemilik: «Sekarang bisa kalimat bersyarat!»", "**Stage 16 selesai! +210 XP**"],
    lesson: {
      title: "〜たら (Jika)",
      rows: [
        { kana: "いったら", romaji: "ittara", meaning: "jika pergi" },
        { kana: "たべたら", romaji: "tabetara", meaning: "jika makan" },
        { kana: "あめが ふったら", romaji: "ame ga futtara", meaning: "jika hujan turun" },
        { kana: "やすみだったら", romaji: "yasumi dattara", meaning: "jika libur" },
      ],
      note: "〜たら = jika. Pola: ta-form + ra. tabeta + ra = tabetara. Bisa juga sifat: たかかったら.",
    },
    enemies: [
      { id: "if-demon", name: "Setan Jika", sprite: "😈", hp: 34, attack: 9, color: "#e91e63", abilities: ["crit", "enrage"] },
    ],
    questions: [
      { type: "typing", prompt: "「jika makan」 (〜たら dari たべる):", kana: "たべたら", answer: ["tabetara"] },
      { type: "typing", prompt: "「jika pergi」:", kana: "いったら", answer: ["ittara"] },
      { type: "typing", prompt: "Romaji 'jika hujan turun':", kana: "あめが ふったら", answer: ["ame ga futtara"] },
      { type: "choice", prompt: "「〜たら」 artinya?", options: ["Karena", "Jika", "Tetapi", "Sehingga"], answer: 1 },
      { type: "choice", prompt: "Pola 〜たら dibuat dari?", options: ["te-form + ra", "ta-form + ra", "nai-form + ra", "masu + ra"], answer: 1 },
    ],
    reward: { xp: 210 },
  },

  // ===== STAGE 17: Reason から / でも =====
  {
    id: "n4-17",
    worldId: "n4",
    index: 17,
    chapter: 2,
    title: "Sebab & Lawan",
    subtitle: "〜から (karena) / 〜でも (tetapi)",
    type: "battle",
    intro: [
      "**Balai Kota Pulau**",
      "Petugas: 「あめだから、 いきません。でも、 あした いきます!»",
      "「から = karena, でも = tetapi. Pelajari!»",
    ],
    outro: ["Petugas: «Sekarang bisa kasih alasan & bantah!»", "**Stage 17 selesai! +220 XP**"],
    lesson: {
      title: "から・でも",
      rows: [
        { kana: "あめだから", romaji: "ame da kara", meaning: "karena hujan" },
        { kana: "たかいから", romaji: "takai kara", meaning: "karena mahal" },
        { kana: "でも", romaji: "demo", meaning: "tetapi / namun" },
        { kana: "つかれた。でも、 いく", romaji: "tsukareta. demo, iku", meaning: "Lelah. Tapi, pergi." },
      ],
      note: "から = karena (sebab). でも = tetapi (lawan). Beda でも dengan そして (dan/lalu).",
    },
    enemies: [
      { id: "logic-guard", name: "Penjaga Logika", sprite: "🤔", hp: 36, attack: 9, color: "#607d8b", abilities: ["counter", "shield"] },
    ],
    questions: [
      { type: "choice", prompt: "「から」 artinya?", options: ["Karena", "Tetapi", "Dan", "Atau"], answer: 0 },
      { type: "choice", prompt: "「でも」 artinya?", options: ["Karena", "Tetapi", "Jika", "Sehingga"], answer: 1 },
      { type: "typing", prompt: "Romaji 'karena hujan':", kana: "あめだから", answer: ["ame da kara"] },
      { type: "choice", prompt: "「たかいから」 artinya?", kana: "たかいから", options: ["Karena mahal", "Tapi mahal", "Jika mahal", "Mahal dan"], answer: 0 },
      { type: "typing", prompt: "Romaji 'tetapi':", kana: "でも", answer: ["demo"] },
    ],
    reward: { xp: 220 },
  },

  // ===== STAGE 18: Giving & receiving =====
  {
    id: "n4-18",
    worldId: "n4",
    index: 18,
    chapter: 2,
    title: "Memberi & Menerima",
    subtitle: "あげる / もらう / くれる",
    type: "lesson",
    intro: [
      "**Toko Hadiah**",
      "Penjaga toko: 「これを あなたに あげます! Ini saya berikan padamu!»",
      "「あげる (beri), もらう (terima), くれる (beri ke saya). Pelajari!»",
    ],
    outro: ["Penjaga: «Sekarang bisa transaksi hadiah!»", "**Stage 18 selesai! +230 XP**"],
    lesson: {
      title: "あげる・もらう・くれる",
      rows: [
        { kana: "あげる", romaji: "ageru", meaning: "memberi (ke orang lain)" },
        { kana: "もらう", romaji: "morau", meaning: "menerima (dari orang lain)" },
        { kana: "くれる", romaji: "kureru", meaning: "memberi (ke saya)" },
        { kana: "ほんを あげる", romaji: "hon o ageru", meaning: "memberi buku" },
        { kana: "ほんを もらう", romaji: "hon o morau", meaning: "menerima buku" },
      ],
      note: "あげる = saya beri ke orang lain. もらう = saya terima dari orang. くれる = orang lain beri ke saya.",
    },
    enemies: [
      { id: "gift-bandit", name: "Perampok Hadiah", sprite: "🥷", hp: 38, attack: 10, color: "#9c27b0", abilities: ["multi-attack", "poison"] },
    ],
    questions: [
      { type: "choice", prompt: "「あげる」 artinya?", kana: "あげる", options: ["Menerima", "Memberi (ke orang)", "Meminta", "Meminjam"], answer: 1 },
      { type: "choice", prompt: "「もらう」 artinya?", kana: "もらう", options: ["Memberi", "Menerima (dari orang)", "Membeli", "Menjual"], answer: 1 },
      { type: "choice", prompt: "「くれる」 dipakai kalau?", kana: "くれる", options: ["Saya beri ke orang", "Orang beri ke saya", "Saya terima", "Orang terima"], answer: 1 },
      { type: "typing", prompt: "Romaji 'memberi buku':", kana: "ほんを あげる", answer: ["hon o ageru"] },
      { type: "typing", prompt: "Romaji 'menerima buku':", kana: "ほんを もらう", answer: ["hon o morau"] },
    ],
    reward: { xp: 230 },
  },

  // ===== STAGE 19: Passive form =====
  {
    id: "n4-19",
    worldId: "n4",
    index: 19,
    chapter: 2,
    title: "Bentuk Pasif",
    subtitle: "〜られる / 〜れる (pasif)",
    type: "battle",
    intro: [
      "**Pengadilan Pulau**",
      "Hakim: 「ぬすまれた! Dicuri!»",
      "「Pasif: 〜られる (grup 1), 〜れる (grup 2). Pelajari!»",
    ],
    outro: ["Hakim: «Sekarang bisa lapor pasif!»", "**Stage 19 selesai! +240 XP**"],
    lesson: {
      title: "Pasif",
      rows: [
        { kana: "たべられる", romaji: "taberareru", meaning: "dimakan (pasif)" },
        { kana: "ぬすまれる", romaji: "nusumareru", meaning: "dicuri (pasif)" },
        { kana: "みられる", romaji: "mirareru", meaning: "dilihat (pasif)" },
        { kana: "される", romaji: "sareru", meaning: "dilakukan (pasif)" },
      ],
      note: "Pasif: subjek dikenai aksi. たべる → たべられる (dimakan). Pola grup 1: 〜れる, grup 2: 〜られる.",
    },
    enemies: [
      { id: "passive-shadow", name: "Bayangan Pasif", sprite: "👤", hp: 40, attack: 10, color: "#37474f", abilities: ["shield", "counter", "enrage"] },
    ],
    questions: [
      { type: "typing", prompt: "Pasif dari たべる (makan):", kana: "たべられる", answer: ["taberareru"] },
      { type: "typing", prompt: "Pasif dari する (lakukan):", kana: "される", answer: ["sareru"] },
      { type: "typing", prompt: "Romaji 'dicuri':", kana: "ぬすまれる", answer: ["nusumareru"] },
      { type: "choice", prompt: "「たべられる」 artinya?", kana: "たべられる", options: ["Makan", "Dimakan", "Ingin makan", "Mohon makan"], answer: 1 },
      { type: "choice", prompt: "Bentuk pasif menunjukkan?", options: ["Subjek melakukan aksi", "Subjek dikenai aksi", "Subjek ingin aksi", "Subjek minta aksi"], answer: 1 },
    ],
    reward: { xp: 240 },
  },

  // ===== STAGE 20: Boss Chapter 2 N4 =====
  {
    id: "n4-20",
    worldId: "n4",
    index: 20,
    chapter: 2,
    title: "Lord Kaizoku",
    subtitle: "Bos Akhir Bab 2 N4 - Raja Bajak Laut",
    type: "boss",
    intro: [
      "**Kapal Bajak Laut Besar**",
      "Di geladak kapal bajak laut, **Lord Kaizoku** menunggu. 「Pengelana, kalahkan aku untuk kuasai seluruh N4!»",
      "「Ujian akhir: gabungan semua N4 - verb forms, kanji, grammar, pasif, kondisional!»",
      "**PERTARUNGAN AKHIR BAB 2 N4**",
    ],
    outro: [
      "Lord Kaizoku tertawa: «Kau benar-benar pahlawan! N4 adalah milikmu!»",
      "Ia menyerahkan mahkota emas. «Lanjut ke Kage Clan - Tingkat Madya menunggu!»",
      "**BAB 2 N4 SELESAI! +800 XP, 300 koin, Badge: Penguasa N4, Item: Mahkota Bajak Laut**",
      "**Dunia baru terbuka: Kage Clan (Tingkat Madya)**",
    ],
    lesson: undefined,
    enemies: [
      { id: "lord-kaizoku", name: "Lord Kaizoku", sprite: "🏴‍☠️", hp: 200, attack: 12, color: "#1a1a2e", abilities: ["enrage", "heal", "crit", "shield", "multi-attack", "counter", "poison"] },
    ],
    questions: [
      { type: "typing", prompt: "te-form dari たべる:", kana: "たべて", answer: ["tabete"] },
      { type: "typing", prompt: "nai-form dari のむ:", kana: "のまない", answer: ["nomanai"] },
      { type: "typing", prompt: "ta-form dari いく:", kana: "いった", answer: ["itta"] },
      { type: "choice", prompt: "Kanji '百' berarti?", kana: "百", options: ["10", "100", "1000", "10000"], answer: 1 },
      { type: "choice", prompt: "Kanji '海' berarti?", kana: "海", options: ["Sungai", "Danau", "Laut", "Hujan"], answer: 2 },
      { type: "typing", prompt: "Romaji 'karena hujan':", kana: "あめだから", answer: ["ame da kara"] },
      { type: "typing", prompt: "「ingin pergi」:", kana: "いきたい", answer: ["ikitai"] },
      { type: "choice", prompt: "「くれる」 dipakai kalau?", kana: "くれる", options: ["Saya beri", "Orang beri ke saya", "Saya terima", "Orang terima"], answer: 1 },
      { type: "typing", prompt: "Pasif dari たべる:", kana: "たべられる", answer: ["taberareru"] },
      { type: "typing", prompt: "Romaji 'tetapi':", kana: "でも", answer: ["demo"] },
      { type: "choice", prompt: "「〜たら」 artinya?", options: ["Karena", "Jika", "Tetapi", "Sehingga"], answer: 1 },
      { type: "typing", prompt: "Romaji 'adik perempuan':", kana: "妹", answer: ["imouto"] },
    ],
    reward: { xp: 800, badge: "Penguasa N4", item: "Mahkota Bajak Laut" },
  },
];
