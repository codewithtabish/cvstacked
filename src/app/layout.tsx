import { ThemeProvider } from "@/components/(app)/general/themes/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";

import Footer from "@/components/(app)/pages/landingpage/footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CVStacked — AI Resume Builder",
    template: "%s | CVStacked",
  },

  description:
    "Create a professional resume with CVStacked's AI-powered resume builder. Choose a modern template, customize your resume, and optimize it for your next job.",

  applicationName: "CVStacked",

  keywords: [
    "resume builder",
    "AI resume builder",
    "resume maker",
    "CV builder",
    "CV maker",
    "resume templates",
    "AI resume optimizer",
    "resume optimizer",
    "professional resume",
  ],

  authors: [
    {
      name: "CVStacked",
    },
  ],

  creator: "CVStacked",
  publisher: "CVStacked",

  metadataBase: new URL("https://cvstacked.com"),

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    siteName: "CVStacked",
    title: "CVStacked — AI Resume Builder",
    description:
      "Create, customize, and optimize your resume with CVStacked's AI-powered resume builder.",
    url: "https://cvstacked.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "CVStacked — AI Resume Builder",
    description:
      "Create, customize, and optimize your resume with CVStacked's AI-powered resume builder.",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>{children}</TooltipProvider>

            <Toaster />
            <Footer />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
