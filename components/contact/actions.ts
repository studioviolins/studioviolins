"use server";

import { headers } from "next/headers";
import { HEIGHT_FIELD, isSliderHeight, sizingFor } from "@/components/instrument/height-sizes";
import { deliverContactMessage } from "./deliver";
import { HONEYPOT_FIELD, STARTED_FIELD, type ContactState, type ContactValues, validateContact } from "./form";

/** Basic spam protection: a hidden field people never fill, a minimum time to fill the form, a per-address limit. */
const MIN_FILL_MS = 3000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
/**
 * Best effort: held in this server's memory only (cleared on restart, not shared between instances),
 * never written anywhere. Keyed by IP address; entries expire after ten minutes.
 */
const recent = new Map<string, number[]>();

function overLimit(key: string) {
  const now = Date.now();
  const times = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const limited = times.length >= MAX_PER_WINDOW;
  if (!limited) times.push(now);
  recent.set(key, times);
  if (recent.size > 2000) {
    for (const [k, v] of recent) if (!v.some((t) => now - t < WINDOW_MS)) recent.delete(k);
  }
  return limited;
}

export async function sendContactMessage(previous: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactValues = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const attempt = previous.attempt + 1;
  // Anything that stops a message reaching Nick is a failure, shown as one: never a pretend success.
  const failed: ContactState = { status: "failed", values, errors: {}, attempt };

  if (String(formData.get(HONEYPOT_FIELD) ?? "") !== "") return failed;
  const started = Number(formData.get(STARTED_FIELD) ?? "");
  if (started > 0 && Date.now() - started < MIN_FILL_MS) return failed;

  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) return { status: "invalid", values, errors, attempt };

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || requestHeaders.get("x-real-ip");
  if (ip && overLimit(ip)) return failed;

  // The height chosen on the slider, if any: a whole number of cm within the slider's limits, or nothing. The
  // suggested size is worked out here again from the height, never taken from the browser.
  const heightCm = Number(formData.get(HEIGHT_FIELD) ?? "");
  const sizing = isSliderHeight(heightCm) ? sizingFor(heightCm) : null;

  const result = await deliverContactMessage({
    name: values.name.trim(),
    email: values.email.trim(),
    phone: values.phone.trim(),
    message: values.message.trim(),
    sizing,
  });
  if (!result.ok) return failed;

  return { status: "sent", values: { name: "", email: "", phone: "", message: "" }, errors: {}, attempt };
}
