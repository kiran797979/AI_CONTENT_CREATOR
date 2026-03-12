# AI Content Studio

A minimal, production-grade AI content generation tool built with React 19, TypeScript 5.9, Tailwind CSS, Framer Motion, and GSAP. Generate LinkedIn posts, tweets, emails, blog posts, ad copy, and landing page content with customizable tone, length, audience targeting, and a fully editable dynamic prompt.

**Design inspired by:** ChatGPT × Linear × Vercel × Perplexity

> **Author:** B M Kiran — Internship Submission

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Design Philosophy](#design-philosophy)
- [Features](#features)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Usage Guide](#usage-guide)
- [Login Page](#login-page)
- [Dynamic Prompt System](#dynamic-prompt-system)
- [Component Reference](#component-reference)
- [UI Primitives](#ui-primitives)
- [Custom Hooks](#custom-hooks)
- [API Service Layer](#api-service-layer)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Design System](#design-system)
- [Light & Dark Mode](#light--dark-mode)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Browser Support](#browser-support)
- [Error Checking](#error-checking)
- [License](#license)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type safety — `strict`, `verbatimModuleSyntax`, `erasableSyntaxOnly` |
| Vite | 7.3 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling with custom design tokens |
| Framer Motion | 12.x | Minimal transitions — opacity fades only, 0.15–0.2s, no springs |
| GSAP | 3.14 | Login page lamp animation — Draggable cord, SVG morphing, timeline |
| React Router | 7.13 | Client-side routing with authentication guard |
| PostCSS | 8.5 | CSS processing pipeline |
| ESLint | 9.39 | Strict linting — `noUnusedLocals`, `noUnusedParameters` |

---

## Design Philosophy

The main app interface follows a flat, content-first layout with minimal decorative animation. The login page is the exception — it uses GSAP for an interactive lamp experience:

| Principle | Implementation |
|---|---|
| **Dark-first, light-ready** | Every component has full `dark:` + light Tailwind classes |
| **No gradients in main UI** | Solid backgrounds in the 3-column workspace |
| **Quick fades only (main UI)** | 0.15s opacity transitions; zero spring physics inside the app |
| **GSAP on login only** | Draggable lamp cord, animated face, glow effects on the login page |
| **Flat 3-column layout** | `Sidebar (240px)` · `Form (440px)` · `Output (flex)` |
| **Compact header** | Brand text, ⌘K search, theme toggle, 🎮 easter egg |
| **Minimal chrome** | No footer, no onboarding tour in main app view |
| **Consistent radii** | `rounded-lg` for inputs, buttons, cards, and panels |
| **Consistent borders** | `border-gray-200` (light) / `dark:border-zinc-800` (dark) |

---

## Features

### Authentication & Login
- **Cute Lamp Login** — interactive animated login page with a draggable lamp cord (GSAP Draggable)
- Pull the lamp cord to toggle the light — randomized glow hue on each toggle
- Animated cute lamp face (eyes flip open/closed, tongue shows on smile)
- **Sign In / Sign Up** card switching with smooth slide transitions
- Password visibility toggle, password strength meter (4-bar indicator), and form validation
- Social login buttons (GitHub, Google) with hover glow effects
- Authentication stored in `localStorage` (`acs-authenticated`)
- Protected routes — unauthenticated users are redirected to `/login`

### Content Generation
- **6 content types:** LinkedIn Post, Twitter, Email, Ad Copy, Blog, Landing Page
- **3 AI models:** DeepSeek R1 (fast), Gemini 2.5 Flash (balanced), GPT-4o Mini (premium)
- **Tone control:** Professional, Friendly, Persuasive, Informative, Witty
- **Length control:** Short, Medium, Long
- **Target audience** and **keyword** inputs with validation
- **Topic field** with live character counter (300 char limit) and auto-resize option
- **Final Dynamic Prompt** — auto-generated from form fields, fully editable before submission
- Mock generator fallback when API is unavailable

### Output & Analysis
- **3-tab output view:** Preview (typewriter), Raw (monospace), Markdown (rendered)
- **Icon action bar:** Copy (with 1.5s visual feedback), Regenerate, Download `.txt` / `.md`, Analyze, Compare A/B
- **Inline content analysis** toggle (lazy-loaded) — readability gauge (SVG circle), animated tone bars, metrics grid
- **A/B comparison** with word-level LCS diff highlighting, summary bar (word/readability delta), version pick buttons, and diff legend
- **Stats pills:** word count, character count, estimated read time

### Templates & Command Palette
- **9 content templates** (3 LinkedIn + 3 Email + 3 Ad Copy) with search and underline-style category tabs
- **⌘K command palette** with fuzzy search across 13+ grouped actions (Content, Export, Navigation, Settings, Quick Set)
- Keyboard navigation throughout (↑↓ Enter Escape)

### History & Persistence
- Sidebar with generation history and relative timestamps (`now`, `5m`, `2h`, `3d`)
- localStorage history (capped at 50 entries)
- Debounced sessionStorage draft auto-save with `loadDraft()` / `clearDraft()`

### UI Primitives
- **FormField** — render-prop pattern with `useId`, required indicator, hint text, live character counter
- **TextInput** — leading icon slot, trailing slot (clear button etc.), inline char counter, Enter-to-submit
- **TextArea** — auto-resize mode, manual resize toggle, inline char counter with 3-state color
- **Dropdown** — `appearance-none` with custom SVG chevron, `pr-9` reserved space

### Easter Egg
- 🎮 SurfGame — full canvas-based surfer game (720×360) with physics, obstacles, powerups, and HiDPI support

---

## Architecture

```
┌────────────────────────────────────────────────────────────  ┐
│                      main.tsx (Router)                       │
│   BrowserRouter → /login → LoginPage (GSAP lamp)            │
│                 → /*     → ProtectedRoute → App             │
├────────────────────────────────────────────────────────────  ┤
│                         App.tsx                              │
│     (All state · orchestration · theme · lazy loading)       │
├──────────┬────────────────────┬──────────────────────────────┤
│          │                    │                              │
│ Sidebar  │   ContentForm      │     OutputPreview            │
│ (history)│   ├ ModelSelector  │     ├ OutputTabs             │
│          │   ├ Templates btn  │     ├ ContentAnalysis (lazy) │
│          │   └ Dynamic Prompt │     └ ABComparison           │
├──────────┴────────────────────┴──────────────────────────────┤
│       TemplatesModal (lazy)  │  CommandPalette (lazy)        │
│       SurfGame (lazy)        │  ToastContainer               │
├──────────────────────────────────────────────────────────────┤
│                      UI Primitives                           │
│          FormField │ Dropdown │ TextInput │ TextArea         │
├──────────────────────────────────────────────────────────────┤
│                       Components                             │
│                 LoginPage │ Tooltip                          │
├──────────────────────────────────────────────────────────────┤
│                         Hooks                                │
│  useFormValidation │ useContentHistory │ useToast            │
│  useAutoSave │ useTypewriter │ useCommandPalette             │
├──────────────────────────────────────────────────────────────┤
│                      Utilities                               │
│  buildPrompt │ mockGenerator │ downloadFile                  │
│  markdownRenderer │ textAnalysis │ textDiff                  │
├──────────────────────────────────────────────────────────────┤
│                 Config / Services / Types                    │
│  animations.ts │ env.ts │ api.ts │ types.ts │ form.ts        │
├──────────────────────────────────────────────────────────────┤
│                      Data                                    │
│                    templates.ts                              │
└───────────────────────────────────────────────────────────── ┘
```

**Key architectural rules:**
- Client-side routing via `react-router-dom` with `ProtectedRoute` auth guard
- All application state lives in `App.tsx` — props flow down, callbacks flow up
- No external UI component libraries — every primitive is hand-built
- No enums or namespaces — `erasableSyntaxOnly` enforced
- `import type` required for type-only imports — `verbatimModuleSyntax` enforced
- Framer Motion used **only** where animation adds UX value (modals, toasts, tabs)
- GSAP used exclusively in `LoginPage` for the interactive lamp animation

---

## Folder Structure

```
ai-content-studio/
├── public/                          # Static assets
├── src/
│   ├── components/                  # Feature components
│   │   ├── ABComparison.tsx              # A/B comparison with diff + summary bar
│   │   ├── CommandPalette.tsx            # ⌘K command palette with grouped actions
│   │   ├── ContentAnalysis.tsx           # Readability gauge + tone bars + metrics (lazy)
│   │   ├── ContentForm.tsx               # Form with model picker + templates btn + dynamic prompt
│   │   ├── LoginPage.tsx                 # Cute Lamp Login — GSAP animated lamp + sign in/up
│   │   ├── LoginPage.css                 # Login page styles (glassmorphism cards, lamp, responsive)
│   │   ├── ModelSelector.tsx             # Compact model selector list
│   │   ├── OutputPreview.tsx             # Output display + action bar
│   │   ├── OutputTabs.tsx                # Preview / Raw / Markdown tabs
│   │   ├── Sidebar.tsx                   # History sidebar + mobile drawer
│   │   ├── SurfGame.tsx                  # 🎮 Canvas-based easter egg (lazy)
│   │   ├── TemplatesModal.tsx            # Template browser with search + filters
│   │   ├── ToastContainer.tsx            # Toast notification stack
│   │   └── Tooltip.tsx                   # 4-direction tooltip with arrow + delay
│   │
│   ├── ui/                          # Reusable UI primitives
│   │   ├── Dropdown.tsx                  # Custom select with SVG chevron
│   │   ├── FormField.tsx                 # Render-prop label + hint + error + counter
│   │   ├── TextArea.tsx                  # Auto-resize, char counter, resize toggle
│   │   └── TextInput.tsx                 # Leading icon, trailing slot, char counter
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAutoSave.ts               # Debounced sessionStorage draft
│   │   ├── useCommandPalette.ts          # Palette keyboard + fuzzy search state
│   │   ├── useContentHistory.ts          # History + localStorage (cap: 50)
│   │   ├── useFormValidation.ts          # Data-driven validation + shake trigger
│   │   ├── useToast.ts                   # Toast state with auto-dismiss
│   │   └── useTypewriter.ts              # Word-by-word rAF typewriter
│   │
│   ├── services/                    # API layer
│   │   ├── api.ts                        # HTTP client: retry + abort + timeout + prompt
│   │   └── types.ts                      # Request/response type definitions (incl. prompt)
│   │
│   ├── types/                       # Shared type definitions
│   │   └── form.ts                       # FormData, ValidationRule, ValidationErrors
│   │
│   ├── utils/                       # Pure utility functions
│   │   ├── buildPrompt.ts               # Assembles dynamic prompt from form fields
│   │   ├── downloadFile.ts               # Blob-based .txt/.md download
│   │   ├── markdownRenderer.tsx          # Markdown → React renderer
│   │   ├── mockGenerator.ts              # Mock AI content generation
│   │   ├── textAnalysis.ts               # Flesch score, tone, text metrics
│   │   └── textDiff.ts                   # Word-level LCS diff algorithm
│   │
│   ├── config/                      # Configuration
│   │   ├── animations.ts                 # Framer variants (fast fades, no springs)
│   │   └── env.ts                        # Typed env variable access
│   │
│   ├── data/                        # Static data
│   │   └── templates.ts                  # 9 content templates
│   │
│   ├── App.tsx                      # Root: state + layout + lazy loading
│   ├── main.tsx                     # React entry + router + auth guard
│   └── index.css                    # Tailwind directives + scrollbar + selection
│
├── Cute_Lamp_Login/                 # Original standalone login page reference
│   └── index.html
│
├── index.html                       # HTML shell with SEO meta
├── tailwind.config.js               # Custom tokens, animations, shadows
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** 9+

### Installation

```bash
git clone <repository-url>
cd ai-content-studio
npm install
npm run dev
```

App available at **http://localhost:5173**

### Production Build

```bash
npm run build      # tsc -b && vite build
npm run preview    # Serve locally
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8501
VITE_USE_MOCK=true
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8501` | Backend API base URL |
| `VITE_USE_MOCK` | `false` | Set to `true` to use the built-in mock generator instead of real API |

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build (`vite build`) |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Serve production build locally |

---

## Usage Guide

| Step | Action |
|---|---|
| 1 | **Login** — pull the lamp cord to reveal the sign-in form, enter credentials |
| 2 | **Select content type** — LinkedIn, Twitter, Email, Ad Copy, Blog, or Landing Page |
| 3 | **Set tone and length** — dropdowns side-by-side for compact layout |
| 4 | **Enter target audience** — required field with validation |
| 5 | **Add keywords** — comma-separated, optional |
| 6 | **Write a topic** — min 3 chars, live character counter (300 max) |
| 7 | **Review/edit dynamic prompt** — expand "Final Dynamic Prompt" to view and customize the generated prompt |
| 8 | **Generate** — click button or press `⌘↵` / `Ctrl+Enter` |
| 9 | **Switch model** — click "Model: X · Change" below Generate button |
| 10 | **View output** — Preview (typewriter), Raw, or Markdown tabs |
| 11 | **Copy** — click copy icon (1.5s blue feedback confirmation) |
| 12 | **Download** — click download icon → saves `.txt` or `.md` |
| 13 | **Analyze** — toggle inline readability gauge, tone bars, metrics |
| 14 | **Compare A/B** — side-by-side diff with word-level highlighting |
| 15 | **Use templates** — click Templates button for pre-built configs |
| 16 | **Command palette** — press `⌘K` for quick actions |
| 17 | **History** — click any sidebar entry to reload a previous generation |

---

## Login Page

The login page features an interactive **Cute Lamp** animation built with GSAP:

| Feature | Detail |
|---|---|
| **Lamp cord interaction** | Drag the cord using GSAP Draggable to toggle the light on/off |
| **Randomized glow** | Each toggle picks a random hue for the lamp glow and card border |
| **Animated face** | Lamp eyes flip open/closed, tongue appears when light is on |
| **Sign In / Sign Up** | Two-card layout with smooth slide transitions between forms |
| **Password strength** | 4-bar strength indicator (Weak / Fair / Good / Strong) on sign-up |
| **Password toggle** | Eye icon to show/hide password fields |
| **Social buttons** | GitHub and Google login button placeholders |
| **Responsive** | Full mobile/tablet/landscape breakpoints with collapsible layout |
| **Auth persistence** | Sets `acs-authenticated` in `localStorage` on successful login |
| **Route protection** | `ProtectedRoute` wrapper in `main.tsx` redirects to `/login` if not authenticated |
| **Pull hint** | Pulsing "Pull the lamp cord" text disappears after first toggle |

---

## Dynamic Prompt System

The app includes a **Final Dynamic Prompt** that is auto-generated from the form fields and fully editable before submission:

### How it works

1. **Auto-generation** — `buildPrompt()` in `utils/buildPrompt.ts` assembles a structured prompt from:
   - Content type (e.g., "Write a LinkedIn post…")
   - Topic (quoted)
   - Tone directive
   - Target audience
   - Keywords (if provided)
   - Length guidance (word count range)
   - Output instruction ("Return only the final content")

2. **Live preview** — The "Final Dynamic Prompt" section in `ContentForm` updates in real time as form fields change

3. **Editable** — Users can expand the collapsible section and freely edit the prompt text in a textarea. Manual edits are preserved until a form field changes

4. **Sent to API** — The edited prompt is included in the API request payload as the `prompt` field, so the backend receives exactly what the user approved

### Example generated prompt

```
Write a LinkedIn post about the following topic:
"The future of AI in content creation"

Tone: professional.
The target audience is: Marketing professionals.
Incorporate these keywords naturally: AI, productivity, SaaS.
Aim for a moderate length — around 150–250 words.

Return only the final content — no meta-commentary, labels, or explanations.
```

---

## Component Reference

| Component | File | Description |
|---|---|---|
| `App` | `App.tsx` | Root orchestrator — all state, handlers, 3-column layout, lazy loading |
| `LoginPage` | `components/` | Cute Lamp Login — GSAP animated lamp, sign-in/sign-up cards, auth guard |
| `ContentForm` | `components/` | Generation form: 2-col dropdowns, char counter, model picker, templates btn, editable dynamic prompt |
| `OutputPreview` | `components/` | Output display: stats pills, icon action bar, lazy analysis toggle |
| `OutputTabs` | `components/` | Preview / Raw / Markdown tabs with typewriter + skip |
| `ModelSelector` | `components/` | Compact list-style model selector with icons and speed badges |
| `TemplatesModal` | `components/` | Modal: search input, underline category tabs, 3-col card grid with hover preview |
| `ContentAnalysis` | `components/` | SVG readability gauge + animated tone bars + 6-item metrics grid (lazy via `Suspense`) |
| `ABComparison` | `components/` | Side-by-side diff: summary bar, version cards with Pick buttons, diff legend |
| `CommandPalette` | `components/` | ⌘K modal: fuzzy search, grouped actions, keyboard nav |
| `Sidebar` | `components/` | History: relative timestamps, 6 content-type colored dots, mobile drawer |
| `SurfGame` | `components/` | 🎮 Canvas-based surfer game with physics, obstacles, powerups (lazy) |
| `ToastContainer` | `components/` | Fixed toast stack: colored dots, progress bar, hover-pause |
| `Tooltip` | `components/` | 4-direction tooltip with CSS arrow, configurable delay, `aria-describedby` |

---

## UI Primitives

| Primitive | Key Features |
|---|---|
| `FormField` | Render-prop `children({ id })`, `useId()`, required asterisk, hint/error toggle, live char counter with 3-color states |
| `TextInput` | Wrapper-based `focus-within`, leading icon slot, trailing slot (clear btn), inline char counter, Enter-to-submit callback |
| `TextArea` | Auto-resize via `scrollHeight`, `resizable` prop toggle, inline char counter (amber at 90%, red at 100%), `maxLength` soft limit |
| `Dropdown` | `appearance-none` + custom SVG chevron, `pr-9` reserved, placeholder option support, error/disabled states |

All primitives share:
- `onChange: (value: string) => void` signature (not native event)
- `error?: boolean` for red border states
- `disabled?: boolean` with `opacity-40 cursor-not-allowed`
- `border-gray-200` (light) / `dark:border-zinc-700` (dark) default borders
- `focus-visible:border-blue-500` focus pattern (border swap, not ring)

---

## Custom Hooks

| Hook | Description |
|---|---|
| `useFormValidation` | Data-driven validation rules → error state + `shakeButton` animation trigger |
| `useContentHistory` | localStorage array (capped at 50) with `addEntry` / `clearHistory` |
| `useToast` | Toast array state with `addToast(message, type)` + configurable auto-dismiss timer (default 3s) |
| `useAutoSave` | Debounced `sessionStorage` write on form change + `loadDraft()` / `clearDraft()` |
| `useTypewriter` | Word-by-word reveal via `requestAnimationFrame` with skip callback |
| `useCommandPalette` | ⌘K toggle, query state, fuzzy filter, selected index, keyboard nav |

---

## API Service Layer

```
POST {VITE_API_BASE_URL}/generate
Content-Type: application/json

{
  "contentType": "linkedin",
  "tone": "professional",
  "length": "medium",
  "targetAudience": "Marketing professionals",
  "keywords": "AI, productivity",
  "topic": "The future of AI in content creation",
  "model": "deepseek/deepseek-r1",
  "prompt": "Write a professional LinkedIn post about \"The future of AI in content creation\"...."
}
```

**Supported models:** `deepseek/deepseek-r1`, `google/gemini-2.5-flash`, `openai/gpt-4o-mini`

| Feature | Detail |
|---|---|
| **Retry** | Exponential backoff, up to 3 attempts |
| **Timeout** | 30s via `AbortSignal.any()` for manual cancellation |
| **Fallback** | Auto-switches to `mockGenerator` on API failure |
| **Feedback** | Toast notifications for errors and fallback messages |
| **Cancel** | Cancel button appears during loading, triggers `AbortController.abort()` |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` / `⌘+Enter` | Generate content |
| `Ctrl+K` / `⌘+K` | Open command palette |
| `Escape` | Close any modal / palette |
| `↑` / `↓` | Navigate command palette or template tabs |
| `Enter` | Execute selected command |
| `Tab` | Navigate through form fields |

---

## Design System

### Colors

| Token | Light | Dark |
|---|---|---|
| Background | `white` / `gray-50` | `#0f172a` (slate-900) |
| Panel / Card | `white` / `gray-50` | `zinc-900` |
| Border | `gray-200` | `zinc-800` |
| Input background | `white` | `zinc-800` |
| Input border | `gray-200` | `zinc-700` |
| Accent | `blue-600` | `blue-500` |
| Text primary | `gray-900` | `zinc-100` |
| Text secondary | `gray-600` | `zinc-400` |
| Text tertiary | `gray-400` | `zinc-600` |
| Labels | `gray-500` | `zinc-400` |
| Error | `red-500` | `red-400` |
| Success dot | `emerald-400` | `emerald-400` |

### Typography

| Element | Classes |
|---|---|
| Section labels | `text-xs font-semibold uppercase tracking-wider` |
| Body text | `text-sm` |
| Small text | `text-[11px]` or `text-2xs` |
| Tiny text | `text-[10px]` |
| Kbd badges | `text-[10px] font-mono` |
| Counter | `text-[10px] tabular-nums` |

### Spacing & Radii

| Element | Value |
|---|---|
| Card/panel radius | `rounded-lg` (8px) |
| Input/button radius | `rounded-lg` (8px) |
| Badge/pill radius | `rounded` (4px) or `rounded-full` |
| Form field gap | `gap-1.5` (6px) |
| Form sections | `space-y-3` (12px) |
| Panel padding | `p-4` (16px) |

### Shadows (dark-optimized)

| Token | Value |
|---|---|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.3)` |
| `shadow-modal` | `0 16px 70px rgba(0,0,0,0.5)` |
| `shadow-toast` | `0 8px 30px rgba(0,0,0,0.4)` |

### Motion

| Property | Value |
|---|---|
| Fade duration | `0.15s` |
| Ease | `easeOut` |
| Max duration | `0.2s` (except shake: `0.4s`) |
| Spring physics | **None** — explicitly avoided |
| Layout animation | `layout` prop on toasts only (for restack) |

---

## Light & Dark Mode

Theme is controlled by `darkMode: 'class'` in Tailwind config. The `dark` class is toggled on `<html>` by `App.tsx` and persisted to `localStorage` under `"acs-theme"`. Default theme is **dark**.

**Every component** uses dual-mode classes:

```tsx
// Example pattern used throughout
className="
  bg-white border-gray-200 text-gray-900
  dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100
"
```

| Light base | Dark override |
|---|---|
| `bg-white` | `dark:bg-zinc-900` |
| `bg-gray-50` | `dark:bg-zinc-800/30` |
| `bg-gray-100` | `dark:bg-zinc-800` |
| `border-gray-200` | `dark:border-zinc-800` |
| `text-gray-900` | `dark:text-zinc-100` |
| `text-gray-500` | `dark:text-zinc-400` |
| `hover:bg-gray-100` | `dark:hover:bg-zinc-800` |
| `bg-blue-100 text-blue-600` | `dark:bg-blue-500/10 dark:text-blue-400` |
| `hover:bg-red-50` | `dark:hover:bg-red-500/5` |

---

## Accessibility

| Feature | Implementation |
|---|---|
| Label linkage | `useId()` render-prop in FormField — every input has a linked `<label>` |
| Error announcements | `role="alert"` + `aria-live="assertive"` on validation errors |
| Toast announcements | `role="status"` + `aria-live="polite"` on toast container |
| Icon buttons | `aria-label` on every icon-only button |
| Focus indicators | `focus-visible:border-blue-500` or `focus-visible:ring-2` on all interactives |
| Modal semantics | `role="dialog"` + `aria-modal="true"` + `aria-label` on all modals |
| Tooltip semantics | `role="tooltip"` + `aria-describedby` linking trigger to tooltip |
| Keyboard nav | Full Tab, Enter, Escape, ↑↓ support in palette, modals, and forms |
| Semantic HTML | `<header>`, `<main>`, `<aside>`, `<nav>`, `<ul>`/`<li>` for lists |
| Scroll lock | `document.body.style.overflow = "hidden"` when modals are open |

---

## Performance

| Optimization | Detail |
|---|---|
| **Lazy loading** | `TemplatesModal`, `CommandPalette`, `SurfGame` via `React.lazy` + `Suspense`; `ContentAnalysis` lazy-loaded within `OutputPreview` |
| **Memoization** | `useMemo` for stats, diff computation, variant generation |
| **Callback stability** | `useCallback` on all handlers passed as props |
| **No re-render loops** | Timer refs (`useRef`) for toast auto-dismiss, tooltip delay, typewriter |
| **Minimal motion** | No spring physics in main UI; GSAP used only on the login page |
| **CSS-first animations** | Toast progress bar (`toast-shrink`), skeleton pulse, blink cursor via Tailwind keyframes |
| **Bundle splitting** | Lazy components create separate chunks |
| **Scrollbar optimization** | `overscroll-behavior-y: contain` prevents scroll chaining |
| **HiDPI canvas** | SurfGame uses `devicePixelRatio` scaling for sharp rendering |

---

## Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

---

## Error Checking

Run before every commit or deploy:

```bash
# Type-check + build
npm run build

# Lint
npm run lint
```

---

## License

This project is private and not licensed for public distribution.