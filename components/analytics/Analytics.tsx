"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import ConsentBanner, { ANALYTICS_COPY } from "./ConsentBanner";
import { ANALYTICS_ENABLED } from "./config";
import { isOn, useConsentState } from "./consent";
import styles from "./ConsentBanner.module.css";
import { contactChannel, contactPlacement, disableAnalytics, enableAnalytics, track, trackPageView } from "./gtag";

/**
 * Mounted once in the root layout. Renders nothing at all unless NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.
 * When it is: runs Google Analytics by default (see ./consent.ts), shows the first-visit notice, stops it (and
 * deletes its cookies) when the visitor turns it off, sends one page_view per page, records contact clicks, and
 * announces "Analytics is on / off" to screen readers after the visitor switches it.
 */
export default function Analytics() {
  if (!ANALYTICS_ENABLED) return null;
  return <ConsentedAnalytics />;
}

function ConsentedAnalytics() {
  const { consent, ready, changed } = useConsentState();
  const on = ready && isOn(consent);
  const pathname = usePathname();
  // Which page this is (counted on each change of path) and which one has had its page_view, so turning analytics
  // off and on again on one page sends one page_view, and #section links send none.
  const page = useRef({ path: "", index: 0, sent: -1 });

  useEffect(() => {
    if (!ready) return;
    if (on) enableAnalytics();
    else disableAnalytics();
  }, [on, ready]);

  useEffect(() => {
    const p = page.current;
    if (p.path !== pathname) {
      p.path = pathname;
      p.index += 1;
    }
    if (!on || p.sent === p.index) return;
    p.sent = p.index;
    trackPageView();
  }, [on, pathname]);

  // One listener for every WhatsApp and email link on the page. track() does nothing while analytics is off.
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

  return (
    <>
      <ConsentBanner />
      <p className={styles.srOnly} role="status">
        {changed ? (on ? ANALYTICS_COPY.on : ANALYTICS_COPY.off) : ""}
      </p>
    </>
  );
}
