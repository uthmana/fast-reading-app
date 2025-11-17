// utils/turkishWords.ts

// A compact Turkish word pool. Add more words as needed.
export const TURKISH_WORDS = [
  "a",
  "o",
  "ev",
  "su",
  "at",
  "��",
  "g�z",
  "el",
  "kar",
  "g�n",
  "yol",
  "den",
  "kitap",
  "okul",
  "masa",
  "saat",
  "kalem",
  "pencere",
  "kap�",
  "bah�e",
  "�ehir",
  "arkada�",
  "�ocuk",
  "istanbul",
  "ankara",
  "izmir",
  "g�zellik",
  "mutluluk",
  "�al��mak",
  "��renci",
  "��retmen",
  "bilgisayar",
  "televizyon",
  "programlama",
  "deneyim",
  "hayat",
  "d���nce",
  "g�r��",
  "uzmanl�k",
  "m�zik",
  "resim",
  "sanat",
  "do�a",
  "manzara",
  "al��veri�",
  "yaz�l�m",
  "donan�m",
  "veritaban�",
  "a�a�lar",
  "g�ne�",
  "ya�mur",
  "karanl�k",
  "ayd�nl�k",
  "mutfa��m�z",
  "sevgilim",
  "arkada�lar",
];

// Count grapheme-like clusters (safe for Turkish letters)
export function graphemeLength(s: string): number {
  const str = String(s || "").normalize("NFC");

  // Prefer Intl.Segmenter when available (most modern environments)
  try {
    if (typeof (Intl as any).Segmenter === "function") {
      const seg = new (Intl as any).Segmenter("tr", {
        granularity: "grapheme",
      });
      // build an array of segments via match fallback so we avoid iterator issues in older TS targets
      // Segmenter provides a resolvedSegments method in newer engines but to be compatible we fall back.
      // We'll attempt to use segmenter to get segments by repeatedly calling," but to keep code portable we use regex fallback below.
    }
  } catch (e) {
    /* ignore and fallback to regex */
  }

  // Fallback: match letters with optional combining marks or numbers. This works well for Turkish.
  // We match sequences: a base letter (\p{L}) followed by zero or more marks (\p{M}), or a number (\p{N}).
  // The 'u' and 'g' flags ensure Unicode-aware matching and returning all occurrences.
  const clusters = str.match(/(\p{L}\p{M}*|\p{N})/gu);
  return clusters ? clusters.length : 0;
}

// Normalize and remove non-letter/number characters; lower-case using Turkish locale
export function normalizeTurkishWord(w: string): string {
  if (!w) return "";
  const trimmed = String(w).trim();
  // keep all Unicode letters and numbers (this includes Turkish characters)
  const cleaned = trimmed.replace(/[^\p{L}\p{N}]+/gu, "");
  return cleaned.toLocaleLowerCase("tr");
}

// Return array of words that exactly match the requested letter count (1-12)
export function getTurkishWordsByLength(
  length: number,
  pool: string[] = TURKISH_WORDS
): string[] {
  if (!Number.isInteger(length) || length < 1 || length > 12) return [];

  const seen = new Set<string>();
  return pool
    .map(normalizeTurkishWord)
    .filter(Boolean)
    .filter((w) => {
      const ok = graphemeLength(w) === length;
      if (ok && !seen.has(w)) {
        seen.add(w);
        return true;
      }
      return false;
    });
}

// Optionally produce a grouped map for quick lookups
export function groupByLength(pool: string[] = TURKISH_WORDS) {
  const map: Record<number, string[]> = {} as Record<number, string[]>;
  for (let i = 1; i <= 12; i++) map[i] = [];
  for (const w of pool) {
    const n = graphemeLength(normalizeTurkishWord(w));
    if (n >= 1 && n <= 12) map[n].push(normalizeTurkishWord(w));
  }
  return map;
}
