"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Alexander Morgan",
    role: "Senior Software Engineer",
    company: "Northstar Technologies",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The AI completely transformed my resume. Weak bullets became strong achievements and I started getting interview calls within a week.",
  },
  {
    id: 2,
    name: "Sophia Anderson",
    role: "Internal Medicine Physician",
    company: "New York Medical Center",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "I was struggling to highlight my clinical experience properly. This tool made everything clear, professional, and ATS-friendly in minutes.",
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Senior Product Designer",
    company: "Nova Labs",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "The templates are beautiful and the AI rewriting is surprisingly good. My portfolio resume finally looks as polished as my design work.",
  },
  {
    id: 4,
    name: "Daniel Richardson",
    role: "Senior Civil Engineer",
    company: "AEC Infrastructure Group",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "I uploaded my old resume and the AI detected every weak section. The before-and-after difference was night and day.",
  },
  {
    id: 5,
    name: "Olivia Thompson",
    role: "Senior Marketing Manager",
    company: "CloudPeak",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    text: "Best resume tool I’ve used. The job description tailoring feature helped me customize my resume for each application effortlessly.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  // Auto cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,hsl(var(--primary)/0.06),transparent_65%)]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-primary/5 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-primary/5 blur-[110px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Left content */}
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground"
            >
              Testimonials
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-serif text-[2.2rem] leading-[1.15] tracking-tight sm:text-[2.6rem] lg:text-[2.9rem]"
            >
              Trusted by professionals{" "}
              <span className="text-primary">around the world</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-5 text-[1.05rem] leading-relaxed text-muted-foreground"
            >
              Join thousands of job seekers who transformed their resumes and
              started landing more interviews with our AI-powered builder.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mt-10 flex flex-wrap gap-10"
            >
              <div>
                <p className="font-serif text-[1.75rem] font-semibold tracking-tight">
                  40k+
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Resumes created
                </p>
              </div>
              <div>
                <p className="font-serif text-[1.75rem] font-semibold tracking-tight">
                  4.9
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Average rating
                </p>
              </div>
              <div>
                <p className="font-serif text-[1.75rem] font-semibold tracking-tight">
                  92%
                </p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  ATS pass rate
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right – Stacked Cards */}
          <div className="relative mx-auto w-full max-w-[420px] lg:mx-0">
            <div className="relative h-[320px] sm:h-[340px]">
              {testimonials.map((t, index) => {
                const total = testimonials.length;
                const offset = (index - active + total) % total;

                // Show only top 3 cards in the stack
                if (offset > 2) return null;

                return (
                  <motion.div
                    key={t.id}
                    className="absolute inset-x-0 top-0"
                    style={{ zIndex: 30 - offset }}
                    animate={{
                      scale: 1 - offset * 0.04,
                      y: offset * 14,
                      x: offset * 8,
                      rotate: offset === 0 ? 0 : offset === 1 ? -1.8 : 1.8,
                      opacity: offset === 0 ? 1 : offset === 1 ? 0.85 : 0.65,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 28,
                    }}
                  >
                    <div className="rounded-2xl border border-border bg-background p-6 shadow-2xl">
                      {/* Author */}
                      <div className="mb-4 flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-border"
                        />
                        <div>
                          <p className="text-[14.5px] font-semibold tracking-tight">
                            {t.name}
                          </p>
                          <p className="text-[12.5px] text-muted-foreground">
                            {t.role} · {t.company}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="mb-3 flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < t.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-[14.5px] leading-relaxed text-foreground">
                        “{t.text}”
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Dots only */}
            <div className="mt-8 flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
