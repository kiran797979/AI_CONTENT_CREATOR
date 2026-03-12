import { useMemo } from "react";
import { fleschReadingEase, countWords, countChars, readTimeLabel, getScoreColor, getScoreBg, getScoreLabel } from "../utils/textAnalysis";
import { wordDiff } from "../utils/textDiff";
import type { DiffSegment } from "../utils/textDiff";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ABComparisonProps {
  versionA: string;
  versionB: string;
  onPick: (version: "A" | "B") => void;
}

// ─── Diff renderer ────────────────────────────────────────────────────────────

function DiffText({ segments }: { segments: DiffSegment[] }) {
  return (
    <p className="text-sm leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === "same") {
          return (
            <span
              key={i}
              className="text-gray-700 dark:text-zinc-300"
            >
              {seg.word}{" "}
            </span>
          );
        }
        if (seg.type === "added") {
          return (
            <span
              key={i}
              className="
                rounded px-0.5
                bg-emerald-100 text-emerald-700
                dark:bg-emerald-900/40 dark:text-emerald-300
              "
            >
              {seg.word}{" "}
            </span>
          );
        }
        // removed
        return (
          <span
            key={i}
            className="
              rounded px-0.5 line-through
              bg-red-100 text-red-500
              dark:bg-red-900/40 dark:text-red-400
            "
          >
            {seg.word}{" "}
          </span>
        );
      })}
    </p>
  );
}

// ─── Stat item ────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs font-medium tabular-nums text-gray-700 dark:text-zinc-300">
        {value}
      </span>
      <span className="text-[10px] text-gray-400 dark:text-zinc-600 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ─── Version card ─────────────────────────────────────────────────────────────

interface VersionCardProps {
  label: string;
  subtitle: string;
  accentColor: "blue" | "purple";
  segments: DiffSegment[];
  words: number;
  chars: number;
  score: number;
  onPick: () => void;
}

const ACCENT = {
  blue: {
    label: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    border: "border-blue-200 dark:border-blue-500/30",
    btnText: "text-blue-600 dark:text-blue-400",
    btnBorder: "border-blue-200 hover:border-blue-300 dark:border-blue-500/30 dark:hover:border-blue-500/50",
    btnHover: "hover:bg-blue-50 dark:hover:bg-blue-500/10",
    focusRing: "focus-visible:ring-blue-500/40",
  },
  purple: {
    label: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
    border: "border-purple-200 dark:border-purple-500/30",
    btnText: "text-purple-600 dark:text-purple-400",
    btnBorder: "border-purple-200 hover:border-purple-300 dark:border-purple-500/30 dark:hover:border-purple-500/50",
    btnHover: "hover:bg-purple-50 dark:hover:bg-purple-500/10",
    focusRing: "focus-visible:ring-purple-500/40",
  },
} as const;

function VersionCard({
  label,
  subtitle,
  accentColor,
  segments,
  words,
  chars,
  score,
  onPick,
}: VersionCardProps) {
  const a = ACCENT[accentColor];

  return (
    <div
      className="
        rounded-lg border p-4 flex flex-col
        border-gray-200 bg-white
        dark:border-zinc-800 dark:bg-zinc-900
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`w-2 h-2 rounded-full shrink-0 ${a.dot}`}
          />
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${a.label}`}>
            {label}
          </span>
        </div>
        <span className="text-[10px] text-gray-400 dark:text-zinc-600">
          {subtitle}
        </span>
      </div>

      {/* Diff content */}
      <div
        className="
          flex-1 overflow-y-auto max-h-56 mb-3
          rounded-md p-3
          bg-gray-50 dark:bg-zinc-800/50
        "
      >
        <DiffText segments={segments} />
      </div>

      {/* Stats row */}
      <div
        className="
          flex items-center justify-between gap-2 mb-3
          py-2 px-3 rounded-md
          bg-gray-50 dark:bg-zinc-800/30
        "
      >
        <div className="flex items-center gap-4">
          <Stat label="words" value={words} />
          <Stat label="chars" value={chars} />
          <Stat label="read" value={readTimeLabel(words)} />
        </div>

        {/* Readability badge */}
        <div
          className={`
            flex items-center gap-1.5 px-2 py-1 rounded-md
            ${getScoreBg(score)}
          `}
        >
          <span className={`text-xs font-semibold tabular-nums ${getScoreColor(score)}`}>
            {score}
          </span>
          <span className={`text-[10px] font-medium ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Pick button */}
      <button
        onClick={onPick}
        className={[
          "w-full py-2 rounded-md border text-xs font-medium",
          "transition-colors duration-150",
          "outline-none focus-visible:ring-2",
          a.btnText,
          a.btnBorder,
          a.btnHover,
          a.focusRing,
        ].join(" ")}
      >
        Pick {label}
      </button>
    </div>
  );
}

