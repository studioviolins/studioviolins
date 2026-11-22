import { LINKS } from "@/components/hero/content";
import { NEW_PRICES_LIVE, PRICE } from "@/components/pricing/content";

/**
 * FAQs, adapted from the live site's FAQ answers and its rental Terms & Conditions (studioviolins.co.uk/terms,
 * "last updated 29 July 2026"), both read on 22 Nov 2026. The source for each answer is noted beside it.
 * Only what those sources state is said here; open points (violin models and playing levels, whether the
 * one-week preparation time still holds, sizes in stock, courier coverage and charges) are in
 * docs/nick-confirmation-checklist.md, not on the page.
 * One deliberate change from the live site, per the brief: measuring is optional in the first enquiry. Answers whose
 * wording Oliver set are marked as such beside them.
 *
 * Questions marked `awaitingNick` have their place in the list but no answer yet, and never appear on the page
 * (in development or production) until Nick has confirmed the facts: write the answer into `a` and remove the
 * flag. Draft wording and the questions for Nick are in the checklist (sections 3 and 4).
 */
export type Faq = {
  q: string;
  a: string[];
  /** A link under the answer to the matching section of the rental terms (/terms). */
  terms?: { label: string; href: string };
  /** Kept off the page until Nick confirms the answer. */
  awaitingNick?: boolean;
};

/** Section headings on /terms carry ids terms-1 … terms-18 (components/legal/LegalPage.tsx). */
const termsSection = (n: number) => ({
  label: `See section ${n} of the rental terms`,
  href: `${LINKS.terms}#terms-${n}`,
});

export const FAQ_COPY = {
  title: "Frequently asked questions.",
  intro: "If your question isn’t here, get in touch.",
  contactLabel: "Talk to Nick",
  contactHref: LINKS.contact,
  termsLabel: "Full rental terms",
  termsHref: LINKS.terms,
};

