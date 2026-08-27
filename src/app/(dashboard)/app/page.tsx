"use client";

import { ArrowRight, FileText, FolderOpen, LayoutTemplate, Plus, Sparkles } from "lucide-react";

export default function AppPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative flex flex-col gap-8 p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Resume workspace
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Build a resume that gets noticed.
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create, edits, customize, and export professional resumes from one focused
                workspace.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Create resume
            </button>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button
            type="button"
            className="group rounded-2xl border border-border/60 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Plus className="h-5 w-5" />
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <h2 className="mt-5 text-base font-semibold">Create a new resume</h2>

            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              Start from scratch and build your professional resume.
            </p>
          </button>

          <button
            type="button"
            className="group rounded-2xl border border-border/60 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LayoutTemplate className="h-5 w-5" />
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <h2 className="mt-5 text-base font-semibold">Browse templates</h2>

            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              Choose from your collection of professionally designed layouts.
            </p>
          </button>

          <button
            type="button"
            className="group rounded-2xl border border-border/60 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FolderOpen className="h-5 w-5" />
              </div>

              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </div>

            <h2 className="mt-5 text-base font-semibold">My resumes</h2>

            <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
              View, edit, duplicate, and manage all of your resumes.
            </p>
          </button>
        </section>

        {/* Recent resumes */}
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Workspace
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight">Recent resumes</h2>
            </div>

            <button
              type="button"
              className="text-sm font-medium text-primary transition-opacity hover:opacity-75"
            >
              View all
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-border/80 bg-card/50">
            <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/70 bg-background">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>

              <h3 className="mt-5 text-base font-semibold">No resumes yet</h3>

              <p className="mt-1.5 max-w-sm text-sm leading-5 text-muted-foreground">
                Create your first resume and it will appear here for quick access.
              </p>

              <button
                type="button"
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Plus className="h-4 w-4" />
                Create your first resume
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
