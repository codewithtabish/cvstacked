import type { Metadata } from "next";

import { LandingPage } from "@/components/(app)/pages/landingpage/landingpage";

export const metadata: Metadata = {
  title: "CVStacked — AI Resume Builder",
  description:
    "Build a professional resume with CVStacked. Choose a modern template, customize your resume, and use AI to optimize it for the job you want.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CVStacked — AI Resume Builder",
    description:
      "Create, customize, and optimize a professional resume with CVStacked's AI-powered resume builder.",
    type: "website",
  },
};

const HomePage = () => {
  return (
    <div>
      <LandingPage />
    </div>
  );
};

export default HomePage;
