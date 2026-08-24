import type { Metadata } from "next";

import ContactPageSection from "@/components/(app)/pages/contact/contact-page-section";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact the CVStacked team for resume builder support, account and billing questions, feedback, bug reports, partnerships, and general help.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageSection />;
}
