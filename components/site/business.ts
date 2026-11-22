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
 * The site's public address, used for canonical links, sharing previews, structured data and the sitemap.
 * www is the current form: today studioviolins.co.uk (no www) redirects to www.studioviolins.co.uk.
 * Nick to confirm the new host keeps www (docs/launch-notes.md).
 */
export const SITE_URL = "https://www.studioviolins.co.uk";

export const EMAIL_HREF = `mailto:${BUSINESS.email}?subject=${encodeURIComponent("Violin rental enquiry")}`;
