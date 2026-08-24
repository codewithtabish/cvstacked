"use client";

/**
 * /terms — Terms of Service for CVSTACKED
 *
 * Theme-aware (light + dark) via shadcn tokens.
 * Matches Privacy Policy visual system.
 * No navbar / footer (global layout provides them).
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Scale } from "lucide-react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const displayFont = "font-[family-name:var(--font-display)]";
const monoFont = "font-[family-name:var(--font-mono)]";

const LAST_UPDATED = "August 24, 2026";
const PRODUCT_NAME = "CVSTACKED";
const CONTACT_EMAIL = "tabish@codewithtabish.com";
const CONTACT_PHONE = "+92 3169000919";
const CONTACT_PHONE_HREF = "tel:+923169000919";

/* ------------------------------------------------------------------ */
/*  Table of contents                                                  */
/* ------------------------------------------------------------------ */

const TOC = [
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "eligibility", label: "2. Eligibility" },
  { id: "accounts", label: "3. Accounts" },
  { id: "service", label: "4. Using the Service" },
  { id: "content", label: "5. Resume Content" },
  { id: "ai", label: "6. AI Features" },
  { id: "templates", label: "7. Templates & PDF Exports" },
  { id: "plans", label: "8. Free Plan & Pro Subscription" },
  { id: "payments", label: "9. Payments" },
  { id: "cancellations", label: "10. Cancellations & Refunds" },
  { id: "acceptable-use", label: "11. Acceptable Use" },
  { id: "ip", label: "12. Intellectual Property" },
  { id: "third-party", label: "13. Third-Party Services" },
  { id: "availability", label: "14. Service Availability" },
  { id: "termination", label: "15. Suspension & Termination" },
  { id: "disclaimers", label: "16. Disclaimers" },
  { id: "liability", label: "17. Limitation of Liability" },
  { id: "indemnification", label: "18. Indemnification" },
  { id: "changes", label: "19. Changes to These Terms" },
  { id: "contact", label: "20. Contact Us" },
];

