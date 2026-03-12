/* ─────────────────────────────────────────────────────
   TextArea – auto-resize capable textarea primitive
   Zinc / blue theme · dark + light · no external deps
   ───────────────────────────────────────────────────── */

import { useRef, useEffect, useCallback } from "react";

interface TextAreaProps {
  readonly id?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly maxLength?: number;
  readonly error?: boolean;
  readonly disabled?: boolean;
  readonly autoResize?: boolean;
  readonly resizable?: boolean;
  readonly className?: string;
}

export default function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  error = false,
  disabled = false,
  autoResize = false,
  resizable = false,
  className = "",
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── Auto-resize logic ─────────────────────────────── */

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    el.style.height = `${String(el.scrollHeight)}px`;
  }, [autoResize]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  useEffect(() => {
    if (!autoResize) return;
    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => {
      window.removeEventListener("resize", adjustHeight);
    };
  }, [autoResize, adjustHeight]);

  /* ── Derived state ─────────────────────────────────── */

  const hasCounter = maxLength !== undefined;
  const charCount = value.length;
  const overLimit = hasCounter && charCount > maxLength;
  const nearLimit = hasCounter && !overLimit && charCount >= maxLength * 0.9;

  const resizeClass = autoResize
    ? "resize-none"
    : resizable
      ? "resize-y"
      : "resize-none";

  return (
    <div className={`relative w-full ${className}`}>
      {/* ── Textarea element ──────────────────────────── */}
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={autoResize ? 1 : rows}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className={[
          // Layout
          "w-full rounded-lg px-3 py-2",
          resizeClass,
          "text-[13px] leading-relaxed font-medium",

          // Light mode
          "bg-white text-gray-900 placeholder-gray-400",

          // Dark mode
          "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500",

          // Border
          "border outline-none",
          error
            ? "border-red-500/60 dark:border-red-500/40"
            : "border-gray-200 dark:border-zinc-700/80",

          // Focus
          error
            ? "focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:border-red-400"
            : "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500",

          // Hover (when enabled)
          "enabled:hover:border-gray-300 dark:enabled:hover:border-zinc-600",

          // Transition
          "transition-[border-color,box-shadow] duration-150",

          // Disabled
          "disabled:opacity-40 disabled:cursor-not-allowed",

          // Overflow
          autoResize ? "overflow-hidden" : "",

          // Bottom padding for inline counter
          hasCounter ? "pb-6" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {/* ── Inline character counter ──────────────────── */}
      {hasCounter && (
        <span
          aria-live="polite"
          className={[
            "absolute bottom-2 right-3",
            "text-[10px] font-medium tabular-nums select-none pointer-events-none",
            "transition-colors duration-150",
            overLimit
              ? "text-red-500 dark:text-red-400"
              : nearLimit
                ? "text-amber-500 dark:text-amber-400"
                : "text-gray-400 dark:text-zinc-600",
          ].join(" ")}
        >
          {charCount} / {maxLength}
        </span>
      )}
    </div>
  );
}