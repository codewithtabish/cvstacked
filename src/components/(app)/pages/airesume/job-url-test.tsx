"use client";

import { Link2, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { fetchJobDescriptionFromUrl } from "@/app/actions/(airesumeoptimizer)/fetch-job-description";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const JobUrlTest = () => {
  const [url, setUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchJob = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      toast.error("Job URL required", {
        description: "Please enter a job posting URL first.",
      });
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      toast.error("Invalid URL", {
        description: "Please enter a valid job posting URL.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await fetchJobDescriptionFromUrl(trimmedUrl);

      if (!result.success) {
        toast.error("Couldn't fetch job", {
          description: result.error,
        });
        return;
      }

      // ============================================================
      // SERVER ACTION CURRENTLY RETURNS:
      //
      // {
      //   success: true,
      //   jobDescription: string
      // }
      // ============================================================

      setJobDescription(result.jobDescription);

      toast.success("Job description fetched", {
        description: "We successfully extracted the job information from the posting.",
      });
    } catch (error) {
      console.error("Job URL fetch error:", error);

      toast.error("Something went wrong", {
        description: "We couldn't process this job URL. Please try again.",
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
              onChange={(event) => setUrl(event.target.value)}
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
        />
      </div>
    </div>
  );
};

export default JobUrlTest;
