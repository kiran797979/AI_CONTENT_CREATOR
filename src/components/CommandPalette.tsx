import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CommandAction } from "../hooks/useCommandPalette";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  filtered: CommandAction[];
  selectedIndex: number;
  onSelectedIndexChange: (i: number) => void;
  onExecute: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function groupByCategory(actions: CommandAction[]): [string, CommandAction[]][] {
  const map = new Map<string, CommandAction[]>();
  for (const action of actions) {
    const group = map.get(action.category);
    if (group) {
      group.push(action);
    } else {
      map.set(action.category, [action]);
    }
  }
  return Array.from(map.entries());
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CommandPalette({
  isOpen,
  onClose,
  query,
  onQueryChange,
  filtered,
  selectedIndex,
  onSelectedIndexChange,
  onExecute,
}: CommandPaletteProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <CommandPaletteInner
          onClose={onClose}
          query={query}
          onQueryChange={onQueryChange}
          filtered={filtered}
          selectedIndex={selectedIndex}
          onSelectedIndexChange={onSelectedIndexChange}
          onExecute={onExecute}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Inner ────────────────────────────────────────────────────────────────────

function CommandPaletteInner({
  onClose,
  query,
  onQueryChange,
  filtered,
  selectedIndex,
  onSelectedIndexChange,
  onExecute,
}: Omit<CommandPaletteProps, "isOpen">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto-focus input
  useEffect(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, []);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selected = list.querySelector<HTMLElement>("[data-selected='true']");
    selected?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  // Keyboard handler
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        onSelectedIndexChange(
          filtered.length > 0 ? (selectedIndex + 1) % filtered.length : 0,
        );
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        onSelectedIndexChange(
          filtered.length > 0
            ? (selectedIndex - 1 + filtered.length) % filtered.length
            : 0,
        );
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        onExecute();
        onClose();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, filtered.length, selectedIndex, onSelectedIndexChange, onExecute]);

  const grouped = groupByCategory(filtered);
  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/55"
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
        aria-label="Command palette"
        className="
          relative w-full max-w-lg
          rounded-xl border border-zinc-800 bg-zinc-900
          shadow-2xl shadow-black/30
          overflow-hidden flex flex-col
        "
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {/* ── Search bar ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <svg
            className="shrink-0 text-zinc-500"
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
          >
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M10.5 10.5L13.5 13.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Type a command…"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="
              flex-1 bg-transparent text-sm
              outline-none caret-blue-500
              placeholder-zinc-500 text-zinc-100
            "
          />

          <kbd className="
            hidden sm:inline-flex items-center
            px-1.5 py-0.5 rounded
            text-[10px] font-mono font-medium
            bg-zinc-800 text-zinc-500 border border-zinc-700
          ">
            esc
          </kbd>
        </div>

        {/* ── Results list ────────────────────────────────────────────────── */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <svg
                className="text-zinc-700 mb-2"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M10 10L21 21M2 12a10 10 0 1020 0 10 10 0 00-20 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs text-zinc-500">
                No commands match &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            grouped.map(([category, items]) => (
              <div key={category}>
                {/* Category header */}
                <p className="
                  px-4 pt-3 pb-1.5
                  text-[10px] font-semibold uppercase tracking-wider
                  text-zinc-500
                ">
                  {category}
                </p>

                {items.map((action) => {
                  const idx = flatIndex++;
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={action.id}
                      data-selected={isSelected}
                      onClick={() => {
                        action.execute();
                        onClose();
                      }}
                      onMouseEnter={() => onSelectedIndexChange(idx)}
                      className={[
                        "w-full flex items-center gap-3",
                        "px-4 py-2.5 text-left",
                        "outline-none transition-colors duration-100",
                        isSelected
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-400 hover:bg-zinc-800/50",
                      ].join(" ")}
                    >
                      {/* Icon container */}
                      <div
                        className={[
                          "w-7 h-7 rounded-md flex items-center justify-center shrink-0",
                          "transition-colors duration-100",
                          isSelected ? "bg-blue-500/15 text-blue-400" : "bg-zinc-800 text-zinc-500",
                        ].join(" ")}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d={action.icon}
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Label */}
                      <span className="flex-1 text-xs font-medium truncate">
                        {action.name}
                      </span>

                      {/* Shortcut badge */}
                      {action.shortcut && (
                        <kbd className="
                          hidden sm:inline-flex items-center shrink-0
                          px-1.5 py-0.5 rounded
                          text-[10px] font-mono font-medium
                          bg-zinc-800 text-zinc-500
                          border border-zinc-700
                        ">
                          {action.shortcut}
                        </kbd>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* ── Footer hints ────────────────────────────────────────────────── */}
        <div className="
          px-4 py-2 border-t border-zinc-800
          flex items-center gap-4
          text-[10px] text-zinc-600
        ">
          <span className="flex items-center gap-1">
            <kbd className="font-mono px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">↑↓</kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">↵</kbd>
            execute
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700">esc</kbd>
            close
          </span>
          {filtered.length > 0 && (
            <span className="ml-auto tabular-nums text-zinc-600">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}