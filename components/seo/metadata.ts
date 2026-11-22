import type { Metadata } from "next";
import { BUSINESS } from "@/components/site/business";
import { SHARE_IMAGE } from "./images";

/**
 * Per-page search and sharing details: title, description, canonical address, Open Graph (Facebook, WhatsApp,
 * LinkedIn…) and the X/Twitter large-image card. Next.js merges metadata shallowly, so each page passes its own
 * full set, including the share image: a page's own openGraph otherwise replaces the inherited image.
 *
 * The share image is set here explicitly, as an absolute URL. There is deliberately no app/opengraph-image.* file:
 * Next.js gives file-based images priority over this config, so one would silently replace the approved image.
 * Titles: "<what the page is> | Studio Violins", no em dashes. Google may still show its own title or snippet.
 */
const OG_IMAGE = {
  url: SHARE_IMAGE.url,
  width: SHARE_IMAGE.width,
  height: SHARE_IMAGE.height,
  alt: SHARE_IMAGE.alt,
  type: "image/jpeg",
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
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE.url, alt: OG_IMAGE.alt }],
    },
  };
}

/** The home page's title and description (also used by its WebPage structured data). */
export const HOME_SEO = {
  title: "Violin Rental in Hitchin | Studio Violins",
  description:
    "Rent a violin with personal advice from professional violinist Nick Evans-Pughe. Serving Hertfordshire, Bedfordshire and Cambridge.",
};
