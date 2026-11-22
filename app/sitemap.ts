import type { MetadataRoute } from "next";
import { SITE_URL } from "@/components/site/business";

/** Every page on the site, for search engines (served at /sitemap.xml). */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/terms", "/privacy"].map((path) => ({ url: new URL(path, SITE_URL).toString() }));
}
