import type { Metadata } from "next";

import AiResumeOptimizer from "@/components/(app)/pages/airesume/ai-resume-optimizer";

export const metadata: Metadata = {
  title: "AI Resume Optimizer",
  description:
    "Optimize your resume for any job with CVStacked. Upload your resume, add a job description or job URL, and use AI to tailor your resume to the role.",
  alternates: {
    canonical: "/ai-resume-optimizer",
  },
  openGraph: {
    title: "AI Resume Optimizer | CVStacked",
    description:
      "Tailor your resume to any job with CVStacked's AI-powered resume optimizer. Match your resume with job requirements and improve your chances of getting noticed.",
    type: "website",
  },
};

const Page = () => {
  return <AiResumeOptimizer />;
};

export default Page;
