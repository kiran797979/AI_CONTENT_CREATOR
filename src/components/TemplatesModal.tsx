import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Template } from "../data/templates";
import { templates } from "../data/templates";

// ─── Filter setup ─────────────────────────────────────────────────────────────

const FILTERS = ["All", "LinkedIn", "Email", "Ad Copy"] as const;
type Filter = (typeof FILTERS)[number];

const FILTER_MAP: Record<Filter, string | null> = {
  All: null,
  LinkedIn: "linkedin",
  Email: "email",
  "Ad Copy": "ad-copy",
};

const TYPE_CONFIG: Record<string, { label: string; dot: string; accent: string; accentBg: string }> = {
  linkedin: {
    label: "LinkedIn",
    dot: "bg-blue-500",
    accent: "text-blue-600 dark:text-blue-400",
    accentBg: "bg-blue-100 dark:bg-blue-500/10",
  },
  email: {
    label: "Email",
    dot: "bg-emerald-500",
    accent: "text-emerald-600 dark:text-emerald-400",
    accentBg: "bg-emerald-100 dark:bg-emerald-500/10",
  },
  "ad-copy": {
    label: "Ad Copy",
    dot: "bg-purple-500",
    accent: "text-purple-600 dark:text-purple-400",
    accentBg: "bg-purple-100 dark:bg-purple-500/10",
  },
};

