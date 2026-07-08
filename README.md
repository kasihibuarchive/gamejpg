# 🎮 KotobaQuest

> Web-app RPG 8-bit modern untuk belajar bahasa Jepang dari Dasar hingga JLPT N1.

Petualangan epik mempelajari bahasa Jepang dalam dunia RPG 8-bit yang dikemas modern. Bertarung, menjelajah, dan kuasai huruf, kosakata, dan kanji melalui sistem gamifikasi story-driven yang terinspirasi dari game Pokemon & Dicero.

## ✨ Fitur Utama

### 🗺️ Story-Driven RPG
- **6 Dunia/Bab** sesuai standar JLPT: Dasar → N5 → N4 → N3 → N2 → N1
- **30 stage penuh** dengan cerita cutscene, dialog, dan karakter
- Setiap 10 stage = 1 story arc lengkap dengan intro, konflik, dan resolusi

### ⚔️ Sistem Pertarungan (Pokemon/Dicero style)
- HP bar musuh & pemain, animasi serangan/shake/flash
- **Combo system** - jawaban benar beruntun menambah damage (+1 per combo, max +5)
- **Critical Hit** - 15% peluang damage 2x lipat
- 3 tipe soal: Pilihan Ganda, Ketik Romaji, Matching
- Sound effect chiptune & background music (Web Audio API)

### 🏪 Items & Shop
- 6 item konsumable: Ramuan Penyembuh, Ramuan Besar, Eliksir, Petunjuk, Perisai, Petir
- Beli item pakai koin di Toko Ramuan
- Pakai item langsung dari menu battle

### 🏆 Achievements
- 14 achievement dengan berbagai kategori (progres, statistik, koleksi)
- Tracking statistik permainan lengkap

### 🎯 Mode Latihan
- Review soal dari stage yang sudah selesai
- Pilih 5/10/20 soal acak, tanpa tekanan HP

### ⚔️ Battle System (Dicero-Style RPG!)
- **Stage-Based Scaling**: HP musuh +16%/stage, ATK +12%/stage (steeper progression, no difficulty selector)
- **Player Stats (Upgradeable)**: ATK (+10% dmg/pt), DEF (-8% taken/pt), SPD (+0.5s timer/pt), LUCK (+3% crit/pt)
- **Stat Points**: +3 points per level up - allocate di Stats screen
- **15 Equipable Abilities** (Dicero-style perks, maks 3 dipasang):
  - 🦇 Vampir, 👹 Berserker, 🍀 Lucky Charm, 👟 Swift Boots, 🛡️ Iron Shield
  - 🤓 Scholar, 🌵 Thorns, 🪓 Executioner, ⏸ Time Freeze, 💍 Combo Master
  - 💚 Regen, 🔰 Shield Start, 👊 Double Strike, 💰 Golden Touch, 🔮 XP Boost
- **9 Enemy Abilities**: Heal, Crit, Shield, Multi-Attack, Enrage, Regen, Poison, Time-Pressure, Counter
- **Timer per Question**: 15s base + SPD/SPD bonuses
- **Question Randomization**: Urutan soal & opsi jawaban diacak tiap battle
- **Critical Hits**: Base 10% + LUCK stat + abilities
- **Boss Phases**: Boss mengamuk (enrage) di bawah 30% HP, +50% damage
- **Combo System**: Streak jawaban benar = damage bonus (max +50%, doubled with Combo Master)
- **Mercy Mechanic**: Kalah 3x di stage yang sama = auto-heal 30% HP

## 📚 Konten Materi

### Bab 1: Hajimari Village (Dasar - Hiragana) 🍃
10 stage: 5 vokal → deret K/S/T → mini-boss Gardo → deret N/H/M/Y/R/W → boss Raja Bayangan Huruf

### Bab 2: Hajimari Village (Dasar - Katakana) 🔪
10 stage: vokal Katakana → deret K/S/T/N/H/M/Y/R → mini-boss → Dakuten (G/Z/D/B) → Handakuten (P) → kata serapan (コーヒー, テレビ) → boss Phantom Cermin

### Bab 3: Vassal Kingdom (JLPT N5) 🏰
10 stage: salam → kata ganti → copula です → angka 1-10 → mini-boss hari/bulan → Kanji angka → Kanji dasar (人日月火水) → kata kerja ます → kata sifat -i/-na → boss Lord Vassal

## 🛠️ Tech Stack

