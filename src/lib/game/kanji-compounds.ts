// ===== JLPT-STYLE KANJI READING QUESTIONS =====
// Database of kanji compound words with readings and example sentences.
// Used to generate "kanji X in sentence Y is read as...?" questions.

export interface KanjiCompound {
  compound: string;      // e.g. "一人"
  reading: string;       // e.g. "ひとり"
  meaning: string;       // e.g. "sendirian"
  sentence: string;      // e.g. "一人ぼっちで すんでいます"
  sentenceMeaning: string; // e.g. "Saya tinggal sendirian"
  level: number;         // 2=Dasar, 3=Madya Bawah
}

// Distractor readings that mix up on/kun yomi
export const KANJI_COMPOUNDS: KanjiCompound[] = [
  // ===== Level 2 (Dasar) - Kanji dasar =====
  {
    compound: "一人", reading: "ひとり", meaning: "sendirian",
    sentence: "一人ぼっちで すんでいます", sentenceMeaning: "Saya tinggal sendirian",
    level: 2,
  },
  {
    compound: "二人", reading: "ふたり", meaning: "berdua",
    sentence: "二人で えいがを みました", sentenceMeaning: "Kami berdua menonton film",
    level: 2,
  },
  {
    compound: "三人", reading: "さんにん", meaning: "bertiga",
    sentence: "三人で でんしゃに のりました", sentenceMeaning: "Kami bertiga naik kereta",
    level: 2,
  },
  {
    compound: "日本人", reading: "にほんじん", meaning: "orang Jepang",
    sentence: "かのじょは 日本人です", sentenceMeaning: "Dia perempuan adalah orang Jepang",
    level: 2,
  },
  {
    compound: "毎日", reading: "まいにち", meaning: "setiap hari",
    sentence: "毎日 べんきょうします", sentenceMeaning: "Saya belajar setiap hari",
    level: 2,
  },
  {
    compound: "今日", reading: "きょう", meaning: "hari ini",
    sentence: "今日は いい てんきです", sentenceMeaning: "Hari ini cuacanya bagus",
    level: 2,
  },
  {
    compound: "明日", reading: "あした", meaning: "besok",
    sentence: "明日 がっこうに いきます", sentenceMeaning: "Besok saya pergi ke sekolah",
    level: 2,
  },
  {
    compound: "昨日", reading: "きのう", meaning: "kemarin",
    sentence: "ともだちと あいました", sentenceMeaning: "Kemarin saya bertemu teman",
    level: 2,
  },
  {
    compound: "学校", reading: "がっこう", meaning: "sekolah",
    sentence: "学校は ここから とおいです", sentenceMeaning: "Sekolah jauh dari sini",
    level: 2,
  },
  {
    compound: "先生", reading: "せんせい", meaning: "guru",
    sentence: "先生は やさしいです", sentenceMeaning: "Gurunya ramah",
    level: 2,
  },
  {
    compound: "大学", reading: "だいがく", meaning: "universitas",
    sentence: "大学で べんきょうしています", sentenceMeaning: "Saya belajar di universitas",
    level: 2,
  },
  {
    compound: "電話", reading: "でんわ", meaning: "telepon",
    sentence: "でんわを かけます", sentenceMeaning: "Saya menelepon",
    level: 2,
  },
  {
    compound: "天気", reading: "てんき", meaning: "cuaca",
    sentence: "てんきが いいです", sentenceMeaning: "Cuacanya bagus",
    level: 2,
  },
  {
    compound: "元気", reading: "げんき", meaning: "sehat/bugar",
    sentence: "げんきですか?", sentenceMeaning: "Apa kabar?",
    level: 2,
  },
  {
    compound: "友達", reading: "ともだち", meaning: "teman",
    sentence: "ともだちと あそびます", sentenceMeaning: "Saya bermain dengan teman",
    level: 2,
  },
  {
    compound: "一日", reading: "いちにち", meaning: "satu hari",
    sentence: "一日 じゅう はたらきました", sentenceMeaning: "Saya bekerja sehari penuh",
    level: 2,
  },
  {
    compound: "外国", reading: "がいこく", meaning: "negara asing",
    sentence: "がいこくに いきたいです", sentenceMeaning: "Saya ingin pergi ke luar negeri",
    level: 2,
  },
  {
    compound: "日本語", reading: "にほんご", meaning: "bahasa Jepang",
    sentence: "にほんごを べんきょうしています", sentenceMeaning: "Saya belajar bahasa Jepang",
    level: 2,
  },
  {
    compound: "時間", reading: "じかん", meaning: "waktu/jam",
    sentence: "じかんが ありません", sentenceMeaning: "Tidak ada waktu",
    level: 2,
  },
  {
    compound: "電車", reading: "でんしゃ", meaning: "kereta listrik",
    sentence: "でんしゃで かえります", sentenceMeaning: "Saya pulang dengan kereta",
    level: 2,
  },

  // ===== Level 3 (Madya Bawah) - Kanji lanjutan =====
  {
    compound: "食事", reading: "しょくじ", meaning: "makan",
    sentence: "しょくじの まえに てを あらいます", sentenceMeaning: "Saya cuci tangan sebelum makan",
    level: 3,
  },
  {
    compound: "飲み物", reading: "のみもの", meaning: "minuman",
    sentence: "のみものを ください", sentenceMeaning: "Tolong minumannya",
    level: 3,
  },
  {
    compound: "食べ物", reading: "たべもの", meaning: "makanan",
    sentence: "たべものが すきです", sentenceMeaning: "Saya suka makanan",
    level: 3,
  },
  {
    compound: "仕事", reading: "しごと", meaning: "pekerjaan",
    sentence: "しごとが いそがしいです", sentenceMeaning: "Pekerjaan saya sibuk",
    level: 3,
  },
  {
    compound: "休み", reading: "やすみ", meaning: "libur/istirahat",
    sentence: "やすみの ひに えいがを みます", sentenceMeaning: "Saya nonton film di hari libur",
    level: 3,
  },
  {
    compound: "病気", reading: "びょうき", meaning: "sakit",
    sentence: "びょうきで がっこうを やすみました", sentenceMeaning: "Saya tidak masuk sekolah karena sakit",
    level: 3,
  },
  {
    compound: "病院", reading: "びょういん", meaning: "rumah sakit",
    sentence: "びょういんに いきました", sentenceMeaning: "Saya pergi ke rumah sakit",
    level: 3,
  },
  {
    compound: "薬", reading: "くすり", meaning: "obat",
    sentence: "くすりを のみました", sentenceMeaning: "Saya minum obat",
    level: 3,
  },
  {
    compound: "天気予報", reading: "てんきよほう", meaning: "ramalan cuaca",
    sentence: "てんきよほうを みました", sentenceMeaning: "Saya melihat ramalan cuaca",
    level: 3,
  },
  {
    compound: "夏休み", reading: "なつやすみ", meaning: "libur musim panas",
    sentence: "なつやすみに りょこうします", sentenceMeaning: "Saya bepergian saat libur musim panas",
    level: 3,
  },
  {
    compound: "冬休み", reading: "ふゆやすみ", meaning: "libur musim dingin",
    sentence: "ふゆやすみは たのしいです", sentenceMeaning: "Libur musim dingin menyenangkan",
    level: 3,
  },
  {
    compound: "映画館", reading: "えいがかん", meaning: "bioskop",
    sentence: "えいがかんで えいがを みます", sentenceMeaning: "Saya menonton film di bioskop",
    level: 3,
  },
  {
    compound: "図書館", reading: "としょかん", meaning: "perpustakaan",
    sentence: "としょかんで べんきょうします", sentenceMeaning: "Saya belajar di perpustakaan",
    level: 3,
  },
  {
    compound: "出口", reading: "でぐち", meaning: "pintu keluar",
    sentence: "でぐちは どこですか?", sentenceMeaning: "Di mana pintu keluar?",
    level: 3,
  },
  {
    compound: "入口", reading: "いりぐち", meaning: "pintu masuk",
    sentence: "いりぐちから はいってください", sentenceMeaning: "Silakan masuk dari pintu masuk",
    level: 3,
  },
  {
    compound: "上着", reading: "うわぎ", meaning: "jaket",
    sentence: "うわぎを ぬいでください", sentenceMeaning: "Silakan buang jaket",
    level: 3,
  },
  {
    compound: "下着", reading: "したぎ", meaning: "pakaian dalam",
    sentence: "したぎを かいました", sentenceMeaning: "Saya beli pakaian dalam",
    level: 3,
  },
  {
    compound: "手紙", reading: "てがみ", meaning: "surat",
    sentence: "てがみを かきました", sentenceMeaning: "Saya menulis surat",
    level: 3,
  },
  {
    compound: "切符", reading: "きっぷ", meaning: "tiket",
    sentence: "きっぷを かいました", sentenceMeaning: "Saya beli tiket",
    level: 3,
  },
  {
    compound: "約束", reading: "やくそく", meaning: "janji",
    sentence: "やくそくの じかんに まにあいました", sentenceMeaning: "Saya tiba tepat waktu untuk janji",
    level: 3,
  },
  {
    compound: "説明", reading: "せつめい", meaning: "penjelasan",
    sentence: "せつめいを してください", sentenceMeaning: "Tolong jelaskan",
    level: 3,
  },
  {
    compound: "料理", reading: "りょうり", meaning: "masakan/masak",
    sentence: "りょうりを つくります", sentenceMeaning: "Saya memasak",
    level: 3,
  },
  {
    compound: "旅行", reading: "りょこう", meaning: "perjalanan",
    sentence: "りょこうに いきます", sentenceMeaning: "Saya pergi berpergian",
    level: 3,
  },
  {
    compound: "約束", reading: "やくそく", meaning: "janji",
    sentence: "やくそくを わすれないでください", sentenceMeaning: "Jangan lupa janjinya",
    level: 3,
  },
  {
    compound: "心配", reading: "しんぱい", meaning: "khawatir",
    sentence: "しんぱいしないでください", sentenceMeaning: "Jangan khawatir",
    level: 3,
  },
  {
    compound: "大切", reading: "たいせつ", meaning: "penting",
    sentence: "たいせつな ひとです", sentenceMeaning: "Dia orang yang penting",
    level: 3,
  },
  {
    compound: "全然", reading: "ぜんぜん", meaning: "sama sekali",
    sentence: "ぜんぜん わかりません", sentenceMeaning: "Sama sekali tidak mengerti",
    level: 3,
  },
  {
    compound: "大好き", reading: "だいすき", meaning: "sangat suka",
    sentence: "だいすきな たべものです", sentenceMeaning: "Makanan yang sangat saya suka",
    level: 3,
  },
];

