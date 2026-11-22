"use client";

import { ANALYTICS_COPY } from "./ConsentBanner";
import { isOn, setConsent, useConsentState } from "./consent";

/**
 * "Turn analytics off" / "Turn analytics on" in the footer of every page: one click switches it, free, and the
 * choice is remembered (./consent.ts). The footer shows it only when analytics is configured. The change is
 * announced by Analytics.tsx. Before the page's script runs it reads "Turn analytics off", the default state.
 */
export default function AnalyticsToggle({ className }: { className?: string }) {
  const { consent, ready } = useConsentState();
  const on = !ready || isOn(consent);
  return (
    <button type="button" className={className} onClick={() => setConsent(on ? "denied" : "granted")}>
      {on ? ANALYTICS_COPY.turnOff : ANALYTICS_COPY.turnOn}
    </button>
  );
}
