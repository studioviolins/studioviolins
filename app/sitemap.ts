import type { MetadataRoute } from "next";
import { GUIDES } from "@/components/guides/content";
import { NEW_PRICES_LIVE } from "@/components/pricing/schedule";
import { SITE_URL } from "@/components/site/business";

// When each page's content last changed. Pages that quote the price change again when the January 2027 prices
// go live (the site is rebuilt that day). Update a date when that page's wording changes.
const REVISED = "2026-11-22";
const PRICE_REVISED = NEW_PRICES_LIVE ? "2027-01-01" : REVISED;
const QUOTES_PRICE = new Set(["/", "/terms", "/starting-violin", "/for-teachers"]);

/** Every page on the site, for search engines (served at /sitemap.xml). */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...GUIDES.map((g) => g.path), "/terms", "/privacy"];
  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: QUOTES_PRICE.has(path) ? PRICE_REVISED : REVISED,
  }));
}
