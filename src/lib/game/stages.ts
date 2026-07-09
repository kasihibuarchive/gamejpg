import type { Stage, WorldId } from "./types";

// ===== HAJIMARI VILLAGE - CHAPTER 1: HIRAGANA =====
// 10 stages forming one story arc following PDF spec:
//  1. First Meeting - 5 vowels (あいうえお)
//  2-4. Journey to village - K, S, T rows
//  5. Mini-Boss - Gate Guard testing Stage 1-4
//  6-9. Investigate village - N, H, M, Y, R, W rows
//  10. Boss - Raja Bayangan Huruf (combine letters into words)

export const HAJIMARI_STAGES: Stage[] = [
  // ===== STAGE 1: PERTEMUAN PERTAMA =====
  {
    id: "hajimari-1",
    worldId: "hajimari",
    index: 1,
    title: "Pertemuan Pertama",
    subtitle: "Lima Vokal Penggerak Dunia",
    type: "lesson",
    intro: [
      "**Hutan Hajimari - Fajar Pertama**",
      "Kau terbangun di atas rerumputan lembab. Cahaya keemasan menyaring di antara pohon-pohon raksasa yang berdaun aksara.",
      "Suara langkah kecil mendekat. Seorang gadis bermata indah berjubah putih muncul dari balik kabut.",
      "「Hai, pengelana. Aku **Yuki**, penjaga desa Hajimari. Kau sepertinya... di panggil oleh aksara ini.」",
      "「Lima vokal adalah jiwa dari setiap huruf Jepang. Tanpa mereka, kata-kata tak bisa bernapas. Pelajari ini dulu.」",
    ],
    outro: [
      "Yuki tersenyum lembut. 「Bagus! Kau sudah bisa merasakan denyut lima vokal.」",
      "「Sekarang, lanjutkan perjalananmu ke arah utara. Desa Hajimari menunggumu - tapi jalan tidak aman...」",
      "Kau melihat sesuatu bergerak di semak. Monster huruf pertama menantimu!",
      "**Stage 1 selesai! +50 XP, Badge: Anak Hutan**",
    ],
    lesson: {
      title: "Lima Vokal (あいうえお)",
      rows: [
        { kana: "あ", romaji: "a", meaning: "huruf vokal 'a'" },
        { kana: "い", romaji: "i", meaning: "huruf vokal 'i'" },
        { kana: "う", romaji: "u", meaning: "huruf vokal 'u'" },
        { kana: "え", romaji: "e", meaning: "huruf vokal 'e'" },
        { kana: "お", romaji: "o", meaning: "huruf vokal 'o'" },
      ],
      note: "Ingat urutan: A-I-U-E-O. Ini akan jadi fondasi semua huruf lainnya!",
    },
    enemies: [
      {
        id: "slime-a",
        name: "Slime Vokal",
        nameJp: "スライム",
        sprite: "🟢",
        hp: 8,
        attack: 2,
        description: "Monster level rendah dari huruf vokal.",
        color: "#66bb6a",
        abilities: ["regen"],
      },
    ],
    questions: [
      {
        type: "choice",
        prompt: "Huruf apa ini?",
        kana: "あ",
        options: ["a", "i", "u", "e"],
        answer: 0,
        hint: "Vokal pertama, seperti 'a' di 'apa'",
      },
      {
        type: "choice",
        prompt: "Huruf apa ini?",
        kana: "い",
        options: ["e", "i", "u", "o"],
        answer: 1,
        hint: "Seperti 'i' di 'ikan'",
      },
      {
        type: "choice",
        prompt: "Huruf apa ini?",
        kana: "う",
        options: ["a", "o", "u", "e"],
        answer: 2,
        hint: "Seperti 'u' di 'ular'",
      },
      {
        type: "choice",
        prompt: "Huruf apa ini?",
        kana: "え",
        options: ["i", "e", "a", "o"],
        answer: 1,
        hint: "Seperti 'e' di 'ekor'",
      },
      {
        type: "typing",
        prompt: "Ketik romaji untuk huruf ini:",
        kana: "お",
        answer: ["o", "ou"],
        hint: "Vokal terakhir, 'o' di 'ola'",
      },
    ],
    reward: { xp: 50, badge: "Anak Hutan" },
  },

  // ===== STAGE 2: DERET K (かきくけこ) =====
  {
    id: "hajimari-2",
    worldId: "hajimari",
    index: 2,
    title: "Deret K - Serangan Pertama",
    subtitle: "Menghadapi Monster Huruf K",
    type: "battle",
    intro: [
      "**Jalan Setapak Utara**",
      "Yuki menunjuk ke arah jalan setapak. 「Lewati sini. Tapi hati-hati - monster huruf K suka bersembunyi di sini.」",
      "Tiba-tiba, sesosok kecil berwarna ungu melompat dari balik batu! 「Kaaaa!」",
      "「Itu **Kappa-slime**!」 seru Yuki. 「Kau harus mengenali deret K untuk mengalahkannya. Aku akan mengajarimu.」",
    ],
    outro: [
      "Kappa-slime hancur menjadi cahaya dan menghilang.",
      "Yuki mengangguk puas. 「Kau belajar cepat. Deret K dibentuk dengan menambahkan konsonan K ke vokal.」",
      "「Lanjutkan - ada lebih banyak di depan.」",
      "**Stage 2 selesai! +60 XP**",
    ],
    lesson: {
      title: "Deret K (かきくけこ)",
      rows: [
        { kana: "か", romaji: "ka", meaning: "K + A" },
        { kana: "き", romaji: "ki", meaning: "K + I" },
        { kana: "く", romaji: "ku", meaning: "K + U" },
        { kana: "け", romaji: "ke", meaning: "K + E" },
        { kana: "こ", romaji: "ko", meaning: "K + O" },
      ],
      note: "Pola: konsonan + vokal. Setiap deret punya 5 huruf yang mengikuti A-I-U-E-O.",
    },
    enemies: [
      {
        id: "kappa-slime",
        name: "Kappa-slime",
        nameJp: "カッパ",
        sprite: "🟣",
        hp: 10,
        attack: 3,
        description: "Monster rawa dengan deret K.",
        color: "#9575cd",
        abilities: ["multi-attack"],
      },
    ],
    questions: [
      {
        type: "choice",
        prompt: "Huruf apa ini?",
        kana: "か",
        options: ["ka", "ki", "ku", "ke"],
        answer: 0,
      },
      {
        type: "choice",
        prompt: "Pilih huruf 'ki':",
        options: ["か", "き", "く", "け"],
        answer: 1,
      },
      {
        type: "choice",
        prompt: "Huruf apa ini?",
        kana: "く",
        options: ["ko", "ke", "ku", "ka"],
        answer: 2,
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "け",
        answer: ["ke"],
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "こ",
        answer: ["ko"],
      },
    ],
    reward: { xp: 60 },
  },

  // ===== STAGE 3: DERET S (さしすせそ) =====
  {
    id: "hajimari-3",
    worldId: "hajimari",
    index: 3,
    title: "Deret S - Bayangan Bisik",
    subtitle: "Misteri Suara dari Pohon",
    type: "battle",
    intro: [
      "**Hutan Bambu Berbisik**",
      "Kau memasuki rumpun bambu yang tinggi. Suara berbisik terdengar dari setiap arah: 「Sss... sss...」",
      "Yuki berbisik balik. 「Mereka adalah **S-spirit**. Mereka menguji pendengaranmu. Dengarkan baik-baik.」",
      "「Pelajari deret S, lalu tunjukkan padaku kau bisa membedakannya.」",
    ],
    outro: [
      "Bisikan mereda. Bambu tenang kembali.",
      "「Kau punya telinga yang tajam,」 puji Yuki. 「Tapi masih ada satu deret lagi sebelum kau bisa masuk desa.」",
      "**Stage 3 selesai! +70 XP**",
    ],
    lesson: {
      title: "Deret S (さしすせそ)",
      rows: [
        { kana: "さ", romaji: "sa", meaning: "S + A" },
        { kana: "し", romaji: "shi", meaning: "S + I (shi, bukan si!)" },
        { kana: "す", romaji: "su", meaning: "S + U" },
        { kana: "せ", romaji: "se", meaning: "S + E" },
        { kana: "そ", romaji: "so", meaning: "S + O" },
      ],
      note: "Perhatian! 'shi' bukan 'si'. Ini pengecualian penting dalam deret S.",
    },
    enemies: [
      {
        id: "s-spirit",
        name: "S-spirit",
        nameJp: "スピリット",
        sprite: "💨",
        hp: 12,
        attack: 3,
        description: "Roh bayangan berbisik.",
        color: "#4fc3f7",
        abilities: ["crit"],
        critChance: 0.2,
      },
    ],
    questions: [
      {
        type: "choice",
        prompt: "Huruf apa ini?",
        kana: "さ",
        options: ["sa", "shi", "su", "se"],
        answer: 0,
      },
      {
        type: "choice",
        prompt: "Romaji untuk 'し' adalah?",
        options: ["si", "shi", "su", "sai"],
        answer: 1,
        hint: "Pengecualian! Tidak diucapkan 'si'",
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "す",
        answer: ["su"],
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "せ",
        answer: ["se"],
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "そ",
        answer: ["so"],
      },
    ],
    reward: { xp: 70 },
  },

  // ===== STAGE 4: DERET T (たちつてと) =====
  {
    id: "hajimari-4",
    worldId: "hajimari",
    index: 4,
    title: "Deret T - Gerbang Desa Terlihat",
    subtitle: "Pertarungan Terakhir Sebelum Desa",
    type: "battle",
    intro: [
      "**Pinggir Hutan - Gerbang Desa Terlihat**",
      "Kau bisa melihat gerbang kayu besar Desa Hajimari di kejauhan. Tapi sebuah sosok berotot menghalangi jalan.",
      "**T-troll** mengaum: 「Tah! Kau pikir bisa lewat begitu saja? Kalahkan aku dulu dengan deret T!」",
      "Yuki mengangguk. 「Kau sudah tahu polanya. T + vokal. Tapi ingat - 'chi' dan 'tsu' adalah pengecualian.」",
    ],
    outro: [
      "T-troll tertawa puas. 「Hebat! Kau boleh lewat. Tapi gerbang desa dijaga penjaga yang lebih kuat...」",
      "Ia menghilang ke tanah.",
      "Yuki: 「Penjaga gerbang akan menguji semua yang kau pelajari di Stage 1-4. Bersiaplah.」",
      "**Stage 4 selesai! +80 XP**",
    ],
    lesson: {
      title: "Deret T (たちつてと)",
      rows: [
        { kana: "た", romaji: "ta", meaning: "T + A" },
        { kana: "ち", romaji: "chi", meaning: "T + I (chi, bukan ti!)" },
        { kana: "つ", romaji: "tsu", meaning: "T + U (tsu, bukan tu!)" },
        { kana: "て", romaji: "te", meaning: "T + E" },
        { kana: "と", romaji: "to", meaning: "T + O" },
      ],
      note: "Dua pengecualian: 'chi' (bukan ti) dan 'tsu' (bukan tu). Hafalkan baik-baik!",
    },
    enemies: [
      {
        id: "t-troll",
        name: "T-troll",
        nameJp: "トロル",
        sprite: "👹",
        hp: 18,
        attack: 4,
        description: "Penjaga jalan berotot.",
        color: "#ef5350",
        abilities: ["enrage"],
      },
    ],
    questions: [
      {
        type: "choice",
        prompt: "Romaji untuk 'ち'?",
        options: ["ti", "chi", "tsu", "ta"],
        answer: 1,
      },
      {
        type: "choice",
        prompt: "Romaji untuk 'つ'?",
        options: ["tu", "tsu", "chi", "to"],
        answer: 1,
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "た",
        answer: ["ta"],
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "て",
        answer: ["te"],
      },
      {
        type: "typing",
        prompt: "Ketik romaji:",
        kana: "と",
        answer: ["to"],
      },
      {
        type: "choice",
        prompt: "Mana yang merupakan deret T lengkap?",
        options: [
          "た ち つ て と",
          "さ し す せ そ",
          "か き く け こ",
          "な に ぬ ね の",
        ],
        answer: 0,
      },
    ],
    reward: { xp: 80 },
  },

  // ===== STAGE 5: MINI-BOSS - PENJAGA GERBANG =====
  {
    id: "hajimari-5",
    worldId: "hajimari",
    index: 5,
    title: "Ujian Gerbang Desa",
    subtitle: "Mini-Boss: Penjaga Gerbang",
    type: "mini-boss",
    intro: [
      "**Gerbang Desa Hajimari**",
      "Gerbang kayu raksasa setinggi 5 meter. Di atasnya, sesosok ksatria berbaju zirah gelap duduk diam.",
      "「Aku **Gardo**, penjaga gerbang. Tak seorang pun masuk tanpa menguasai dasar.」",
      "「Aku akan menguji semua huruf yang kau pelajari: vokal, K, S, dan T. Lewati ujian ini, dan desa terbuka untukmu.」",
      "Yuki mundur. 「Ini tugasmu sekarang, pengelana. Aku percaya padamu.」",
    ],
    outro: [
      "Gardo turun dari posisinya, melepaskan helmnya. 「Kau memang layak. Gerbang ini terbuka untukmu.」",
      "Gerbang terbuka berderit. Pemandangan desa Hajimari terbentang - rumah-rumah kayu, kebun, dan menara jam kecil di tengah.",
      "「Selamat datang, warga baru.」",
      "**Stage 5 selesai! +120 XP, Badge: Lulus Gerbang**",
    ],
    lesson: undefined,
    enemies: [
      {
        id: "gardo",
        name: "Gardo si Penjaga",
        nameJp: "ガード",
        sprite: "🛡️",
        hp: 40,
        attack: 6,
        description: "Mini-boss penjaga gerbang desa. Menguji deret vokal, K, S, T.",
        color: "#8b8b9d",
        abilities: ["shield", "counter"],
      },
    ],
    questions: [
      // Mixed review of stages 1-4
      {
        type: "choice",
        prompt: "「Vokal kedua adalah...」",
        options: ["あ (a)", "い (i)", "う (u)", "え (e)"],
        answer: 1,
      },
      {
        type: "choice",
        prompt: "「Huruf 'ku' adalah...」",
        options: ["く", "か", "き", "け"],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "「Sebut romaji: し」",
        kana: "し",
        answer: ["shi"],
      },
      {
        type: "choice",
        prompt: "「Mana yang romaji untuk つ?」",
        options: ["tu", "tsu", "chi", "to"],
        answer: 1,
      },
      {
        type: "typing",
        prompt: "「Sebut romaji: こ」",
        kana: "こ",
        answer: ["ko"],
      },
      {
        type: "choice",
        prompt: "「Urutan vokal yang benar?」",
        options: [
          "a-i-u-e-o",
          "a-e-i-o-u",
          "a-u-i-e-o",
          "i-a-u-e-o",
        ],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "「Romaji: せ」",
        kana: "せ",
        answer: ["se"],
      },
      {
        type: "choice",
        prompt: "「Pilih た:」",
        options: ["た", "ち", "つ", "て"],
        answer: 0,
      },
    ],
    reward: { xp: 120, badge: "Lulus Gerbang" },
  },

  // ===== STAGE 6: DERET N (なにぬねの) =====
  {
    id: "hajimari-6",
    worldId: "hajimari",
    index: 6,
    title: "Pasar Desa - Deret N",
    subtitle: "Berkenalan dengan Penduduk",
    type: "battle",
    intro: [
      "**Pasar Desa Hajimari**",
      "Setelah masuk desa, kau melihat pasar yang ramai. Pedagang berseru menjual buah, ikan, dan kerajinan.",
      "Seorang kakek tersenyum. 「Selamat datang, anak muda! Coba ucapkan **'namae wa nan desu ka'** - apa namamu?」",
      "「Untuk menyapa penduduk, kau harus kuasai deret N. Ini akan membantumu mengucapkan banyak kata seperti 'namae' (nama).」",
    ],
    outro: [
      "Kakek itu tertawa lebar. 「Bagus! Sekarang kau bisa berkenalan dengan semua orang di sini.」",
      "Ia menyodorkan buku tipis. 「Ini catatan penduduk desa. Mungkin berguna bagimu.」",
      "Item didapat: **Catatan Penduduk Desa**",
      "**Stage 6 selesai! +80 XP**",
    ],
    lesson: {
      title: "Deret N (なにぬねの)",
      rows: [
        { kana: "な", romaji: "na", meaning: "N + A" },
        { kana: "に", romaji: "ni", meaning: "N + I" },
        { kana: "ぬ", romaji: "nu", meaning: "N + U" },
        { kana: "ね", romaji: "ne", meaning: "N + E" },
        { kana: "の", romaji: "no", meaning: "N + O (partikel kepemilikan)" },
      ],
      note: "'no' (の) sering dipakai sebagai partikel kepemilikan, seperti 'buku saya' = 'watashi no hon'.",
    },
    enemies: [
      {
        id: "merchant-illusion",
        name: "Pedagang Ilusi",
        nameJp: "イリュージョン",
        sprite: "🧙",
        hp: 15,
        attack: 3,
        description: "Ilusi yang mengganggu pembelajaran.",
        color: "#ffb74d",
      },
    ],
    questions: [
      {
        type: "choice",
        prompt: "Huruf 'no' adalah?",
        options: ["な", "に", "ぬ", "の"],
        answer: 3,
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "な",
        answer: ["na"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "に",
        answer: ["ni"],
      },
      {
        type: "choice",
        prompt: "Pilih 'nu':",
        options: ["ね", "な", "ぬ", "の"],
        answer: 2,
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "ね",
        answer: ["ne"],
      },
    ],
    reward: { xp: 80, item: "Catatan Penduduk Desa" },
  },

  // ===== STAGE 7: DERET H (はひふへほ) =====
  {
    id: "hajimari-7",
    worldId: "hajimari",
    index: 7,
    title: "Perpustakaan Tua - Deret H",
    subtitle: "Misteri Buku Terkunci",
    type: "battle",
    intro: [
      "**Perpustakaan Tua Hajimari**",
      "Yuki membawamu ke perpustakaan tua di sudut desa. Debu menari dalam cahaya jendela.",
      "「Di sini tersimpan rahasia desa kami,」 bisik Yuki. 「Tapi buku-buku itu dilindungi roh deret H.」",
      "Buku tebal di meja utama bergetar. 「**Fuuum...** siapa yang berani membaca aku?」",
      "Yuki: 「Pelajari deret H, terutama 'fu' yang merupakan pengecualian.」",
    ],
    outro: [
      "Buku itu terbuka dengan sendirinya. 「Akhirnya, pembaca yang layak...」",
      "Halaman pertama menunjukkan peta tua dengan lokasi bertanda X di dekat kuil desa.",
      "Yuki terkejut. 「Itu... lokasi di mana Raja Bayangan dikurung dulu.」",
      "**Stage 7 selesai! +90 XP**",
    ],
    lesson: {
      title: "Deret H (はひふへほ)",
      rows: [
        { kana: "は", romaji: "ha", meaning: "H + A (partikel topik)" },
        { kana: "ひ", romaji: "hi", meaning: "H + I" },
        { kana: "ふ", romaji: "fu", meaning: "H + U (fu, bukan hu!)" },
        { kana: "へ", romaji: "he", meaning: "H + E (partikel arah)" },
        { kana: "ほ", romaji: "ho", meaning: "H + O" },
      ],
      note: "Pengecualian: 'fu' (ふ) bukan 'hu'. 'ha' (は) dan 'he' (へ) juga sering jadi partikel.",
    },
    enemies: [
      {
        id: "book-spirit",
        name: "Roh Buku Kuno",
        nameJp: "ほん",
        sprite: "📖",
        hp: 18,
        attack: 4,
        description: "Roh penjaga pengetahuan lama.",
        color: "#8b8b9d",
      },
    ],
    questions: [
      {
        type: "choice",
        prompt: "Romaji untuk 'ふ'?",
        options: ["hu", "fu", "ha", "ho"],
        answer: 1,
        hint: "Pengecualian!",
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "は",
        answer: ["ha", "wa"],
        hint: "Juga dibaca 'wa' sebagai partikel topik",
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "ひ",
        answer: ["hi"],
      },
      {
        type: "choice",
        prompt: "Pilih 'he':",
        options: ["へ", "ほ", "は", "ふ"],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "ほ",
        answer: ["ho"],
      },
    ],
    reward: { xp: 90 },
  },

  // ===== STAGE 8: DERET M & Y (まみむめも / やゆよ) =====
  {
    id: "hajimari-8",
    worldId: "hajimari",
    index: 8,
    title: "Kuil Desa - Deret M & Y",
    subtitle: "Doa di Kuil Kecil",
    type: "battle",
    intro: [
      "**Kuil Hajimari - Senja**",
      "Pendeta tua menyambut di pintu kuil. 「Kau datang untuk memohon kekuatan? Mari, berdoalah bersama.」",
      "「Doa kami ditulis dalam deret M. Dan ada juga deret Y - hanya 3 huruf, seperti tritunggal dewa.」",
      "Lilin-lilin menyala sendiri. Asap mengepul membentuk sosok rubah api.",
      "**Kitsune-bi**: 「Hmmm... pembaca baru. Tunjukkan padaku kau layak.」",
    ],
    outro: [
      "Kitsune-bi tersenyum tipis. 「Kau memiliki hati yang murni.」",
      "Ia memberimu jimat kecil. 「Ini akan melindungimu dari bayangan.」",
      "Item didapat: **Jimat Rubah Api**",
      "Pendeta: 「Kuil ini menyimpan pintu ke dimensi bayangan. Bersiaplah, petualang.」",
      "**Stage 8 selesai! +100 XP**",
    ],
    lesson: {
      title: "Deret M (まみむめも) & Deret Y (やゆよ)",
      rows: [
        { kana: "ま", romaji: "ma", meaning: "M + A" },
        { kana: "み", romaji: "mi", meaning: "M + I" },
        { kana: "む", romaji: "mu", meaning: "M + U" },
        { kana: "め", romaji: "me", meaning: "M + E" },
        { kana: "も", romaji: "mo", meaning: "M + O" },
        { kana: "や", romaji: "ya", meaning: "Y + A" },
        { kana: "ゆ", romaji: "yu", meaning: "Y + U" },
        { kana: "よ", romaji: "yo", meaning: "Y + O" },
      ],
      note: "Deret Y hanya punya 3 huruf (ya, yu, yo) - tidak ada 'yi' atau 'ye'!",
    },
    enemies: [
      {
        id: "kitsune-bi",
        name: "Kitsune-bi",
        nameJp: "きつね火",
        sprite: "🦊",
        hp: 20,
        attack: 4,
        description: "Roh rubah api penjaga kuil.",
        color: "#ef5350",
      },
    ],
    questions: [
      {
        type: "choice",
        prompt: "Deret Y hanya punya berapa huruf?",
        options: ["3 (ya, yu, yo)", "5", "4", "2"],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "ま",
        answer: ["ma"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "み",
        answer: ["mi"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "む",
        answer: ["mu"],
      },
      {
        type: "choice",
        prompt: "Pilih 'me':",
        options: ["も", "め", "ま", "み"],
        answer: 1,
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "も",
        answer: ["mo"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "や",
        answer: ["ya"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "ゆ",
        answer: ["yu"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "よ",
        answer: ["yo"],
      },
    ],
    reward: { xp: 100, item: "Jimat Rubah Api" },
  },

  // ===== STAGE 9: DERET R & W (らりるれろ / わをん) =====
  {
    id: "hajimari-9",
    worldId: "hajimari",
    index: 9,
    title: "Menara Jam - Deret R & W",
    subtitle: "Penjaga Waktu",
    type: "battle",
    intro: [
      "**Menara Jam Desa Hajimari - Tengah Malam**",
      "Jam berdetak lambat. Di puncak menara, sesosok kurcaci berjanggut putih menunggu.",
      "「Aku **Rokku**, penjaga waktu. Raja Bayangan akan terbangun saat jam menunjukkan 12.」",
      "「Untuk membuka segel terakhir, kuasai deret R dan sisa huruf: わ, を, ん.」",
      "「Waktu kita sempit. Mulai!」",
    ],
    outro: [
      "Rokku terengah-engah. 「Kau... kau lebih cepat dari yang kuduga.」",
      "Ia menunjuk ke kejauhan. Bayangan gelap mulai berkumpul di hutan utara.",
      "「Dia datang. Raja Bayangan Huruf.」",
      "Yuki muncul di tangga. 「Pengelana, kau sudah siap. Ini pertarungan terakhir Bab 1.」",
      "**Stage 9 selesai! +120 XP, Item: Kunci Segel Waktu**",
    ],
    lesson: {
      title: "Deret R (らりるれろ) & Sisa (わ, を, ん)",
      rows: [
        { kana: "ら", romaji: "ra", meaning: "R + A" },
        { kana: "り", romaji: "ri", meaning: "R + I" },
        { kana: "る", romaji: "ru", meaning: "R + U" },
        { kana: "れ", romaji: "re", meaning: "R + E" },
        { kana: "ろ", romaji: "ro", meaning: "R + O" },
        { kana: "わ", romaji: "wa", meaning: "W + A (partikel topik)" },
        { kana: "を", romaji: "wo", meaning: "partikel objek (dibaca 'o')" },
        { kana: "ん", romaji: "n", meaning: "konsonan akhir 'n'" },
      ],
      note: "'を' ditulis 'wo' tapi diucapkan 'o'. 'ん' adalah satu-satunya konsonan tunggal dalam hiragana!",
    },
    enemies: [
      {
        id: "rokku",
        name: "Rokku Penjaga Waktu",
        nameJp: "ロック",
        sprite: "⏰",
        hp: 22,
        attack: 6,
        description: "Penjaga menara jam dengan kekuatan waktu.",
        color: "#ffd54f",
      },
    ],
    questions: [
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "ら",
        answer: ["ra"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "り",
        answer: ["ri"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "る",
        answer: ["ru"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "れ",
        answer: ["re"],
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "ろ",
        answer: ["ro"],
      },
      {
        type: "choice",
        prompt: "'を' diucapkan sebagai?",
        options: ["wo", "o", "wa", "wu"],
        answer: 1,
        hint: "Ditulis 'wo', diucapkan 'o'",
      },
      {
        type: "choice",
        prompt: "Apa fungsi 'ん'?",
        options: [
          "Konsonan tunggal di akhir suku kata",
          "Partikel topik",
          "Partikel objek",
          "Vokal",
        ],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "Romaji:",
        kana: "わ",
        answer: ["wa"],
      },
    ],
    reward: { xp: 120, item: "Kunci Segel Waktu" },
  },

  // ===== STAGE 10: BOSS - RAJA BAYANGAN HURUF =====
  {
    id: "hajimari-10",
    worldId: "hajimari",
    index: 10,
    title: "Raja Bayangan Huruf",
    subtitle: "Bos Akhir Bab 1",
    type: "boss",
    intro: [
      "**Hutan Utara - Tengah Malam**",
      "Pohon-pohon membungkuk seolah takut. Di tengah hutan, lubang hitam pekat muncul di tanah.",
      "Dari lubang itu, sesosok raksasa berbentuk aksara kelam naik. 「**Ku... ku... ku...** akhirnya, aku bebas.」",
      "**Raja Bayangan Huruf**: 「Aku adalah semua huruf yang dilupakan. Yang tak pernah dihafalkan. Yang dibuang.」",
      "「Pengelana kecil, kau pikir 46 huruf cukup untuk mengalahkanku? Tunjukkan! Gabungkan huruf-huruf itu menjadi kata bermakna!」",
      "Yuki berdiri di sampingmu. 「Aku akan memberikan kekuatanku padamu. Ingat semua yang kau pelajari.」",
      "**PERTARUNGAN AKHIR DIMULAI**",
    ],
    outro: [
      "Raja Bayangan Huruf terurai menjadi ribuan partikel cahaya.",
      "「Kau... mengingatku. Kau mengingat semua huruf...」 suaranya memudar. 「Mungkin... aku bukan musuh. Aku hanya... ingin diingat.」",
      "Partikel itu berkumpul menjadi sebuah komet keemasan yang melayang ke langit.",
      "Yuki menangis bahagia. 「Kau menyelamatkan desa. Lebih dari itu - kau menyelamatkan semua huruf yang dilupakan.」",
      "Pintu gerbang kuno muncul di hutan. Di atasnya tertulis: **Vassal Kingdom - Tingkat Dasar**.",
      "Yuki: 「Paspor Petualang adalah tiketmu. Pergilah, sang pahlawan. Petualanganmu baru saja dimulai.」",
      "**BAB 1 SELESAI! +500 XP, Badge: Pahlawan Hajimari, Item: Paspor Petualang**",
      "**Dunia baru terbuka: Vassal Kingdom (Tingkat Dasar)**",
    ],
    lesson: {
      title: "Teka-Teki Kata Utuh",
      rows: [
        { kana: "さくら", romaji: "sakura", meaning: "bunga sakura" },
        { kana: "ねこ", romaji: "neko", meaning: "kucing" },
        { kana: "かわいい", romaji: "kawaii", meaning: "imut" },
        { kana: "やま", romaji: "yama", meaning: "gunung" },
        { kana: "みず", romaji: "mizu", meaning: "air" },
      ],
      note: "Huruf-huruf digabung menjadi kata! Inilah fondasi membaca bahasa Jepang.",
    },
    enemies: [
      {
        id: "shadow-king",
        name: "Raja Bayangan Huruf",
        nameJp: "影の王",
        sprite: "👑",
        hp: 84,
        attack: 12,
        description: "Bos akhir Bab 1. Wujud semua huruf yang dilupakan.",
        color: "#1a1a2e",
        abilities: ["enrage", "heal", "crit", "shield", "multi-attack"],
        critChance: 0.15,
      },
    ],
    questions: [
      // Word formation puzzles
      {
        type: "choice",
        prompt: "Gabungkan さ + く + ら menjadi kata berarti?",
        options: ["Sakura (bunga sakura)", "Sukura (sepeda)", "Sakaru (lapar)", "Sakora (asap)"],
        answer: 0,
      },
      {
        type: "choice",
        prompt: "ね + こ = ?",
        kana: "ねこ",
        options: ["Neko (kucing)", "Nako (bola)", "Niko (senyum)", "Nuko (tikus)"],
        answer: 0,
      },
      {
        type: "choice",
        prompt: "Apa arti かわいい?",
        kana: "かわいい",
        options: ["Imut", "Bagus", "Mahal", "Besok"],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "Ketik romaji untuk やま (gunung):",
        kana: "やま",
        answer: ["yama"],
      },
      {
        type: "typing",
        prompt: "Ketik romaji untuk みず (air):",
        kana: "みず",
        answer: ["mizu"],
      },
      {
        type: "choice",
        prompt: "さ + く + ら huruf tengahnya adalah?",
        options: ["く (ku)", "か (ka)", "こ (ko)", "け (ke)"],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "「Kau ingat?」 Romaji untuk さくら:",
        kana: "さくら",
        answer: ["sakura"],
      },
      {
        type: "choice",
        prompt: "「Akhirnya...」 Pilih kata 'kawaii':",
        options: ["かわいい", "かわい", "かわいいそ", "かわよい"],
        answer: 0,
      },
      {
        type: "typing",
        prompt: "「Pertarungan terakhir!」 Ketik romaji ねこ:",
        kana: "ねこ",
        answer: ["neko"],
      },
      {
        type: "choice",
        prompt: "「Selamat tinggal, Raja Bayangan.」 Mana yang berarti 'bunga sakura'?",
        options: ["さくら", "やま", "みず", "ねこ"],
        answer: 0,
      },
    ],
    reward: { xp: 500, badge: "Pahlawan Hajimari", item: "Paspor Petualang" },
  },
];

// ===== STAGE AGGREGATION =====
// All stages are combined from multiple files for maintainability.

import { KATAKANA_STAGES } from "./katakana-stages";
import { N5_STAGES } from "./n5-stages";
import { N4_STAGES } from "./n4-stages";

export function getAllStages(): Stage[] {
  return [...HAJIMARI_STAGES, ...KATAKANA_STAGES, ...N5_STAGES, ...N4_STAGES];
}

export function getStagesByWorld(worldId: string): Stage[] {
  return getAllStages()
    .filter((s) => s.worldId === worldId)
    .sort((a, b) => a.index - b.index);
}

export function getStage(id: string): Stage | undefined {
  return getAllStages().find((s) => s.id === id);
}

// World unlock logic: which world does completing a boss stage unlock?
export function getWorldUnlockForStage(stageId: string): WorldId | undefined {
  if (stageId === "hajimari-10" || stageId === "hajimari-20") return "n5";
  if (stageId === "n5-20") return "n4";
  if (stageId === "n4-40") return "n3";
  if (stageId === "n3-10" || stageId === "n3-20") return "n2";
  if (stageId === "n2-10" || stageId === "n2-20") return "n1";
  return undefined;
}

// Vocab collection: extract all vocab from lesson rows
export interface VocabEntry {
  kana: string;
  romaji: string;
  meaning: string;
  sourceStageId: string;
  sourceStageTitle: string;
  worldId: WorldId;
}

export function getAllVocab(): VocabEntry[] {
  const vocab: VocabEntry[] = [];
  for (const stage of getAllStages()) {
    if (stage.lesson) {
      for (const row of stage.lesson.rows) {
        if (row.meaning) {
          vocab.push({
            kana: row.kana,
            romaji: row.romaji,
            meaning: row.meaning,
            sourceStageId: stage.id,
            sourceStageTitle: stage.title,
            worldId: stage.worldId,
          });
        }
      }
    }
  }
  return vocab;
}

// Vocab collected by player (only from completed stages)
export function getPlayerVocab(completedStages: string[]): VocabEntry[] {
  return getAllVocab().filter((v) => completedStages.includes(v.sourceStageId));
}
