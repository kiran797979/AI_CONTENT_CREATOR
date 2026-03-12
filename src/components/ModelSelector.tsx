import { modelOptions } from "../types/form";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ModelMeta {
  id: string;
  name: string;
  speed: string;
  description: string;
  icon: string;       // SVG path
  dot: string;        // colored dot class
  speedColor: string; // speed badge accent
}

const MODEL_META: Record<string, Omit<ModelMeta, "id" | "name" | "dot">> = {
  "deepseek/deepseek-r1": {
    speed: "Fast",
    description: "Quick drafts and iterations — ideal for brainstorming",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    speedColor: "text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10",
  },
  "google/gemini-2.5-flash": {
    speed: "Balanced",
    description: "Best all-around performance for most content types",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
    speedColor: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10",
  },
  "openai/gpt-4o-mini": {
    speed: "Premium",
    description: "Highest quality output — best for final, polished content",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    speedColor: "text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10",
  },
};

const MODELS: ModelMeta[] = modelOptions.map((o) => {
  const meta = MODEL_META[o.value];
  return {
    id: o.value,
    name: o.label,
    dot: o.dot.replace("bg-", "bg-").replace("-400", "-500"), // -500 for selector dots
    ...meta,
  };
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="space-y-1.5">
      {/* Label */}
      <p
        className="
          text-[10px] font-semibold uppercase tracking-wider
          text-gray-400 dark:text-zinc-500
          px-1
        "
      >
        Select model
      </p>

      {/* Model list */}
      <div className="space-y-1">
        {MODELS.map((m) => {
          const isSelected = selectedModel === m.id;

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onModelChange(m.id)}
              className={[
                "w-full flex items-center gap-3",
                "px-3 py-2.5 rounded-md text-left",
                "border transition-all duration-150",
                "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                isSelected
                  ? [
                      "border-blue-200 bg-blue-50",
                      "dark:border-blue-500/30 dark:bg-blue-500/5",
                    ].join(" ")
                  : [
                      "border-transparent",
                      "hover:bg-gray-50 hover:border-gray-200",
                      "dark:hover:bg-zinc-800 dark:hover:border-zinc-700",
                    ].join(" "),
              ].join(" ")}
            >
              {/* Icon container */}
              <div
                className={[
                  "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                  "transition-colors duration-150",
                  isSelected
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                    : "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500",
                ].join(" ")}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={m.icon} />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={[
                      "text-xs font-semibold truncate",
                      "transition-colors",
                      isSelected
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-800 dark:text-zinc-200",
                    ].join(" ")}
                  >
                    {m.name}
                  </p>

                  {/* Colored dot */}
                  <span
                    aria-hidden="true"
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${m.dot}`}
                  />
                </div>

                <p
                  className="
                    text-[11px] truncate mt-0.5
                    text-gray-500 dark:text-zinc-500
                  "
                >
                  {m.description}
                </p>
              </div>

              {/* Speed badge */}
              <span
                className={[
                  "shrink-0 text-[10px] font-semibold",
                  "px-2 py-0.5 rounded-full",
                  "transition-colors duration-150",
                  isSelected
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"
                    : m.speedColor,
                ].join(" ")}
              >
                {m.speed}
              </span>

              {/* Checkmark */}
              <div
                className={[
                  "shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                  "transition-all duration-150",
                  isSelected
                    ? "bg-blue-600 dark:bg-blue-500"
                    : "border border-gray-300 dark:border-zinc-600",
                ].join(" ")}
              >
                {isSelected && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2.5 5L4.5 7L7.5 3"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info hint */}
      <p
        className="
          text-[10px] leading-relaxed px-1 pt-1
          text-gray-400 dark:text-zinc-600
        "
      >
        Model affects generation quality and speed. You can switch anytime.
      </p>
    </div>
  );
}