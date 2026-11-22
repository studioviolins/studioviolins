/**
 * When the new rental prices start: 1 January 2027 (confirmed by Oliver for Studio Violins, 22 Nov 2026).
 * Until then the site shows the current prices (£65 upfront including the one-off subscription fee, then £10 a
 * month); from then, the new ones (£56 upfront, no joining fee, then £14 a month). See ./content.ts.
 *
 * The pages are built ahead of time, so which set shows is decided when the site is BUILT: a build before
 * 1 January 2027 shows the current prices, a build on or after it shows the new ones. Going live with the new
 * prices therefore needs a fresh deploy on or after that date (to be scheduled once the site is on Vercel).
 *
 * To preview either set, build or run with PRICING_AS_OF=YYYY-MM-DD, for example
 * `PRICING_AS_OF=2027-01-01 npm run build`.
 *
 * Server side only: it's read by the pricing section, the FAQs and the terms, which all render on the server.
 * Never import it into a client component, or the visitor's own clock would decide what they see.
 */
export const NEW_PRICES_FROM = "2027-01-01";

const pricingDate = process.env.PRICING_AS_OF || new Date().toISOString().slice(0, 10);

/** True when the new prices apply (dates compare correctly as YYYY-MM-DD strings; UTC, the same as UK time in January). */
export const NEW_PRICES_LIVE = pricingDate >= NEW_PRICES_FROM;
