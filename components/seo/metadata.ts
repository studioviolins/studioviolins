import type { Metadata } from "next";
import { BUSINESS } from "@/components/site/business";

/**
 * Per-page search and sharing details: canonical address, Open Graph (Facebook, WhatsApp, LinkedIn…) and the
 * X/Twitter large-image card. Next.js merges metadata shallowly, so each page passes its own full set,
 * including the share image: a page's own openGraph otherwise replaces the inherited image.
 */

/** app/opengraph-image.jpg: 1200×630, cropped and resized from the original hero photograph (no other edits). */
const SHARE_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Nick Evans-Pughe playing the violin", // same as app/opengraph-image.alt.txt
};

export function pageMetadata({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_GB",
      siteName: BUSINESS.name,
      url: path,
      title,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SHARE_IMAGE],
    },
  };
}
