import { notFound } from "next/navigation";

import { RESUME_TEMPLATES } from "@/components/(app)/general/templates/all-templates";
import SingleTemplateClient from "@/components/(app)/pages/templatespage/single-template-client";
import { civilEngineerResume } from "@/data/resume";

export const instant = false;

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const SingleTemplate = async ({ params }: PageProps) => {
  const { id } = await params;

  const template = RESUME_TEMPLATES.find((item) => item.id === id);

  if (!template) {
    notFound();
  }

  return (
    <SingleTemplateClient template={template} templateId={id} initialResume={civilEngineerResume} />
  );
};

export default SingleTemplate;
