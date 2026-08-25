import * as React from "react";

import { cn } from "@/lib/utils";

interface AppContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AppContainer({ children, className, ...props }: AppContainerProps) {
  return (
    <div
      className={cn("py-6", "sm:py-8", "md:py-10", "lg:py-12", "xl:py-14", "2xl:py-16", className)}
      {...props}
    >
      {children}
    </div>
  );
}
