import styles from "./Credentials.module.css";

type Credential = {
  title: string;
  label: string;
  /** At most one short sentence; anything fuller belongs in Meet Nick. */
  note?: string;
};

/**
 * Nick's credentials, led by his ARAM honour. ARAM (Associate of the Royal Academy of Music) is an honour the
 * Academy awards to its alumni, so it's worded as recognition of Nick personally, never as the Academy endorsing
 * Studio Violins. The sentence is the user's wording; the Academy's honours page couldn't be read automatically
 * (bot check), so Nick confirms it. "30+ years … in the violin business" is settled (Oliver, 22 Nov 2026): the
 * Meet Nick biography explains the background (instrument retail, then managing loans of high-end instruments in
 * the charity sector). Never narrow it to 30 years of teaching or professional performance. Its supporting line is
 * the user's wording and says what that experience means for customers. See docs/nick-confirmation-checklist.md.
 */
const CREDENTIALS: Credential[] = [
  {
    title: "Royal Academy of Music",
    label: "Associate — ARAM",
    note: "Recognised for his contribution to the music profession.",
  },
  {
    title: "30+ years",
    label: "Experience in the violin business",
    note: "Helping you choose the right instrument.",
  },
];

/**
 * Southern Enterprise Awards, 2021 and 2022: identified, but hidden until verified. Still missing: the supporting
 * documentation (certificate or notification for each year, showing the recipient and awarding organisation) and
 * the exact award categories. Once Nick supplies them, set `verified: true` and fill in the note with the exact
 * category; both years then show as one column.
 */
const AWARDS: Credential & { verified: boolean } = {
  verified: false,
  title: "2021 & 2022",
  label: "Southern Enterprise Awards",
};

export default function Credentials() {
  const items = AWARDS.verified ? [...CREDENTIALS, AWARDS] : CREDENTIALS;

  return (
    <section className={styles.strip} aria-label="Nick’s credentials">
      <ul className={styles.list} style={{ "--count": items.length } as React.CSSProperties}>
        {items.map((item) => (
          <li key={item.title} className={styles.item}>
            <p className={styles.title}>{item.title}</p>
            <span className={styles.rule} aria-hidden="true" />
            <p className={styles.label}>{item.label}</p>
            {item.note ? <p className={styles.note}>{item.note}</p> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
