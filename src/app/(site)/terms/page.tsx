import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { terms } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms for using The Study Syndicate Library website and joining the library.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage title="Terms of Use" sections={terms} />;
}
