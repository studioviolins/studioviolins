import type { Metadata } from "next";
import { pageMetadata } from "@/components/seo/metadata";
import LegalPage from "@/components/legal/LegalPage";
import { PRIVACY } from "@/components/legal/privacy-content";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy | Studio Violins",
  description: "How Studio Violins looks after your personal information.",
});

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} slug="privacy" />;
}
