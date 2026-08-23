"use client";

import AllTemplateShow from "@/components/(app)/pages/templatespage/all-template-show";
import { Metadata } from "next";
import TemplatesHeader from "./template-header";

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
      <AllTemplateShow />
    </main>
  );
};

export default TemplatePage;
