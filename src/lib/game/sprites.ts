// ===== SPRITE HELPER =====
// Maps enemy IDs to sprite PNG paths.
// All sprites are 256x256 PNGs in /public/sprites/.

// Inline enemy-to-sprite mapping (kept in sync with /public/sprites/manifest.json)
const ENEMY_MAP: Record<string, string> = {
  "slime-a": "slime",
  "kappa-slime": "kappa",
  "s-spirit": "spirit",
  "t-troll": "troll",
  gardo: "gardo",
  "shadow-king": "shadow_king",
  "mirror-echo": "echo_mirror",
  "k-beast": "k_beast",
  "shadow-nh": "shadow_nh",
  "three-siblings": "stone_trio",
  "mirror-test": "mirror_test",
  "locked-door": "locked_door",
  "stone-trio": "stone_trio",
  "mirror-horde": "mirror_horde",
  "word-phantom": "word_phantom",
  "mirror-phantom": "mirror_phantom",
  "merchant-illusion": "merchant_illusion",
  "book-spirit": "book_spirit",
  "kitsune-bi": "kitsune",
  rokku: "rokku",
  "confused-merchant": "confused_merchant",
  "name-thief": "name_thief",
  "is-bug": "is_bug",
  "number-ghost": "number_ghost",
  tokkun: "tokkun",
  "kanji-tutor": "kanji_tutor",
  "kanji-book": "kanji_book",
  "verb-shadow": "verb_shadow",
  "adjective-mist": "adjective_mist",
  "lord-vassal": "lord_vassal",
};

/**
 * Get sprite PNG path for a given enemy ID.
 * Returns "/sprites/<name>.png" or null if no sprite exists.
 */
export function getEnemySprite(enemyId: string): string | null {
  const spriteName = ENEMY_MAP[enemyId];
  if (!spriteName) return null;
  return `/sprites/${spriteName}.png`;
}

/**
 * Get hero sprite path.
 */
export function getHeroSprite(hasShield = false): string {
  return "/sprites/hero.png";
}

/**
 * Get Yuki (companion) sprite path.
 */
export function getYukiSprite(): string {
  return "/sprites/yuki.png";
}
