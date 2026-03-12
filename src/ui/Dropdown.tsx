/* ─────────────────────────────────────────────────────
   Dropdown – minimal select primitive
   Zinc / blue theme · dark + light · no external deps
   ───────────────────────────────────────────────────── */

interface DropdownOption {
  readonly label: string;
  readonly value: string;
}

interface DropdownProps {
  readonly id?: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly DropdownOption[];
  readonly placeholder?: string;
  readonly disabled?: boolean;
  readonly error?: boolean;
  readonly className?: string;
}

export default function Dropdown({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error = false,
  className = "",
}: DropdownProps) {
  const isEmpty = value === "";

  return (
    <div className={`relative w-full ${className}`}>
      {/* ── Select ──────────────────────────────────── */}
      <select
        id={id}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        className={[
          // Layout
          "w-full appearance-none rounded-lg pl-3 pr-9 py-2",
          "text-[13px] leading-5 font-medium",

          // Light mode
          "bg-white",
          isEmpty ? "text-gray-400" : "text-gray-900",

          // Dark mode
          "dark:bg-zinc-900",
          isEmpty ? "dark:text-zinc-500" : "dark:text-zinc-100",

          // Border
          "border outline-none",
          error
            ? "border-red-500/60 dark:border-red-500/40"
            : "border-gray-200 dark:border-zinc-700/80",

          // Focus
          error
            ? "focus-visible:ring-2 focus-visible:ring-red-500/20 focus-visible:border-red-400"
            : "focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500",

          // Hover (when not disabled)
          "enabled:hover:border-gray-300 dark:enabled:hover:border-zinc-600",

          // Transition
          "transition-[border-color,box-shadow] duration-150",

          // Disabled
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "cursor-pointer",
        ].join(" ")}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}

        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-white text-gray-900 dark:bg-zinc-900 dark:text-zinc-100"
          >
            {opt.label}
          </option>
        ))}
      </select>

      {/* ── Chevron icon ────────────────────────────── */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2",
          "transition-colors duration-150",
          disabled
            ? "text-gray-300 dark:text-zinc-600"
            : "text-gray-400 dark:text-zinc-500",
        ].join(" ")}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}