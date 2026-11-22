import SiteFooter from "@/components/site-footer/SiteFooter";
import SiteHeader from "@/components/site-header/SiteHeader";
import { BUSINESS, EMAIL_HREF } from "@/components/site/business";
import type { LegalBlock, LegalDoc } from "./types";
import styles from "./Legal.module.css";

/**
 * Terms and privacy: the site's header and footer around a plain reading page on cream.
 * Title, date and a route to Nick on the left (held in view on wide screens); numbered sections on the right.
 */
export default function LegalPage({ doc, slug }: { doc: LegalDoc; slug: string }) {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <article className={styles.inner} aria-labelledby={`${slug}-title`}>
          <div className={styles.head}>
            <p className={styles.eyebrow}>{BUSINESS.name}</p>
            <h1 id={`${slug}-title`} className={styles.title}>
              {doc.title}
            </h1>
            <p className={styles.intro}>{doc.intro}</p>
            <p className={styles.updated}>Last updated {doc.updated}</p>
          </div>

          <div className={styles.body}>
            {doc.sections.map((section, index) => {
              const id = `${slug}-${index + 1}`;
              return (
                <section key={section.heading} className={styles.section} aria-labelledby={id}>
                  <h2 id={id} className={styles.heading}>
                    <span className={styles.headingNumber}>{index + 1}.</span> {section.heading}
                  </h2>
                  {section.clauses ? (
                    <ol className={styles.clauses}>
                      {section.clauses.map(([number, text]) => (
                        <li key={number} className={styles.clause}>
                          <span className={styles.clauseNumber}>{number}</span>
                          <p>{text}</p>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {section.blocks?.map((block, i) => <Block key={i} block={block} />)}
                </section>
              );
            })}

            <section className={styles.questions} aria-labelledby={`${slug}-questions`}>
              <h2 id={`${slug}-questions`} className={styles.questionsTitle}>
                {doc.questions.title}
              </h2>
              <p>{doc.questions.body}</p>
              <ul className={styles.contactList}>
                <li>
                  <span className={styles.contactLabel}>Email</span>
                  <a href={EMAIL_HREF}>{BUSINESS.email}</a>
                </li>
                <li>
                  <span className={styles.contactLabel}>WhatsApp</span>
                  <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer">
                    {BUSINESS.whatsapp.display}
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p className={styles.paragraph}>{block}</p>;
  if ("list" in block) {
    return (
      <ul className={styles.list}>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  const { before, label, href, after } = block.link;
  return (
    <p className={styles.paragraph}>
      {before}
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
        <span className={styles.srOnly}> (opens in a new tab)</span>
      </a>
      {after}
    </p>
  );
}
