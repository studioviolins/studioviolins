import Image from "next/image";
import { LineArrowIcon } from "@/components/hero/icons";
import { MEET_NICK } from "./content";
import styles from "./MeetNick.module.css";

/** Meet Nick: the seated photograph on the left, a short introduction on the right; stacked on phones. */
export default function MeetNick() {
  const { title, body, cta, href, photo } = MEET_NICK;
  return (
    <section id="about" className={styles.section} aria-labelledby="meet-nick-title">
      <div className={styles.inner}>
        <div className={styles.photo}>
          <Image
            src={photo.image}
            alt={photo.alt}
            fill
            sizes="(max-width: 860px) 100vw, 46vw"
            className={styles.image}
          />
        </div>

        <div className={styles.copy}>
          <h2 id="meet-nick-title" className={styles.title}>
            {title}
          </h2>
          {body.map((p) => (
            <p key={p.slice(0, 24)} className={styles.body}>
              {p}
            </p>
          ))}
          <a href={href} className={styles.cta}>
            {cta}
            <LineArrowIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
