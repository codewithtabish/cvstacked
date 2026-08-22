"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { icon: User, label: "Personal" },
  { icon: Briefcase, label: "Experience" },
  { icon: GraduationCap, label: "Education" },
  { icon: Code2, label: "Skills" },
  { icon: FileText, label: "Projects" },
  { icon: Award, label: "Awards" },
];

const aiSuggestions = [
  "Improve this bullet",
  "Make this achievement measurable",
  "Match this job",
  "Make this summary stronger",
];

export function ResumeBuilderShowcase() {
  return (
    <section id="builder" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Build your resume without starting from a blank page
          </h2>
          <p className="mt-4 text-muted-foreground">
            A structured builder with live preview and an AI assistant that
            helps you write stronger content.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
        >
          <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/40 px-4">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
            <span className="ml-3 text-xs text-muted-foreground">
              ResumeFlow Builder
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_220px]">
            {/* Sidebar */}
            <div className="hidden border-r border-border p-3 lg:block">
              <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Sections
              </p>
              {sidebarItems.map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
                    i === 1
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="border-r border-border bg-muted/20 p-4 sm:p-6">
              <div className="mx-auto max-w-sm rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="text-sm font-semibold">Alex Rivera</div>
                <div className="text-[11px] text-muted-foreground">
                  Senior Software Engineer
                </div>
                <div className="mt-3 space-y-2 text-[10px] leading-relaxed">
                  <p>
                    Product-focused engineer with 7+ years building scalable
                    applications. Led work that reduced load times by 40%.
                  </p>
                  <div className="font-medium">Experience</div>
                  <p className="text-muted-foreground">
                    Senior Frontend Engineer · Stripe
                  </p>
                  <ul className="list-inside list-disc space-y-0.5 text-foreground/80">
                    <li>Built Next.js apps serving 2M+ users</li>
                    <li>Improved Core Web Vitals by 35%</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI panel */}
            <div className="p-3">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI Assistant
              </div>
              <div className="space-y-1.5">
                {aiSuggestions.map((s) => (
                  <button
                    key={s}
                    className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
