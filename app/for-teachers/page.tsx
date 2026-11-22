import type { Metadata } from "next";
import { FOR_TEACHERS } from "@/components/guides/content";
import GuidePage from "@/components/guides/GuidePage";
import { pageMetadata } from "@/components/seo/metadata";

export const metadata: Metadata = pageMetadata({ path: FOR_TEACHERS.path, ...FOR_TEACHERS.seo });

export default function ForTeachersPage() {
  return <GuidePage guide={FOR_TEACHERS} />;
}
