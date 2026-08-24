import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("mx-auto w-full max-w-7xl px-0", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-6 bg-gold" />
      <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 font-display text-3xl leading-[1.1] tracking-tight text-balance md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground md:text-lg">{description}</p>
      )}
    </div>
  );
}
