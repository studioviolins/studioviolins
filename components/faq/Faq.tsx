import { LineArrowIcon } from "@/components/hero/icons";
import FaqAccordion from "./FaqAccordion";
import { FAQ_COPY, PUBLISHED_FAQS } from "./content";
import styles from "./Faq.module.css";

/** FAQs on warm ivory: heading and a route to Nick on the left, the accordion on the right; stacked on phones. */
export default function Faq() {
  return (
    <section id="faqs" className={styles.section} aria-labelledby="faq-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="faq-title" className={styles.title}>
            {FAQ_COPY.title}
          </h2>
          <p className={styles.intro}>{FAQ_COPY.intro}</p>
          <p className={styles.links}>
            <a href={FAQ_COPY.contactHref} className={styles.link}>
              {FAQ_COPY.contactLabel}
              <LineArrowIcon width={22} height={11} />
            </a>
            <a href={FAQ_COPY.termsHref} className={styles.link}>
              {FAQ_COPY.termsLabel}
              <LineArrowIcon width={22} height={11} />
            </a>
          </p>
        </div>

        <FaqAccordion faqs={PUBLISHED_FAQS} />
      </div>
    </section>
  );
}
