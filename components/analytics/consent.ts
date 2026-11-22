"use client";

import { useSyncExternalStore } from "react";

/**
 * The visitor's analytics choice, shared by the first-visit notice, the footer's "Turn analytics off / on" button
 * and the tracker. Only used when analytics is configured (./config.ts).
 *
 * Analytics is ON by default, under the UK's statistical-purposes exception for analytics cookies (in force from
 * 5 Feb 2026): Google Analytics is used only for aggregate statistics to improve this website, with no advertising
 * or profiling, visitors are told on their first visit and in the privacy policy, and anyone can turn it off, free
 * and in one click. See docs/seo-geo-aeo-handover-2026-11-22.md for the conditions and the GA settings they rely on.
 *
 * The choice is kept in this browser's localStorage under one key:
 *   - "denied": turned off. Stays off on every page and later visit until turned back on.
 *   - "granted": turned back on, or the notice closed with "OK" (visitors who accepted the old consent banner too).
 *   - nothing: no choice yet. Analytics runs and the notice is shown.
 * If storage is blocked, an opt-out couldn't be remembered on the next page, so analytics stays off and the notice
 * isn't shown; the footer button can still turn it on for the page being viewed.
 */
export type Consent = "granted" | "denied" | null;

/** `changed` is true once the visitor has switched analytics on or off on this page, so the change is announced. */
type ConsentState = { consent: Consent; ready: boolean; changed: boolean };

const KEY = "sv-analytics-consent";
const SERVER_STATE: ConsentState = { consent: null, ready: false, changed: false };

let state: ConsentState | null = null;
const listeners = new Set<() => void>();

function readStored(): Consent {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return "denied"; // storage blocked: see the note at the top
  }
}

function current(): ConsentState {
  if (state === null) state = { consent: readStored(), ready: true, changed: false };
  return state;
}

function update(next: Partial<ConsentState>) {
  state = { ...current(), ...next };
  listeners.forEach((listener) => listener());
}

/** Whether a choice means analytics runs: everything except "turned off". */
export function isOn(consent: Consent): boolean {
  return consent !== "denied";
}

/** True once the browser has read the visitor's choice and analytics may run. False on the server. */
export function analyticsAllowed(): boolean {
  return typeof window !== "undefined" && isOn(current().consent);
}

/** "OK" or "Turn analytics on" store "granted"; "Turn analytics off" stores "denied". */
export function setConsent(consent: "granted" | "denied") {
  try {
    window.localStorage.setItem(KEY, consent);
  } catch {
    // storage blocked: the choice still applies until the page is closed
  }
  const before = current();
  update({ consent, changed: before.changed || isOn(before.consent) !== isOn(consent) });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useConsentState(): ConsentState {
  return useSyncExternalStore(subscribe, current, () => SERVER_STATE);
}
