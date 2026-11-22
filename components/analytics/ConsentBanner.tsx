"use client";

import { useId } from "react";
import { LINKS } from "@/components/hero/content";
import { setConsent, useConsentState } from "./consent";
import styles from "./ConsentBanner.module.css";

export const ANALYTICS_COPY = {
  title: "Analytics cookies",
  body: "We use Google Analytics cookies to count visits and see how this website is used, so we can improve it. It isn’t used for advertising or profiling, and you can turn it off at any time.",
  more: "Privacy Policy",
  ok: "OK",
  turnOff: "Turn analytics off",
  turnOn: "Turn analytics on",
  on: "Analytics is on.",
  off: "Analytics is off. You can turn it back on at the bottom of any page.",
} as const;

/**
 * The first-visit notice: a small panel in the bottom corner, shown until the visitor closes it with "OK" or turns
 * analytics off. Analytics is already running while it shows (see ./consent.ts). It doesn't block the page or take
 * focus; the form and everything else work whatever the choice. "OK" and "Turn analytics off" look the same, so
 * turning it off is as easy as carrying on. Afterwards the footer's "Turn analytics off / on" button changes it.
 */
export default function ConsentBanner() {
  const { consent, ready } = useConsentState();
  const id = useId();

  if (!ready || consent !== null) return null;

  return (
    <section className={styles.banner} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.title}>
        {ANALYTICS_COPY.title}
      </h2>
      <p className={styles.body}>
        {ANALYTICS_COPY.body} <a href={`${LINKS.privacy}#privacy-analytics`}>{ANALYTICS_COPY.more}</a>
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => setConsent("granted")}>
          {ANALYTICS_COPY.ok}
        </button>
        <button type="button" className={styles.button} onClick={() => setConsent("denied")}>
          {ANALYTICS_COPY.turnOff}
        </button>
      </div>
    </section>
  );
}
