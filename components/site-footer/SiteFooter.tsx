import { ANALYTICS_ENABLED } from "@/components/analytics/config";
import AnalyticsToggle from "@/components/analytics/AnalyticsToggle";
import { GUIDES } from "@/components/guides/content";
import { HERO_COPY, LINKS } from "@/components/hero/content";
import { BUSINESS, EMAIL_HREF } from "@/components/site/business";
import styles from "./SiteFooter.module.css";

const NEW_TAB = { target: "_blank", rel: "noopener noreferrer" } as const;

function NewTab() {
  return <span className={styles.srOnly}> (opens in a new tab)</span>;
}

/** Compact footer on the site's deep green: contact, hours, links and on-page navigation. No embedded map. */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>
            Studio <span>Violins</span>
          </p>
          <p className={styles.tagline}>{HERO_COPY.location}</p>
        </div>

        <div className={`${styles.col} ${styles.contactCol}`}>
          <h2 className={styles.colTitle}>Contact</h2>
          <ul>
            <li>
              <a href={BUSINESS.whatsapp.href} {...NEW_TAB}>
                {BUSINESS.whatsapp.display} (WhatsApp)
                <NewTab />
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF}>{BUSINESS.email}</a>
            </li>
            <li>{BUSINESS.address}</li>
            <li>
              <a href={BUSINESS.directions} {...NEW_TAB}>
                Get directions
                <NewTab />
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>Opening hours</h2>
          <ul>
            {BUSINESS.hours.map((h) => (
              <li key={h.days}>
                {h.days}: {h.time}
              </li>
            ))}
            <li>{BUSINESS.appointment}</li>
          </ul>
        </div>

        <div className={styles.col}>
          <h2 className={styles.colTitle}>More</h2>
          <ul>
            {GUIDES.map((g) => (
              <li key={g.path}>
                <a href={g.path}>{g.linkLabel}</a>
              </li>
            ))}
            <li>
              <a href={BUSINESS.instagram} {...NEW_TAB}>
                Instagram
                <NewTab />
              </a>
            </li>
            <li>
              <a href={LINKS.terms}>Terms &amp; Conditions</a>
            </li>
            <li>
              <a href={LINKS.privacy}>Privacy Policy</a>
            </li>
            {ANALYTICS_ENABLED ? (
              <li>
                <AnalyticsToggle className={styles.linkButton} />
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
        <nav aria-label="Footer" className={styles.pageNav}>
          <a href={LINKS.pricing}>Rental pricing</a>
          <a href={LINKS.meetNick}>About Nick</a>
          <a href={LINKS.faqs}>Rental FAQs</a>
          <a href={LINKS.contact}>Start an enquiry</a>
        </nav>
      </div>
    </footer>
  );
}
