"use client";

import { useCallback, useEffect, useId, useRef, useState, type FocusEvent, type MouseEvent } from "react";
import { LINKS } from "@/components/hero/content";
import { LineArrowIcon } from "@/components/hero/icons";
import styles from "./SiteHeader.module.css";

/** In page order. The last one is the contact button. */
const SECTIONS = [
  { id: "prices", label: "Pricing", href: LINKS.pricing },
  { id: "about", label: "Meet Nick", href: LINKS.meetNick },
  { id: "faqs", label: "FAQs", href: LINKS.faqs },
];
const CTA = { id: "contact", label: "Contact Nick", href: LINKS.contact };
const ALL = [...SECTIONS, CTA];

/** The compact bar's height plus a little air (kept in step with `scroll-padding-top` in globals.css). */
const BAR_OFFSET = 72;
/** Must match the breakpoint in SiteHeader.module.css where the Menu button replaces the links. */
const MENU_QUERY = "(max-width: 820px)";

type Props = {
  /**
   * Home page: the header sits transparently over the hero, as it always has, and a compact solid bar takes over
   * once the hero has scrolled away. Other pages (terms, privacy) show the solid bar throughout.
   */
  overHero?: boolean;
};

export default function SiteHeader({ overHero = false }: Props) {
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);

  const mode = !overHero ? "static" : pastHero ? "bar" : "top";

  const closeMenu = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) menuButtonRef.current?.focus();
  }, []);

  // Over the hero or past it: the hero marks itself with data-site-hero.
  useEffect(() => {
    if (!overHero) return;
    const hero = document.querySelector("[data-site-hero]");
    if (!hero) {
      setPastHero(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
        setOpen(false); // the header changes shape here, so a menu left open would jump
      },
      { rootMargin: `-${BAR_OFFSET}px 0px 0px 0px` },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [overHero]);

  // The section being read: the last one whose top has passed a line a third of the way down the screen.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = BAR_OFFSET + window.innerHeight * 0.3;
      let next: string | null = null;
      for (const { id } of ALL) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) next = id;
      }
      // Contact is short and last, so its top may never reach the line; at the foot of the page it's the one in view.
      const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (next && atEnd) next = CTA.id;
      setCurrent(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  // While the menu is open: Escape closes it (focus back on Menu), so do a tap outside or widening to desktop.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) closeMenu(false);
    };
    const wide = window.matchMedia(MENU_QUERY);
    const onWidth = () => {
      if (!wide.matches) closeMenu(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWidth);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWidth);
    };
  }, [open, closeMenu]);

  // Tabbing out of the header closes the menu.
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (open && !event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
  };

  // On the home page the logo glides back to the top (instantly if motion is reduced); elsewhere it goes home.
  const onLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (window.location.pathname !== "/") return;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (window.location.hash) window.history.replaceState(window.history.state, "", "/");
  };

  const ariaCurrent = (id: string) => (current === id ? ("location" as const) : undefined);

  return (
    <header ref={headerRef} className={styles.header} data-mode={mode} data-open={open || undefined} onBlur={onBlur}>
      <a href={LINKS.home} className={styles.logo} aria-label="Studio Violins home" onClick={onLogoClick}>
        Studio <span>Violins</span>
      </a>

      <nav aria-label="Main" className={styles.nav}>
        <ul className={styles.links}>
          {SECTIONS.map((item) => (
            <li key={item.id}>
              <a href={item.href} className={styles.link} aria-current={ariaCurrent(item.id)}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href={CTA.href} className={styles.cta} aria-current={ariaCurrent(CTA.id)}>
              {CTA.label}
              <LineArrowIcon width={20} height={10} />
            </a>
          </li>
        </ul>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon open={open} />
          Menu
        </button>

        <div id={panelId} className={styles.panel} hidden={!open}>
          <ul className={styles.panelLinks}>
            {SECTIONS.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={styles.panelLink}
                  aria-current={ariaCurrent(item.id)}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={CTA.href}
            className={styles.panelCta}
            aria-current={ariaCurrent(CTA.id)}
            onClick={() => setOpen(false)}
          >
            {CTA.label}
            <LineArrowIcon width={22} height={11} />
          </a>
        </div>
      </nav>
    </header>
  );
}

/** Three lines that become a cross while the menu is open. */
function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <path d="M4 4l10 10M14 4 4 14" />
      ) : (
        <path d="M2.5 5h13M2.5 9h13M2.5 13h13" />
      )}
    </svg>
  );
}
