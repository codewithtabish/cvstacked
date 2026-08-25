"use client";

import { useClerk } from "@clerk/nextjs";

export default function AppPage() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: "/" });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      {/* <TemplateThree resume={seniorSoftwareEngineerResume} /> */}
      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Sign out
      </button>
    </main>
  );
}
