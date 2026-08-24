import AppSidebar from "@/components/(app)/pages/(dashboard)/componenets/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="relative flex-1 overflow-y-auto">
        {/* Exact same ambient gradients from sidebar */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-primary/6 blur-3xl dark:bg-primary/9" />
          <div className="absolute top-1/3 -right-40 h-80 w-80 rounded-full bg-primary/[0.035] blur-3xl dark:bg-primary/6" />
          <div className="absolute bottom-0 left-0 h-64 w-full bg-linear-to-t from-primary/[0.035] to-transparent" />
        </div>

        {/* Content sits above the gradients */}
        <div className="relative z-10">
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
