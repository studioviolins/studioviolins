import { NICK } from "@/components/hero/content";
import { NEW_PRICES_LIVE } from "@/components/pricing/content";
import { AREAS_SERVED, BUSINESS, SITE_URL } from "@/components/site/business";
import { HOME_SEO } from "./metadata";
import { LOGO_IMAGE, PHOTO_IMAGE } from "./images";

/**
 * Structured data (schema.org JSON-LD) for search and AI systems: one connected graph with stable @ids, so every
 * page refers to the same business, person, service and website instead of repeating them.
 *
 * Only published, confirmed facts, each visible on the site:
 *   - Studio Violins: the Hitchin address (visits by appointment), opening hours, email and the WhatsApp chat link,
 *     Instagram. No telephone number (the number is published as WhatsApp only), no review ratings (the visible
 *     testimonials stay as they are; self-serving review markup isn't eligible), no stock or product offers.
 *   - Violin rental: provided by Studio Violins in Hertfordshire, Bedfordshire and Cambridge (the city), confirmed by
 *     Oliver on 22 Nov 2026. Its price follows the same date switch as the pricing section (components/pricing),
 *     so the markup and the page always agree: a rental (LeaseOut), never a sale.
 *   - Nick Evans-Pughe: professional violinist and teacher, Associate of the Royal Academy of Music (ARAM, an honour
 *     to him personally, not the Academy endorsing the business), 30+ years in the violin business.
 * Not included until confirmed: awards, specific instrument models, delivery prices or times.
 */
export const IDS = {
  website: `${SITE_URL}/#website`,
  business: `${SITE_URL}/#business`,
  nick: `${SITE_URL}/#nick`,
  rental: `${SITE_URL}/#violin-rental`,
  photo: `${SITE_URL}/#primaryimage`,
  logo: `${SITE_URL}/#logo`,
};

const [streetAddress, addressLocality, postalCode] = BUSINESS.address.split(", ");

const photo = {
  "@type": "ImageObject",
  "@id": IDS.photo,
  url: PHOTO_IMAGE.url,
  contentUrl: PHOTO_IMAGE.url,
  width: PHOTO_IMAGE.width,
  height: PHOTO_IMAGE.height,
  caption: PHOTO_IMAGE.alt.replace(/\.$/, ""),
};

const website = {
  "@type": "WebSite",
  "@id": IDS.website,
  url: `${SITE_URL}/`,
  name: BUSINESS.name,
  inLanguage: "en-GB",
  publisher: { "@id": IDS.business },
};

const business = {
  "@type": "LocalBusiness",
  "@id": IDS.business,
  name: BUSINESS.name,
  description: "Violin rental from a professional violinist, based in Hitchin and serving Hertfordshire, Bedfordshire and Cambridge.",
  url: `${SITE_URL}/`,
  logo: { "@type": "ImageObject", "@id": IDS.logo, url: LOGO_IMAGE.url, width: LOGO_IMAGE.width, height: LOGO_IMAGE.height },
  image: { "@id": IDS.photo },
  email: BUSINESS.email,
  address: {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality,
    addressRegion: "Hertfordshire",
    postalCode,
    addressCountry: "GB",
  },
  // Matches BUSINESS.hours (Monday to Saturday 9am to 5pm, Sunday closed). Visits are by appointment.
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer enquiries",
    email: BUSINESS.email,
    url: BUSINESS.whatsapp.href, // WhatsApp chat; not a telephone line
    availableLanguage: "en-GB",
  },
  makesOffer: { "@id": `${IDS.rental}-offer` },
  sameAs: [BUSINESS.instagram],
};

const rentalOffer = {
  "@type": "Offer",
  "@id": `${IDS.rental}-offer`,
  itemOffered: { "@id": IDS.rental },
  businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
  priceCurrency: "GBP",
  price: NEW_PRICES_LIVE ? "56.00" : "65.00",
  description: NEW_PRICES_LIVE
    ? "£56 upfront covers the first four months, with no joining fee. From month five, £14 a month by direct debit. Four months is the minimum rental period."
    : "£65 upfront covers the first four months and the one-off subscription fee. From month five, £10 a month by direct debit. Four months is the minimum rental period.",
  priceSpecification: [
    {
      "@type": "PriceSpecification",
      name: "Upfront payment for the first four months",
      price: NEW_PRICES_LIVE ? "56.00" : "65.00",
      priceCurrency: "GBP",
    },
    {
      "@type": "UnitPriceSpecification",
      name: "Monthly payment from month five",
      price: NEW_PRICES_LIVE ? "14.00" : "10.00",
      priceCurrency: "GBP",
      unitCode: "MON",
      unitText: "month",
    },
  ],
  areaServed: AREAS_SERVED.map(areaNode),
  offeredBy: { "@id": IDS.business },
};

const rental = {
  "@type": "Service",
  "@id": IDS.rental,
  name: "Violin rental",
  serviceType: "Violin rental",
  description:
    "Rental of a carefully prepared violin outfit (violin, bow, case, shoulder rest and rosin), with advice on sizing, care and set-up throughout the rental. Free collection in Hitchin by appointment, or courier delivery (charged).",
  provider: { "@id": IDS.business },
  areaServed: AREAS_SERVED.map(areaNode),
  offers: { "@id": `${IDS.rental}-offer` },
};

const nick = {
  "@type": "Person",
  "@id": IDS.nick,
  name: NICK.name,
  jobTitle: "Professional violinist and teacher",
  honorificSuffix: "ARAM",
  description:
    "Professional violinist and teacher, Associate of the Royal Academy of Music, with over 30 years’ experience in the violin business.",
  image: { "@id": IDS.photo },
  worksFor: { "@id": IDS.business },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    name: "Associate of the Royal Academy of Music (ARAM)",
    credentialCategory: "Honorary title",
    recognizedBy: { "@type": "CollegeOrUniversity", name: "Royal Academy of Music", url: "https://www.ram.ac.uk/" },
  },
};

function areaNode(area: (typeof AREAS_SERVED)[number]) {
  return { "@type": area.type, name: area.name, ...(area.sameAs ? { sameAs: area.sameAs } : {}) };
}

/** A WebPage node for one page of the site, tied to the shared website and business. */
export function webPageNode({
  path,
  title,
  description,
  primaryImage = false,
}: {
  path: string;
  title: string;
  description: string;
  primaryImage?: boolean;
}) {
  const url = new URL(path, SITE_URL).toString();
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-GB",
    isPartOf: { "@id": IDS.website },
    about: { "@id": IDS.business },
    ...(primaryImage ? { primaryImageOfPage: { "@id": IDS.photo } } : {}),
  };
}

/** The full graph, for the home page. */
export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      webPageNode({ path: "/", ...HOME_SEO, primaryImage: true }),
      website,
      business,
      rental,
      rentalOffer,
      nick,
      photo,
    ],
  };
}

/** A smaller graph for a supporting page: the page itself, plus the business and service it's about. */
export function pageGraph(page: { path: string; title: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [webPageNode(page), website, business, rental, rentalOffer, photo],
  };
}

/** Escaping "<" keeps the JSON from ever closing the script tag early. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
