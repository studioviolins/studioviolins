import { SITE_URL } from "@/components/site/business";

/**
 * The approved search and sharing images (Oliver, 22 Nov 2026), served from stable public URLs in public/images/.
 * Masters and the layout that produced them stay outside the site, in design/seo-share-preview-v1/ (not published).
 *
 * - SHARE_IMAGE: the branded card (original photograph of Nick, hero headline, wordmark and region line). Used as
 *   og:image and twitter:image on every page.
 * - PHOTO_IMAGE: the clean photograph with no text, byte-for-byte the image that was app/opengraph-image.jpg. Used
 *   as the home page's WebPage.primaryImageOfPage and as the business and Nick's image in the structured data.
 *   Google picks the search preview itself; this is a preference, not a guarantee.
 *
 * The old file-based route /opengraph-image.jpg redirects to SHARE_IMAGE (next.config.ts), for shares that cached it.
 */
export const SHARE_IMAGE = {
  path: "/images/studio-violins-og-1200x630.jpg",
  url: `${SITE_URL}/images/studio-violins-og-1200x630.jpg`,
  width: 1200,
  height: 630,
  alt: "Studio Violins. Rent your violin from a professional violinist. Nick Evans-Pughe playing the violin.",
};

export const PHOTO_IMAGE = {
  path: "/images/studio-violins-primary-photo-1200x630.jpg",
  url: `${SITE_URL}/images/studio-violins-primary-photo-1200x630.jpg`,
  width: 1200,
  height: 630,
  alt: "Nick Evans-Pughe playing the violin.",
};

/** The SV monogram, also used for the favicon and the web app manifest. */
export const LOGO_IMAGE = {
  url: `${SITE_URL}/icons/icon-512.png`,
  width: 512,
  height: 512,
};
