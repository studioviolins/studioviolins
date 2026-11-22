import HeightGuide from "./HeightGuide";
import ViolinStage from "./ViolinStage";
import { INSTRUMENT_COPY as COPY, RENTAL_BENEFITS } from "./content";
import styles from "./InstrumentExplorer.module.css";

/**
 * Your rental violin, as one section. Wide screens: the upgrade statement and the height slider on the left,
 * the rotatable violin on the right, three rental benefits across the bottom. Phones read in order:
 * statement, violin, slider, benefits. The slider never changes the violin.
 */
export default function InstrumentExplorer() {
  return (
    <section className={styles.section} aria-labelledby="upgrade-title">
      <div className={styles.inner}>
        <div className={styles.layout}>
          <header className={styles.intro}>
            <p className={styles.eyebrow}>{COPY.eyebrow}</p>
            <h2 id="upgrade-title" className={styles.introTitle}>
              {COPY.introTitle}
            </h2>
            <p className={styles.introBody}>{COPY.introBody}</p>
          </header>

          <div className={styles.right}>
            <ViolinStage />
          </div>

          <HeightGuide />
        </div>

        <ul className={styles.benefits}>
          {RENTAL_BENEFITS.map((b) => (
            <li key={b.title} className={styles.benefit}>
              <h3 className={styles.benefitTitle}>{b.title}</h3>
              <p className={styles.benefitBody}>{b.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
