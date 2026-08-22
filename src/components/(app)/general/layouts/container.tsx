import { cn } from "@/lib/utils";
import * as React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ContainerTwo({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-360",
        "px-4 sm:px-5 md:px-6  ",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
