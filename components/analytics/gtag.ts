"use client";

import { analyticsAllowed } from "./consent";
import { ANALYTICS_ENABLED, GA_MEASUREMENT_ID } from "./config";

/**
 * The only code that talks to Google Analytics. Every function does nothing unless analytics is configured AND
 * the visitor hasn't turned it off (./consent.ts: on by default, under the UK's statistical-purposes exception).
 *
 * That exception holds only while Google Analytics is used for aggregate statistics to improve this website, with
 * no advertising, profiling or personal data. So, in this code:
 *   - Google's consent mode says no to advertising from the start: ad_storage, ad_user_data and ad_personalization
 *     are "denied"; only analytics_storage is "granted". Google signals and ad personalisation are off as well.
 *   - Only the events below are sent, with fixed, non-personal values, and page addresses are cleaned first.
 * And in the GA property (checked 23 Nov 2026; keep it that way, docs/seo-geo-aeo-handover-2026-11-22.md): no
 * Google Ads or other advertising links, Google signals off, account data sharing off, ads personalisation off.
 *
 * Events (the agreed plan, docs/seo-geo-aeo-handover-2026-11-22.md):
 *   - page_view: once per page (sent by Analytics.tsx when the path changes; #section links don't count).
 *   - generate_lead: once, after the contact form's server action reports the message was accepted for delivery.
 *     Not on clicking Send, and not on validation or delivery errors. It means an accepted enquiry, nothing more.
 *   - contact_click: a click on a WhatsApp or email link, with fixed channel and placement values.
 *   - size_guide_continue: once per page view, when the visitor continues from the height guide.
 * Never form contents, names, email addresses, phone numbers, the player's height or size, message text, raw link
 * URLs or error messages. Page addresses are sent without their query string (except utm_ campaign tags) or
 * #fragment.
 *
 * The GA4 property's own Google tag (G-DTHTWQM125, checked 23 Nov 2026 with Google's collection blocked) also
 * runs "enhanced measurement" (scrolls, form starts, outbound clicks, site search, history page views) and
 * ignores send_page_view in a later config call. So the settings below go in with gtag("set") BEFORE
 * gtag("js"), which stops its automatic page_view and makes its automatic events use the cleaned address. Its
 * site-search and form events read the browser's address directly, so while analytics runs the address bar keeps
 * only utm_ tags (and the #section) before the tag loads.
 */
type EventName = "page_view" | "generate_lead" | "contact_click" | "size_guide_continue";
type EventParams = Record<string, string>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;
let sizeGuideSent = false;

const DISABLE_FLAG = `ga-disable-${GA_MEASUREMENT_ID}`;

function setDisabled(disabled: boolean) {
  (window as unknown as Record<string, boolean>)[DISABLE_FLAG] = disabled;
}

/** The page address without personal or tracking clutter: origin + path, plus utm_ campaign tags only. */
export function safePageLocation(): string {
  const { origin, pathname, search } = window.location;
  const kept = new URLSearchParams();
  new URLSearchParams(search).forEach((value, key) => {
    if (/^utm_(source|medium|campaign|term|content|id)$/.test(key)) kept.set(key, value);
  });
  const query = kept.toString();
  return `${origin}${pathname}${query ? `?${query}` : ""}`;
}

/** The previous page's address without its query string or #fragment (empty when there isn't one). */
function safeReferrer(): string {
  try {
    const ref = new URL(document.referrer);
    return `${ref.origin}${ref.pathname}`;
  } catch {
    return "";
  }
}

/** Drops query values other than utm_ tags from the address bar, keeping the #section, so nothing the tag reads
 *  from the address itself (site search terms, form addresses) can carry them. Only used while analytics runs. */
function cleanAddressBar() {
  const { pathname, search, hash } = window.location;
  if (!search) return;
  const clean = new URL(safePageLocation()).search;
  if (clean === search) return;
  try {
    window.history.replaceState(window.history.state, "", `${pathname}${clean}${hash}`);
  } catch {
    // leave the address as it is; the events still send the cleaned address
  }
}

/** Called while analytics is on (the default): loads gtag.js once. Advertising stays off (see the note at the top). */
export function enableAnalytics() {
  if (!ANALYTICS_ENABLED) return;
  setDisabled(false);
  if (loaded) return;
  loaded = true;
  cleanAddressBar();

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js expects the arguments object itself
    window.dataLayer!.push(arguments);
  };
  // Consent mode: analytics only, never advertising. Must come before anything else is queued.
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  const settings = {
    send_page_view: false, // page_view is sent by Analytics.tsx, once per page
    page_location: safePageLocation(),
    page_referrer: safeReferrer(),
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  };
  window.gtag("set", settings); // must come before "js" (see the note at the top)
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, settings);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

/** Called when the visitor turns analytics off (now or on an earlier visit): stops all sending and deletes the
 *  analytics cookies. */
export function disableAnalytics() {
  if (!ANALYTICS_ENABLED) return;
  setDisabled(true);
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((name) => name === "_ga" || name.startsWith("_ga_"));
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}

export function track(name: EventName, params: EventParams = {}) {
  if (!ANALYTICS_ENABLED || !loaded || !analyticsAllowed() || !window.gtag) return;
  window.gtag("event", name, { ...params, page_location: safePageLocation() });
}

export function trackPageView() {
  if (!ANALYTICS_ENABLED || !loaded || !analyticsAllowed() || !window.gtag) return;
  cleanAddressBar();
  window.gtag("set", { page_location: safePageLocation(), page_title: document.title });
  track("page_view", { page_title: document.title });
}

/** After the contact form's server action reports success. */
export function trackLead() {
  track("generate_lead", { lead_source: "contact_form" });
}

/** "Continue with this size": once per page view, and without the height or size. */
export function trackSizeGuideContinue() {
  if (sizeGuideSent || !loaded || !analyticsAllowed()) return;
  sizeGuideSent = true;
  track("size_guide_continue");
}

const PAGE_PLACEMENT: Record<string, string> = {
  "/": "home",
  "/delivery": "delivery_page",
  "/for-teachers": "teachers_page",
  "/starting-violin": "starting_page",
  "/terms": "terms",
  "/privacy": "privacy",
};

/** Where a contact link was clicked, as a fixed value. */
export function contactPlacement(link: Element): string {
  if (link.closest("footer")) return "footer";
  if (link.closest("form")) return "contact_form_error";
  if (link.closest("#contact")) return "contact_section";
  return PAGE_PLACEMENT[window.location.pathname] ?? "other";
}

/** WhatsApp or email, from a link's address; null for any other link. */
export function contactChannel(href: string): "whatsapp" | "email" | null {
  if (href.startsWith("https://wa.me/")) return "whatsapp";
  if (href.startsWith("mailto:")) return "email";
  return null;
}
