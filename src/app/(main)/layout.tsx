import type { Metadata } from "next";

import { Container } from "@/components/(app)/general/layouts/container-two";
import AIResumeNavbar from "@/components/(app)/general/navbars/resume-navbar";

export const metadata: Metadata = {
  title: {
    default: "CVStacked — AI Resume Builder",
    template: "%s | CVStacked",
  },
  description:
    "Build professional resumes with CVStacked. Choose from modern resume templates, customize your CV, and optimize it with AI for the job you want.",
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AIResumeNavbar />

      <main className="w-full">
        <Container>{children}</Container>
      </main>
    </div>
  );
};

export default MainLayout;
