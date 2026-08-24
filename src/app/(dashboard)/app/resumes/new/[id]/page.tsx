import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import { seniorSoftwareEngineerResume } from "@/data/resume";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const instant = false;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

  const template = RESUME_TEMPLATES.find((template) => template.id === id);

  if (!template) {
    notFound();
  }

  const TemplateComponent = template.component;

  return (
    <main className="min-h-screen">
      <TemplateComponent resume={seniorSoftwareEngineerResume} id={id} />
    </main>
  );
}