export const FAQS: Faq[] = [
  {
    // Wording set by Oliver (22 Nov 2026), shortened from the live FAQ "What size violin will I need?" (teacher's
    // size first); measuring stays optional per the brief.
    q: "What size violin do I need?",
    a: [
      "If a teacher has recommended a size, include it in your enquiry. Otherwise, use our height guide or contact us for advice. You don’t need a measurement to get in touch.",
    ],
  },
  {
    // Settled: new or carefully refurbished (next question); D'Addario Prelude strings, a high-quality bridge and
    // precise adjustment; mainly from The Sound Post, with some Stentor (live FAQ). Awaiting Nick: the specific
    // models (by size) and which playing levels they suit. The 3D violin is illustrative only: Primavera 150 photos
    // were the model's reference, not confirmation of what's supplied, so don't name a model from it.
    q: "Which violins do you supply?",
    a: [],
    awaitingNick: true,
  },
  {
    // Wording set by Oliver (22 Nov 2026); Nick to confirm (checklist, section 3). It must not suggest every
    // instrument is refurbished: some are new.
    q: "Will my violin be new?",
    a: [
      "Your violin may be new or carefully refurbished. Some players particularly appreciate instruments that have already been played in. Nick selects each violin for its tone and playability, and every instrument is checked and prepared to the same high standard before it reaches you.",
    ],
  },
  {
    // Terms 3.1, 3.2, 3.5, 6.5; live prices section "Free collection; delivery is charged for."
    q: "Can I collect the violin, or can it be delivered?",
    a: [
      "Collection in Hitchin is free, by appointment. If you can’t collect, the violin can be sent by courier; delivery is charged, and paid with your first payment before it’s sent.",
      "If anything looks damaged or missing when it arrives, let us know within seven days.",
    ],
  },
  {
    // Terms 6.4, 6.6. Until 1 January 2027 the upfront payment also covers the one-off subscription fee; from then
    // there's no joining fee (new prices set by Oliver on 22 Nov 2026; components/pricing/schedule.ts).
    q: "Is there a minimum rental period?",
    a: [
      `Yes, the first ${PRICE.minimumTerm}. The ${PRICE.upfront} upfront payment covers them, ${NEW_PRICES_LIVE ? "and there’s no joining fee" : "together with the one-off subscription fee"}. From month five, the rental continues at ${PRICE.monthly} a month by direct debit, for as long as you need the violin.`,
    ],
  },
  {
    // Live "Support included — on-going support, included in the subscription fee"; live care FAQ. There is no
    // subscription or joining fee for new rentals any more (22 Nov 2026), so support is "included in your rental".
    q: "What does ongoing support include?",
    a: [
      "Advice throughout your rental: on sizing, care and set-up, and on what to do if something doesn’t seem right. It’s included in your rental.",
      "Support is advice and help; it isn’t insurance. Responsibility for damage and maintenance is explained below.",
    ],
  },
  {
    // Wording set by Oliver for Studio Violins (22 Nov 2026): a short summary of terms 9.1–9.3, which hold the
    // details and limits (strings damaged beyond repair at wholesale cost; bows capped at £40; both counting towards
    // the £125 outfit limit in an incident; non-matching replacements chargeable). Fitted strings: D'Addario
    // Prelude. Nick replaces worn strings between rentals; by choice, the FAQ doesn't explain that.
    q: "What maintenance am I responsible for?",
    a: [
      "Loosen the bow hair after playing and gently wipe away rosin dust with a soft cloth, taking care around the bridge.",
      "Normal wear and tear and faults that are our responsibility are not chargeable. Strings returned damaged beyond repair are charged at wholesale cost. Chargeable bow replacements are capped at £40 per bow.",
      "Check with Nick before replacing strings or bows, as non-matching replacements are chargeable. See our rental terms for full details and charge limits.",
    ],
    terms: termsSection(9),
  },
  {
    // Terms 4.1, 8.2–8.6; live care FAQ "don't try to fix it yourself". Minor repairs included, delivery at the
    // customer's expense: confirmed by Oliver for Studio Violins on 22 Nov 2026 (clause 8.5 now says the same).
    // Answer wording set by Oliver the same day, including the £125 cap (per rented outfit, per incident) and no
    // charge for wear and tear or faults that are Studio Violins' responsibility. Terms 8.4–8.6 say the same
    // (changed the same day).
    // These damage limits are not an insurance policy. Whether Nick offers any insurance product is an optional
    // service still to clarify (checklist, "Optional services"); don't assume one.
    q: "What if the violin is damaged or lost?",
    a: [
      "Minor repairs are included in your rental, with any delivery costs payable by you.",
      "If all or part of the outfit is lost or damaged, you are responsible for the reasonable cost of repairs not included in your rental, or replacement of the affected items. The total repair or replacement charge is capped at £125 per rented outfit, per incident. Each outfit includes one violin and its supplied bow, case and accessories. If multiple outfits are affected by the same incident, this limit applies separately to each affected outfit.",
      "You will not be charged for normal wear and tear or faults that are our responsibility.",
    ],
    terms: termsSection(8),
  },
  {
    // Live "Free upsizing … subject to availability"; live FAQ asks for notice; live "Free collection; delivery is charged for."
    q: "How do size exchanges work?",
    a: [
      "As your child grows, they can move up to the next size free of charge, subject to availability. Give us as much notice as you can. Collection is free; if you need the new size delivered, ask us about courier costs.",
    ],
  },
  {
    // Terms 6.7, 10.1–10.4, 10.6; live FAQ "How do I return my rental violin?"
    q: "How do I return the violin, and when do payments stop?",
    a: [
      `You can return it any time after the first ${PRICE.minimumTerm}. Contact us to arrange a time. Returns are in person, by appointment; a courier can be used only by prior agreement, at your cost.`,
      `Your direct debit runs until the end of the month in which the complete outfit is returned, and we then cancel it. A violin returned within the first ${PRICE.minimumTerm} can’t be refunded.`,
    ],
    terms: termsSection(10),
  },
  {
    // Wording set by Oliver for Studio Violins (22 Nov 2026): rental only. Instruments aren't for sale, and rental
    // payments never count towards a purchase. Nowhere on the site may suggest discussing purchase prices, buying
    // advice or rental credit with Nick. Terms 5.1–5.2 say the same (changed the same day).
    q: "Can I buy my rental violin?",
    a: [
      "No. Studio Violins provides a rental service only. Instruments are not available to buy, and rental payments do not count towards a purchase.",
    ],
    terms: termsSection(5),
  },
];

/** What the page shows: confirmed answers only. */
export const PUBLISHED_FAQS = FAQS.filter((faq) => !faq.awaitingNick && faq.a.length > 0);
