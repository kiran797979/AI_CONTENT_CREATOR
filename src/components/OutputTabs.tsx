/* ─────────────────────────────────────────────────────
   OutputTabs – Preview / Raw / Markdown tabbed output
   Zinc / blue theme · dark + light · minimal motion
   ───────────────────────────────────────────────────── */

import { type ReactNode, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tooltip from "./Tooltip";
import { renderMarkdown } from "../utils/markdownRenderer";
import { downloadAsText, downloadAsMarkdown } from "../utils/downloadFile";
import { useTypewriter } from "../hooks/useTypewriter";

/* ── Constants ─────────────────────────────────────── */

const TABS = ["Preview", "Raw", "Markdown"] as const;
type Tab = (typeof TABS)[number];

const TAB_ICONS: Record<Tab, ReactNode> = {
  Preview: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Raw: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Markdown: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

const FADE = { duration: 0.15 } as const;

/* ── Props ─────────────────────────────────────────── */

interface OutputTabsProps {
  readonly output: string;
  readonly onCopy?: () => void;
  readonly onRegenerate?: () => void;
}

/* ── Component ─────────────────────────────────────── */

export default function OutputTabs({
  output,
  onCopy,
  onRegenerate,
}: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Preview");
  const [copied, setCopied] = useState(false);
  const { displayedText, isTyping, skip } = useTypewriter(output);

  const handleCopy = useCallback(() => {
    onCopy?.();
    setCopied(true);
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, [onCopy]);

  /* ── Computed ────────────────────────────────────── */

  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="flex flex-col h-full gap-0">
      {/* ── Tab bar ─────────────────────────────────── */}
      <div className="flex items-center gap-0 border-b border-gray-200 dark:border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
            }}
            className={[
              "relative flex items-center gap-1.5",
              "px-3 py-2 text-[11px] font-semibold uppercase tracking-wider",
              "transition-colors duration-150 outline-none",
              activeTab === tab
                ? "text-blue-500 dark:text-blue-400"
                : "text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300",
            ].join(" ")}
          >
            <span aria-hidden="true" className="opacity-70">
              {TAB_ICONS[tab]}
            </span>
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="output-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500 dark:bg-blue-400 rounded-full"
                transition={FADE}
              />
            )}
          </button>
        ))}

        {/* ── Stats pill ────────────────────────────── */}
        {output.trim() && (
          <span
            className={[
              "ml-auto mr-1 flex items-center gap-2",
              "text-[10px] tabular-nums font-medium",
              "text-gray-400 dark:text-zinc-600",
              "select-none",
            ].join(" ")}
          >
            <span>{wordCount} words</span>
            <span className="w-px h-2.5 bg-gray-200 dark:bg-zinc-700" />
            <span>{readTime} min read</span>
          </span>
        )}

        {/* ── Skip typing button ────────────────────── */}
        <AnimatePresence>
          {isTyping && activeTab === "Preview" && (
            <motion.button
              key="skip"
              onClick={skip}
              className={[
                "ml-2 mr-1 px-2 py-1 rounded-md",
                "text-[11px] font-medium",
                "text-blue-500 dark:text-blue-400",
                "hover:bg-gray-100 dark:hover:bg-zinc-800",
                "transition-colors duration-150 outline-none",
              ].join(" ")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={FADE}
            >
              Skip ▸
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Tab content ─────────────────────────────── */}
      <div
        className={[
          "flex-1 overflow-y-auto",
          "rounded-lg mt-2 p-4",
          "border border-gray-100 dark:border-zinc-800",
          "bg-gray-50/50 dark:bg-zinc-900/60",
        ].join(" ")}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE}
          >
            {activeTab === "Preview" && (
              <pre
                className={[
                  "whitespace-pre-wrap",
                  "text-[13px] leading-relaxed font-medium",
                  "text-gray-800 dark:text-zinc-200",
                ].join(" ")}
              >
                {displayedText}
                {isTyping && (
                  <span
                    aria-hidden="true"
                    className={[
                      "inline-block w-[2px] h-[1em] align-middle ml-0.5",
                      "bg-blue-500 dark:bg-blue-400",
                      "animate-blink",
                    ].join(" ")}
                  />
                )}
              </pre>
            )}

            {activeTab === "Raw" && (
              <pre
                className={[
                  "whitespace-pre overflow-x-auto",
                  "text-xs leading-relaxed font-mono",
                  "text-gray-500 dark:text-zinc-400",
                  "selection:bg-blue-500/20",
                ].join(" ")}
              >
                {output}
              </pre>
            )}

            {activeTab === "Markdown" && (
              <div
                className={[
                  "prose prose-sm dark:prose-invert max-w-none",
                  "text-gray-800 dark:text-zinc-200",
                  "[&_code]:bg-gray-100 [&_code]:dark:bg-zinc-800",
                  "[&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded",
                  "[&_code]:text-[12px] [&_code]:font-mono",
                  "[&_pre]:bg-gray-100 [&_pre]:dark:bg-zinc-800/80",
                  "[&_pre]:rounded-lg [&_pre]:border [&_pre]:border-gray-200 [&_pre]:dark:border-zinc-700",
                  "[&_a]:text-blue-500 [&_a]:no-underline [&_a]:hover:underline",
                  "[&_blockquote]:border-l-blue-500/40 [&_blockquote]:text-gray-500 [&_blockquote]:dark:text-zinc-400",
                ].join(" ")}
              >
                {renderMarkdown(output)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Action bar ──────────────────────────────── */}
      <div
        className={[
          "flex items-center gap-0.5 mt-2",
          "pt-2 border-t border-gray-100 dark:border-zinc-800/60",
        ].join(" ")}
      >
        <ActionButton
          tooltip={copied ? "Copied!" : "Copy"}
          onClick={handleCopy}
          label="Copy to clipboard"
          icon={
            copied ? (
              <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
            )
          }
          text={copied ? "Copied" : "Copy"}
          active={copied}
        />

        <ActionButton
          tooltip="Download .txt"
          onClick={() => {
            downloadAsText(output);
          }}
          label="Download as text"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
          text=".txt"
        />

        <ActionButton
          tooltip="Download .md"
          onClick={() => {
            downloadAsMarkdown(output);
          }}
          label="Download as markdown"
          icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
          text=".md"
        />

        {onRegenerate && (
          <ActionButton
            tooltip="Regenerate"
            onClick={onRegenerate}
            label="Regenerate content"
            className="ml-auto"
            icon={
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
            text="Regenerate"
          />
        )}
      </div>
    </div>
  );
}

/* ── ActionButton (internal) ─────────────────────── */

interface ActionButtonProps {
  readonly tooltip: string;
  readonly onClick: () => void;
  readonly label: string;
  readonly icon: ReactNode;
  readonly text: string;
  readonly className?: string;
  readonly active?: boolean;
}

function ActionButton({
  tooltip,
  onClick,
  label,
  icon,
  text,
  className = "",
  active = false,
}: ActionButtonProps) {
  return (
    <Tooltip label={tooltip}>
      <button
        onClick={onClick}
        aria-label={label}
        className={[
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md",
          "text-[11px] font-medium",
          "transition-colors duration-150 outline-none",
          active
            ? "text-emerald-500 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10"
            : "text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800",
          "focus-visible:ring-2 focus-visible:ring-blue-500/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon}
        {text}
      </button>
    </Tooltip>
  );
}