import type { Metadata } from "next";

import AboutPageSection from "@/components/(app)/pages/about/about-section";

export const metadata: Metadata = {
  title: "About CVStacked — Better Tools for Your Career",
  description:
    "Learn why CVStacked is building clearer, more thoughtful tools for creating professional resumes and presenting your experience with confidence.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About CVStacked — Better Tools for Your Career",
    description:
      "CVStacked is building clearer, more thoughtful tools for professional career presentation.",
    type: "website",
  },
};

const AboutPage = () => <AboutPageSection />;

export default AboutPage;

// https://www.recraft.ai/
