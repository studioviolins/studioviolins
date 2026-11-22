"use client";

import { useSyncExternalStore } from "react";
import { isSliderHeight } from "./height-sizes";

/**
 * The height the visitor has actively chosen on the slider, shared by the slider and the contact form on the
 * same page. Null until they move, tap or use the keys on the slider (an untouched default is never attached),
 * and again after they remove it from the form, follow "contact Nick directly" or send their message. Held in memory for this page view only:
 * nothing goes into cookies or browser storage (the privacy policy says the site uses neither), and nothing is
 * stored on the server.
 */
let current: number | null = null;
const listeners = new Set<() => void>();

export function setSelectedHeight(cm: number | null) {
  const next = cm !== null && isSliderHeight(cm) ? cm : null;
  if (next === current) return;
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => null;

/** The chosen height in whole cm, or null when nothing has been chosen (always null on the server). */
export function useSelectedHeight() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** The id the form's "Change" link scrolls to, and the slider's own id, which it focuses. */
export const SIZE_GUIDE_ID = "size-guide";
export const HEIGHT_SLIDER_ID = "player-height";
/** The contact form's id: "Continue with this size" goes straight to it once a height is chosen. */
export const CONTACT_FORM_ID = "contact-form";
/** The contact section's WhatsApp and email options, linked from "contact Nick directly" under the button. */
export const CONTACT_OPTIONS_ID = "contact-options";
