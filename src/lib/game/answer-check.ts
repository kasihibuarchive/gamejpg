// ===== ANSWER VALIDATION HELPER =====
// Centralized typing answer check with tolerance:
// - Case insensitive
// - Trim whitespace
// - Normalize macrons (ā→a, ū→u, etc.)
// - Split answers on "/" (e.g. "kyuu/ku" → ["kyuu", "ku"])
// - Remove spaces and hyphens
// - Handle common romaji variations (ou→o, uu→u for some cases)

/**
 * Normalize a single answer string for comparison.
 */
function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    // Normalize macrons and long vowels
    .replace(/ā/g, "a")
    .replace(/ī/g, "i")
    .replace(/ū/g, "u")
    .replace(/ē/g, "e")
    .replace(/ō/g, "o")
    // Remove spaces, hyphens, apostrophes
    .replace(/[\s\-']/g, "")
    // Normalize "ou" → "o" (e.g. "arigatou" matches "arigato")
    .replace(/ou/g, "o")
    // Normalize "oo" → "o" (e.g. "ohayoo" matches "ohayo")
    .replace(/oo/g, "o")
    // Normalize "uu" → "u" (e.g. "kyuu" matches "kyu")
    .replace(/uu/g, "u")
    // Normalize "ee" → "e" (e.g. "sensei" matches "sensee")
    .replace(/ee/g, "e");
}

/**
 * Check if user's typed answer matches any of the acceptable answers.
 * Handles:
 * - Multiple acceptable answers in the `answer` array
 * - Answers containing "/" (split into multiple acceptable forms)
 * - User input containing "/" (also split, accept any part)
 * - Macrons, long vowels, spaces, hyphens
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
 * Splits on "/" and returns the first part.
 */
export function getPrimaryAnswer(acceptableAnswers: string[]): string {
  if (acceptableAnswers.length === 0) return "";
  const first = acceptableAnswers[0];
  const parts = first.split("/").map((s) => s.trim()).filter(Boolean);
  return parts[0] || first;
}