// ─── Diff legend ──────────────────────────────────────────────────────────────

function DiffLegend() {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      <span className="flex items-center gap-1.5 text-[10px]">
        <span
          className="
            inline-block w-3 h-3 rounded
            bg-emerald-100 dark:bg-emerald-900/40
            border border-emerald-200 dark:border-emerald-800/50
          "
        />
        <span className="text-gray-500 dark:text-zinc-500">Added</span>
      </span>
      <span className="flex items-center gap-1.5 text-[10px]">
        <span
          className="
            inline-block w-3 h-3 rounded
            bg-red-100 dark:bg-red-900/40
            border border-red-200 dark:border-red-800/50
          "
        />
        <span className="text-gray-500 dark:text-zinc-500">Removed</span>
      </span>
      <span className="flex items-center gap-1.5 text-[10px]">
        <span
          className="
            inline-block w-3 h-3 rounded
            bg-gray-100 dark:bg-zinc-800
            border border-gray-200 dark:border-zinc-700
          "
        />
        <span className="text-gray-500 dark:text-zinc-500">Unchanged</span>
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ABComparison({
  versionA,
  versionB,
  onPick,
}: ABComparisonProps) {
  const scoreA = useMemo(() => fleschReadingEase(versionA), [versionA]);
  const scoreB = useMemo(() => fleschReadingEase(versionB), [versionB]);
  const wordsA = useMemo(() => countWords(versionA), [versionA]);
  const wordsB = useMemo(() => countWords(versionB), [versionB]);
  const charsA = useMemo(() => countChars(versionA), [versionA]);
  const charsB = useMemo(() => countChars(versionB), [versionB]);
  const diff = useMemo(() => wordDiff(versionA, versionB), [versionA, versionB]);

  const diffA = useMemo(
    () => diff.filter((s) => s.type === "same" || s.type === "removed"),
    [diff],
  );
  const diffB = useMemo(
    () => diff.filter((s) => s.type === "same" || s.type === "added"),
    [diff],
  );

  // Quick comparison summary
  const wordDelta = wordsB - wordsA;
  const scoreDelta = scoreB - scoreA;

  return (
    <div className="flex flex-col gap-3 h-full min-h-0">
      {/* Summary bar */}
      <div
        className="
          flex items-center justify-between gap-4
          px-3 py-2 rounded-md
          bg-gray-100 dark:bg-zinc-800/50
          border border-gray-200 dark:border-zinc-800
        "
      >
        <span className="text-[11px] text-gray-500 dark:text-zinc-500">
          Comparison Summary
        </span>
        <div className="flex items-center gap-3">
          {/* Word count delta */}
          <span className="text-[11px] tabular-nums">
            <span className="text-gray-400 dark:text-zinc-600 mr-1">Words:</span>
            <span
              className={
                wordDelta === 0
                  ? "text-gray-500 dark:text-zinc-500"
                  : wordDelta < 0
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-emerald-600 dark:text-emerald-400"
              }
            >
              {wordDelta === 0 ? "same" : wordDelta > 0 ? `+${wordDelta}` : `${wordDelta}`}
            </span>
          </span>

          <span className="text-gray-200 dark:text-zinc-800">·</span>

          {/* Readability delta */}
          <span className="text-[11px] tabular-nums">
            <span className="text-gray-400 dark:text-zinc-600 mr-1">Readability:</span>
            <span
              className={
                scoreDelta === 0
                  ? "text-gray-500 dark:text-zinc-500"
                  : scoreDelta > 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-amber-600 dark:text-amber-400"
              }
            >
              {scoreDelta === 0 ? "same" : scoreDelta > 0 ? `+${scoreDelta}` : `${scoreDelta}`}
            </span>
          </span>
        </div>
      </div>

      {/* Version cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 min-h-0">
        <VersionCard
          label="Version A"
          subtitle="Original"
          accentColor="blue"
          segments={diffA}
          words={wordsA}
          chars={charsA}
          score={scoreA}
          onPick={() => onPick("A")}
        />
        <VersionCard
          label="Version B"
          subtitle="Variant"
          accentColor="purple"
          segments={diffB}
          words={wordsB}
          chars={charsB}
          score={scoreB}
          onPick={() => onPick("B")}
        />
      </div>

      {/* Diff legend */}
      <DiffLegend />
    </div>
  );
}