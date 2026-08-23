import { Container } from "@/components/(app)/general/layouts/container-two";
import AIResumeNavbar from "@/components/(app)/general/navbars/resume-navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Alentah",
    template: "%s | Alentah",
  },
  description: "Create, optimize, and tailor professional resumes with Alentah.",
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
