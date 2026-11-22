/**
 * Studio Violins' public business details, as shown on the live site (studioviolins.co.uk) on 22 Nov 2026.
 * Used by the contact section, the footer and the terms and privacy pages — change them here only.
 * Nothing here points at the old site: the terms and privacy pages are now this site's own (/terms, /privacy).
 */
export const BUSINESS = {
  name: "Studio Violins",
  whatsapp: {
    display: "07976 803533",
    href: "https://wa.me/447976803533", // WhatsApp click-to-chat for +44 7976 803533
  },
  email: "violins@studioviolins.co.uk",
  address: "23 Folly Path, Hitchin, SG4 9DU",
  directions: "https://www.google.com/maps/dir/?api=1&destination=23%20Folly%20Path%2C%20Hitchin%20SG4%209DU",
  hours: [
    { days: "Monday–Saturday", time: "9am–5pm" },
    { days: "Sunday", time: "Closed" },
  ],
  appointment: "In person, by appointment only",
  instagram: "https://www.instagram.com/studio_violins/",
};

/**
 * Where Studio Violins rents violins: confirmed by Oliver on 22 Nov 2026 for collection and courier delivery.
 * Hitchin is the only base (visits by appointment); these are areas served, not branches. "Cambridge" means the
 * city, not the wider county of Cambridgeshire. The structured data, the delivery page and the FAQ read this list,
 * so a future area is added here, once, when it's confirmed. Never list a planned area before then.
 */
export const BASE_TOWN = "Hitchin";

export const AREAS_SERVED = [
  { name: "Hertfordshire", type: "AdministrativeArea", sameAs: "https://en.wikipedia.org/wiki/Hertfordshire" },
  { name: "Bedfordshire", type: "AdministrativeArea", sameAs: "https://en.wikipedia.org/wiki/Bedfordshire" },
  { name: "Cambridge", type: "City", sameAs: "https://en.wikipedia.org/wiki/Cambridge" },
] as const;

/** "Hertfordshire, Bedfordshire and Cambridge", for running text. */
export const AREAS_TEXT = `${AREAS_SERVED.slice(0, -1).map((a) => a.name).join(", ")} and ${AREAS_SERVED[AREAS_SERVED.length - 1].name}`;

/**
 * The site's public address, used for canonical links, sharing previews, structured data and the sitemap.
 * www is the preferred form: studioviolins.co.uk (no www) redirects to www.studioviolins.co.uk (308, on Vercel).
 */
export const SITE_URL = "https://www.studioviolins.co.uk";

export const EMAIL_HREF = `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Violin rental enquiry")}`;
