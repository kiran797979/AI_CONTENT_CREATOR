export interface DiffSegment {
  word: string;
  type: "same" | "added" | "removed";
}

/**
 * Simple word-level diff using longest common subsequence (LCS).
 * Returns an array of segments marking each word as same, added, or removed.
 */
export function wordDiff(textA: string, textB: string): DiffSegment[] {
  const wordsA = textA.trim().split(/\s+/).filter(Boolean);
  const wordsB = textB.trim().split(/\s+/).filter(Boolean);

  const m = wordsA.length;
  const n = wordsB.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (wordsA[i - 1] === wordsB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to produce diff
  const result: DiffSegment[] = [];
  let i = m;
  let j = n;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && wordsA[i - 1] === wordsB[j - 1]) {
      result.push({ word: wordsA[i - 1], type: "same" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ word: wordsB[j - 1], type: "added" });
      j--;
    } else {
      result.push({ word: wordsA[i - 1], type: "removed" });
      i--;
    }
  }

  return result.reverse();
}
