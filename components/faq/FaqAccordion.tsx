"use client";

import { useId, useState } from "react";
import type { Faq } from "./content";
import styles from "./Faq.module.css";

/**
 * WAI-ARIA accordion: each question is a heading containing a button with aria-expanded and aria-controls;
 * its answer is hidden until opened. Several can be open at once. Enter / Space toggle (native buttons).
 * No role="region" on the panels: with eight answers, landmarks would add noise rather than help.
 */
export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const id = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <div className={styles.list}>
      {faqs.map((f, i) => {
        const isOpen = open.has(i);
        const qId = `${id}-q${i}`;
        const aId = `${id}-a${i}`;
        return (
          <div key={f.q} className={styles.item}>
            <h3 className={styles.question}>
              <button
                type="button"
                id={qId}
                aria-expanded={isOpen}
                aria-controls={aId}
                onClick={() => toggle(i)}
              >
                <span>{f.q}</span>
                <svg className={styles.icon} width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M1 7h12" />
                  <path className={styles.iconVertical} d="M7 1v12" />
                </svg>
              </button>
            </h3>
            <div id={aId} className={styles.answer} hidden={!isOpen}>
              {f.a.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              {f.more ? (
                <p className={styles.termsLink}>
                  <a href={f.more.href}>{f.more.label}</a>
                </p>
              ) : null}
              {f.terms ? (
                <p className={styles.termsLink}>
                  <a href={f.terms.href}>{f.terms.label}</a>
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
