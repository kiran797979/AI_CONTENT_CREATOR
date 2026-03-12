/* ─────────────────────────────────────────────────────
   Sidebar – history panel (desktop persistent + mobile drawer)
   Zinc / blue theme · dark + light · responsive
   ───────────────────────────────────────────────────── */

import { AnimatePresence, motion } from "framer-motion";
import type { HistoryEntry } from "../hooks/useContentHistory";

/* ── Config ──────────────────────────────────────────── */

const TYPE_CONFIG: Record<string, { label: string; dot: string }> = {
  linkedin:  { label: "LinkedIn", dot: "bg-blue-400" },
  twitter:   { label: "Twitter",  dot: "bg-sky-400" },
  email:     { label: "Email",    dot: "bg-emerald-400" },
  "ad-copy": { label: "Ad Copy",  dot: "bg-purple-400" },
  blog:      { label: "Blog",     dot: "bg-amber-400" },
  "landing-page": { label: "Landing", dot: "bg-rose-400" },
};

const SLIDE_TRANSITION = { duration: 0.18, ease: "easeOut" } as const;
const FADE_TRANSITION = { duration: 0.15, ease: "easeOut" } as const;

/* ── Helpers ─────────────────────────────────────────── */

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "now";
  if (mins < 60) return `${String(mins)}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${String(hrs)}h`;
  const days = Math.floor(hrs / 24);
  return `${String(days)}d`;
}

function isMobileViewport(): boolean {
  return typeof window !== "undefined" ? window.innerWidth < 1024 : false;
}

/* ── Props ───────────────────────────────────────────── */

interface SidebarProps {
  readonly history: HistoryEntry[];
  readonly onSelect: (entry: HistoryEntry) => void;
  readonly onClear: () => void;
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

/* ── Main Component ──────────────────────────────────── */

export default function Sidebar({
  history,
  onSelect,
  onClear,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* ── Mobile overlay ────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="sidebar-overlay"
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] lg:hidden"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={FADE_TRANSITION}
          />
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ───────────────────────────── */}
      <aside
        className={[
          "hidden lg:flex lg:flex-col",
          "h-full w-60 shrink-0",
          "border-r",
          "border-gray-200/80 bg-gray-50/80",
          "dark:border-zinc-800/60 dark:bg-zinc-950/80",
        ].join(" ")}
      >
        <SidebarContent
          history={history}
          onSelect={onSelect}
          onClear={onClear}
          onClose={onClose}
          showMobileHeader={false}
        />
      </aside>

