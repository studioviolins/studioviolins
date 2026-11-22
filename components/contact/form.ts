/** Shared by the contact form (client) and its server action: field names, limits, state and validation. */

/** `phone` is optional; the other three are required. */
export type ContactField = "name" | "email" | "phone" | "message";
export type ContactValues = Record<ContactField, string>;

export type ContactState = {
  /** idle: not sent yet · invalid: a field needs fixing · sent: delivered · failed: not delivered (any reason). */
  status: "idle" | "invalid" | "sent" | "failed";
  /** What the visitor typed, sent back so nothing is lost when the form re-renders after a failed attempt. */
  values: ContactValues;
  errors: Partial<Record<ContactField, string>>;
  /** Goes up with every response, so the form reacts even when the status is the same twice running. */
  attempt: number;
};

export const INITIAL_CONTACT_STATE: ContactState = {
  status: "idle",
  values: { name: "", email: "", phone: "", message: "" },
  errors: {},
  attempt: 0,
};

export const CONTACT_LIMITS = { name: 100, email: 254, phone: 30, messageMin: 10, messageMax: 5000 };

/** Field names for the spam checks; deliberately unlike anything a browser would autofill. */
export const HONEYPOT_FIELD = "contact_extra";
export const STARTED_FIELD = "form_started";

// A plain, conservative address check: something@something.tld, with no spaces, angle brackets, quotes or commas.
const EMAIL_PATTERN = /^[^\s@<>()",;:\\[\]]+@[^\s@<>()",;:\\[\]]+\.[^\s@<>()",;:\\[\]]{2,}$/;

export function validateContact(values: ContactValues): ContactState["errors"] {
  const errors: ContactState["errors"] = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > CONTACT_LIMITS.name || /[\r\n]/.test(name))
    errors.name = `Please enter your name on one line, in under ${CONTACT_LIMITS.name} characters.`;

  if (!email) errors.email = "Please enter your email address, so Nick can reply.";
  else if (email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(email))
    errors.email = "Please enter a valid email address, like name@example.com.";

  // Optional. If given: digits with the usual separators (spaces, +, brackets, dots, dashes), 7 to 15 digits,
  // so UK numbers in any common format pass ("07976 803533", "+44 7976 803533", "(01462) 123456").
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    if (phone.length > CONTACT_LIMITS.phone || !/^[0-9+().\-\s]+$/.test(phone) || digits.length < 7 || digits.length > 15)
      errors.phone = "Please enter a valid phone number, or leave this blank.";
  }

  if (!message) errors.message = "Please write your message.";
  else if (message.length < CONTACT_LIMITS.messageMin)
    errors.message = `Please add a little more detail (at least ${CONTACT_LIMITS.messageMin} characters).`;
  else if (message.length > CONTACT_LIMITS.messageMax)
    errors.message = `Please keep your message under ${CONTACT_LIMITS.messageMax.toLocaleString("en-GB")} characters.`;

  return errors;
}
