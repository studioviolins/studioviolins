import type { Metadata } from "next";
import { DELIVERY } from "@/components/guides/content";
import GuidePage from "@/components/guides/GuidePage";
import { pageMetadata } from "@/components/seo/metadata";

export const metadata: Metadata = pageMetadata({ path: DELIVERY.path, ...DELIVERY.seo });

export default function DeliveryPage() {
  return <GuidePage guide={DELIVERY} />;
}
