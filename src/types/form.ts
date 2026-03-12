/* ─────────────────────────────────────────────────────
   Form types, options, defaults & validation
   ───────────────────────────────────────────────────── */

// ── Option arrays (single source of truth) ──────────

export const contentTypeOptions = [
  { value: "linkedin", label: "LinkedIn Post" },
  { value: "twitter", label: "Twitter / X Thread" },
  { value: "email", label: "Email" },
  { value: "ad-copy", label: "Ad Copy" },
  { value: "blog", label: "Blog Article" },
  { value: "landing-page", label: "Landing Page" },
] as const;

export const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
  { value: "informative", label: "Informative" },
  { value: "witty", label: "Witty" },
] as const;

export const lengthOptions = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
] as const;

export const modelOptions = [
  { value: "deepseek/deepseek-r1", label: "DeepSeek R1", dot: "bg-emerald-400" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", dot: "bg-blue-400" },
  { value: "openai/gpt-4o-mini", label: "GPT-4o Mini", dot: "bg-amber-400" },
] as const;

// ── Union types derived from option arrays ──────────

export type ContentType = (typeof contentTypeOptions)[number]["value"];
export type Tone = (typeof toneOptions)[number]["value"];
export type Length = (typeof lengthOptions)[number]["value"];
export type Model = (typeof modelOptions)[number]["value"];

// ── Form data ───────────────────────────────────────

export type FormData = {
  topic: string;
  contentType: ContentType;
  tone: Tone;
  length: Length;
  targetAudience: string;
  keywords: string;
  model: Model;
};

export const initialFormData: FormData = {
  topic: "",
  contentType: "linkedin",
  tone: "professional",
  length: "medium",
  targetAudience: "",
  keywords: "",
  model: "deepseek/deepseek-r1",
};

// ── Validation ──────────────────────────────────────

export type ValidationErrors = Partial<Record<keyof FormData, string>>;

export const validationRules: Record<
  string,
  (value: string) => string | null
> = {
  topic: (v) =>
    v.trim().length < 3 ? "Topic must be at least 3 characters" : null,
  targetAudience: (v) =>
    v.trim().length > 0 && v.trim().length < 2
      ? "Audience must be at least 2 characters"
      : null,
  keywords: (v) =>
    v.trim().length > 0 && v.trim().length < 2
      ? "Keywords must be at least 2 characters"
      : null,
};