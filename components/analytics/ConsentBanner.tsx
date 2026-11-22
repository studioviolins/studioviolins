"use client";

import { useEffect, useId, useRef } from "react";
import { LINKS } from "@/components/hero/content";
import { closeConsentSettings, setConsent, useConsentState } from "./consent";
import styles from "./ConsentBanner.module.css";

export const ANALYTICS_COPY = {
  title: "Analytics cookies",
  body: "May we use Google Analytics cookies to see how visitors use this website? Nothing is collected unless you accept.",
  more: "Privacy Policy",
  accept: "Accept analytics",
  decline: "Decline",
  on: "Analytics is on. You can turn it off at any time.",
  off: "Analytics is off.",
} as const;

/**
 * A small panel in the bottom corner, shown until the visitor chooses and again from "Cookie settings" in the
 * footer. It doesn't block the page or take focus when it first appears; the form and everything else work
 * whatever the choice. Accept and Decline look the same, so declining is as easy as accepting. Reopened from
 * the footer it shows the current choice, takes focus, closes with Escape and hands focus back afterwards.
 */
export default function ConsentBanner() {
  const { consent, settingsOpen, ready } = useConsentState();
  const id = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const visible = ready && (consent === null || settingsOpen);

  useEffect(() => {
    if (!settingsOpen) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    titleRef.current?.focus();
    return () => {
      opener.current?.focus();
      opener.current = null;
    };
  }, [settingsOpen]);

  if (!visible) return null;

  return (
    <section
      className={styles.banner}
      aria-labelledby={`${id}-title`}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeConsentSettings();
      }}
    >
      <h2 id={`${id}-title`} ref={titleRef} className={styles.title} tabIndex={-1}>
        {ANALYTICS_COPY.title}
      </h2>
      <p className={styles.body}>
        {ANALYTICS_COPY.body} <a href={`${LINKS.privacy}#privacy-analytics`}>{ANALYTICS_COPY.more}</a>
      </p>
      {consent !== null ? (
        <p className={styles.status}>{consent === "granted" ? ANALYTICS_COPY.on : ANALYTICS_COPY.off}</p>
      ) : null}
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => setConsent("granted")}>
          {ANALYTICS_COPY.accept}
        </button>
        <button type="button" className={styles.button} onClick={() => setConsent("denied")}>
          {ANALYTICS_COPY.decline}
        </button>
      </div>
    </section>
  );
}
