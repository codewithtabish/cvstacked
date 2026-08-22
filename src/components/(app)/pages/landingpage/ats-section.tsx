"use client";

import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { AlertCircle, Check } from "lucide-react";
import { ApplicationTracker } from "./application-tracker";

const breakdown = [
  { label: "Keyword Match", value: 94 },
  { label: "Experience Match", value: 91 },
  { label: "Skills Match", value: 89 },
  { label: "Formatting", value: 98 },
];

export function AtsSection() {
  return (
    <section id="ats" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            See how your resume performs before you apply
          </h2>
          <p className="mt-4 text-muted-foreground">
            Get a clear ATS score and concrete recommendations so you know what
            to fix.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-8"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Overall ATS Score</p>
              <div className="mt-1 text-5xl font-semibold tabular-nums">92</div>
              <p className="text-sm text-muted-foreground">/ 100</p>
            </div>

            <div className="w-full flex-1 space-y-3">
              {breakdown.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {item.value}%
                    </span>
                  </div>
                  <Progress value={item.value} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Strengths</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> Strong keyword
                  coverage
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> Relevant
                  experience
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-500" /> Clear structure
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">Suggestions</p>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Add
                  accessibility experience
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Quantify
                  two achievements
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
      {/* <AiWritingSection /> */}
      <ApplicationTracker />
    </section>
  );
}
