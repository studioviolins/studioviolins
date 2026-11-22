import type { Metadata } from "next";
import { pageMetadata } from "@/components/seo/metadata";
import LegalPage from "@/components/legal/LegalPage";
import { TERMS } from "@/components/legal/terms-content";

export const metadata: Metadata = pageMetadata({
  path: "/terms",
  title: "Terms & Conditions — Studio Violins",
  description: "Terms for hiring an instrument from Studio Violins.",
});

export default function TermsPage() {
  return <LegalPage doc={TERMS} slug="terms" />;
}
