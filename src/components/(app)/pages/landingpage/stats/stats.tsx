"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FileCheck2, Target, Star, Users } from "lucide-react";

const stats = [
  {
    icon: FileCheck2,
    value: 40000,
    suffix: "+",
    label: "Resumes Created",
    description: "Professionals trust our builder",
  },
  {
    icon: Target,
    value: 92,
    suffix: "%",
    label: "ATS Pass Rate",
    description: "Optimized for every major system",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    label: "Average Rating",
    description: "From thousands of users",
  },
  {
    icon: Users,
    value: 180,
    suffix: "+",
    label: "Countries",
    description: "Used worldwide every day",
  },
];

function AnimatedNumber({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplay(Number((eased * value).toFixed(decimals)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, decimals]);

  return (
    <span ref={ref}>
      {decimals > 0
        ? display.toFixed(decimals)
        : Math.floor(display).toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-muted/20 py-16 sm:py-20">
      {/* Soft background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,hsl(var(--primary)/0.05),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isDecimal = stat.value % 1 !== 0;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Icon */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5.5 w-5.5" />
                </div>

                {/* Number */}
                <div className="font-serif text-[2.4rem] font-semibold tracking-tight text-foreground sm:text-[2.7rem]">
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={isDecimal ? 1 : 0}
                  />
                </div>

                {/* Label */}
                <p className="mt-1.5 text-[15px] font-semibold tracking-tight">
                  {stat.label}
                </p>

                {/* Description */}
                <p className="mt-1 text-[13px] text-muted-foreground">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
