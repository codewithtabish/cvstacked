"use client";

/**
 * /privacy — Privacy Policy page for CVSTACKED
 *
 * Matches the marketing design system:
 * Fraunces (display) + Inter (body) + JetBrains Mono (labels)
 * Fully theme-aware via shadcn tokens (light + dark)
 */

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";

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

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const LAST_UPDATED = "August 24, 2026";

const SECTIONS = [
  {
    id: "overview",
    title: "1. Overview",
    content: (
      <>
        <p>
          CVSTACKED (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) builds tools that
          help you present your professional experience more clearly. This Privacy Policy explains
          what information we collect, how we use it, and the choices you have.
        </p>
        <p>
          We designed CVSTACKED so that your career story stays yours. We do not sell personal data,
          and we do not use your resume content to train public models.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information We Collect",
    content: (
      <>
        <p className="font-medium text-foreground">Account information</p>
        <p>
          When you create an account (via Clerk or similar providers), we receive basic identifiers
          such as your name, email address, and authentication tokens. We do not store your
          password.
        </p>

        <p className="mt-5 font-medium text-foreground">Resume & content you provide</p>
        <p>
          Content you upload or write inside CVSTACKED—resumes, experience bullets, job descriptions
          you paste, and edits you make—is processed to deliver the product features you request
          (matching, keyword suggestions, wording improvements, ATS structure checks).
        </p>

        <p className="mt-5 font-medium text-foreground">Usage & device data</p>
        <p>
          We collect standard technical data such as browser type, device information, pages viewed,
          and approximate location derived from IP address. This helps us keep the service reliable
          and improve performance.
        </p>

        <p className="mt-5 font-medium text-foreground">Cookies & similar technologies</p>
        <p>
          We use essential cookies for authentication and session management. We may also use
          limited analytics cookies to understand how the product is used. You can control
          non-essential cookies through your browser settings.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How We Use Information",
    content: (
      <>
        <p>We use the information we collect to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Provide, operate, and improve CVSTACKED</li>
          <li>
            Process your resume content only for the features you actively request (matching,
            keyword analysis, writing suggestions, structure checks)
          </li>
          <li>Authenticate you and secure your account</li>
          <li>Respond to support requests and communicate important product updates</li>
          <li>Detect and prevent abuse, fraud, and security incidents</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p className="mt-4">
          We do <strong>not</strong> use the content of your resume to train general-purpose AI
          models that are shared with other customers or the public.
        </p>
      </>
    ),
  },
  {
    id: "ai-processing",
    title: "4. AI Processing",
    content: (
      <>
        <p>
          Certain features rely on AI models to analyze the relationship between your experience and
          a target role, surface relevant keywords, and suggest clearer phrasing.
        </p>
        <p>
          When you use these features, the relevant text is sent to our AI providers solely to
          generate the response you requested. We require our providers to process data under
          appropriate data-protection terms and not to use your content for their own model training
          unless you have explicitly agreed otherwise.
        </p>
        <p>
          You remain in control: suggestions are always reviewable, and nothing is applied to your
          resume without your action.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "5. How We Share Information",
    content: (
      <>
        <p>We share information only in these limited situations:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            <strong>Service providers</strong> — infrastructure, authentication (e.g. Clerk),
            analytics, and AI processing partners who help us operate the product under contractual
            confidentiality and security obligations.
          </li>
          <li>
            <strong>Legal requirements</strong> — when we believe disclosure is necessary to comply
            with law, protect rights, or respond to lawful requests.
          </li>
          <li>
            <strong>Business transfers</strong> — in connection with a merger, acquisition, or sale
            of assets, with notice where required.
          </li>
        </ul>
        <p className="mt-4">We do not sell your personal information or resume content.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: (
      <>
        <p>
          We retain account and content data for as long as your account is active or as needed to
          provide the service. You may delete your account and associated content at any time from
          your account settings (or by contacting us).
        </p>
        <p>
          After deletion we remove or anonymize personal data within a reasonable period, except
          where we must retain certain information for legal, security, or legitimate business
          purposes.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "7. Security",
    content: (
      <>
        <p>
          We use industry-standard technical and organizational measures to protect your
          information, including encryption in transit, access controls, and regular review of our
          systems.
        </p>
        <p>
          No method of transmission or storage is completely secure. We encourage you to use a
          strong, unique password and to keep your login credentials confidential.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Rights & Choices",
    content: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data in a portable format</li>
          <li>Object to or restrict certain processing</li>
          <li>Withdraw consent where processing is based on consent</li>
        </ul>
        <p className="mt-4">
          You can exercise many of these rights directly in the product (account settings, content
          deletion). For other requests, contact us using the details below. We will respond within
          the timeframes required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "9. Children",
    content: (
      <p>
        CVSTACKED is not directed at children under 16. We do not knowingly collect personal
        information from children. If you believe a child has provided us with personal data, please
        contact us and we will take appropriate steps to delete it.
      </p>
    ),
  },
  {
    id: "international",
    title: "10. International Transfers",
    content: (
      <p>
        We may process and store information in the United States and other countries where we or
        our service providers operate. When we transfer personal data internationally we use
        appropriate safeguards, such as standard contractual clauses, where required by law.
      </p>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. We will post the revised version on
        this page and update the “Last updated” date. If changes are material we will provide
        additional notice (for example by email or an in-product message).
      </p>
    ),
  },
  {
    id: "contact",
    title: "12. Contact Us",
    content: (
      <>
        <p>
          If you have questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <p className="mt-3">
          <span className="text-muted-foreground">Email:</span>{" "}
          <a
            href="mailto:privacy@cvstacked.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            privacy@cvstacked.com
          </a>
        </p>
        <p className="mt-1">
          <span className="text-muted-foreground">Subject line:</span> Privacy Request
        </p>
      </>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PrivacyPolicyPageSection() {
  return (
    <div
      className={cn(
        fraunces.variable,
        inter.variable,
        mono.variable,
        "min-h-screen bg-background text-foreground font-(family-name:--font-body)",
      )}
    >
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
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
        <div className="mx-auto max-w-3xl">
          {/* Title block */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 text-primary">
              <Shield className="h-4 w-4" />
              <span className={cn(monoFont, "text-[11px] uppercase tracking-[0.22em]")}>
                Privacy
              </span>
            </div>

            <h1
              className={cn(
                displayFont,
                "mt-4 text-3xl tracking-tight text-foreground sm:text-4xl md:text-[2.75rem] leading-[1.15]",
              )}
            >
              Privacy Policy
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Last updated <span className={cn(monoFont, "text-foreground")}>{LAST_UPDATED}</span>
            </p>

            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              This policy describes how CVSTACKED collects, uses, and protects information when you
              use our AI resume tools and related services.
            </p>
          </motion.div>

          {/* Table of contents */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-10 rounded-2xl border border-border bg-card p-5 sm:p-6"
            aria-label="Table of contents"
          >
            <p
              className={cn(
                monoFont,
                "text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
              )}
            >
              Contents
            </p>
            <ol className="mt-4 grid gap-2 sm:grid-cols-2">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </motion.nav>

          {/* Sections */}
          <div className="mt-14 space-y-14">
            {SECTIONS.map((section, i) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.2) }}
                className="scroll-mt-24"
              >
                <h2
                  className={cn(displayFont, "text-xl sm:text-2xl tracking-tight text-foreground")}
                >
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground [&_strong]:text-foreground">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="mt-20 rounded-2xl border border-border bg-card px-6 py-10 text-center sm:px-10"
          >
            <p className={cn(monoFont, "text-[11px] uppercase tracking-[0.2em] text-primary")}>
              Questions?
            </p>
            <h3 className={cn(displayFont, "mt-3 text-xl sm:text-2xl text-foreground")}>
              We’re here to help.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Reach out anytime about privacy, data requests, or how CVSTACKED handles your
              information.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="outline" className="rounded-full">
                <a href="mailto:privacy@cvstacked.com">Contact privacy team</a>
              </Button>
              <Button asChild className="rounded-full">
                <Link href="/app">
                  Create Resume
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
