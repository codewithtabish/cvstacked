import { AppContainer } from "@/components/(app)/general/layouts/app-container";
import DashboardNavbar from "@/components/(app)/general/navbars/dashboard-navbar";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | CVStacked",
    template: "%s | CVStacked",
  },

  description: "Manage your resumes and build professional CVs with CVStacked.",

  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard navigation */}
      <DashboardNavbar />

      {/* Dashboard content */}
      <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
        {/* Subtle ambient background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/4 blur-3xl dark:bg-primary/6" />

          <div className="absolute top-1/3 -right-48 h-[28rem] w-md rounded-full bg-primary/2.5r-3xl dark:bg-primary/5" />

          <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-primary/2-3xl dark:bg-primary/4" />
        </div>
        <div className="relative z-10">
          <AppContainer>{children}</AppContainer>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
