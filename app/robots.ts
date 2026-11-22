import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/site/business";

/** Served at /robots.txt: everything may be indexed, and the sitemap is listed. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
