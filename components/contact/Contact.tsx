import { LineArrowIcon } from "@/components/hero/icons";
import { CONTACT_OPTIONS_ID } from "@/components/instrument/size-selection";
import { BUSINESS, EMAIL_HREF } from "@/components/site/business";
import ContactForm from "./ContactForm";
import { CONTACT_COPY } from "./content";
import styles from "./Contact.module.css";

/**
 * Talk to Nick: what happens next and the two direct routes (WhatsApp, email) on the left; a short message form
 * on the right. Stacked on phones: copy, direct routes, form. Copy lives in ./content.ts.
 */
export default function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.inner}>
        <div className={styles.direct}>
          <div className={styles.copy}>
            <h2 id="contact-title" className={styles.title}>
              {CONTACT_COPY.title}
            </h2>
            <p className={styles.body}>{CONTACT_COPY.body}</p>
            <p className={styles.lesson}>{CONTACT_COPY.lesson}</p>
          </div>

          {/* "contact Nick directly" in the rental section links here */}
          <ul id={CONTACT_OPTIONS_ID} className={styles.options}>
            <li>
              <a className={styles.option} href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer">
                <ChatIcon />
                <span className={styles.optionText}>
                  <span className={styles.optionLabel}>WhatsApp</span>
                  <span className={styles.optionValue}>{BUSINESS.whatsapp.display}</span>
                </span>
                <span className={styles.srOnly}> (opens WhatsApp in a new tab)</span>
                <LineArrowIcon className={styles.arrow} />
              </a>
            </li>
            <li>
              <a className={styles.option} href={EMAIL_HREF}>
                <MailIcon />
                <span className={styles.optionText}>
                  <span className={styles.optionLabel}>Email</span>
                  <span className={styles.optionValue}>{BUSINESS.email}</span>
                </span>
                <LineArrowIcon className={styles.arrow} />
              </a>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}

function ChatIcon() {
  return (
    <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 18.5V6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H8.5L4 18.5Z" />
      <path d="M8 8.75h8M8 12h5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className={styles.icon} width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="m4.5 7 7.5 6 7.5-6" />
    </svg>
  );
}
