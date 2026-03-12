/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      // ── Colors — design tokens for quick reference ──────────────────
      colors: {
        surface: {
          DEFAULT: "#0f172a",     // app background
          raised: "#18181b",      // zinc-900 — cards/panels
          overlay: "#27272a",     // zinc-800 — hover/elevated
        },
      },

      // ── Border radius — tighten default for SaaS feel ──────────────
      borderRadius: {
        DEFAULT: "0.375rem",     // 6px — matches rounded-md everywhere
      },

      // ── Box shadow — subtle depth for dark UI ──────────────────────
      boxShadow: {
        "card":    "0 1px 3px 0 rgba(0,0,0,0.3), 0 1px 2px -1px rgba(0,0,0,0.3)",
        "modal":   "0 16px 70px rgba(0,0,0,0.5)",
        "toast":   "0 8px 30px rgba(0,0,0,0.4)",
      },

      // ── Font size — add 11px utility used across components ────────
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],   // 11px
      },

      // ── Animations ─────────────────────────────────────────────────
      animation: {
        // General
        "fade-in":      "fade-in 0.2s ease-out",
        "fade-out":     "fade-out 0.15s ease-in forwards",

        // Slide variants
        "slide-in":     "slide-in-left 0.2s ease-out",
        "slide-up":     "slide-in-up 0.18s ease-out",
        "slide-down":   "slide-in-down 0.18s ease-out",

        // Feedback
        "shake":        "shake 0.4s ease-in-out",
        "blink":        "blink 1s step-end infinite",

        // Toast-specific
        "toast-in":     "toast-in 0.18s ease-out",
        "toast-shrink": "toast-shrink 4s linear forwards",

        // Skeleton pulse — slower than default for subtlety
        "skeleton":     "pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",

        // Spin — same as default but available for reference
        "spinner":      "spin 0.8s linear infinite",

        // Scale pop — for buttons/badges on state change
        "pop":          "pop 0.15s ease-out",
      },

      keyframes: {
        // ── Fade ──────────────────────────────────────────────────────
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%":   { opacity: "1" },
          "100%": { opacity: "0" },
        },

        // ── Slide ─────────────────────────────────────────────────────
        "slide-in-left": {
          "0%":   { opacity: "0", transform: "translateX(-100%)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-up": {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-down": {
          "0%":   { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },

        // ── Feedback ──────────────────────────────────────────────────
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%":      { transform: "translateX(-6px)" },
          "40%":      { transform: "translateX(6px)" },
          "60%":      { transform: "translateX(-4px)" },
          "80%":      { transform: "translateX(4px)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },

        // ── Toast ─────────────────────────────────────────────────────
        "toast-in": {
          "0%":   { opacity: "0", transform: "translateX(40px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateX(0) scale(1)" },
        },
        "toast-shrink": {
          "0%":   { width: "100%" },
          "100%": { width: "0%" },
        },

        // ── Pop ───────────────────────────────────────────────────────
        pop: {
          "0%":   { transform: "scale(0.95)" },
          "60%":  { transform: "scale(1.02)" },
          "100%": { transform: "scale(1)" },
        },
      },

      // ── Transition duration — shorter defaults for snappy feel ─────
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [],
};