// ===== ANSWER VALIDATION HELPER =====
// Centralized typing answer check with STRONG tolerance.
// Accepts many romaji variations: kohi, koohii, ko-hi, koohi, etc.

/**
 * Normalize a single answer string for comparison.
 * Very lenient: removes long vowels, hyphens, spaces, normalizes case.
 */
function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    // Normalize macrons
    .replace(/ā/g, "a")
    .replace(/ī/g, "i")
    .replace(/ū/g, "u")
    .replace(/ē/g, "e")
    .replace(/ō/g, "o")
    // Remove spaces, hyphens, apostrophes
    .replace(/[\s\-']/g, "")
    // Normalize long vowels: ou→o, oo→o, uu→u, ee→e, ii→i
    // This means "koohii" → "kohi", "kyuu" → "kyu", "arigatou" → "arigato"
    .replace(/ou/g, "o")
    .replace(/oo/g, "o")
    .replace(/uu/g, "u")
    .replace(/ee/g, "e")
    .replace(/ii/g, "i")
    // Also handle remaining double letters after above (e.g. "kohhi" → "kohi")
    .replace(/(.)\1+/g, "$1");
}

/**
 * Check if user's typed answer matches any of the acceptable answers.
 * VERY tolerant: accepts many romaji spelling variations.
 *
 * @param typedAnswer - What the user typed
 * @param acceptableAnswers - Array of acceptable answers (from question.answer)
 * @returns true if match found
 */
export function checkTypingAnswer(
  typedAnswer: string,
  acceptableAnswers: string[],
): boolean {
  // Also split user input on "/" in case user types "kyuu/ku"
  const typedParts = typedAnswer
    .split("/")
    .map((s) => normalizeAnswer(s))
    .filter(Boolean);
  if (typedParts.length === 0) return false;

  // Collect all acceptable forms by splitting on "/"
  const allAcceptable: string[] = [];
  for (const ans of acceptableAnswers) {
    const parts = ans.split("/").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      allAcceptable.push(normalizeAnswer(part));
    }
  }

  // Match if ANY typed part matches ANY acceptable answer
  return typedParts.some((tp) => allAcceptable.some((a) => a === tp));
}

/**
 * Get the primary (first) acceptable answer for display.
 * Cleans up: takes first variant, removes "/" splits.
 */
export function getPrimaryAnswer(acceptableAnswers: string[]): string {
  if (acceptableAnswers.length === 0) return "";
  const first = acceptableAnswers[0];
  const parts = first.split("/").map((s) => s.trim()).filter(Boolean);
  return parts[0] || first;
}
