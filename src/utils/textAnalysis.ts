export interface TextMetrics {
  sentences: number;
  avgWordsPerSentence: number;
  paragraphs: number;
  readTime: number;
  keywordDensity: Record<string, number>;
}

function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  if (w.length <= 3) return 1;
  const matches = w.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(matches.length, 1) : 1;
}

function tokenize(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return { words: [] as string[], sentenceCount: 0 };
  const words = trimmed.split(/\s+/).filter(Boolean);
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return { words, sentenceCount: Math.max(sentences.length, 1) };
}

export function fleschReadingEase(text: string): number {
  const { words, sentenceCount } = tokenize(text);
  if (words.length === 0) return 0;
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const score =
    206.835 -
    1.015 * (words.length / sentenceCount) -
    84.6 * (totalSyllables / words.length);
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

// ── Score display helpers (single source of truth) ──────────

/** Tailwind text-color class for a Flesch score */
export function getScoreColor(score: number): string {
  if (score >= 60) return "text-emerald-600 dark:text-emerald-400";
  if (score >= 30) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

/** Background class for a Flesch score badge */
export function getScoreBg(score: number): string {
  if (score >= 60) return "bg-emerald-100 dark:bg-emerald-500/10";
  if (score >= 30) return "bg-amber-100 dark:bg-amber-500/10";
  return "bg-red-100 dark:bg-red-500/10";
}

/** Human label for a Flesch score */
export function getScoreLabel(score: number): string {
  if (score >= 60) return "Easy";
  if (score >= 30) return "Moderate";
  return "Advanced";
}

/** Hex color for a Flesch score (used in SVG/canvas) */
export function getScoreHex(score: number): string {
  if (score >= 60) return "#22c55e";
  if (score >= 30) return "#eab308";
  return "#ef4444";
}

/** Tailwind text class (green/yellow/red-500) for a Flesch score */
export function getScoreTextClass(score: number): string {
  if (score >= 60) return "text-green-500";
  if (score >= 30) return "text-yellow-500";
  return "text-red-500";
}

// ── Quick stat helpers (word count / read time) ─────────────

export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function countChars(text: string): number {
  return text.trim().length;
}

export function readTimeLabel(words: number): string {
  const mins = words / 200;
  return mins < 1
    ? `${Math.max(Math.round(mins * 60), 1)}s`
    : `${Math.round(mins)}m`;
}

const TONE_KEYWORDS: Record<string, string[]> = {
  Professional: [
    "strategy", "implement", "optimize", "leverage", "stakeholder",
    "objective", "framework", "deliverable", "synergy", "enterprise",
  ],
  Casual: [
    "hey", "cool", "awesome", "stuff", "pretty",
    "gonna", "wanna", "yeah", "honestly", "kinda",
  ],
  Persuasive: [
    "must", "need", "urgent", "essential", "critical",
    "proven", "guarantee", "exclusive", "limited", "immediately",
  ],
  Friendly: [
    "love", "great", "amazing", "wonderful", "excited",
    "happy", "welcome", "together", "share", "fun",
  ],
  Analytical: [
    "data", "analysis", "research", "evidence", "statistics",
    "findings", "study", "measure", "trend", "insight",
  ],
};

export function analyzeTone(text: string): Record<string, number> {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const counts: Record<string, number> = {};
  let total = 0;

  for (const [tone, keywords] of Object.entries(TONE_KEYWORDS)) {
    let hits = 0;
    for (const kw of keywords) {
      for (const w of words) {
        if (w.includes(kw)) hits++;
      }
    }
    if (hits > 0) {
      counts[tone] = hits;
      total += hits;
    }
  }

  if (total === 0) return { Neutral: 100 };

  const result: Record<string, number> = {};
  for (const [tone, hits] of Object.entries(counts)) {
    result[tone] = Math.round((hits / total) * 1000) / 10;
  }
  return result;
}

export function getMetrics(text: string, keywords?: string[]): TextMetrics {
  const { words, sentenceCount } = tokenize(text);

  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || 1
    : 0;

  const readTime =
    words.length > 0
      ? Math.max(0.1, Math.round((words.length / 200) * 10) / 10)
      : 0;

  const keywordDensity: Record<string, number> = {};

  if (keywords && keywords.length > 0) {
    // Compute density for supplied keywords
    const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z]/g, ""));
    for (const kw of keywords) {
      const kwLower = kw.toLowerCase().trim();
      if (!kwLower) continue;
      const count = lowerWords.filter((w) => w === kwLower).length;
      if (count > 0) {
        keywordDensity[kwLower] = Math.round((count / words.length) * 1000) / 10;
      }
    }
  } else {
    // Fallback: top 5 words (length>3, appearing 2+)
    const freq: Record<string, number> = {};
    for (const w of words) {
      const clean = w.toLowerCase().replace(/[^a-z]/g, "");
      if (clean.length > 3) {
        freq[clean] = (freq[clean] ?? 0) + 1;
      }
    }

    const sorted = Object.entries(freq)
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    for (const [word, count] of sorted) {
      keywordDensity[word] = Math.round((count / words.length) * 1000) / 10;
    }
  }

  return {
    sentences: sentenceCount,
    avgWordsPerSentence:
      words.length > 0
        ? Math.round((words.length / sentenceCount) * 10) / 10
        : 0,
    paragraphs,
    readTime,
    keywordDensity,
  };
}
