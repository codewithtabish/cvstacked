import type { Metadata } from "next";

import TemplatePageTemplates from "@/components/(app)/pages/templatespage/template-page-templatelist";

export const metadata: Metadata = {
  title: "Resume Templates",
  description:
    "Explore professional resume templates designed for modern job applications. Choose a template, customize your resume, and create a polished CV with CVStacked.",
  alternates: {
    canonical: "/templates",
  },
  openGraph: {
    title: "Resume Templates | CVStacked",
    description:
      "Explore professional resume templates and create a polished resume with CVStacked.",
    type: "website",
  },
};

export default function TemplatePage() {
  return (
    <main className="min-h-screen">
      <TemplatePageTemplates />
    </main>
  );
}
