"use client";

import { Link2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { fetchJobDescriptionFromUrl } from "@/app/actions/(airesumeoptimizer)/fetch-job-description";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type FetchStatus = "idle" | "loading" | "success" | "error";

const JobUrlTest = () => {
  const [url, setUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

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
      // Success
      // ----------------------------------------------------------

      setJobDescription(result.jobDescription);
      setStatus("success");
      setStatusMessage(
        "Job details were successfully extracted. You can review and edit them below.",
      );

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
              onChange={(event) => {
                setUrl(event.target.value);

                if (status !== "idle") {
                  setStatus("idle");
                  setStatusMessage("");
                }
              }}
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

            {status === "success" && <Sparkles className="mt-0.5 size-4 shrink-0" />}

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

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="job-description" className="text-sm font-medium">
            Job description
          </label>

          {jobDescription && <span className="text-xs text-muted-foreground">Editable</span>}
        </div>

        <Textarea
          id="job-description"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="The extracted job description will appear here..."
          className="min-h-[420px] resize-y leading-6"
          disabled={isLoading}
        />

        {jobDescription && (
          <p className="text-xs text-muted-foreground">
            Review the extracted information and make any changes before continuing to optimize your
            resume.
          </p>
        )}
      </div>
    </div>
  );
};

export default JobUrlTest;