/* ------------------------------------------------------------------ */
/*  Callout                                                            */
/* ------------------------------------------------------------------ */

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-border bg-muted/40 px-4 py-3.5 sm:px-5">
      <p className={cn(monoFont, "text-[11px] uppercase tracking-[0.16em] text-primary")}>
        {title}
      </p>
      <div className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function TermsOfServicePage() {
  const [activeId, setActiveId] = useState(TOC[0].id);
  const reduce = useReducedMotion();

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    TOC.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      className={cn(
        fraunces.variable,
        inter.variable,
        mono.variable,
        "min-h-screen bg-background text-foreground font-(family-name:--font-body)",
      )}
    >
      {/* Header strip */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span
            className={cn(
              monoFont,
              "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
            )}
          >
            Legal
          </span>
        </div>
      </header>

      <main className="px-6 pb-24 pt-12 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 text-primary">
              <Scale className="h-4 w-4" />
              <span className={cn(monoFont, "text-[11px] uppercase tracking-[0.22em]")}>Legal</span>
            </div>

            <h1
              className={cn(
                displayFont,
                "mt-4 text-3xl tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] leading-[1.15]",
              )}
            >
              Terms of Service
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Last updated <span className={cn(monoFont, "text-foreground")}>{LAST_UPDATED}</span>
            </p>

            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of{" "}
              {PRODUCT_NAME}, including our resume builder, templates, PDF export, AI-assisted
              features, and related services (the &ldquo;Service&rdquo;). By using the Service, you
              agree to these Terms.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
            {/* Sticky TOC — desktop */}
            <aside className="hidden lg:block">
              <nav className="sticky top-24 space-y-1" aria-label="Table of contents">
                <p
                  className={cn(
                    monoFont,
                    "mb-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
                  )}
                >
                  Contents
                </p>
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                      activeId === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Mobile TOC */}
            <details className="lg:hidden rounded-2xl border border-border bg-card">
              <summary className="cursor-pointer list-none px-5 py-4 text-sm font-medium text-foreground">
                Table of contents
              </summary>
              <nav className="border-t border-border px-3 py-3" aria-label="Table of contents">
                <ul className="space-y-1">
                  {TOC.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block rounded-md px-2 py-1.5 text-[13px] text-muted-foreground hover:text-foreground"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </details>

            {/* Body */}
            <article className="min-w-0 max-w-3xl space-y-14 text-[15px] leading-relaxed text-muted-foreground">
              {/* 1 */}
              <section id="acceptance" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  1. Acceptance of Terms
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    By accessing or using {PRODUCT_NAME}, you agree to be bound by these Terms and
                    our{" "}
                    <Link
                      href="/privacy"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    . If you do not agree, do not use the Service.
                  </p>
                  <p>
                    If you use the Service on behalf of an organization, you represent that you have
                    authority to bind that organization to these Terms.
                  </p>
                </div>
              </section>

              {/* 2 */}
              <section id="eligibility" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  2. Eligibility
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    You must be legally capable of entering into a binding agreement under
                    applicable law to use the Service. If you are using the Service on behalf of
                    someone else, you represent that you have authority to do so.
                  </p>
                </div>
              </section>

              {/* 3 */}
              <section id="accounts" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  3. Accounts
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    Certain features require an account. Authentication is provided through Clerk.
                    Account information may include email address, name, and related authentication
                    identifiers.
                  </p>
                  <p>You are responsible for:</p>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>Maintaining the security of your account and authentication methods</li>
                    <li>All activity that occurs under your account</li>
                    <li>
                      Notifying us promptly at{" "}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {CONTACT_EMAIL}
                      </a>{" "}
                      if you believe your account has been compromised
                    </li>
                  </ul>
                  <p>
                    We do not control Clerk’s internal authentication systems. Your use of
                    authentication is also subject to Clerk’s own terms and policies.
                  </p>
                </div>
              </section>

              {/* 4 */}
              <section id="service" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  4. Using the Service
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    {PRODUCT_NAME} provides tools to create, edit, customize, and export
                    professional resumes. Depending on your plan and available features, you may:
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>Create and edit resumes</li>
                    <li>Choose and customize templates, themes, and typography</li>
                    <li>Manage multiple resume versions (subject to plan limits)</li>
                    <li>Export resumes to PDF</li>
                    <li>Upload existing resume content where supported</li>
                    <li>Use AI-assisted optimization and related features where available</li>
                  </ul>
                  <p>
                    Feature availability depends on your plan and may change as we improve the
                    Service.
                  </p>
                </div>
              </section>

              {/* 5 */}
              <section id="content" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  5. Resume Content
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    You are solely responsible for the content you submit, upload, or create in the
                    Service (&ldquo;User Content&rdquo;). This may include name, contact details,
                    employment history, education, skills, projects, certifications, links, and
                    other resume information.
                  </p>
                  <Callout title="Your content">
                    You retain the rights you have in your own resume content. We do not claim
                    ownership of the personal and professional information you enter.
                  </Callout>
                  <p>
                    By submitting User Content, you grant {PRODUCT_NAME} a limited, non-exclusive
                    license to store, process, display, format, analyze, and export that content
                    solely as needed to provide the Service you request. This is not a transfer of
                    ownership and is not a right to sell or commercially exploit your resume content
                    outside the Service.
                  </p>
                  <p>
                    You represent that you have the rights necessary to submit the content and that
                    it does not violate applicable law or third-party rights.
                  </p>
                  <p>
                    If you upload resume files, you are responsible for ensuring the files are
                    lawful, do not infringe others’ rights, and do not contain malware or harmful
                    code.
                  </p>
                </div>
              </section>

              {/* 6 */}
              <section id="ai" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  6. AI Features
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    The Service may include AI-powered features such as resume optimization, wording
                    suggestions, job-description matching, keyword analysis, and related
                    recommendations.
                  </p>
                  <Callout title="AI is assistance, not a guarantee">
                    AI-generated suggestions may be incomplete, inaccurate, or unsuitable for a
                    particular role. You must review and approve any AI output before relying on it
                    in applications or other materials.
                  </Callout>
                  <p>
                    AI features do not guarantee employment, interviews, offers, ATS passage,
                    recruiter responses, or any specific career outcome. Final employment decisions
                    are made by employers and other third parties.
                  </p>
                  <p>
                    Where ATS or keyword analysis is offered, results are intended as guidance only.
                    ATS systems differ widely; we do not guarantee compatibility with every system
                    or ranking in any process.
                  </p>
                </div>
              </section>

              {/* 7 */}
              <section id="templates" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  7. Templates & PDF Exports
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    Template availability may depend on your plan. Some templates may be free;
                    others may require a Pro subscription. Designs and availability may change over
                    time.
                  </p>
                  <p>
                    PDF export is provided as a convenience. We do not guarantee that every exported
                    PDF will render identically on every device, printer, or reader, or that it will
                    pass every ATS or third-party system. Always review exported documents before
                    submitting them.
                  </p>
                </div>
              </section>

              {/* 8 */}
              <section id="plans" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  8. Free Plan & Pro Subscription
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    {PRODUCT_NAME} offers a Free plan and a paid Pro plan. Specific limits,
                    templates, and features are described on our pricing page and in the product.
                    Those descriptions are the source of truth for plan entitlements.
                  </p>
                  <p>
                    As of the last update of these Terms, Pro is offered at{" "}
                    <strong className="text-foreground">$9 USD per month</strong>. Pricing and
                    inclusions may change; current details are always shown at checkout and on the
                    pricing page.
                  </p>
                  <Callout title="Paid features">
                    Access to Pro features requires an active Pro subscription. When a subscription
                    ends or is cancelled, paid features may no longer be available according to the
                    status of your billing period.
                  </Callout>
                </div>
              </section>

              {/* 9 */}
              <section id="payments" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  9. Payments
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    Paid subscriptions are processed through Lemon Squeezy, a third-party payment
                    and merchant-of-record provider. Lemon Squeezy may handle payment processing,
                    billing information, renewals, invoices, and related subscription management.
                  </p>
                  <p>
                    We do not store full payment-card details on our systems when Lemon Squeezy
                    processes the transaction. Your use of payment features is also subject to{" "}
                    <a
                      href="https://www.lemonsqueezy.com/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Lemon Squeezy’s Terms
                    </a>{" "}
                    and related policies.
                  </p>
                  <p>
                    By purchasing a subscription, you authorize recurring charges for the applicable
                    billing period until you cancel in accordance with these Terms and the payment
                    provider’s process.
                  </p>
                </div>
              </section>

              {/* 10 */}
              <section id="cancellations" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  10. Cancellations & Refunds
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    You may cancel a Pro subscription through the mechanisms made available to you
                    (for example, via the Lemon Squeezy customer portal or any in-app subscription
                    management we provide). After cancellation, access to paid features typically
                    continues until the end of the current paid billing period, unless otherwise
                    stated at the time of cancellation.
                  </p>
                  <p>
                    Refunds, if any, are handled according to the applicable terms of Lemon Squeezy
                    and our business practices at the time of the request. We do not guarantee
                    refunds for partial billing periods or unused time unless required by law or
                    expressly offered for a specific purchase.
                  </p>
                  <p>
                    For billing or refund questions, contact us at{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <p>
                    We may change prices in the future. Where required, we will communicate material
                    price changes through appropriate channels. Continued use after a price change
                    takes effect constitutes acceptance of the new price for subsequent billing
                    periods.
                  </p>
                </div>
              </section>

              {/* 11 */}
              <section id="acceptable-use" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  11. Acceptable Use
                </h2>
                <div className="mt-4 space-y-3">
                  <p>You agree not to use the Service to:</p>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>Violate any applicable law or regulation</li>
                    <li>Infringe intellectual property or other rights of others</li>
                    <li>Impersonate another person or misrepresent your identity or affiliation</li>
                    <li>Upload malware, harmful code, or content intended to disrupt systems</li>
                    <li>
                      Attempt unauthorized access to the Service, accounts, or related systems
                    </li>
                    <li>Circumvent subscription limits, access controls, or security measures</li>
                    <li>
                      Abuse free or paid functionality, including automated abuse or fake accounts
                    </li>
                    <li>Scrape or harvest data from the Service in an abusive manner</li>
                    <li>Interfere with other users’ use of the Service</li>
                    <li>Use the Service for fraudulent or deceptive purposes</li>
                  </ul>
                  <p>
                    We may investigate suspected violations and take action we reasonably consider
                    appropriate, including suspension or termination of access.
                  </p>
                </div>
              </section>

              {/* 12 */}
              <section id="ip" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  12. Intellectual Property
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    The Service—including software, interface, branding, logos, design, templates,
                    graphics, documentation, and proprietary functionality—is owned by us or our
                    licensors and is protected by applicable intellectual-property laws.
                  </p>
                  <p>
                    Subject to these Terms, we grant you a limited, non-exclusive, non-transferable
                    right to use the Service for your personal or internal professional purposes.
                    You do not acquire ownership of the underlying software, templates, or other
                    proprietary assets merely by using the Service.
                  </p>
                  <p>
                    Using a template does not transfer ownership of the template design to you. Your
                    resume content remains yours; the template system and software remain ours.
                  </p>
                </div>
              </section>

              {/* 13 */}
              <section id="third-party" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  13. Third-Party Services
                </h2>
                <div className="mt-4 space-y-3">
                  <p>The Service relies on third-party providers, which may include:</p>
                  <ul className="list-disc space-y-1.5 pl-5">
                    <li>
                      <strong className="text-foreground">Clerk</strong> — authentication and
                      account management
                    </li>
                    <li>
                      <strong className="text-foreground">Lemon Squeezy</strong> — payment
                      processing and subscription management
                    </li>
                    <li>AI infrastructure providers used to power optional AI-assisted features</li>
                    <li>Hosting, storage, and related infrastructure providers</li>
                  </ul>
                  <p>
                    We do not control third-party services. Your use of those services may be
                    subject to their own terms and privacy policies. We are not responsible for the
                    acts or omissions of third parties except as required by applicable law.
                  </p>
                </div>
              </section>

              {/* 14 */}
              <section id="availability" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  14. Service Availability
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    We aim to keep the Service available and reliable, but we do not guarantee
                    uninterrupted or error-free operation. The Service may be unavailable from time
                    to time due to maintenance, updates, technical issues, third-party outages,
                    security incidents, or circumstances beyond our reasonable control.
                  </p>
                  <p>
                    We may modify, add, or remove features, templates, limits, or AI capabilities as
                    we develop the product. Material changes that affect paid entitlements will be
                    handled in a manner consistent with these Terms and applicable law.
                  </p>
                </div>
              </section>

              {/* 15 */}
              <section id="termination" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  15. Suspension & Termination
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    We may suspend or terminate access to the Service if we reasonably believe it is
                    necessary due to violation of these Terms, fraud, abuse, security threats,
                    illegal activity, attempts to circumvent subscription controls, or other serious
                    misuse.
                  </p>
                  <p>
                    You may stop using the Service at any time. To close your account, use any
                    in-product account deletion option if available, or contact us at{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </p>
                  <p>
                    After termination or account closure, we may delete or retain data as described
                    in our{" "}
                    <Link
                      href="/privacy"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    , including where retention is needed for legal, security, accounting, or
                    dispute-resolution purposes.
                  </p>
                </div>
              </section>

              {/* 16 */}
              <section id="disclaimers" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  16. Disclaimers
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    The Service is provided for resume-building and career-support purposes. To the
                    maximum extent permitted by applicable law, the Service is provided on an
                    &ldquo;as available&rdquo; basis without warranties of any kind, whether
                    express, implied, or statutory, including implied warranties of merchantability,
                    fitness for a particular purpose, and non-infringement.
                  </p>
                  <p>
                    We do not warrant that the Service will be uninterrupted, error-free, or free of
                    harmful components, or that AI suggestions, templates, or exports will meet
                    every requirement of every employer or ATS.
                  </p>
                  <Callout title="No employment guarantee">
                    {PRODUCT_NAME} does not guarantee employment, interviews, job offers, salary
                    outcomes, recruiter responses, or success in any application process.
                  </Callout>
                  <p>
                    You are responsible for reviewing your final resume and any AI-assisted content
                    before using it.
                  </p>
                </div>
              </section>

              {/* 17 */}
              <section id="liability" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  17. Limitation of Liability
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    To the maximum extent permitted by applicable law, {PRODUCT_NAME} and its
                    operators will not be liable for any indirect, incidental, special,
                    consequential, or punitive damages, or for any loss of profits, data,
                    opportunity, or goodwill, arising out of or related to your use of the Service.
                  </p>
                  <p>
                    Without limiting the foregoing, we are not liable for employment outcomes,
                    resume accuracy, AI-generated content, third-party outages, or decisions made by
                    employers or other third parties.
                  </p>
                  <p>
                    Where liability cannot be excluded, our total liability for claims arising out
                    of these Terms or the Service will be limited to the greater of (a) the amounts
                    you paid to us for the Service in the twelve (12) months preceding the claim, or
                    (b) fifty US dollars (USD $50), to the extent permitted by law.
                  </p>
                  <p>
                    Some jurisdictions do not allow certain limitations; in those cases, the
                    limitations apply only to the fullest extent permitted.
                  </p>
                </div>
              </section>

              {/* 18 */}
              <section id="indemnification" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  18. Indemnification
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    To the extent permitted by law, you agree to indemnify and hold harmless{" "}
                    {PRODUCT_NAME} and its operators from claims, damages, losses, and expenses
                    (including reasonable legal fees) arising out of your unlawful use of the
                    Service, your violation of these Terms, your infringement of third-party rights,
                    or your misuse of the Service.
                  </p>
                </div>
              </section>

              {/* 19 */}
              <section id="changes" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  19. Changes to These Terms
                </h2>
                <div className="mt-4 space-y-3">
                  <p>
                    We may update these Terms from time to time. The current version will be posted
                    on this page with an updated “Last updated” date. If changes are material, we
                    will provide additional notice through appropriate means (for example, email or
                    an in-product message) where practicable.
                  </p>
                  <p>
                    Continued use of the Service after updated Terms become effective constitutes
                    acceptance of the revised Terms.
                  </p>
                </div>
              </section>

              {/* 20 */}
              <section id="contact" className="scroll-mt-24">
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl text-foreground tracking-tight")}
                >
                  20. Contact Us
                </h2>
                <div className="mt-4 space-y-3">
                  <p>Questions about these Terms of Service? Contact us:</p>
                  <div className="mt-4 space-y-2 rounded-xl border border-border bg-card p-5">
                    <p>
                      <span className="text-muted-foreground">Email:</span>{" "}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Phone:</span>{" "}
                      <a
                        href={CONTACT_PHONE_HREF}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {CONTACT_PHONE}
                      </a>
                    </p>
                  </div>
                  <p className="mt-4">
                    For privacy-related requests, see our{" "}
                    <Link
                      href="/privacy"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </section>

              {/* Bottom CTA */}
              <div className="rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-10">
                <p className={cn(monoFont, "text-[11px] uppercase tracking-[0.2em] text-primary")}>
                  Questions?
                </p>
                <h3 className={cn(displayFont, "mt-3 text-xl sm:text-2xl text-foreground")}>
                  We’re here if you need clarity.
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Reach out about these Terms, subscriptions, or how {PRODUCT_NAME} works.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Button asChild variant="outline" className="rounded-full">
                    <a href={`mailto:${CONTACT_EMAIL}`}>Contact us</a>
                  </Button>
                  <Button asChild className="rounded-full">
                    <Link href="/app">
                      Create Resume
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
