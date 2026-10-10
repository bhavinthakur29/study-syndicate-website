import type { Metadata } from "next";
import { LegalPage } from "@/components/shared/legal-page";
import { privacy } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How The Study Syndicate Library collects, uses and protects your details.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" sections={privacy} />;
}