/**
 * Generate JLPT-style kanji reading questions for a given level.
 * Format: "Kalimat: [sentence] - kanji [X] dibaca apa?"
 * Distractors mix on/kun yomi readings.
 */
export function generateKanjiReadingQuestions(level: number, count: number = 10) {
  const pool = KANJI_COMPOUNDS.filter((k) => k.level <= level);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((kc) => {
    // Generate 3 distractors from other compounds' readings
    const others = KANJI_COMPOUNDS.filter(
      (k) => k.compound !== kc.compound && k.reading !== kc.reading,
    );
    const distractorReadings = others
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((k) => k.reading);

    // Also add some "wrong" readings that mix kanji readings
    // e.g. for 一人 (ひとり): いちひと, いちり, ひといち
    const kanji1 = kc.compound[0];
    const kanji2 = kc.compound[1];
    const wrongMixes = [
      // on+yomi mix: ichi+hito = いちひと
      // kun+on mix: hito+ichi = ひといち
      // etc.
    ];

    const allDistractors = [...distractorReadings, ...wrongMixes]
      .filter((r) => r !== kc.reading)
      .slice(0, 3);

    const options = [kc.reading, ...allDistractors].sort(() => Math.random() - 0.5);

    return {
      type: "choice" as const,
      prompt: `「${kc.sentence}」の中の「${kc.compound}」の読み方は?`,
      kana: kc.sentence, // Show the full sentence (kana is the QUESTION, not answer)
      options,
      answer: options.indexOf(kc.reading),
      hint: `Arti: ${kc.meaning} (${kc.sentenceMeaning})`,
    };
  });
}
