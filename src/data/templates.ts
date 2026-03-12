/* ─────────────────────────────────────────────────────
   Content templates — typed against form.ts unions
   ───────────────────────────────────────────────────── */

import type { ContentType, Length, Tone } from "../types/form";

// ── Template shape ──────────────────────────────────

export type Template = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly contentType: ContentType;
  readonly tone: Tone;
  readonly length: Length;
  readonly targetAudience: string;
  readonly keywords: string;
  readonly topic: string;
  readonly category: TemplateCategory;
};

export type TemplateCategory = "linkedin" | "email" | "ad-copy";

// ── Category metadata (for tabs / filters) ──────────

export const templateCategories = [
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "email", label: "Email", icon: "✉️" },
  { value: "ad-copy", label: "Ad Copy", icon: "📢" },
] as const satisfies readonly {
  value: TemplateCategory;
  label: string;
  icon: string;
}[];

// ── Template data ───────────────────────────────────

export const templates: readonly Template[] = [
  // ─── LinkedIn ──────────────────────────────────────
  {
    id: "product-launch",
    name: "Product Launch Announcement",
    description: "Announce a new product with excitement and professionalism",
    contentType: "linkedin",
    tone: "professional",
    length: "medium",
    targetAudience: "Tech enthusiasts and early adopters",
    keywords: "launch, product, innovation",
    topic:
      "Announcing our latest product that solves a critical problem for modern teams",
    category: "linkedin",
  },
  {
    id: "thought-leadership",
    name: "Thought Leadership Post",
    description: "Share industry insights and establish authority",
    contentType: "linkedin",
    tone: "professional",
    length: "long",
    targetAudience: "Industry professionals",
    keywords: "leadership, strategy, insights",
    topic:
      "Sharing key insights about the future of our industry and emerging trends",
    category: "linkedin",
  },
  {
    id: "company-culture",
    name: "Company Culture Highlight",
    description: "Showcase what makes your workplace special",
    contentType: "linkedin",
    tone: "friendly",
    length: "medium",
    targetAudience: "Job seekers and employees",
    keywords: "culture, team, workplace",
    topic:
      "What makes our company culture unique and why people love working here",
    category: "linkedin",
  },

  // ─── Email ─────────────────────────────────────────
  {
    id: "cold-outreach",
    name: "Cold Outreach",
    description: "Reach out to potential clients or partners",
    contentType: "email",
    tone: "persuasive",
    length: "short",
    targetAudience: "Potential clients",
    keywords: "outreach, partnership, growth",
    topic:
      "Reaching out about a potential collaboration on driving business growth",
    category: "email",
  },
  {
    id: "newsletter-intro",
    name: "Newsletter Introduction",
    description: "Welcome readers to your latest newsletter edition",
    contentType: "email",
    tone: "friendly",
    length: "medium",
    targetAudience: "Newsletter subscribers",
    keywords: "update, news, community",
    topic:
      "Welcome to this month's edition covering the latest updates and insights",
    category: "email",
  },
  {
    id: "follow-up",
    name: "Follow-up After Meeting",
    description: "Reconnect after a business meeting with next steps",
    contentType: "email",
    tone: "professional",
    length: "short",
    targetAudience: "Business contacts",
    keywords: "follow-up, meeting, next steps",
    topic:
      "Following up on our recent conversation about partnership opportunities",
    category: "email",
  },

  // ─── Ad Copy ───────────────────────────────────────
  {
    id: "saas-product",
    name: "SaaS Product Ad",
    description: "Promote a software product to business owners",
    contentType: "ad-copy",
    tone: "persuasive",
    length: "medium",
    targetAudience: "Small business owners",
    keywords: "SaaS, productivity, efficiency",
    topic:
      "Discover the tool that helps businesses save time and boost productivity",
    category: "ad-copy",
  },
  {
    id: "event-promotion",
    name: "Event Promotion",
    description: "Drive registrations for an upcoming event",
    contentType: "ad-copy",
    tone: "friendly",
    length: "short",
    targetAudience: "Event attendees",
    keywords: "event, conference, networking",
    topic:
      "Join us for an exclusive event featuring industry leaders and networking",
    category: "ad-copy",
  },
  {
    id: "limited-offer",
    name: "Limited Time Offer",
    description: "Create urgency around a promotional deal",
    contentType: "ad-copy",
    tone: "persuasive",
    length: "short",
    targetAudience: "Deal seekers",
    keywords: "discount, offer, limited",
    topic:
      "Don't miss our biggest sale of the year on premium features and plans",
    category: "ad-copy",
  },
];

// ── Derived helpers ─────────────────────────────────

export type TemplateId = (typeof templates)[number]["id"];