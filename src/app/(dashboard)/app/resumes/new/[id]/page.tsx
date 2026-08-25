import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import { ResumeEditor } from "@/components/(app)/pages/(dashboard)/componenets/resumeeditor/resume-editor";

import { emptyResume } from "@/data/resume";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * The resume editor depends on the dynamic route parameter.
 * Allow this route to use runtime data instead of requiring
 * params to be available during prerendering.
 */
export const instant = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  const template = RESUME_TEMPLATES.find((template) => template.id === id);

  if (!template) {
    return {
      title: "Resume Editor | CVSTACKED",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Edit ${template.name} Resume | CVSTACKED`,
    description: `Create and customize your resume using the ${template.name} template on CVSTACKED.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ResumeEditorPage({ params }: PageProps) {
  const { id } = await params;

  /**
   * Make sure the requested template actually exists.
   */
  const template = RESUME_TEMPLATES.find((template) => template.id === id);

  if (!template) {
    notFound();
  }

  /**
   * IMPORTANT:
   *
   * Start every NEW resume with empty user content.
   *
   * We intentionally DO NOT use:
   *
   * seniorSoftwareEngineerResume
   *
   * because that is demo/sample resume data.
   *
   * emptyResume already contains:
   *
   * - empty personal information
   * - empty summary
   * - empty experience
   * - empty education
   * - empty skills
   * - empty projects
   * - empty certifications
   * - empty languages
   * - empty awards
   * - empty publications
   * - empty volunteer
   * - empty references
   * - empty interests
   * - empty custom sections
   *
   * while still having the default design settings:
   *
   * - themeId
   * - fontFamilyId
   * - typographyScale
   */
  const initialResume = {
    ...emptyResume,

    /**
     * The template selected by the user.
     */
    templateId: id,

    /**
     * Give each newly-created resume its own ID.
     *
     * This prevents every new resume from sharing
     * the same "new-resume" ID.
     */
    id: crypto.randomUUID(),

    /**
     * Keep the title clean for a new resume.
     */
    title: "My Resume",
  };

  return <ResumeEditor initialResume={initialResume} templateId={id} />;
}
