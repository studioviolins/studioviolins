import { Fragment } from "react";
import legal from "@/components/legal/Legal.module.css";
import BusinessJsonLd from "@/components/seo/BusinessJsonLd";
import SiteFooter from "@/components/site-footer/SiteFooter";
import SiteHeader from "@/components/site-header/SiteHeader";
import { BUSINESS, EMAIL_HREF } from "@/components/site/business";
import { GUIDE_CONTACT, GUIDES } from "./content";
import type { Guide, GuideBlock, GuideSegment } from "./types";
import styles from "./Guide.module.css";

/**
 * A supporting guide (collection and delivery, for teachers, starting the violin): the same plain reading page as
 * the terms and privacy pages (their styles, header and footer), with unnumbered sections, a closing block with
 * the contact routes, and links to the other guides. Enquiries go through the existing contact form, WhatsApp or
 * email; there's no form here.
 */
export default function GuidePage({ guide }: { guide: Guide }) {
  const slug = guide.path.slice(1);
  const others = GUIDES.filter((g) => g.path !== guide.path);

  return (
    <>
      <BusinessJsonLd page={{ path: guide.path, title: guide.seo.title, description: guide.seo.description }} />
      <SiteHeader />
      <main className={legal.page}>
        <article className={legal.inner} aria-labelledby={`${slug}-title`}>
          <div className={legal.head}>
            <p className={legal.eyebrow}>{BUSINESS.name}</p>
            <h1 id={`${slug}-title`} className={legal.title}>
              {guide.title}
            </h1>
            <p className={legal.intro}>{guide.intro}</p>
          </div>

          <div className={legal.body}>
            {guide.sections.map((section) => (
              <section key={section.id} id={section.id} className={`${legal.section} ${styles.section}`} aria-labelledby={`${section.id}-heading`}>
                <h2 id={`${section.id}-heading`} className={legal.heading}>
                  {section.heading}
                </h2>
                {section.blocks.map((block, i) => (
                  <Block key={i} block={block} />
                ))}
              </section>
            ))}

            <section className={legal.questions} aria-labelledby={`${slug}-contact`}>
              <h2 id={`${slug}-contact`} className={legal.questionsTitle}>
                {GUIDE_CONTACT.title}
              </h2>
              <p>{GUIDE_CONTACT.body}</p>
              <ul className={legal.contactList}>
                <li>
                  <span className={legal.contactLabel}>Message</span>
                  <a href={GUIDE_CONTACT.formHref}>{GUIDE_CONTACT.formLabel}</a>
                </li>
                <li>
                  <span className={legal.contactLabel}>WhatsApp</span>
                  <a href={BUSINESS.whatsapp.href} target="_blank" rel="noopener noreferrer">
                    {BUSINESS.whatsapp.display}
                    <span className={legal.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <span className={legal.contactLabel}>Email</span>
                  <a href={EMAIL_HREF}>{BUSINESS.email}</a>
                </li>
              </ul>
            </section>

            <nav className={styles.related} aria-label="More guides">
              <p className={styles.relatedTitle}>More guides</p>
              <ul>
                {others.map((g) => (
                  <li key={g.path}>
                    <a href={g.path}>{g.linkLabel}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function Segments({ parts }: { parts: string | GuideSegment[] }) {
  if (typeof parts === "string") return <>{parts}</>;
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <Fragment key={i}>{part}</Fragment>
        ) : part.external ? (
          <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
            {part.label}
            <span className={legal.srOnly}> (opens in a new tab)</span>
          </a>
        ) : (
          <a key={i} href={part.href}>
            {part.label}
          </a>
        ),
      )}
    </>
  );
}

function Block({ block }: { block: GuideBlock }) {
  if (typeof block === "string" || Array.isArray(block)) {
    return (
      <p className={legal.paragraph}>
        <Segments parts={block} />
      </p>
    );
  }
  const ordered = "steps" in block;
  const items = ordered ? block.steps : block.list;
  const List = ordered ? "ol" : "ul";
  return (
    <List className={`${legal.list} ${ordered ? styles.steps : ""}`}>
      {items.map((item, i) => (
        <li key={i}>
          <Segments parts={item} />
        </li>
      ))}
    </List>
  );
}
