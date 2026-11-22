import type { Metadata } from "next";
import { LINKS } from "@/components/hero/content";
import { LineArrowIcon } from "@/components/hero/icons";
import styles from "@/components/seo/NotFound.module.css";
import SiteFooter from "@/components/site-footer/SiteFooter";
import SiteHeader from "@/components/site-header/SiteHeader";

// Next.js adds noindex to 404s itself; the home page's canonical and sharing details mustn't carry over.
export const metadata: Metadata = {
  title: "Page not found — Studio Violins",
  description: "This page isn’t on the Studio Violins site.",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

/** Any unknown address, including old links: a short message and three ways back. */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className={styles.page}>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>Page not found</p>
          <h1 className={styles.title}>Sorry, this page isn’t here.</h1>
          <p className={styles.body}>
            It may have moved, or the link may be out of date. Everything about renting a violin is on the home
            page.
          </p>
          <ul className={styles.links}>
            <li>
              <a href={LINKS.home} className={styles.primary}>
                Go to the home page
                <LineArrowIcon width={22} height={11} />
              </a>
            </li>
            <li>
              <a href={LINKS.pricing} className={styles.link}>
                See pricing
              </a>
            </li>
            <li>
              <a href={LINKS.contact} className={styles.link}>
                Talk to Nick
              </a>
            </li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
