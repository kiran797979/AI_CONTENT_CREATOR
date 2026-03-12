import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fleschReadingEase, analyzeTone, getMetrics, getScoreHex, getScoreLabel, getScoreTextClass } from "../utils/textAnalysis";


// --- Animated number (rAF count-up, safe for React 19 lint) ---

function AnimatedNumber({ target, decimals = 0, suffix = "" }: { target: number; decimals?: number; suffix?: string }) {
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();
    const duration = 1500;

    function tick(now: number) {
      if (cancelled) return;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setDisplay(current.toFixed(decimals) + suffix);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    return () => { cancelled = true; };
  }, [target, decimals, suffix]);

  return <>{display}</>;
}

// --- Tone bar colors ---

const toneColors: Record<string, string> = {
  Professional: "bg-blue-500",
  Casual: "bg-green-500",
  Persuasive: "bg-red-500",
  Friendly: "bg-amber-500",
  Analytical: "bg-purple-500",
  Neutral: "bg-zinc-400",
};

// --- Metric icons ---

const metricIcons: Record<string, string> = {
  Sentences: "M4 6h16M4 10h16M4 14h10",
  "Avg Words": "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  Paragraphs: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  "Read Time": "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  Keywords: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
  "Flesch Score": "M13 10V3L4 14h7v7l9-11h-7z",
};

// --- Main component ---

interface ContentAnalysisProps {
  text: string;
}

export default function ContentAnalysis({ text }: ContentAnalysisProps) {
  const [isOpen, setIsOpen] = useState(true);

  const fleschScore = useMemo(() => fleschReadingEase(text), [text]);
  const toneData = useMemo(() => analyzeTone(text), [text]);
  const metrics = useMemo(() => getMetrics(text), [text]);

  const toneEntries = Object.entries(toneData);
  const proportion = fleschScore / 100;
  const scoreColor = getScoreHex(fleschScore);

  const metricItems = [
    { label: "Sentences", value: metrics.sentences, icon: metricIcons.Sentences },
    { label: "Avg Words", value: metrics.avgWordsPerSentence, icon: metricIcons["Avg Words"], decimals: 1 },
    { label: "Paragraphs", value: metrics.paragraphs, icon: metricIcons.Paragraphs },
    { label: "Read Time", value: metrics.readTime, icon: metricIcons["Read Time"], decimals: 1, suffix: " min" },
    { label: "Keywords", value: Object.keys(metrics.keywordDensity).length, icon: metricIcons.Keywords },
    { label: "Flesch Score", value: fleschScore, icon: metricIcons["Flesch Score"], decimals: 1 },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      {/* Collapsible header */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:ring-inset transition-colors hover:bg-zinc-800/40"
        aria-expanded={isOpen}
        aria-label="Toggle content analysis"
      >
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Content Analysis</h3>
        <motion.svg
          className="w-4 h-4 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Collapsible body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="analysis-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-6">

              {/* --- Readability Gauge --- */}
              <div>
                <h4 className="text-[11px] font-medium text-zinc-500 mb-3">
                  Readability Score
                </h4>
                <div className="flex flex-col items-center">
                  <svg viewBox="0 0 120 120" className="w-28 h-28">
                    <circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      strokeWidth="8"
                      className="stroke-zinc-800"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="52"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke={scoreColor}
                      strokeDasharray="1 1"
                      transform="rotate(-90 60 60)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: proportion }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <text
                      x="60"
                      y="56"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`text-2xl font-bold fill-current ${getScoreTextClass(fleschScore)}`}
                      style={{ fontSize: 24 }}
                    >
                      <AnimatedNumber target={fleschScore} decimals={1} />
                    </text>
                    <text
                      x="60"
                      y="78"
                      textAnchor="middle"
                      className="fill-zinc-500"
                      style={{ fontSize: 10 }}
                    >
                      {getScoreLabel(fleschScore)}
                    </text>
                  </svg>
                </div>
              </div>

              {/* --- Tone Analysis --- */}
              <div>
                <h4 className="text-[11px] font-medium text-zinc-500 mb-3">
                  Tone Analysis
                </h4>
                <div className="space-y-2">
                  {toneEntries.map(([tone, pct], i) => (
                    <div key={tone} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>{tone}</span>
                        <span>{Math.round(pct)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${toneColors[tone] ?? "bg-zinc-400"}`}
                          initial={{ width: "0%" }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* --- Metrics Grid --- */}
              <div>
                <h4 className="text-[11px] font-medium text-zinc-500 mb-3">
                  Text Metrics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {metricItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg border border-zinc-800 bg-zinc-800/40 p-3 text-center"
                    >
                      <div className="mx-auto w-6 h-6 mb-1.5 text-blue-400">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                      </div>
                      <p className="text-lg font-bold text-zinc-100">
                        <AnimatedNumber target={item.value} decimals={item.decimals ?? 0} suffix={item.suffix ?? ""} />
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
