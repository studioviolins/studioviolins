"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { trackLead } from "@/components/analytics/gtag";
import { LineArrowIcon } from "@/components/hero/icons";
import { BUSINESS, EMAIL_HREF } from "@/components/site/business";
import { HEIGHT_FIELD, sizingFor } from "@/components/instrument/height-sizes";
import {
  CONTACT_FORM_ID,
  HEIGHT_SLIDER_ID,
  SIZE_GUIDE_ID,
  setSelectedHeight,
  useSelectedHeight,
} from "@/components/instrument/size-selection";
import { sendContactMessage } from "./actions";
import { CONTACT_COPY } from "./content";
import { CONTACT_LIMITS, HONEYPOT_FIELD, INITIAL_CONTACT_STATE, STARTED_FIELD, type ContactField } from "./form";
import styles from "./Contact.module.css";

const COPY = CONTACT_COPY.form;
const PICK = COPY.selection;
const FIELD_ORDER: ContactField[] = ["name", "email", "phone", "message"];

/**
 * "Send a message": name, email, an optional phone number and message, sent by a server action. Labels are always visible; errors
 * come back from the server, sit under their field (aria-invalid + aria-describedby) and the first one takes focus.
 * What the visitor typed is returned with every response and used as each field's default, so it survives the
 * re-render after a failed attempt. Success is only shown when the server says the email went.
 *
 * A height chosen on the rental section's slider shows as a short summary above the fields and goes with the
 * message in its own hidden field, never inside the message itself. It follows the slider as it moves ("Change"
 * goes back to it). It is cleared when the visitor chooses "Remove" (moving the slider again adds it back) or
 * follows "contact Nick directly" under the slider, and absent when nothing was chosen, so the form works the
 * same without it.
 */
