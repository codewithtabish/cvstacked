"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bug,
  CheckCircle2,
  CircleHelp,
  CreditCard,
  FileText,
  Lightbulb,
  LoaderCircle,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

const CONTACT_EMAIL = "tabish@codewithtabish.com";
const CONTACT_PHONE = "+92 316 900 0919";
const topics = [
  "General question",
  "Resume builder support",
  "Account help",
  "Billing & subscription",
  "Bug report",
  "Feature request",
  "Partnership",
  "Feedback",
  "Other",
];

type FormData = { name: string; email: string; subject: string; topic: string; message: string };
type FieldName = keyof FormData;
type Status = "idle" | "submitting" | "success" | "error";

const emptyForm: FormData = { name: "", email: "", subject: "", topic: "", message: "" };

function validate(form: FormData) {
  const errors: Partial<Record<FieldName, string>> = {};
  if (!form.name.trim()) errors.name = "Please enter your name.";
  if (!form.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (!form.subject.trim()) errors.subject = "Please add a subject.";
  if (!form.message.trim()) errors.message = "Please tell us how we can help.";
  else if (form.message.trim().length < 20)
    errors.message = "Please add a little more detail (at least 20 characters).";
  else if (form.message.length > 2000)
    errors.message = "Please keep your message to 2,000 characters or fewer.";
  return errors;
}

/** Replace this with the existing server action or provider when contact delivery is configured. */
async function submitContactMessage(form: FormData) {
  void form;
  throw new Error("Contact delivery has not been configured yet.");
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{children}</p>
  );
}

