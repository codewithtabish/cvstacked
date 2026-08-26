// src/components/(app)/(common)/footer/full-footer.tsx

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { CVStackedLogo } from "@/components/brand/cv-stacked-logo";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Copyright                                                          */
/* ------------------------------------------------------------------ */

const COPYRIGHT_YEAR = "2026";

/* ------------------------------------------------------------------ */
/* Social icons                                                        */
/* ------------------------------------------------------------------ */

type IconProps = {
  className?: string;
};

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.5 21v-7.2h2.4l.4-2.8h-2.8V9.2c0-.8.2-1.4 1.4-1.4h1.5V5.3c-.3 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2.1H9.4v2.8h2.4V21" />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.7 9.6v4.8l4.3-2.4-4.3-2.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.53 2.5h3.2l-7 8 8.24 11h-6.45l-5.05-6.63L4.6 21.5H1.4l7.49-8.56L1 2.5h6.61l4.56 6.06 5.36-6.06Zm-1.12 17.02h1.77L7.66 4.38H5.76l10.65 15.14Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Social links                                                        */
/* ------------------------------------------------------------------ */

type SocialLink = {
  label: string;
  href: string;
  icon: React.ComponentType<IconProps>;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/codewithtabish",
    icon: InstagramIcon,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/codewithtabish",
    icon: FacebookIcon,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@codewithtabish",
    icon: YoutubeIcon,
  },
  {
    label: "X",
    href: "https://x.com/codewithtabish",
    icon: XIcon,
  },
];

/* ------------------------------------------------------------------ */
/* Footer navigation                                                   */
/* ------------------------------------------------------------------ */

const PRODUCT_LINKS = [
  {
    label: "Templates",
    href: "/templates",
  },
  {
    label: "AI Optimizer",
    href: "/ai-optimizer",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const COMPANY_LINKS = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Blog",
    href: "/blog",
  },
];

const LEGAL_LINKS = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms of Use",
    href: "/terms",
  },
];

/* ------------------------------------------------------------------ */
/* Footer link                                                         */
/* ------------------------------------------------------------------ */

function FooterLink({
  href,
  children,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = cn(
    "group inline-flex items-center gap-1.5",
    "text-sm text-muted-foreground",
    "transition-colors duration-200",
    "hover:text-foreground",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
  );

  const arrow = (
    <ArrowUpRight
      className="size-3.5 opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
      aria-hidden="true"
    />
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
        {arrow}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
      {arrow}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Social button                                                       */
/* ------------------------------------------------------------------ */

function SocialButton({ social }: { social: SocialLink }) {
  const Icon = social.icon;

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={social.label}
      className={cn(
        "inline-flex size-10 items-center justify-center",
        "rounded-lg border border-border",
        "text-muted-foreground",
        "transition-all duration-200",
        "hover:border-foreground",
        "hover:bg-foreground",
        "hover:text-background",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-ring",
        "focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
      )}
    >
      <Icon className="size-[18px]" />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/* Footer navigation column                                            */
/* ------------------------------------------------------------------ */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
}) {
  return (
    <div>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h2>

      <nav aria-label={title} className="mt-5 flex flex-col items-start gap-3.5">
        {links.map((link) => (
          <FooterLink key={link.href} href={link.href}>
            {link.label}
          </FooterLink>
        ))}
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export default function FullFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 lg:px-8">
        {/* ========================================================== */}
        {/* Main footer                                                 */}
        {/* ========================================================== */}

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_0.8fr_0.8fr_0.8fr] lg:gap-14 lg:py-16">
          {/* -------------------------------------------------------- */}
          {/* Brand                                                     */}
          {/* -------------------------------------------------------- */}

          <div className="max-w-[520px]">
            <Link
              href="/"
              aria-label="CVStacked — Home"
              className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <CVStackedLogo
                size="lg"
                showWordmark
                className="transition-opacity duration-200 hover:opacity-80"
              />
            </Link>

            <p className="mt-7 max-w-[500px] text-[15px] leading-7 text-muted-foreground">
              Build a professional resume faster with beautifully designed templates, intelligent
              resume tools, and everything you need to create a resume that gets noticed.
            </p>

            <p className="mt-3 max-w-[500px] text-[15px] leading-7 text-muted-foreground">
              Created and maintained by{" "}
              <a
                href="https://codewithtabish.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                CodeWithTabish
              </a>
              .
            </p>

            {/* Socials */}

            <div className="mt-7 flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <SocialButton key={social.label} social={social} />
              ))}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* Product                                                    */}
          {/* -------------------------------------------------------- */}

          <FooterColumn title="Product" links={PRODUCT_LINKS} />

          {/* -------------------------------------------------------- */}
          {/* Company                                                    */}
          {/* -------------------------------------------------------- */}

          <FooterColumn title="Company" links={COMPANY_LINKS} />

          {/* -------------------------------------------------------- */}
          {/* Legal                                                      */}
          {/* -------------------------------------------------------- */}

          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        {/* ========================================================== */}
        {/* Product highlight                                           */}
        {/* ========================================================== */}

        <div className="border-t border-border py-8">
          <div className="flex flex-col gap-5 rounded-2xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-tight">
                Create a resume you&apos;re proud to send.
              </p>

              <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                Start with a professional template and build your resume in minutes.
              </p>
            </div>

            <Link
              href="/app/templates"
              className={cn(
                "group inline-flex shrink-0 items-center justify-center gap-2",
                "rounded-lg border border-border",
                "px-4 py-2.5",
                "text-xs font-semibold",
                "text-foreground",
                "transition-all duration-200",
                "hover:bg-accent",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-ring",
                "focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background",
              )}
            >
              Explore templates
              <ArrowUpRight
                className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>

        {/* ========================================================== */}
        {/* Divider                                                      */}
        {/* ========================================================== */}

        <div className="border-t border-dashed border-border" />

        {/* ========================================================== */}
        {/* Bottom footer                                                */}
        {/* ========================================================== */}

        <div className="flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground">
              © {COPYRIGHT_YEAR} CodeWithTabish. All rights reserved.
            </p>

            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              CVStacked is a product by CodeWithTabish. All product content, trademarks, and
              third-party materials remain the property of their respective owners where applicable.
            </p>
          </div>

          <a
            href="https://codewithtabish.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Built by CodeWithTabish
            <ArrowUpRight
              className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
