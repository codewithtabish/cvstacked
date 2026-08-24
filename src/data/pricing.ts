// src/data/pricing.ts
//
// Single source of truth for all pricing information.
// The pricing page (and any other pricing UI) must render from this file —
// never hardcode plan names, prices, features, or limits elsewhere.

export type PricingPlanId = "free" | "pro";

export type PricingFeature = {
  label: string;
  included: boolean;
  value?: string;
};

export type PricingPlan = {
  id: PricingPlanId;
  name: string;
  description: string;
  monthlyPrice: number;
  currency: string;
  period: string;
  popular?: boolean;
  cta: string;
  features: PricingFeature[];
  limits: {
    resumes: number | null;
    templates: number | null;
    aiOptimizations: number | null;
    exports: number | null;
  };
};

export const PRICING_CURRENCY = "$";
export const PRICING_INTERVAL = "month";

export const FREE_PLAN: PricingPlan = {
  id: "free",
  name: "Free",
  description:
    "Everything you need to build a clean, professional resume and start applying today.",
  monthlyPrice: 0,
  currency: PRICING_CURRENCY,
  period: PRICING_INTERVAL,
  cta: "Start for free",
  features: [
    { label: "Resume builder", included: true },
    { label: "Resume templates", included: true, value: "3 templates" },
    { label: "PDF export", included: true },
    { label: "Multiple resume versions", included: true, value: "Up to 1" },
    { label: "AI resume optimization", included: false },
    { label: "ATS keyword analysis", included: false },
    { label: "Job description matching", included: false },
    { label: "Advanced customization", included: false },
  ],
  limits: {
    resumes: 1,
    templates: 3,
    aiOptimizations: 0,
    exports: null,
  },
};

export const PRO_PLAN: PricingPlan = {
  id: "pro",
  name: "Pro",
  description:
    "AI-powered optimization, every template, and unlimited resumes for serious job seekers.",
  monthlyPrice: 9,
  currency: PRICING_CURRENCY,
  period: PRICING_INTERVAL,
  popular: true,
  cta: "Upgrade to Pro",
  features: [
    { label: "Resume builder", included: true },
    { label: "Resume templates", included: true, value: "All templates" },
    { label: "PDF export", included: true },
    { label: "Multiple resume versions", included: true, value: "Unlimited" },
    { label: "AI resume optimization", included: true },
    { label: "ATS keyword analysis", included: true },
    { label: "Job description matching", included: true },
    {
      label: "Advanced customization",
      included: true,
      value: "Fonts, themes & layout",
    },
  ],
  limits: {
    resumes: null,
    templates: null,
    aiOptimizations: null,
    exports: null,
  },
};

export const PRO_PRICE = PRO_PLAN.monthlyPrice;

export const PRICING_PLANS: PricingPlan[] = [FREE_PLAN, PRO_PLAN];