export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, INITIAL_CONTACT_STATE);
  const id = useId();
  const ids = {
    title: `${id}-title`,
    name: `${id}-name`,
    email: `${id}-email`,
    phone: `${id}-phone`,
    message: `${id}-message`,
  };
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const trackedAttempt = useRef(0);
  // When the form appeared (set in the browser), for the minimum-time spam check.
  const [startedAt, setStartedAt] = useState("");
  const selectedHeight = useSelectedHeight();
  const sizing = selectedHeight !== null ? sizingFor(selectedHeight) : null;

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  // After each response, move focus to what needs attention.
  useEffect(() => {
    if (state.attempt === 0) return;
    if (state.status === "invalid") {
      const first = FIELD_ORDER.find((field) => state.errors[field]);
      ({ name: nameRef, email: emailRef, phone: phoneRef, message: messageRef })[first ?? "name"].current?.focus();
    } else if (state.status === "failed") {
      alertRef.current?.focus();
    } else if (state.status === "sent") {
      successRef.current?.focus();
      setSelectedHeight(null); // sent with that message; a new one starts without it
      // Analytics (only if configured and accepted): one generate_lead per accepted message, with no form details.
      if (trackedAttempt.current !== state.attempt) {
        trackedAttempt.current = state.attempt;
        trackLead();
      }
    }
  }, [state]);

  if (state.status === "sent") {
    return (
      <div id={CONTACT_FORM_ID} className={styles.form}>
        <h3 id={ids.title} className={styles.formTitle}>
          {COPY.title}
        </h3>
        <p ref={successRef} className={styles.success} role="status" tabIndex={-1}>
          {COPY.success}
        </p>
        {COPY.replyTime ? <p className={styles.replyTime}>{COPY.replyTime}</p> : null}
      </div>
    );
  }

  const errorProps = (field: ContactField) =>
    state.errors[field]
      ? { "aria-invalid": true as const, "aria-describedby": `${ids[field]}-error` }
      : {};

  return (
    <form id={CONTACT_FORM_ID} action={formAction} noValidate className={styles.form} aria-labelledby={ids.title}>
      <h3 id={ids.title} className={styles.formTitle}>
        {COPY.title}
      </h3>

      {sizing ? (
        <div className={styles.selection} role="group" aria-label={PICK.label}>
          <dl className={styles.selectionList}>
            <div className={styles.selectionRow}>
              <dt>{PICK.heightLabel}</dt>
              <dd>
                {sizing.height.metric} · {sizing.height.imperial}
              </dd>
            </div>
            {sizing.suggestedSize ? (
              <div className={styles.selectionRow}>
                <dt>{PICK.sizeLabel}</dt>
                <dd>{sizing.suggestedSize}</dd>
              </div>
            ) : null}
          </dl>
          {sizing.suggestedSize ? <p className={styles.selectionNote}>{PICK.sizeNote}</p> : null}
          <p className={styles.selectionActions}>
            <a
              href={`#${SIZE_GUIDE_ID}`} /* same page: "/#…" would reload a page whose address has a query */
              className={styles.selectionAction}
              onClick={() => {
                // the link scrolls to the slider; focus it too, so the keys adjust it straight away
                requestAnimationFrame(() => document.getElementById(HEIGHT_SLIDER_ID)?.focus({ preventScroll: true }));
              }}
            >
              {PICK.change}
              <span className={styles.srOnly}>{PICK.changeHint}</span>
            </a>
            <button
              type="button"
              className={styles.selectionAction}
              onClick={() => {
                setSelectedHeight(null);
                // the summary (and this button) disappears, so move focus on to the first field
                nameRef.current?.focus({ preventScroll: true });
              }}
            >
              {PICK.remove}
              <span className={styles.srOnly}>{PICK.removeHint}</span>
            </button>
          </p>
          <input type="hidden" name={HEIGHT_FIELD} value={sizing.heightCm} />
        </div>
      ) : null}

      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor={ids.name}>{COPY.nameLabel}</label>
          <input
            ref={nameRef}
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name}
            defaultValue={state.values.name}
            className={styles.input}
            {...errorProps("name")}
          />
          {state.errors.name ? (
            <p id={`${ids.name}-error`} className={styles.fieldError}>
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor={ids.email}>{COPY.emailLabel}</label>
          <input
            ref={emailRef}
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            spellCheck={false}
            required
            maxLength={CONTACT_LIMITS.email}
            defaultValue={state.values.email}
            className={styles.input}
            {...errorProps("email")}
          />
          {state.errors.email ? (
            <p id={`${ids.email}-error`} className={styles.fieldError}>
              {state.errors.email}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor={ids.phone}>
            {COPY.phoneLabel} <span className={styles.optional}>{COPY.optional}</span>
          </label>
          <input
            ref={phoneRef}
            id={ids.phone}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone}
            defaultValue={state.values.phone}
            className={styles.input}
            {...errorProps("phone")}
          />
          {state.errors.phone ? (
            <p id={`${ids.phone}-error`} className={styles.fieldError}>
              {state.errors.phone}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor={ids.message}>{COPY.messageLabel}</label>
          <textarea
            ref={messageRef}
            id={ids.message}
            name="message"
            rows={5}
            required
            maxLength={CONTACT_LIMITS.messageMax}
            defaultValue={state.values.message}
            className={`${styles.input} ${styles.textarea}`}
            {...errorProps("message")}
          />
          {state.errors.message ? (
            <p id={`${ids.message}-error`} className={styles.fieldError}>
              {state.errors.message}
            </p>
          ) : null}
        </div>
      </div>

      {/* Spam checks: a field people never see or fill, and when the form appeared. */}
      <div className={styles.trap} aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name={STARTED_FIELD} value={startedAt} />

      {state.status === "failed" ? (
        <div ref={alertRef} className={styles.formAlert} role="alert" tabIndex={-1}>
          <p>{COPY.failure}</p>
          <p className={styles.alertLinks}>
            <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer">
              WhatsApp {BUSINESS.whatsapp.display}
              <span className={styles.srOnly}> (opens WhatsApp in a new tab)</span>
            </a>
            <a href={EMAIL_HREF}>{BUSINESS.email}</a>
          </p>
        </div>
      ) : null}

      <button type="submit" className={styles.submit} disabled={pending}>
        {pending ? COPY.sending : COPY.submit}
        <LineArrowIcon />
      </button>
      {COPY.replyTime ? <p className={styles.replyTime}>{COPY.replyTime}</p> : null}
    </form>
  );
}
