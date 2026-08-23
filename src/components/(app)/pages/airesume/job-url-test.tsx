"use client";

import { CheckCircle2, Edit3, Eye, Link2, Loader2, Sparkles } from "lucide-react";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { fetchJobDescriptionFromUrl } from "@/app/actions/(airesumeoptimizer)/fetch-job-description";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FetchStatus = "idle" | "loading" | "success" | "error";
type ViewMode = "preview" | "edit";

const JobUrlTest = () => {
  const [url, setUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState<FetchStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const [viewMode, setViewMode] = useState<ViewMode>("preview");

  const handleFetchJob = async () => {
    const trimmedUrl = url.trim();

    // ------------------------------------------------------------
    // Validate empty URL
    // ------------------------------------------------------------

    if (!trimmedUrl) {
      setStatus("error");
      setStatusMessage("Please enter a job posting URL first.");

      toast.error("Job URL required", {
        description: "Please enter a job posting URL first.",
      });

      return;
    }

    // ------------------------------------------------------------
    // Validate URL format
    // ------------------------------------------------------------

    try {
      const parsedUrl = new URL(trimmedUrl);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setStatus("error");
      setStatusMessage(
        "That doesn't look like a valid job posting URL. Please check the link and try again.",
      );

      toast.error("Invalid URL", {
        description: "Please enter a valid HTTP or HTTPS job posting URL.",
      });

      return;
    }

    // ------------------------------------------------------------
    // Start loading
    // ------------------------------------------------------------

    setIsLoading(true);
    setStatus("loading");
    setStatusMessage("Fetching the job posting and extracting the relevant details...");

    // ------------------------------------------------------------
    // Clear previous result
    // ------------------------------------------------------------

    setJobDescription("");
    setViewMode("preview");

    try {
      const result = await fetchJobDescriptionFromUrl(trimmedUrl);

      // ----------------------------------------------------------
      // Server action returned an error
      // ----------------------------------------------------------

      if (!result.success) {
        const message = result.error || "We couldn't extract the job details from this posting.";

        setStatus("error");
        setStatusMessage(message);

        toast.error("Couldn't fetch job", {
          description: message,
        });

        return;
      }

      // ----------------------------------------------------------
      // Validate returned description
      // ----------------------------------------------------------

      const description = result.jobDescription?.trim();

      if (!description) {
        const message = "The job posting was fetched, but no job description was returned.";

        setStatus("error");
        setStatusMessage(message);

        toast.error("Empty job description", {
          description: message,
        });

        return;
      }

      // ----------------------------------------------------------
      // Success
      // ----------------------------------------------------------

      setJobDescription(description);
      setStatus("success");

      setStatusMessage(
        "Job details were successfully extracted. Review the formatted content below.",
      );

      setViewMode("preview");

      toast.success("Job description fetched", {
        description: "We successfully extracted the job information from the posting.",
      });
    } catch (error) {
      console.error("Job URL fetch error:", error);

      const message =
        "We couldn't process this job URL. The posting may be unavailable, protected, or unsupported.";

      setStatus("error");
      setStatusMessage(message);

      toast.error("Something went wrong", {
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------------------------
  // Change URL
  // ------------------------------------------------------------

  const handleUrlChange = (value: string) => {
    setUrl(value);

    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------

  return (
    <div className="w-full space-y-6">
      {/* ============================================================
          URL INPUT
      ============================================================ */}

      <div className="space-y-2">
        <label htmlFor="job-url" className="text-sm font-medium">
          Job posting URL
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="job-url"
              type="url"
              value={url}
              onChange={(event) => handleUrlChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !isLoading) {
                  event.preventDefault();
                  void handleFetchJob();
                }
              }}
              placeholder="https://example.com/jobs/software-engineer"
              className="h-11 pl-9"
              disabled={isLoading}
            />
          </div>

          <Button
            type="button"
            onClick={handleFetchJob}
            disabled={isLoading || !url.trim()}
            className="h-11 gap-2 sm:px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Fetching...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Fetch Job
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Paste a public job posting URL and we&apos;ll extract the job details for you.
        </p>
      </div>

      {/* ============================================================
          STATUS
      ============================================================ */}

      {status !== "idle" && statusMessage && (
        <div
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
          className={[
            "rounded-xl border px-4 py-3 text-sm",
            status === "loading" ? "border-border bg-muted/40 text-muted-foreground" : "",
            status === "success"
              ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
              : "",
            status === "error" ? "border-destructive/20 bg-destructive/5 text-destructive" : "",
          ].join(" ")}
        >
          <div className="flex items-start gap-3">
            {status === "loading" && <Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />}

            {status === "success" && <CheckCircle2 className="mt-0.5 size-4 shrink-0" />}

            {status === "error" && (
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                !
              </span>
            )}

            <div className="min-w-0">
              <p className="font-medium">
                {status === "loading" && "Processing job posting"}
                {status === "success" && "Job posting ready"}
                {status === "error" && "Unable to fetch job"}
              </p>

              <p className="mt-0.5 text-xs opacity-90">{statusMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          JOB DESCRIPTION
      ============================================================ */}

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label className="text-sm font-medium">Job description</label>

            {jobDescription && (
              <p className="mt-1 text-xs text-muted-foreground">
                Review the extracted job information before optimizing your resume.
              </p>
            )}
          </div>

          {jobDescription && (
            <div className="flex items-center gap-1 rounded-lg border bg-muted/30 p-1">
              <Button
                type="button"
                size="sm"
                variant={viewMode === "preview" ? "secondary" : "ghost"}
                onClick={() => setViewMode("preview")}
                className="h-8 gap-2 text-xs"
              >
                <Eye className="size-3.5" />
                Preview
              </Button>

              <Button
                type="button"
                size="sm"
                variant={viewMode === "edit" ? "secondary" : "ghost"}
                onClick={() => setViewMode("edit")}
                className="h-8 gap-2 text-xs"
              >
                <Edit3 className="size-3.5" />
                Edit
              </Button>
            </div>
          )}
        </div>

        {/* ==========================================================
            PREVIEW
        =========================================================== */}

        {viewMode === "preview" && jobDescription && (
          <div className="rounded-xl border bg-background px-5 py-6 shadow-sm sm:px-7 sm:py-8">
            <article
              className="
                max-w-none
                text-sm
                leading-7
                text-foreground

                [&_h1]:mb-5
                [&_h1]:text-2xl
                [&_h1]:font-semibold
                [&_h1]:tracking-tight
                [&_h1]:text-foreground

                [&_h2]:mb-3
                [&_h2]:mt-8
                [&_h2]:text-lg
                [&_h2]:font-semibold
                [&_h2]:tracking-tight
                [&_h2]:text-foreground

                [&_h3]:mb-2
                [&_h3]:mt-6
                [&_h3]:text-base
                [&_h3]:font-semibold
                [&_h3]:text-foreground

                [&_p]:mb-4
                [&_p]:leading-7
                [&_p]:text-muted-foreground

                [&_strong]:font-semibold
                [&_strong]:text-foreground

                [&_ul]:mb-5
                [&_ul]:ml-5
                [&_ul]:list-disc
                [&_ul]:space-y-2

                [&_ol]:mb-5
                [&_ol]:ml-5
                [&_ol]:list-decimal
                [&_ol]:space-y-2

                [&_li]:pl-1
                [&_li]:leading-7
                [&_li]:text-muted-foreground

                [&_a]:text-primary
                [&_a]:underline
                [&_a]:underline-offset-4

                [&_code]:rounded
                [&_code]:bg-muted
                [&_code]:px-1.5
                [&_code]:py-0.5
                [&_code]:text-[0.85em]
              "
            >
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                }}
              >
                {jobDescription}
              </ReactMarkdown>
            </article>
          </div>
        )}

        {/* ==========================================================
            EMPTY STATE
        =========================================================== */}

        {!jobDescription && !isLoading && (
          <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl border bg-background shadow-sm">
                <Sparkles className="size-5 text-muted-foreground" />
              </div>

              <p className="text-sm font-medium">No job description yet</p>

              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Paste a job posting URL above and click{" "}
                <span className="font-medium text-foreground">Fetch Job</span> to extract the job
                information.
              </p>
            </div>
          </div>
        )}

        {/* ==========================================================
            EDITOR
        =========================================================== */}

        {viewMode === "edit" && jobDescription && (
          <div className="space-y-2">
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="The extracted job description will appear here..."
              className="min-h-[520px] resize-y font-mono text-[13px] leading-6"
              disabled={isLoading}
            />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Markdown supported</span>

              <span>{jobDescription.length.toLocaleString()} characters</span>
            </div>
          </div>
        )}

        {/* ==========================================================
            HELPER TEXT
        =========================================================== */}

        {viewMode === "preview" && jobDescription && (
          <p className="text-xs text-muted-foreground">
            Markdown formatting is rendered automatically. Switch to{" "}
            <span className="font-medium text-foreground">Edit</span> if you want to modify the
            extracted job description.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobUrlTest;
