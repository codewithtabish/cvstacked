"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // if you have cn helper, otherwise remove
import type { ResumeData } from "@/data/resume";
import Hero from "./hero-section";
import HeroFormGenerate from "./hero-form-generate";

// Import both Heroes

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------
interface HeroToggleProps {
  resume: ResumeData;
}

// ---------------------------------------------------------
// Toggle Hero
// ---------------------------------------------------------
export default function HeroToggle({ resume }: HeroToggleProps) {
  const [active, setActive] = useState<"ai" | "form">("ai");

  return (
    <div className="relative">
      {/* Toggle Control */}
      <div className="absolute left-1/2 top-6 z-50 -translate-x-1/2 sm:top-8">
        <div className="flex items-center gap-1 rounded-full border border-border bg-background/80 p-1 shadow-lg backdrop-blur-md">
          <button
            onClick={() => setActive("ai")}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-all sm:px-5 sm:py-2",
              active === "ai"
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active === "ai" && (
              <motion.div
                layoutId="hero-toggle"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">AI Optimize</span>
          </button>

          <button
            onClick={() => setActive("form")}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-[13px] font-medium transition-all sm:px-5 sm:py-2",
              active === "form"
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active === "form" && (
              <motion.div
                layoutId="hero-toggle"
                className="absolute inset-0 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Fill Form</span>
          </button>
        </div>
      </div>

      {/* Heroes */}
      <AnimatePresence mode="wait">
        {active === "ai" ? (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <Hero resume={resume} />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <HeroFormGenerate resume={resume} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
