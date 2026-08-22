"use client";

import { motion } from "framer-motion";
import { applicationStages } from "@/data/landing";
import { Badge } from "@/components/ui/badge";

const sampleApps = [
  {
    company: "Linear",
    role: "Senior Designer",
    date: "Aug 12",
    stage: "interview",
    resume: "Aurora",
  },
  {
    company: "Vercel",
    role: "Frontend Engineer",
    date: "Aug 10",
    stage: "applied",
    resume: "Vertex",
  },
  {
    company: "Stripe",
    role: "Product Engineer",
    date: "Aug 8",
    stage: "saved",
    resume: "Atlas",
  },
  {
    company: "Notion",
    role: "Design Engineer",
    date: "Aug 5",
    stage: "offer",
    resume: "Nova",
  },
];

export function ApplicationTracker() {
  return (
    <section id="tracker" className="">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {/* Keep every application moving */}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {/* Track stages, resumes used, and outcomes in one clean workspace. */}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-x-auto rounded-2xl border border-border bg-card"
        >
          <div className="flex min-w-[700px] gap-0">
            {applicationStages.map((stage) => (
              <div
                key={stage.id}
                className="flex-1 border-r border-border last:border-r-0"
              >
                <div className="border-b border-border bg-muted/30 px-3 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {stage.label}
                </div>
                <div className="space-y-2 p-2">
                  {sampleApps
                    .filter((a) => a.stage === stage.id)
                    .map((app) => (
                      <div
                        key={app.company}
                        className="rounded-lg border border-border bg-background p-3 shadow-sm"
                      >
                        <p className="text-sm font-medium">{app.company}</p>
                        <p className="text-xs text-muted-foreground">
                          {app.role}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-muted-foreground">
                            {app.date}
                          </span>
                          <Badge variant="secondary" className="text-[10px]">
                            {app.resume}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mini analytics */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Applications", value: "12" },
            { label: "Interviews", value: "4" },
            { label: "Offers", value: "2" },
            { label: "Resume views", value: "31" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <div className="text-2xl font-semibold tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