      {/* ── Mobile sidebar (drawer) ───────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="mobile-sidebar"
            className={[
              "fixed left-0 top-0 z-40",
              "flex h-full w-72 max-w-[85vw] flex-col",
              "border-r shadow-2xl",
              "border-gray-200 bg-white shadow-black/10",
              "dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40",
              "lg:hidden",
              // Rounded right edge
              "rounded-r-2xl",
            ].join(" ")}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={SLIDE_TRANSITION}
            aria-label="History sidebar"
          >
            <SidebarContent
              history={history}
              onSelect={onSelect}
              onClear={onClear}
              onClose={onClose}
              showMobileHeader
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Sidebar Content (shared between desktop + mobile) ── */

interface SidebarContentProps {
  readonly history: HistoryEntry[];
  readonly onSelect: (entry: HistoryEntry) => void;
  readonly onClear: () => void;
  readonly onClose: () => void;
  readonly showMobileHeader: boolean;
}

function SidebarContent({
  history,
  onSelect,
  onClear,
  onClose,
  showMobileHeader,
}: SidebarContentProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* ── Header ────────────────────────────────────── */}
      <div
        className={[
          "flex items-center justify-between px-4 py-3 shrink-0",
          "border-b border-gray-200/80 dark:border-zinc-800/60",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={[
              "text-[11px] font-semibold uppercase tracking-widest",
              "text-gray-500 dark:text-zinc-400",
            ].join(" ")}
          >
            History
          </span>

          {history.length > 0 && (
            <span
              className={[
                "px-1.5 py-0.5 rounded-md text-[10px] font-medium tabular-nums",
                "bg-gray-100 text-gray-500 border border-gray-200/80",
                "dark:bg-zinc-800/80 dark:text-zinc-500 dark:border-zinc-700/50",
              ].join(" ")}
            >
              {history.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              onClick={onClear}
              type="button"
              className={[
                "px-2 py-1 rounded-md text-[11px] font-medium",
                "text-gray-400 hover:text-red-500",
                "dark:text-zinc-500 dark:hover:text-red-400",
                "hover:bg-red-50 dark:hover:bg-red-500/5",
                "transition-colors duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20",
              ].join(" ")}
              aria-label="Clear history"
            >
              Clear
            </button>
          )}

          {showMobileHeader && (
            <button
              onClick={onClose}
              type="button"
              className={[
                "p-1.5 rounded-lg",
                "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
                "dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800",
                "transition-colors duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20",
              ].join(" ")}
              aria-label="Close sidebar"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2L12 12M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── List ──────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {history.length === 0 ? (
          <EmptyHistory />
        ) : (
          <ul className="space-y-0.5">
            {history.map((entry) => (
              <li key={entry.id}>
                <HistoryItem
                  entry={entry}
                  onSelect={() => {
                    onSelect(entry);
                    if (isMobileViewport()) {
                      onClose();
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Footer (keyboard shortcut hint) ───────────── */}
      <div
        className={[
          "shrink-0 px-4 py-2.5",
          "border-t border-gray-200/80 dark:border-zinc-800/60",
        ].join(" ")}
      >
        <p
          className={[
            "text-[10px] text-center",
            "text-gray-400 dark:text-zinc-600",
          ].join(" ")}
        >
          <kbd
            className={[
              "inline-flex items-center px-1 py-0.5 rounded",
              "text-[9px] font-mono font-medium",
              "bg-gray-100 border border-gray-200",
              "dark:bg-zinc-800 dark:border-zinc-700/60",
              "text-gray-500 dark:text-zinc-500",
            ].join(" ")}
          >
            ⌘K
          </kbd>
          {" "}to search
        </p>
      </div>
    </div>
  );
}

/* ── History Item ─────────────────────────────────────── */

interface HistoryItemProps {
  readonly entry: HistoryEntry;
  readonly onSelect: () => void;
}

function HistoryItem({ entry, onSelect }: HistoryItemProps) {
  const config = TYPE_CONFIG[entry.contentType] ?? {
    label: "Other",
    dot: "bg-gray-400",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "group w-full rounded-xl px-3 py-2.5 text-left",
        "border border-transparent",
        "hover:bg-gray-100/80 hover:border-gray-200/60",
        "dark:hover:bg-zinc-800/40 dark:hover:border-zinc-700/40",
        "transition-all duration-150",
        "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20",
      ].join(" ")}
      aria-label={`Load generation: ${entry.topic}`}
    >
      {/* Topic + time */}
      <div className="flex items-start justify-between gap-2">
        <p
          className={[
            "min-w-0 truncate text-[12px] font-medium leading-snug",
            "text-gray-700 group-hover:text-gray-900",
            "dark:text-zinc-300 dark:group-hover:text-zinc-100",
            "transition-colors duration-150",
          ].join(" ")}
        >
          {entry.topic}
        </p>
        <span
          className={[
            "shrink-0 text-[10px] tabular-nums",
            "text-gray-400 dark:text-zinc-600",
          ].join(" ")}
        >
          {relativeTime(entry.timestamp)}
        </span>
      </div>

      {/* Type badge */}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className={[
            "w-1.5 h-1.5 rounded-full shrink-0",
            config.dot,
          ].join(" ")}
        />
        <span
          className={[
            "text-[10px] font-medium uppercase tracking-wider",
            "text-gray-500 dark:text-zinc-500",
          ].join(" ")}
        >
          {config.label}
        </span>
      </div>
    </button>
  );
}

/* ── Empty State ─────────────────────────────────────── */

function EmptyHistory() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div
        className={[
          "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
          "bg-gray-100 border border-gray-200/80",
          "dark:bg-zinc-800/60 dark:border-zinc-800",
        ].join(" ")}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-400 dark:text-zinc-600"
          aria-hidden="true"
        >
          <path
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <p className="text-[12px] text-gray-500 dark:text-zinc-500 font-medium">
        No history yet
      </p>
      <p
        className={[
          "text-[11px] text-gray-400 dark:text-zinc-600",
          "mt-1 text-center leading-relaxed",
        ].join(" ")}
      >
        Your generations will
        <br />
        appear here
      </p>
    </div>
  );
}