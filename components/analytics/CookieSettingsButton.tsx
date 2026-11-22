"use client";

import { openConsentSettings } from "./consent";

/** "Cookie settings" in the footer: reopens the analytics choice. The footer shows it only when analytics is configured. */
export default function CookieSettingsButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openConsentSettings}>
      Cookie settings
    </button>
  );
}
