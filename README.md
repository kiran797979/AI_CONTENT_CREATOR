# AI Content Studio

<<<<<<< HEAD
A full-stack AI content generation platform that lets you create, compare, and analyze content across multiple LLM models. Built with a **React + Vite** frontend and a **Python (Streamlit)** backend powered by [OpenRouter](https://openrouter.ai/).

Generate LinkedIn posts, tweets, emails, blog posts, ad copy, and landing page content with customizable tone, length, audience targeting, and a fully editable dynamic prompt — then compare outputs across models side by side.

> **Author:** B M Kiran

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Usage Guide](#usage-guide)
- [Architecture](#architecture)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
  - [API Contract](#api-contract)
- [Multi-Model Comparison](#multi-model-comparison)
- [Dynamic Prompt System](#dynamic-prompt-system)
- [Design System](#design-system)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Browser Support](#browser-support)
- [License](#license)

---

## Features

### Multi-LLM Content Generation
- **6 content types:** LinkedIn Post, Twitter, Email, Ad Copy, Blog, Landing Page
- **Multiple AI models** via OpenRouter — DeepSeek, Gemini Flash, GPT-4o Mini, Llama, Mistral, Qwen, and more
- **A/B model comparison** — generate from two models side by side with word-level diff highlighting
- **Dynamic prompt builder** — auto-assembled from form fields, fully editable before submission
- Mock generator fallback when the backend is unavailable

### Content Controls
- **Tone:** Professional, Friendly, Persuasive, Informative, Witty, and more
- **Length:** Very Short → Extended (with word-count guidance)
- **Target audience** and **keyword** inputs with validation
- **Topic field** with live character counter (300 char limit) and auto-resize

### Output & Analysis
- **3-tab output view:** Preview (typewriter effect), Raw (monospace), Markdown (rendered)
- **Action bar:** Copy, Regenerate, Download (`.txt` / `.md`), Analyze, Compare A/B
- **Inline content analysis** — readability gauge (Flesch score), tone bars, word/sentence metrics
- **A/B comparison** with word-level LCS diff, summary bar, version pick buttons, and diff legend
- **Stats pills:** word count, character count, estimated read time

### Templates & Command Palette
- **9 content templates** (LinkedIn, Email, Ad Copy) with search and category tabs
- **⌘K command palette** with fuzzy search across 13+ grouped actions

### Authentication & Login
- **Interactive Lamp Login** — GSAP-animated lamp with draggable cord, randomized glow hue
- Sign In / Sign Up cards with password strength meter and form validation
- Protected routes with `localStorage`-based auth persistence

### Easter Egg & Extras
- 🎮 Canvas-based surfer game with physics, obstacles, powerups, and HiDPI support
- **Pixel/retro visual theme** on landing page (`/welcome`) using "Press Start 2P" and "Silkscreen" fonts
- Interactive **3D Spline scene** hero layout 

---
=======
AI Content Studio is a full-stack project for generating, comparing, and analyzing AI-written content.

- Frontend: React + TypeScript + Vite + Tailwind
- Backend API: FastAPI + OpenRouter (OpenAI SDK)
- Backend UI: Streamlit (optional companion interface)
- Milestone branch: `ManojKiran_m3`

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Contract](#api-contract)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Overview

This project supports a complete content workflow:
- Generate content from multiple LLMs
- Compare A/B outputs with diffing
- Analyze readability and quality
- Use templates, command palette, and autosave for faster drafting

Frontend users interact with a modern dashboard and a public landing page (`/welcome`).
The frontend calls the FastAPI backend at `POST /generate`, and the backend routes requests to OpenRouter.

## Features

### Frontend

- Public startup landing page (`/welcome`, alias `/landing`)
- Login page and protected dashboard route (`/`)
- Dynamic prompt builder (auto + editable)
- A/B model comparison and output tabs
- Text analysis and content utilities
- Local autosave and content history
- Pixel/retro themed landing experience (landing only)

### Backend

- FastAPI endpoint for frontend integration (`/generate`)
- Health check endpoint (`/health`)
- Content/tone/length/model mapping layer
- OpenRouter integration through OpenAI SDK
- Optional Streamlit interface for standalone usage
- CLI scripts for generation and model comparison

## Architecture

```text
React App (Vite)  --->  FastAPI (/generate)  --->  OpenRouter API  --->  LLM
       |                      |
       |                      +--> prompt templates + validation/mapping
       |
       +--> optional mock mode (frontend only)

Optional parallel backend UI:
Streamlit app.py (same environment/config)
```
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)

## Tech Stack

### Frontend

<<<<<<< HEAD
| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety (`strict`, `verbatimModuleSyntax`, `erasableSyntaxOnly`) |
| Vite | 7 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling with custom design tokens |
| Framer Motion | 12.x | Spring dynamics and smooth UI transitions |
| GSAP | 3.14 | Login page lamp animation (Draggable, SVG morphing) |
| React Router | 7.13 | Client-side routing with auth guard |
| @splinetool/react-spline | latest | 3D visual integration |

### Backend

| Technology | Purpose |
|---|---|
| Python 3.10+ | Backend runtime |
| Streamlit | Web UI for the backend content generator |
| OpenAI SDK | API client for OpenRouter (multi-model gateway) |
| python-dotenv | Environment variable management |

---
=======
- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 3
- Framer Motion
- GSAP
- React Router
- `@splinetool/react-spline`

### Backend

- Python 3.10+
- FastAPI
- Uvicorn
- Streamlit
- OpenAI SDK (with OpenRouter base URL)
- python-dotenv

## Project Structure
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)

## Project Structure

```
ai-content-studio/
<<<<<<< HEAD
│
├── src/                             # React frontend source
│   ├── components/                  # Feature components
│   │   ├── ABComparison.tsx         #   A/B comparison with diff + summary bar
│   │   ├── CommandPalette.tsx       #   ⌘K command palette with grouped actions
│   │   ├── ContentAnalysis.tsx      #   Readability gauge + tone bars + metrics
│   │   ├── ContentForm.tsx          #   Generation form + model picker + dynamic prompt
│   │   ├── LoginPage.tsx            #   GSAP animated lamp login page
│   │   ├── ModelSelector.tsx        #   Compact model selector list
│   │   ├── OutputPreview.tsx        #   Output display + action bar
│   │   ├── OutputTabs.tsx           #   Preview / Raw / Markdown tabs
│   │   ├── Sidebar.tsx              #   History sidebar + mobile drawer
│   │   ├── SurfGame.tsx             #   🎮 Canvas-based easter egg
│   │   ├── TemplatesModal.tsx       #   Template browser with search + filters
│   │   ├── ToastContainer.tsx       #   Toast notification stack
│   │   └── Tooltip.tsx              #   Tooltip with arrow + delay
│   ├── ui/                          # Reusable UI primitives
│   │   ├── Dropdown.tsx
│   │   ├── FormField.tsx
│   │   ├── TextArea.tsx
│   │   └── TextInput.tsx
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAutoSave.ts
│   │   ├── useCommandPalette.ts
│   │   ├── useContentHistory.ts
│   │   ├── useFormValidation.ts
│   │   ├── useToast.ts
│   │   └── useTypewriter.ts
│   ├── pages/                       # Route pages
│   │   └── LandingPage.tsx          #   Public startup/marketing page (/welcome)
│   ├── services/                    # API layer
│   │   ├── api.ts                   #   HTTP client with retry, abort, timeout
│   │   └── types.ts                 #   Request/response type definitions
│   ├── utils/                       # Pure utility functions
│   │   ├── buildPrompt.ts           #   Assembles dynamic prompt from form fields
│   │   ├── downloadFile.ts          #   Blob-based .txt/.md download
│   │   ├── markdownRenderer.tsx     #   Markdown → React renderer
│   │   ├── mockGenerator.ts         #   Mock AI content generation
│   │   ├── textAnalysis.ts          #   Flesch score, tone, text metrics
│   │   └── textDiff.ts              #   Word-level LCS diff algorithm
│   ├── config/                      # Configuration
│   │   ├── animations.ts
│   │   └── env.ts
│   ├── data/
│   │   └── templates.ts             # 9 content templates
│   ├── types/
│   │   └── form.ts                  # Shared type definitions
│   ├── App.tsx                      # Root: state + layout + lazy loading
│   ├── main.tsx                     # React entry + router + auth guard
│   └── index.css                    # Tailwind directives + custom styles
│
├── backend/                         # Python backend
│   ├── app.py                       #   Streamlit app — UI, model selection, generation
│   ├── generate_content.py          #   CLI content generator (single model)
│   ├── compare_models.py            #   Multi-model comparison script
│   ├── config.py                    #   Configuration & environment management
│   ├── prompt_templates.py          #   Dynamic prompt builder + content types/tones
│   └── requirements.txt             #   Python dependencies
│
├── public/                          # Static assets
├── .env.example                     # Frontend environment template
├── .gitignore
├── index.html                       # HTML shell
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Python** 3.10+
- An [OpenRouter API key](https://openrouter.ai/) (for backend LLM calls)

### Frontend Setup
├── src/                         # Frontend source
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   │   └── LandingPage.tsx      # Public startup/marketing page (/welcome)
│   ├── services/
│   ├── utils/
│   └── ...
├── backend/                     # Streamlit + content generation backend
│   ├── api.py                   # FastAPI adapter for frontend
│   ├── run_api.py               # local API runner
│   ├── app.py                   # Streamlit app
│   ├── config.py
│   ├── compare_models.py        # CLI model comparison
│   ├── generate_content.py      # CLI content generation
│   ├── prompt_templates.py
│   ├── requirements.txt
│   └── .env.example
├── public/
├── .env.example                 # Frontend env template
├── vercel.json
└── README.md
```

---

## Quick Start

### 1) Clone

```bash
# Clone the repository
git clone https://github.com/kiran797979/Multi_LLM_comparison.git
cd Multi_LLM_comparison
```

### 2) Frontend Setup

```bash
npm install
```

Create root `.env` from `.env.example` and configure:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=false
```

Run frontend:

```bash
npm run dev
```

The frontend will be available at **http://localhost:5173**.

> **Tip:** Set `VITE_USE_MOCK=true` in `.env` to use the built-in mock generator without needing the backend running.

### 3) Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv .venv
```

Activate environment:

- Windows PowerShell: `\.venv\Scripts\Activate.ps1`
- Windows cmd: `.venv\Scripts\activate`
- macOS/Linux: `source .venv/bin/activate`

```bash
# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Add your OpenRouter API key to .env
```

### Running Both Together

1. Start the backend API: `cd backend && python run_api.py` (Runs on `http://localhost:8000`)
2. Start the Streamlit app (optional UI): `cd backend && streamlit run app.py` (Runs on `http://localhost:8501`)
3. Set `VITE_USE_MOCK=false` and `VITE_API_BASE_URL=http://localhost:8000` in the root `.env`
4. Start the frontend: `npm run dev`

---

## Environment Variables

### Frontend (`.env` in project root)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8501` | Backend API base URL |
| `VITE_USE_MOCK` | `true` | Use built-in mock generator (`true`) or real backend (`false`) |

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `OPENROUTER_API_KEY` | **Yes** | Your OpenRouter API key from [openrouter.ai](https://openrouter.ai/) |
| `DEFAULT_MODEL` | No | Default model (e.g., `deepseek/deepseek-chat`) |
| `DEFAULT_TEMPERATURE` | No | Generation temperature (default: `0.7`) |

---

## Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + production build (`vite build`) |
| `npm run lint` | Run ESLint across the project |
| `npm run preview` | Serve production build locally |

### Backend

| Command | Description |
|---|---|
| `streamlit run app.py` | Launch the Streamlit web UI |
| `python generate_content.py <model> --prompt "..."` | CLI: generate content with a specific model |
| `python compare_models.py` | Compare output from multiple models side by side |

---

## Usage Guide

1. **Login** — pull the lamp cord to reveal the sign-in form, enter credentials
2. **Select content type** — LinkedIn, Twitter, Email, Ad Copy, Blog, or Landing Page
3. **Set tone and length** — choose from dropdown selectors
4. **Enter target audience** — required field with validation
5. **Add keywords** — comma-separated, optional
6. **Write a topic** — min 3 chars, live character counter (300 max)
7. **Review/edit dynamic prompt** — expand "Final Dynamic Prompt" to view and customize
8. **Generate** — click the button or press `Ctrl+Enter` / `⌘+Enter`
9. **Switch model** — click "Model: X · Change" below the Generate button
10. **View output** — Preview (typewriter), Raw, or Markdown tabs
11. **Copy / Download / Analyze** — use the icon action bar
12. **Compare A/B** — side-by-side diff with word-level highlighting
13. **Use templates** — click Templates button for pre-built configs
14. **Command palette** — press `⌘K` / `Ctrl+K` for quick actions
15. **History** — click any sidebar entry to reload a previous generation

---

## Architecture

### Frontend Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      main.tsx (Router)                        │
│   BrowserRouter → /login → LoginPage (GSAP lamp)             │
│                 → /*     → ProtectedRoute → App              │
├──────────────────────────────────────────────────────────────┤
│                         App.tsx                               │
│      (All state · orchestration · theme · lazy loading)       │
├──────────┬────────────────────┬───────────────────────────────┤
│ Sidebar  │   ContentForm      │     OutputPreview             │
│ (history)│   ├ ModelSelector   │     ├ OutputTabs              │
│          │   ├ Templates btn   │     ├ ContentAnalysis (lazy)  │
│          │   └ Dynamic Prompt  │     └ ABComparison            │
├──────────┴────────────────────┴───────────────────────────────┤
│      TemplatesModal (lazy)  │  CommandPalette (lazy)          │
│      SurfGame (lazy)        │  ToastContainer                 │
├──────────────────────────────────────────────────────────────┤
│                 Hooks · Utils · Services · Config             │
└──────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**
- All application state lives in `App.tsx` — props flow down, callbacks flow up
- No external UI component libraries — every primitive is hand-built
- `import type` for type-only imports (`verbatimModuleSyntax` enforced)
- Framer Motion used only where animation adds UX value (modals, toasts, tabs)
- GSAP used exclusively on the login page for the interactive lamp animation
- Lazy loading via `React.lazy` + `Suspense` for heavy components

### Backend Architecture

The backend uses **OpenRouter** as a unified gateway to access multiple LLM providers through a single API key:

| Component | Purpose |
|---|---|
| `app.py` | Streamlit web UI — model selection, prompt suggestions, content generation |
| `config.py` | Centralized configuration, API key validation, model list, retry settings |
| `prompt_templates.py` | Dynamic prompt builder — 12 content types, 12 tones, 6 lengths |
| `generate_content.py` | CLI tool for generating content with a single model |
| `compare_models.py` | Script to compare outputs from multiple models on the same prompt |

**Supported models (via OpenRouter):**
- `deepseek/deepseek-chat`
- `google/gemini-flash-1.5:free`
- `openai/gpt-oss-120b:free`
- `meta-llama/llama-3.2-90b-vision-instruct:free`
- `mistralai/mistral-7b-instruct`
- `qwen/qwen-2.5-72b-instruct:free`

### API Contract

=======
```env
OPENROUTER_API_KEY=your-openrouter-api-key
# Optional:
# DEFAULT_MODEL=deepseek/deepseek-chat
# DEFAULT_TEMPERATURE=0.7
# CORS_ORIGINS=http://localhost:5173
```

Run backend API:

```bash
python run_api.py
```

Backend API URL: `http://localhost:8000`

Optional Streamlit UI:

```bash
streamlit run app.py
```

Streamlit URL: `http://localhost:8501`

## Configuration

### Frontend environment

- `VITE_API_BASE_URL` — FastAPI base URL
- `VITE_USE_MOCK` — `true` to bypass backend and use mock generation

### Backend environment

- `OPENROUTER_API_KEY` (required)
- `DEFAULT_MODEL` (optional)
- `DEFAULT_TEMPERATURE` (optional)
- `CORS_ORIGINS` (optional, comma-separated)

Example:

```env
CORS_ORIGINS=http://localhost:5173,https://your-frontend-domain.vercel.app
```

## Usage

### App routes

- `/welcome` or `/landing` — public landing page
- `/login` — login page
- `/` — protected dashboard

### CLI examples (backend)

Generate content:

```bash
python generate_content.py "deepseek/deepseek-chat" --topic "AI productivity for marketers" --type "Blog Post" --tone "Professional" --audience "Marketing teams" --length "Medium" --keywords "AI, productivity"
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)
```
POST {VITE_API_BASE_URL}/generate
Content-Type: application/json

<<<<<<< HEAD
=======
Compare models:

```bash
python compare_models.py --prompt "Create a launch announcement for an AI content platform"
```

## API Contract

### `POST /generate`

Request body:

```json
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)
{
  "contentType": "linkedin",
  "tone": "professional",
  "length": "medium",
  "targetAudience": "Marketing professionals",
  "keywords": "AI, productivity",
<<<<<<< HEAD
  "topic": "The future of AI in content creation",
  "model": "deepseek/deepseek-r1",
  "prompt": "Write a professional LinkedIn post about..."
=======
  "topic": "Future of AI content",
  "model": "deepseek/deepseek-r1",
  "prompt": ""
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)
}

Response: { "content": "Generated content here..." }
```

<<<<<<< HEAD
| Feature | Detail |
|---|---|
| **Retry** | Exponential backoff, up to 3 attempts |
| **Timeout** | 30s with `AbortSignal` for manual cancellation |
| **Fallback** | Auto-switches to mock generator on API failure |
| **Cancel** | Cancel button triggers `AbortController.abort()` |
=======
Response body:
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)

---

## Multi-Model Comparison

The project supports comparing outputs from multiple LLMs on the same prompt:

**Frontend A/B Comparison:**
- Generate content with one model, then regenerate with another
- Side-by-side view with word-level diff highlighting (LCS algorithm)
- Summary bar showing word count and readability deltas
- Pick the preferred version with one click

**Backend CLI Comparison:**
```bash
cd backend
python compare_models.py
```
This runs the same prompt through DeepSeek, GPT-OSS-120B, and other configured models, printing outputs side by side in the terminal.

---

## Dynamic Prompt System

The app includes a **Final Dynamic Prompt** that is auto-generated from form fields and fully editable before submission:

1. **Auto-generation** — `buildPrompt()` assembles a structured prompt from content type, topic, tone, audience, keywords, and length
2. **Live preview** — updates in real time as form fields change
3. **Editable** — users can freely edit the prompt text before sending
4. **Sent to API** — the final edited prompt is included in the API request payload

**Example generated prompt:**
```
Write a LinkedIn post about the following topic:
"The future of AI in content creation"

Tone: professional.
The target audience is: Marketing professionals.
Incorporate these keywords naturally: AI, productivity, SaaS.
Aim for a moderate length — around 150–250 words.

Return only the final content — no meta-commentary, labels, or explanations.
```

<<<<<<< HEAD
---

## Design System

- **Dark-first, light-ready** — every component has full `dark:` + light Tailwind classes
- **Theme toggle** — `darkMode: 'class'` persisted to `localStorage` under `"acs-theme"`
- **Flat 3-column layout** — Sidebar (240px) · Form (440px) · Output (flex)
- **Consistent radii** — `rounded-lg` (8px) for inputs, buttons, cards, panels
- **Minimal motion** — 0.15s opacity fades only; no spring physics in main UI
- **Custom shadows** — `shadow-card`, `shadow-modal`, `shadow-toast` optimized for dark mode
=======
Health check:

- `GET /health` → `{ "status": "ok" }`

## Deployment

### Recommended setup

- Frontend: Vercel
- Backend API: Render Web Service

### Deploy backend (Render)

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
- Required env:
  - `OPENROUTER_API_KEY=...`
  - `CORS_ORIGINS=https://your-frontend-domain.vercel.app`

### Deploy frontend (Vercel)

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Env:
  - `VITE_USE_MOCK=false`
  - `VITE_API_BASE_URL=https://your-render-service.onrender.com`

This repo includes `vercel.json` rewrite rules so SPA routes like `/welcome` and `/login` work on refresh.

### Post-deploy verification

1. Open backend health URL: `https://your-render-service.onrender.com/health`
2. Confirm response: `{ "status": "ok" }`
3. Open frontend and run one real generation
4. Confirm browser console has no CORS/API errors
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)

---

<<<<<<< HEAD
## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+Enter` / `⌘+Enter` | Generate content |
| `Ctrl+K` / `⌘+K` | Open command palette |
| `Escape` | Close any modal / palette |
| `↑` / `↓` | Navigate command palette |
| `Enter` | Execute selected command |

---

## Accessibility

- **Label linkage** — `useId()` render-prop ensures every input has a linked `<label>`
- **ARIA roles** — `role="alert"` on errors, `role="status"` on toasts, `role="dialog"` on modals
- **Focus indicators** — `focus-visible:border-blue-500` on all interactives
- **Keyboard nav** — full Tab, Enter, Escape, ↑↓ support in palette, modals, and forms
- **Semantic HTML** — `<header>`, `<main>`, `<aside>`, `<nav>`, `<ul>`/`<li>` used throughout

---

## Performance

| Optimization | Detail |
|---|---|
| **Lazy loading** | `TemplatesModal`, `CommandPalette`, `SurfGame`, `ContentAnalysis` via `React.lazy` |
| **Memoization** | `useMemo` for stats, diff computation; `useCallback` on all handler props |
| **CSS-first animations** | Toast progress bar, skeleton pulse, blink cursor via Tailwind keyframes |
| **Bundle splitting** | Lazy components create separate chunks |
| **HiDPI canvas** | SurfGame uses `devicePixelRatio` for sharp rendering |

---

## Browser Support

| Browser | Minimum Version |
|---|---|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

---
=======
- **CORS error in browser**
  - Ensure backend `CORS_ORIGINS` includes your exact frontend domain.
- **`OPENROUTER_API_KEY` missing/invalid**
  - Verify key in `backend/.env` (local) or hosting env vars (production).
- **Frontend calls wrong URL**
  - Recheck `VITE_API_BASE_URL` and redeploy frontend after env update.
- **Generation returns empty/error**
  - Check backend logs and model ID mapping in `backend/api.py`.
- **Route refresh 404 on frontend**
  - Ensure `vercel.json` is present and deployed.
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)

---

<<<<<<< HEAD
MIT
=======
If you want, I can now commit this README improvement and push it to both `origin` and `personal` on `ManojKiran_m3`.
>>>>>>> 2af7774 (docs: unify main README and finalize deployment setup)
