"use client";

import { Palette } from "lucide-react";
import { useState } from "react";

import type { ResumeData } from "@/data/resume";

import type { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import DownloadPdfButton from "../../general/buttons/download-pdf-button";
import { ResumeAppearanceDialog } from "../../general/buttons/reumse-apprance-diloag";

type ResumeTemplate = (typeof RESUME_TEMPLATES)[number];

interface SingleTemplateClientProps {
  template: ResumeTemplate;
  templateId: string;
  initialResume: ResumeData;
}

const generateRandomId = () => {
  return Math.random().toString(36).slice(2, 10);
};

const SingleTemplateClient = ({
  template,
  templateId,
  initialResume,
}: SingleTemplateClientProps) => {
  const [resume, setResume] = useState<ResumeData>(initialResume);

  const TemplateComponent = template.component;

  const firstName = resume.personal.firstName?.trim() || "resume";

  const lastName = resume.personal.lastName?.trim() || "";

  const randomId = generateRandomId();

  const fileName = [firstName, lastName, template.name, randomId]
    .filter(Boolean)
    .join("--")
    .replace(/\s+/g, "-")
    .toLowerCase();

  return (
    <main className="min-h-screen bg-muted/30 py-8">
      {/* =========================================================
          TEMPLATE HEADER
      ========================================================== */}

      <div className="mx-auto mb-6 flex w-full max-w-[1200px] items-center justify-between gap-4 px-4">
        {/* TEMPLATE INFORMATION */}

        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold tracking-tight">{template.name}</h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{template.description}</p>
        </div>

        {/* ACTIONS */}

        <div className="flex shrink-0 items-center gap-2">
          {/* APPEARANCE */}

          <ResumeAppearanceDialog resume={resume} onChange={setResume}>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
            >
              <Palette className="size-4" />

              <span className="hidden sm:inline">Change appearance</span>

              <span className="sm:hidden">Appearance</span>
            </button>
          </ResumeAppearanceDialog>

          {/* DOWNLOAD PDF */}

          <DownloadPdfButton elementId={templateId} fileName={fileName} />
        </div>
      </div>

      {/* =========================================================
          RESUME PREVIEW
      ========================================================== */}

      <div className="mx-auto w-full max-w-[1200px] overflow-x-auto px-4 pb-12">
        <div className="flex min-w-fit justify-center">
          <TemplateComponent id={templateId} resume={resume} />
        </div>
      </div>
    </main>
  );
};

export default SingleTemplateClient;
