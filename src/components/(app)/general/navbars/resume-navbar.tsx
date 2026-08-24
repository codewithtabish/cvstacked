"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CVStackedLogo } from "@/components/brand/cv-stacked-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../themes/mode-toggler";

const AIResumeNavbar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    {
      label: "Templates",
      href: "/templates",
    },
    {
      label: "AI Resume",
      href: "/ai-resume-optimizer",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          aria-label="CVStacked home"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <CVStackedLogo className="max-[380px]:hidden" />
          <CVStackedLogo iconOnly className="hidden max-[380px]:inline-flex" />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="ai-resume-navbar-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-muted"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <span className="relative">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Create Resume */}
          <Button
            asChild
            size="sm"
            className="group relative overflow-hidden shadow-sm transition-all hover:shadow-md max-[380px]:size-8 max-[380px]:px-0"
          >
            <Link href="/app">
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-white/10"
                whileHover={{
                  translateX: "100%",
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />

              <span className="relative flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-12" />
                <span className="max-[380px]:sr-only">Create Resume</span>
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AIResumeNavbar;
