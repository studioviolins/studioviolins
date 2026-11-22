import { BUSINESS, SITE_URL } from "@/components/site/business";

/**
 * Structured data for search engines: who and where Studio Violins is. Only published facts from BUSINESS.
 * Deliberately left out until Nick confirms them: a telephone number (the number is shown as WhatsApp only),
 * review ratings, prices and the area served. See docs/launch-notes.md.
 */
const [streetAddress, addressLocality, postalCode] = BUSINESS.address.split(", ");

const DATA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: BUSINESS.name,
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/opengraph-image.jpg`,
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    postalCode,
    addressCountry: "GB",
  },
  // Matches BUSINESS.hours (Monday–Saturday 9am–5pm, Sunday closed). Visits are by appointment.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: [BUSINESS.instagram],
};

export default function BusinessJsonLd() {
  return (
    <script
      type="application/ld+json"
      // Escaping "<" keeps the JSON from ever closing the script tag early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(DATA).replace(/</g, "\\u003c") }}
    />
  );
}
