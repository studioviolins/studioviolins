import type { Metadata } from "next";
import { STARTING_VIOLIN } from "@/components/guides/content";
import GuidePage from "@/components/guides/GuidePage";
import { pageMetadata } from "@/components/seo/metadata";

export const metadata: Metadata = pageMetadata({ path: STARTING_VIOLIN.path, ...STARTING_VIOLIN.seo });

export default function StartingViolinPage() {
  return <GuidePage guide={STARTING_VIOLIN} />;
}
