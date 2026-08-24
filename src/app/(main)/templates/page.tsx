import AllTemplateShow from "@/components/(app)/pages/templatespage/all-template-show";
import TemplatesHeader from "@/components/(app)/pages/templatespage/template-header";
import { Metadata } from "next";

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

const TemplatePage = () => {
  return (
    <main>
      <TemplatesHeader />
      <div className="px-4 pb-12 sm:px-6 lg:px-8">
        <AllTemplateShow />
      </div>
    </main>
  );
};

export default TemplatePage;