const FILTER_COUNTS = (list: readonly Template[]): Record<Filter, number> => ({
  All: list.length,
  LinkedIn: list.filter((t) => t.contentType === "linkedin").length,
  Email: list.filter((t) => t.contentType === "email").length,
  "Ad Copy": list.filter((t) => t.contentType === "ad-copy").length,
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: Template) => void;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function TemplatesModal({ isOpen, onClose, onSelect }: TemplatesModalProps) {
  return (
    <AnimatePresence>
      {isOpen && <TemplatesModalInner onClose={onClose} onSelect={onSelect} />}
    </AnimatePresence>
  );
}

// ─── Inner ────────────────────────────────────────────────────────────────────

function TemplatesModalInner({ onClose, onSelect }: Omit<TemplatesModalProps, "isOpen">) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Escape + keyboard nav
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Auto-focus search
  useEffect(() => {
    requestAnimationFrame(() => {
      searchRef.current?.focus();
    });
  }, []);

  // Filter logic
  const filtered = useMemo(() => {
    const typeFilter = FILTER_MAP[filter];
    const q = search.toLowerCase().trim();
    return templates.filter((t) => {
      if (typeFilter && t.contentType !== typeFilter) return false;
      if (
        q &&
        !t.name.toLowerCase().includes(q) &&
        !t.description.toLowerCase().includes(q) &&
        !t.topic.toLowerCase().includes(q) &&
        !t.keywords.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [filter, search]);

  // Reset selection when filter/search changes (render-time derivation)
  const [prevFilter, setPrevFilter] = useState(filter);
  const [prevSearch, setPrevSearch] = useState(search);
  if (filter !== prevFilter || search !== prevSearch) {
    setPrevFilter(filter);
    setPrevSearch(search);
    setSelectedIdx(-1);
  }

  const filterCounts = useMemo(() => FILTER_COUNTS(templates), []);

  // Get hovered template for preview
  const hoveredTemplate = useMemo(
    () => templates.find((t) => t.id === hoveredId) ?? null,
    [hoveredId],
  );

  const handleSelect = useCallback(
    (template: Template) => {
      onSelect(template);
      onClose();
    },
    [onSelect, onClose],
  );

  const clearSearch = useCallback(() => {
    setSearch("");
    searchRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Templates"
        className="
          relative w-full max-w-4xl max-h-[85vh]
          rounded-xl border overflow-hidden
          flex flex-col
          border-gray-200 bg-white shadow-2xl
          dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40
        "
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {/* ═══════════════════════════════════════════════════════════════
            Header
            ═══════════════════════════════════════════════════════════ */}
        <div className="px-5 pt-5 pb-0 space-y-3 shrink-0">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div
                className="
                  w-8 h-8 rounded-lg flex items-center justify-center
                  bg-blue-100 dark:bg-blue-500/10
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-blue-600 dark:text-blue-400"
                >
                  <path
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <div>
                <h2
                  className="
                    text-sm font-semibold
                    text-gray-900 dark:text-zinc-100
                  "
                >
                  Templates
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-zinc-500 mt-0.5">
                  Pre-fill the form with a ready-made prompt
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close templates"
              className="
                flex items-center justify-center w-7 h-7 rounded-md
                text-gray-400 hover:text-gray-700 hover:bg-gray-100
                dark:text-zinc-500 dark:hover:text-zinc-200 dark:hover:bg-zinc-800
                transition-colors duration-150
                outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
              "
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M2 2L12 12M12 2L2 12"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                pointer-events-none
                text-gray-400 dark:text-zinc-500
              "
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4" />
              <path
                d="M9.5 9.5L12.5 12.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>

            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates by name, topic, or keyword…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="
                w-full rounded-md border
                pl-9 pr-20 py-2 text-sm
                outline-none
                transition-colors duration-150
                bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400
                focus-visible:border-blue-500 focus-visible:bg-white
                dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500
                dark:focus-visible:border-blue-500 dark:focus-visible:bg-zinc-800
              "
            />

            {/* Right side: count + clear */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {search && (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="
                    p-0.5 rounded
                    text-gray-400 hover:text-gray-600
                    dark:text-zinc-500 dark:hover:text-zinc-300
                    transition-colors
                  "
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 2L10 10M10 2L2 10"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
              <span
                className="
                  text-[10px] tabular-nums px-1.5 py-0.5 rounded
                  bg-gray-100 text-gray-400 border border-gray-200
                  dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700
                "
              >
                {filtered.length}
              </span>
            </div>
          </div>

          {/* Filter tabs — underline style with counts */}
          <div
            className="
              flex gap-0 -mx-5 px-5
              border-b border-gray-200 dark:border-zinc-800
            "
          >
            {FILTERS.map((f) => {
              const isActive = filter === f;
              const count = filterCounts[f];
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={[
                    "relative shrink-0 px-3 py-2.5",
                    "text-[11px] font-medium",
                    "border-b-2 -mb-px",
                    "transition-colors duration-150 outline-none",
                    "focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-inset",
                    isActive
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-1.5">
                    {f}
                    <span
                      className={[
                        "text-[9px] tabular-nums px-1 py-px rounded-full min-w-[16px] text-center",
                        isActive
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                          : "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500",
                      ].join(" ")}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            Content — grid + preview sidebar
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Template grid */}
          <div
            ref={gridRef}
            className="flex-1 overflow-y-auto p-4"
          >
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {filtered.map((t, idx) => {
                  const config = TYPE_CONFIG[t.contentType] ?? {
                    label: t.contentType,
                    dot: "bg-gray-400",
                    accent: "text-gray-600 dark:text-zinc-400",
                    accentBg: "bg-gray-100 dark:bg-zinc-800",
                  };
                  const isHovered = hoveredId === t.id;
                  const isSelected = selectedIdx === idx;

                  return (
                    <button
                      key={t.id}
                      onClick={() => handleSelect(t)}
                      onMouseEnter={() => {
                        setHoveredId(t.id);
                        setSelectedIdx(idx);
                      }}
                      onMouseLeave={() => setHoveredId(null)}
                      onFocus={() => {
                        setHoveredId(t.id);
                        setSelectedIdx(idx);
                      }}
                      className={[
                        "group text-left rounded-lg border p-3.5 flex flex-col",
                        "transition-all duration-150",
                        "outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                        isHovered || isSelected
                          ? "border-gray-300 bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800/70 shadow-sm"
                          : "border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-800/30",
                      ].join(" ")}
                    >
                      {/* Type badge */}
                      <span className="flex items-center gap-1.5 mb-2.5">
                        <span
                          aria-hidden="true"
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`}
                        />
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider ${config.accent}`}
                        >
                          {config.label}
                        </span>
                      </span>

                      {/* Name */}
                      <p
                        className="
                          text-xs font-semibold mb-1 leading-snug
                          text-gray-800 group-hover:text-gray-900
                          dark:text-zinc-200 dark:group-hover:text-white
                          transition-colors
                        "
                      >
                        {t.name}
                      </p>

                      {/* Description */}
                      <p
                        className="
                          text-[11px] leading-relaxed flex-1 mb-3
                          text-gray-500 dark:text-zinc-500
                        "
                      >
                        {t.description}
                      </p>

                      {/* Topic preview — truncated */}
                      <p
                        className="
                          text-[10px] leading-relaxed mb-3 truncate
                          text-gray-400 dark:text-zinc-600
                          italic
                        "
                        title={t.topic}
                      >
                        &ldquo;{t.topic}&rdquo;
                      </p>

                      {/* Use button */}
                      <span
                        className={[
                          "w-full py-1.5 rounded-md text-center text-[11px] font-medium",
                          "transition-colors duration-150",
                          isHovered || isSelected
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-500 dark:bg-zinc-700/50 dark:text-zinc-400",
                        ].join(" ")}
                      >
                        Use template
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <EmptySearch query={search} onClear={clearSearch} />
            )}
          </div>

          {/* Preview sidebar — visible on lg+ when hovering a card */}
          <AnimatePresence mode="wait">
            {hoveredTemplate && (
              <motion.div
                key={hoveredTemplate.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.12 }}
                className="
                  hidden lg:flex flex-col
                  w-72 shrink-0
                  border-l overflow-y-auto
                  border-gray-200 bg-gray-50
                  dark:border-zinc-800 dark:bg-zinc-800/30
                  p-4
                "
              >
                <TemplatePreview template={hoveredTemplate} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            Footer
            ═══════════════════════════════════════════════════════════ */}
        <div
          className="
            px-5 py-2.5 shrink-0
            border-t flex items-center justify-between
            border-gray-200 dark:border-zinc-800
          "
        >
          <span className="text-[10px] tabular-nums text-gray-400 dark:text-zinc-600">
            {filtered.length} template{filtered.length !== 1 ? "s" : ""}
            {search && " matching"}
          </span>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-zinc-600">
              <kbd
                className="
                  font-mono px-1 py-0.5 rounded
                  bg-gray-100 border border-gray-200 text-gray-400
                  dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500
                "
              >
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-zinc-600">
              <kbd
                className="
                  font-mono px-1 py-0.5 rounded
                  bg-gray-100 border border-gray-200 text-gray-400
                  dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-500
                "
              >
                esc
              </kbd>
              close
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Template preview sidebar ─────────────────────────────────────────────────

function TemplatePreview({ template }: { template: Template }) {
  const config = TYPE_CONFIG[template.contentType] ?? {
    label: template.contentType,
    dot: "bg-gray-400",
    accent: "text-gray-600 dark:text-zinc-400",
    accentBg: "bg-gray-100 dark:bg-zinc-800",
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <span
          className={`
            inline-flex items-center gap-1.5 px-2 py-1 rounded-md mb-2
            text-[10px] font-semibold uppercase tracking-wider
            ${config.accent} ${config.accentBg}
          `}
        >
          <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>

        <h3
          className="
            text-sm font-semibold mt-2
            text-gray-900 dark:text-zinc-100
          "
        >
          {template.name}
        </h3>
        <p className="text-[11px] text-gray-500 dark:text-zinc-500 mt-1 leading-relaxed">
          {template.description}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-2.5">
        <PreviewField label="Topic" value={template.topic} />
        <PreviewField label="Tone" value={template.tone} />
        <PreviewField label="Length" value={template.length} />
        <PreviewField label="Audience" value={template.targetAudience} />
        <PreviewField label="Keywords" value={template.keywords} />
      </div>

      {/* Visual divider */}
      <div className="border-t border-gray-200 dark:border-zinc-700/50" />

      {/* Quick info */}
      <p className="text-[10px] text-gray-400 dark:text-zinc-600 leading-relaxed">
        Clicking &ldquo;Use template&rdquo; will pre-fill all form fields with this configuration.
      </p>
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span
        className="
          block text-[10px] font-semibold uppercase tracking-wider mb-0.5
          text-gray-400 dark:text-zinc-500
        "
      >
        {label}
      </span>
      <span
        className="
          block text-xs leading-relaxed
          text-gray-700 dark:text-zinc-300
        "
      >
        {value}
      </span>
    </div>
  );
}

// ─── Empty search state ───────────────────────────────────────────────────────

function EmptySearch({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Icon */}
      <div
        className="
          w-12 h-12 rounded-xl flex items-center justify-center mb-4
          bg-gray-100 dark:bg-zinc-800/60
        "
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-400 dark:text-zinc-600"
        >
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      <p className="text-sm font-medium text-gray-600 dark:text-zinc-400 mb-1">
        No templates found
      </p>
      <p className="text-xs text-gray-400 dark:text-zinc-600 mb-4 text-center max-w-[240px]">
        Nothing matches &ldquo;{query}&rdquo;. Try a different search term or clear the filter.
      </p>

      <button
        onClick={onClear}
        className="
          px-3 py-1.5 rounded-md text-xs font-medium
          text-blue-600 hover:text-blue-700
          bg-blue-50 hover:bg-blue-100
          dark:text-blue-400 dark:hover:text-blue-300
          dark:bg-blue-500/10 dark:hover:bg-blue-500/15
          transition-colors duration-150
          outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
        "
      >
        Clear search
      </button>
    </div>
  );
}