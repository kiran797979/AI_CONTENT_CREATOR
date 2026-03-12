/* ─────────────────────────────────────────────────────
   FormField – label + hint + error + char counter
   Zinc / blue theme · dark + light · no external deps
   ───────────────────────────────────────────────────── */

import { useId } from "react";
import type { ReactNode } from "react";

interface FormFieldProps {
  readonly label: string;
  readonly hint?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly charCount?: number;
  readonly maxChars?: number;
  readonly children: (props: { id: string }) => ReactNode;
}

export default function FormField({
  label,
  hint,
  error,
  required = false,
  charCount,
  maxChars,
  children,
}: FormFieldProps) {
  const id = useId();

  const showCounter = charCount !== undefined;
  const overLimit =
    maxChars !== undefined &&
    charCount !== undefined &&
    charCount > maxChars;
  const nearLimit =
    maxChars !== undefined &&
    charCount !== undefined &&
    !overLimit &&
    charCount >= maxChars * 0.9;

  return (
    <div className="flex flex-col gap-1">
      {/* ── Label row ────────────────────────────────── */}
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={id}
          className={[
            "block text-[11px] font-semibold uppercase tracking-widest select-none",
            "text-gray-500 dark:text-zinc-400",
            "transition-colors duration-150",
          ].join(" ")}
        >
          {label}
          {required && (
            <span
              aria-hidden="true"
              className="ml-0.5 text-blue-500 dark:text-blue-400"
            >
              *
            </span>
          )}
        </label>

        {showCounter && (
          <span
            aria-live="polite"
            className={[
              "shrink-0 text-[10px] font-medium tabular-nums",
              "transition-colors duration-150",
              overLimit
                ? "text-red-500 dark:text-red-400"
                : nearLimit
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-gray-400 dark:text-zinc-600",
            ].join(" ")}
          >
            {maxChars !== undefined
              ? `${charCount} / ${maxChars}`
              : charCount}
          </span>
        )}
      </div>

      {/* ── Input slot ───────────────────────────────── */}
      {children({ id })}

      {/* ── Hint (only when no error) ────────────────── */}
      {hint && !error && (
        <p
          className={[
            "text-[11px] leading-relaxed",
            "text-gray-400 dark:text-zinc-500",
          ].join(" ")}
        >
          {hint}
        </p>
      )}

      {/* ── Error ────────────────────────────────────── */}
      {error && (
        <p
          role="alert"
          aria-live="assertive"
          className={[
            "flex items-center gap-1.5",
            "text-[11px] leading-relaxed font-medium",
            "text-red-500 dark:text-red-400",
          ].join(" ")}
        >
          <span
            aria-hidden="true"
            className={[
              "inline-block w-1 h-1 shrink-0 rounded-full",
              "bg-red-500 dark:bg-red-400",
            ].join(" ")}
          />
          {error}
        </p>
      )}
    </div>
  );
}