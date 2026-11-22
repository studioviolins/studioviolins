import Image from "next/image";
import { LineArrowIcon } from "@/components/hero/icons";
import { PRICING } from "./content";
import styles from "./Pricing.module.css";

/**
 * Pricing, on the site's deep green across the full width. Left (about 57%): one compact group with the
 * heading, the two successive payments side by side and joined by a thin gold line (upfront, then
 * per month), the short terms beneath them and the button. Right: the whole transparent violin-and-bow
 * image (3:1), vertically centred, its empty left margin running a little under the copy column. Phones
 * stack the payments and put the whole image beneath the button. The benefits (outfit, upsizing, support)
 * are in the rental section above, so they are not repeated here.
 */
export default function Pricing() {
  const { title, stages, details, cta, photo } = PRICING;
  return (
    <section id="prices" className={styles.section} aria-labelledby="pricing-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 id="pricing-title" className={styles.title}>
            {title}
          </h2>

          <ol className={styles.stages}>
            {stages.map((s) => (
              <li key={s.label} className={styles.stage}>
                <p className={styles.label}>{s.label}</p>
                <p className={styles.price}>
                  <span className={styles.amount}>{s.amount}</span> <span className={styles.unit}>{s.unit}</span>
                </p>
              </li>
            ))}
          </ol>

          <div className={styles.details}>
            {details.map((d) => (
              <p key={d} className={styles.detail}>
                {d}
              </p>
            ))}
          </div>

          <a href={cta.href} className={styles.cta}>
            {cta.label}
            <LineArrowIcon />
          </a>
        </div>

        {/* The approved transparent image, whole at its own 3:1 proportions; the green shows through its alpha. */}
        <div className={styles.photo}>
          <Image
            className={styles.photoImg}
            src={photo.image}
            alt={photo.alt}
            sizes="(min-width: 1000px) 920px, (min-width: 721px) 640px, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
