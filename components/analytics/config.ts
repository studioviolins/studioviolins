/**
 * Google Analytics 4: ONE integration point, dormant until configured.
 *
 * Set NEXT_PUBLIC_GA_MEASUREMENT_ID (for example G-XXXXXXXXXX, from the GA4 property's web data stream) in the
 * host's Production environment, then rebuild and redeploy: NEXT_PUBLIC_ values are fixed into the site when it's
 * built. While it's empty or not a valid GA4 ID, nothing analytics-related is rendered or loaded: no banner, no
 * cookie settings link, no script, no storage, and the privacy policy keeps saying the site uses no analytics.
 *
 * Installation method: gtag.js loaded directly by components/analytics/gtag.ts, and only after the visitor accepts
 * analytics (basic consent: no Google request of any kind before that). If Google Tag Manager is ever used instead,
 * leave this variable empty, so the two can't both send data. See docs/seo-geo-aeo-handover-2026-11-22.md.
 */
const RAW = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();

export const GA_MEASUREMENT_ID = /^G-[A-Z0-9]{4,16}$/.test(RAW) ? RAW : "";

export const ANALYTICS_ENABLED = GA_MEASUREMENT_ID !== "";