- **Framework**: Next.js 16 dengan App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand (dengan localStorage persist)
- **Audio**: Web Audio API (chiptune generator, tanpa file audio external)
- **Fonts**: Press Start 2P, DotGothic16, VT323 (Google Fonts)

## 🚀 Cara Menjalankan

```bash
# Install dependencies
bun install

# Jalankan dev server
bun run dev

# Build untuk production
bun run build

# Jalankan production
bun run start
```

Buka `http://localhost:3000` di browser.

## 📁 Struktur Project

```
src/
├── app/
│   ├── layout.tsx          # Font setup & metadata
│   ├── page.tsx            # Game container dengan view routing
│   └── globals.css         # Styling 8-bit RPG (animasi, palette, panel)
├── components/game/
│   ├── PixelUI.tsx         # PixelSprite, PixelButton, PixelPanel, StatBar
│   ├── HUD.tsx             # Top bar: level, HP, XP, koin, settings
│   ├── TitleScreen.tsx     # Landing screen
│   ├── WorldMap.tsx        # 6 dunia dengan progress
│   ├── StageSelect.tsx     # Stage list dengan chapter divider
│   ├── StoryCutscene.tsx   # Typewriter dialogue + lesson view
│   ├── BattleScreen.tsx    # Battle: combo, crit, items, end screen
│   ├── Shop.tsx            # Toko Ramuan
│   ├── Practice.tsx        # Mode latihan
│   ├── Achievements.tsx    # Achievement & stats
│   └── Codex.tsx           # Inventory, badges, kana library
└── lib/game/
    ├── types.ts            # TypeScript interfaces
    ├── worlds.ts           # Data 6 dunia
    ├── stages.ts           # Bab 1: Hiragana (10 stage)
    ├── katakana-stages.ts  # Bab 2: Katakana (10 stage)
    ├── n5-stages.ts        # Bab 3: N5 Vassal Kingdom (10 stage)
    ├── items.ts            # Item definitions + achievements
    ├── store.ts            # Zustand store dengan persist
    ├── audio.ts            # Chiptune AudioEngine
    └── sprites.ts          # Enemy sprite mapping

```
public/sprites/             # 32 PNG sprite 8-bit (256x256)
scripts/
└── generate_sprites.py     # Pixel art sprite generator (PIL)
```

## 🎨 Desain Visual

- **Palette 8-bit modern**: warna gelap (deep navy) sebagai background, panel cream parchment, accent emas
- **Font pixel**: Press Start 2P untuk heading/UI, DotGothic16 untuk kanji, VT323 untuk body text
- **Pixel borders**: thick bordered panels dengan box-shadow berlapis (classic game window look)
- **CRT scanline overlay**: efek TV old-school (toggleable)
- **Sprite pixel art asli**: 32 sprite 8-bit (32x32px, scaled 8x to 256x256) dibuat procedurally dengan PIL
  - Hero (mage biru dengan tongkat sihir)
  - Yuki (pemandu berjubah putih)
  - 30 musuh unik: Slime, Kappa, Spirit, Troll, Gardo, Shadow King, Phantom Cermin, Kitsune-bi, Rokku, Lord Vassal, dll
  - Lokasi: `/public/sprites/` — generator: `python3 scripts/generate_sprites.py`
- **Animasi**: typewriter, float, bob, shake, pop, slash, damage-float, rainbow, combo

## 📖 Konsep Asli

Berdasarkan dokumen pitch "KotobaQuest" - Web-App Edukasi Bahasa Jepang Berbasis 8-Bit RPG Modern (Dasar hingga JLPT N1).

## 🗺️ Roadmap

- ✅ Bab 1: Hiragana (10 stage)
- ✅ Bab 2: Katakana (10 stage)
- ✅ Bab 3: N5 Vassal Kingdom (10 stage)
- ⏳ Bab N4: Minato Port (kosakata lanjutan, konjugasi kata kerja, ~300 Kanji)
- ⏳ Bab N3: Kage Clan (bahasa menengah, artikel berita, ~650 Kanji)
- ⏳ Bab N2: Tenno Citadel (bahasa formal/bisnis, ~1000 Kanji)
- ⏳ Bab N1: Emperor's Throne (literate kuno, ~2000 Kanji, boss akhir)
- ⏳ Spaced Repetition System (SRS) untuk review Kanji
- ⏳ Leaderboard global & PvP kuis
- ⏳ Sprite pixel-art asli (PNG) untuk hero & musuh

## 📝 License

MIT License - bebas dipakai untuk pembelajaran.

---

**KOTOBAQUEST** — Bertualang · Belajar · Menaklukkan 🗡️
