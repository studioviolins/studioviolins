"use client";

import { useSyncExternalStore } from "react";

/**
 * The visitor's analytics choice, shared by the banner, the cookie settings button and the tracker.
 * Only used when analytics is configured (./config.ts). The choice is kept in this browser's localStorage under
 * one key, so the banner isn't shown on every page; if storage is blocked, the choice lasts for this page view.
 * Null means no choice yet: analytics stays off.
 */
export type Consent = "granted" | "denied" | null;

type ConsentState = { consent: Consent; settingsOpen: boolean; ready: boolean };

const KEY = "sv-analytics-consent";
const SERVER_STATE: ConsentState = { consent: null, settingsOpen: false, ready: false };

let state: ConsentState | null = null;
const listeners = new Set<() => void>();

function readStored(): Consent {
  try {
    const value = window.localStorage.getItem(KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function current(): ConsentState {
  if (state === null) state = { consent: readStored(), settingsOpen: false, ready: true };
  return state;
}

function update(next: Partial<ConsentState>) {
  state = { ...current(), ...next };
  listeners.forEach((listener) => listener());
}

export function getConsent(): Consent {
  return typeof window === "undefined" ? null : current().consent;
}

export function setConsent(consent: "granted" | "denied") {
  try {
    window.localStorage.setItem(KEY, consent);
  } catch {
    // storage blocked: the choice still applies until the page is closed
  }
  update({ consent, settingsOpen: false });
}

/** "Cookie settings": show the choice again, so it can be changed or withdrawn. */
export function openConsentSettings() {
  update({ settingsOpen: true });
}

/** Close the reopened choice without changing it (Escape). */
export function closeConsentSettings() {
  if (current().consent !== null) update({ settingsOpen: false });
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
