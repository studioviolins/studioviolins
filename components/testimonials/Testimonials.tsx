import { LineArrowIcon } from "@/components/hero/icons";
import ReviewCarousel, { type Review } from "./ReviewCarousel";
import styles from "./Testimonials.module.css";

/**
 * Verified against the Studio Violins Google Business Profile on 21 Nov 2026.
 * Wording is the reviewer's own (spelling included); "…" marks where a
 * review has been shortened. First names follow the live site's convention.
 * Chosen for what renters ask about: personal advice, choosing the right violin, moving up a size.
 * Each quote is one reviewer's own words, never combined. Andrew's starts at the advice he describes; the part
 * before it (including "a good range of instruments in varying price brackets") reads as buying.
 * Reviews about buying are left out: Studio Violins rents instruments only (confirmed 22 Nov 2026).
 * Nick to confirm attribution (first names) and permission, and the rating line. See the checklist.
 */
const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/place/Studio+Violins/@51.9407291,-0.2691761,17z/data=!4m8!3m7!1s0x487633e3efb7c189:0x7f8b99c8e48bbe12!8m2!3d51.9407291!4d-0.2691761!9m1!1b1!16s%2Fg%2F11f3y2dtc7";

/** Google rating and count as shown on 21 Nov 2026. Update or remove if they change. */
const GOOGLE_RATING = { score: "5.0", count: 5 };

const REVIEWS: Review[] = [
  // Advice and instrument selection
  {
    name: "Andrew",
    text: "…Nick was really helpful and easy going. No pressure at all and lots of good advice on how to choose, without ever telling us what to choose. My daughter is very happy with her choice. Highly recommended.",
    shortened: true,
  },
  // Support when moving on to the next violin
  {
    name: "Alex",
    text: "Very recommended - Nick was very accommodating and patient while helping my son choose his next violin. He clearly knows his stuff.",
    shortened: false,
  },
  // Rental, via a teacher's recommendation
  {
    name: "Lee",
    text: "My daughter’s teacher recommended us to Nick(Violin rental Hitchin). He is knowledgable violinist with a good range of violin for us to choose.",
    shortened: false,
  },
];

export default function Testimonials() {
  return (
    <section className={styles.section} aria-labelledby="testimonials-title">
      <header className={styles.head}>
        <h2 id="testimonials-title" className={styles.title}>
          Expert advice. Personal attention.
        </h2>
        <p className={styles.lede}>What players and parents say about Studio Violins.</p>
      </header>

      <div className={styles.stage}>
        <ReviewCarousel reviews={REVIEWS} label="Reviews from Google" />
      </div>

      <div className={styles.meta}>
        <p className={styles.rating}>
          Rated <strong>{GOOGLE_RATING.score}</strong> from {GOOGLE_RATING.count} Google reviews
        </p>
        <a
          className={styles.link}
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read more reviews on Google
          <LineArrowIcon width={22} height={11} />
        </a>
      </div>
    </section>
  );
}
