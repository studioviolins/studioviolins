"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ConsentBanner from "./ConsentBanner";
import { ANALYTICS_ENABLED } from "./config";
import { useConsentState } from "./consent";
import { contactChannel, contactPlacement, disableAnalytics, enableAnalytics, track, trackPageView } from "./gtag";

/**
 * Mounted once in the root layout. Renders nothing at all unless NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.
 * When it is: shows the consent banner until the visitor chooses, loads Google Analytics only after "Accept",
 * stops it (and deletes its cookies) on "Decline", sends one page_view per page, and records contact clicks.
 */
export default function Analytics() {
  if (!ANALYTICS_ENABLED) return null;
  return <ConsentedAnalytics />;
}

function ConsentedAnalytics() {
  const { consent, ready } = useConsentState();
  const pathname = usePathname();
  // Which page this is (counted on each change of path) and which one has had its page_view, so accepting,
  // withdrawing and accepting again on one page sends one page_view, and #section links send none.
  const page = useRef({ path: "", index: 0, sent: -1 });

  useEffect(() => {
    if (!ready) return;
    if (consent === "granted") enableAnalytics();
    else if (consent === "denied") disableAnalytics();
  }, [consent, ready]);

  useEffect(() => {
    const p = page.current;
    if (p.path !== pathname) {
      p.path = pathname;
      p.index += 1;
    }
    if (consent !== "granted" || p.sent === p.index) return;
    p.sent = p.index;
    trackPageView();
  }, [consent, pathname]);

  // One listener for every WhatsApp and email link on the page. track() does nothing without consent.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) return;
      const channel = contactChannel(link.getAttribute("href") ?? "");
      if (channel) track("contact_click", { channel, placement: contactPlacement(link) });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <ConsentBanner />;
}
