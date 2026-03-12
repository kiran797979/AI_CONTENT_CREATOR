/* ─────────────────────────────────────────────────────
   TextInput – single-line input primitive
   Zinc / blue theme · dark + light · no external deps
   ───────────────────────────────────────────────────── */

import { useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

interface TextInputProps {
  readonly id?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly error?: boolean;
  readonly disabled?: boolean;
  readonly maxLength?: number;
  readonly type?: "text" | "email" | "url" | "search" | "tel";
  readonly leadingIcon?: ReactNode;
  readonly trailingSlot?: ReactNode;
  readonly onSubmit?: () => void;
  readonly className?: string;
}

export default function TextInput({
  id,
  value,
  onChange,
  placeholder,
  error = false,
  disabled = false,
  maxLength,
  type = "text",
  leadingIcon,
  trailingSlot,
  onSubmit,
  className = "",
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── Derived state ─────────────────────────────────── */

  const hasCounter = maxLength !== undefined && !trailingSlot;
  const charCount = value.length;
  const overLimit = hasCounter && charCount > maxLength;
  const nearLimit = hasCounter && !overLimit && charCount >= maxLength * 0.9;

  /* ── Handlers ──────────────────────────────────────── */

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  }

  function handleWrapperClick() {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }

  return (
    <div
      role="presentation"
      onClick={handleWrapperClick}
      className={[
        // Layout
        "group relative flex items-center w-full rounded-lg",

        // Border
        "border outline-none",
        error
          ? "border-red-500/60 dark:border-red-500/40"
          : "border-gray-200 dark:border-zinc-700/80",

        // Focus-within
        error
          ? "focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-400"
          : "focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500",

        // Hover (when not disabled)
        !disabled && !error
          ? "hover:border-gray-300 dark:hover:border-zinc-600"
          : "",

        // Background
        "bg-white dark:bg-zinc-900",

        // Transition
        "transition-[border-color,box-shadow] duration-150",

        // Disabled
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-text",

        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Leading icon ──────────────────────────────── */}
      {leadingIcon && (
        <span
          aria-hidden="true"
          className={[
            "shrink-0 pl-3 pointer-events-none select-none",
            "text-gray-400 dark:text-zinc-500",
            "transition-colors duration-150",
            "group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400",
          ].join(" ")}
        >
          {leadingIcon}
        </span>
      )}

      {/* ── Input element ─────────────────────────────── */}
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={[
          "flex-1 min-w-0 bg-transparent",
          "text-[13px] leading-5 font-medium",
          "py-2",

          // Horizontal padding (adjusted for icon / trailing slot)
          leadingIcon ? "pl-2" : "px-3",
          trailingSlot ? "pr-1" : hasCounter ? "pr-1" : "pr-3",

          // Text colors
          "text-gray-900 placeholder-gray-400",
          "dark:text-zinc-100 dark:placeholder-zinc-500",

          // Reset
          "outline-none border-none",
          "disabled:cursor-not-allowed",
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {/* ── Trailing slot ─────────────────────────────── */}
      {trailingSlot && (
        <span className="shrink-0 pr-2 flex items-center">
          {trailingSlot}
        </span>
      )}

      {/* ── Inline character counter ──────────────────── */}
      {hasCounter && (
        <span
          aria-live="polite"
          className={[
            "shrink-0 pr-3",
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