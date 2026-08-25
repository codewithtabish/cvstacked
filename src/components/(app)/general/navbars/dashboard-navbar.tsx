"use client";

import { Bot, FileText, LayoutDashboard, Menu, Sparkles, Tag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ModeToggle } from "@/components/(app)/general/themes/mode-toggler";
import { cn } from "@/lib/utils";

import { UserButton } from "@clerk/nextjs";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/app",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "My Resumes",
    href: "/app/resumes",
    icon: FileText,
  },
  {
    label: "Templates",
    href: "/app/templates",
    icon: Tag,
  },
  {
    label: "AI Optimizer",
    href: "/app/ai-optimizer",
    icon: Bot,
  },
  {
    label: "Pricing",
    href: "/app/pricing",
    icon: Sparkles,
  },
];

function isNavItemActive(pathname: string | null, item: NavItem) {
  if (!pathname) return false;

  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function DashboardNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Brand */}
        <Link
          href="/app"
          onClick={() => setMobileOpen(false)}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="CVStacked dashboard"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-primary/8 text-sm font-bold tracking-tight text-primary transition-colors group-hover:bg-primary/12">
            CV
          </span>

          <span className="hidden text-[15px] font-semibold tracking-[-0.02em] sm:block">
            CVStacked
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Dashboard navigation" className="ml-8 hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isNavItemActive(pathname, item);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[13px] font-medium",
                  "transition-colors duration-150",
                  active
                    ? "bg-primary/8 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn("h-3.5 w-3.5", active ? "text-primary" : "text-muted-foreground")}
                  strokeWidth={1.8}
                />

                {item.label}

                {active && <span className="absolute inset-x-3 bottom-[-17px] h-px bg-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="ml-auto flex items-center gap-1.5">
          <ModeToggle />

          <div className="ml-1 hidden h-6 w-px bg-border sm:block" />

          <div className="ml-1 flex items-center">
            <UserButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((previous) => !previous)}
            className={cn(
              "ml-1 flex h-9 w-9 items-center justify-center rounded-lg lg:hidden",
              "text-muted-foreground transition-colors",
              "hover:bg-muted hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            {mobileOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "overflow-hidden border-t border-border/60 lg:hidden",
          "transition-[max-height,opacity] duration-200",
          mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 border-t-transparent opacity-0",
        )}
      >
        <nav
          aria-label="Mobile dashboard navigation"
          className="mx-auto w-full max-w-[1440px] px-4 py-3 sm:px-6"
        >
          <div className="grid gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavItemActive(pathname, item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-xl px-3.5",
                    "text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/8 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg",
                      active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>

                  {item.label}

                  {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default DashboardNavbar;