function Field({
  label,
  error,
  children,
  htmlFor,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactPageSection() {
  const prefersReducedMotion = useReducedMotion();
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const update = (field: FieldName, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("error");
      setStatusMessage("Please review the highlighted fields and try again.");
      return;
    }
    setStatus("submitting");
    setStatusMessage("");
    try {
      await submitContactMessage(form);
      setStatus("success");
    } catch {
      setStatus("error");
      setStatusMessage(
        "Online message delivery is not available yet. Please email us directly and we’ll be glad to help.",
      );
    }
  };

  const reveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.45 },
      };

  if (status === "success") {
    return (
      <section className="flex min-h-[70vh] items-center px-4 py-20 sm:px-6">
        <motion.div {...reveal} className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="size-8" />
          </div>
          <Eyebrow>Your message is on its way</Eyebrow>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Thanks for reaching out.
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            We’ve received your message and will follow up as soon as we can.
          </p>
          <Button
            className="mt-8"
            onClick={() => {
              setForm(emptyForm);
              setStatus("idle");
            }}
          >
            <MessageSquare data-icon="inline-start" /> Send another message
          </Button>
        </motion.div>
      </section>
    );
  }

  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-70 [background-image:linear-gradient(to_right,hsl(var(--border)/.55)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.55)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_75%_75%_at_50%_0%,black,transparent)]"
        />
        <motion.div
          aria-hidden
          animate={prefersReducedMotion ? undefined : { y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-10 left-[12%] -z-10 size-52 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          aria-hidden
          animate={prefersReducedMotion ? undefined : { y: [0, 20, 0], x: [0, -16, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-0 right-[10%] -z-10 size-64 rounded-full bg-secondary/40 blur-3xl"
        />
        <motion.div
          {...(prefersReducedMotion
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.55 },
              })}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/75 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
            <Sparkles className="size-3.5 text-primary" /> GET IN TOUCH
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Let&apos;s build something better together.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
            Whether you need a hand with your resume, have a product question, found a bug, or want
            to share an idea, the CVStacked team is here to listen.
          </p>
        </motion.div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-2">
          {[
            {
              icon: Mail,
              title: "Email us",
              description: "For product questions, feedback, or anything else.",
              value: CONTACT_EMAIL,
              href: `mailto:${CONTACT_EMAIL}`,
              action: "Send an email",
            },
            {
              icon: Phone,
              title: "Give us a call",
              description: "Prefer a direct conversation? We’re happy to hear from you.",
              value: CONTACT_PHONE,
              href: "tel:+923169000919",
              action: "Call us",
            },
          ].map((item, index) => (
            <motion.a
              {...reveal}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              key={item.title}
              href={item.href}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <ArrowRight className="mt-2 size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h2 className="mt-6 text-lg font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
              <p className="mt-5 break-all text-sm font-medium text-foreground">{item.value}</p>
              <p className="mt-3 text-sm font-medium text-primary">
                {item.action} <span aria-hidden>→</span>
              </p>
            </motion.a>
          ))}
        </div>
      </section>

      <section id="message" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <motion.div {...reveal}>
            <Eyebrow>Send a message</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tell us what&apos;s on your mind.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              Share enough context for us to understand your question. Please don&apos;t include
              payment details, passwords, or other sensitive information.
            </p>
            <div className="mt-8 space-y-4 text-sm text-muted-foreground">
              <p className="flex gap-3">
                <CircleHelp className="mt-0.5 size-4 shrink-0 text-primary" /> Product, account,
                billing, and partnership questions are all welcome.
              </p>
              <p className="flex gap-3">
                <FileText className="mt-0.5 size-4 shrink-0 text-primary" /> For resume support,
                tell us which part of the builder you were using.
              </p>
            </div>
          </motion.div>
          <motion.div {...reveal} transition={{ duration: 0.45, delay: 0.08 }}>
            <Card className="border shadow-lg shadow-primary/5">
              <CardContent className="pt-2">
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  aria-describedby={status === "error" ? "form-status" : undefined}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Name" htmlFor="contact-name" error={errors.name}>
                      <Input
                        id="contact-name"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        autoComplete="name"
                      />
                    </Field>
                    <Field label="Email" htmlFor="contact-email" error={errors.email}>
                      <Input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        autoComplete="email"
                      />
                    </Field>
                  </div>
                  <Field label="Subject" htmlFor="contact-subject" error={errors.subject}>
                    <Input
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => update("subject", e.target.value)}
                      aria-invalid={!!errors.subject}
                      aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                    />
                  </Field>
                  <Field label="Reason / topic" htmlFor="contact-topic">
                    <Select value={form.topic} onValueChange={(value) => update("topic", value)}>
                      <SelectTrigger id="contact-topic" className="h-10 w-full">
                        <SelectValue placeholder="Choose a topic (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic} value={topic}>
                            {topic}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Message" htmlFor="contact-message" error={errors.message}>
                    <Textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? "contact-message-error" : "message-hint"}
                      className="min-h-36 resize-y"
                      maxLength={2000}
                    />
                    <div
                      id="message-hint"
                      className="flex justify-between text-xs text-muted-foreground"
                    >
                      <span>At least 20 characters</span>
                      <span>{form.message.length}/2,000</span>
                    </div>
                  </Field>
                  {status === "error" && (
                    <p
                      id="form-status"
                      role="alert"
                      className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive"
                    >
                      {statusMessage}{" "}
                      {statusMessage.includes("delivery") && (
                        <a
                          href={`mailto:${CONTACT_EMAIL}`}
                          className="font-medium underline underline-offset-2"
                        >
                          Email us instead
                        </a>
                      )}
                      .
                    </p>
                  )}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? (
                      <LoaderCircle data-icon="inline-start" className="animate-spin" />
                    ) : (
                      <Send data-icon="inline-start" />
                    )}{" "}
                    {status === "submitting" ? "Preparing message…" : "Send message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="border-y bg-muted/35 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <Eyebrow>Quick help</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              The right starting point for every question.
            </h2>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: CircleHelp,
                title: "Product support",
                copy: "Need help using the resume builder?",
                cta: "Get help",
              },
              {
                icon: CreditCard,
                title: "Billing",
                copy: "Questions about subscriptions or payments?",
                cta: "Contact billing",
              },
              {
                icon: Lightbulb,
                title: "Feedback",
                copy: "Have an idea that could improve CVStacked?",
                cta: "Share feedback",
              },
              {
                icon: Bug,
                title: "Bug report",
                copy: "Something not working as expected?",
                cta: "Report an issue",
              },
            ].map((item, index) => (
              <motion.a
                {...reveal}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                key={item.title}
                href="#message"
                className="rounded-xl border bg-background p-5 transition-colors hover:border-primary/35 hover:bg-card focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <item.icon className="size-5 text-primary" />
                <h3 className="mt-5 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {item.cta} <ArrowRight className="size-3.5" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
          <motion.div {...reveal}>
            <Eyebrow>Helpful answers</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A few things you might be wondering.
            </h2>
            <p className="mt-5 max-w-md leading-7 text-muted-foreground">
              Can&apos;t find what you need? Send us a message—every question helps us make the
              product more useful.
            </p>
          </motion.div>
          <motion.div {...reveal} transition={{ duration: 0.45, delay: 0.08 }}>
            <Accordion type="single" collapsible className="rounded-xl border bg-card px-5">
              {[
                [
                  "How can I get help with my resume?",
                  "Choose Resume builder support in the form and explain what you were working on. Screenshots and a clear description can help us understand the issue.",
                ],
                [
                  "Can I contact you about billing?",
                  "Yes. Select Billing & subscription, but please never include card numbers, CVV codes, passwords, or other sensitive payment details.",
                ],
                [
                  "How do I report a bug?",
                  "Tell us what happened, what you expected to happen, and the steps that led there. Your browser and device can also be useful context.",
                ],
                [
                  "Can I suggest a new feature?",
                  "Absolutely. Tell us about the problem you are trying to solve and how the feature would make your workflow better.",
                ],
                [
                  "Can I ask about partnerships?",
                  "Yes—choose Partnership or send an email with a concise overview of your idea.",
                ],
                [
                  "What should I include when contacting support?",
                  "A clear subject, a description of the issue, and relevant context such as the resume action you were taking will help us respond thoughtfully.",
                ],
              ].map(([question, answer], index) => (
                <AccordionItem key={question} value={`faq-${index}`}>
                  <AccordionTrigger className="py-4 text-base no-underline hover:no-underline">
                    {question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-6 text-muted-foreground">
                    {answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-12">
        <motion.div
          {...reveal}
          className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border bg-primary px-6 py-14 text-primary-foreground sm:px-12 sm:py-20"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:20px_20px]"
          />
          <div className="relative max-w-2xl">
            <Eyebrow>Built for momentum</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Tools that make professional opportunities easier to pursue.
            </h2>
            <p className="mt-5 leading-7 text-primary-foreground/80">
              CVStacked helps people create stronger, more professional resumes and present their
              experience with confidence.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="px-4 py-20 text-center sm:px-6 sm:py-28">
        <motion.div {...reveal} className="mx-auto max-w-2xl">
          <Eyebrow>We&apos;re listening</Eyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
            Have a question? We&apos;re here.
          </h2>
          <p className="mt-5 text-base leading-7 text-muted-foreground">
            Whether you found a bug, have an idea, or simply need a hand, we&apos;d love to hear
            from you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href="#message">
                <MessageSquare data-icon="inline-start" /> Send us a message
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/app">
                Explore the resume builder <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
