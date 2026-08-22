import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

const CURRENT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                R
              </div>

              {siteConfig.name}
            </Link>

            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium">Product</h4>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#builder" className="hover:text-foreground">
                  Resume Builder
                </Link>
              </li>

              <li>
                <Link href="#ai-tailoring" className="hover:text-foreground">
                  AI Tailoring
                </Link>
              </li>

              <li>
                <Link href="#ats" className="hover:text-foreground">
                  ATS Analyzer
                </Link>
              </li>

              <li>
                <Link href="#templates" className="hover:text-foreground">
                  Templates
                </Link>
              </li>

              <li>
                <Link href="#cover-letters" className="hover:text-foreground">
                  Cover Letters
                </Link>
              </li>

              <li>
                <Link href="#tracker" className="hover:text-foreground">
                  Application Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Resources</h4>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/guides/resume" className="hover:text-foreground">
                  Resume Guide
                </Link>
              </li>

              <li>
                <Link href="/guides/ats" className="hover:text-foreground">
                  ATS Guide
                </Link>
              </li>

              <li>
                <Link href="/guides/career" className="hover:text-foreground">
                  Career Tips
                </Link>
              </li>

              <li>
                <Link
                  href="/guides/interview"
                  className="hover:text-foreground"
                >
                  Interview Prep
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium">Company</h4>

            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>

              <li>
                <Link href="#pricing" className="hover:text-foreground">
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {CURRENT_YEAR} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
