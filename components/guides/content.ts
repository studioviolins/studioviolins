import { LINKS } from "@/components/hero/content";
import { SIZE_GUIDE_ID } from "@/components/instrument/size-selection";
import { NEW_PRICES_LIVE, PRICE } from "@/components/pricing/content";
import { AREAS_TEXT, BUSINESS } from "@/components/site/business";
import type { Guide } from "./types";

/**
 * The three supporting guides (regional SEO brief, 22 Nov 2026): collection and delivery, a guide for violin
 * teachers, and starting the violin. Every statement comes from what the site already publishes, so nothing
 * here is new policy:
 *   - areas served: components/site/business.ts (AREAS_SERVED, confirmed by Oliver, 22 Nov 2026);
 *   - collection, courier delivery, storage, the seven-day check, exchanges and returns: the FAQs and the rental
 *     terms (3.1 to 3.5, 6.5, 10.1 to 10.6). Delivery is charged and quoted on request; no price, timescale or
 *     guarantee is given because none is published;
 *   - preparation, outfit, sizing advice and care: the rental section, the FAQs and the approved height ranges
 *     (components/instrument/height-sizes.ts: full size from 150 cm);
 *   - prices: PRICE and NEW_PRICES_LIVE, so these pages switch with the pricing section on 1 January 2027.
 * Not claimed: teacher partnerships, discounts or consultations, lessons, trials, insurance, short-term hire,
 * sales, instrument models, stock or reply and preparation times. New advice in Nick's name needs his review.
 * Plain British English, no em dashes, "size" rather than "fit".
 */

const HEIGHT_GUIDE = `/#${SIZE_GUIDE_ID}`;
const TERMS = (n: number) => `${LINKS.terms}#terms-${n}`;

const PRICE_SENTENCE = NEW_PRICES_LIVE
  ? `${PRICE.upfront} upfront covers the first ${PRICE.minimumTerm}, and there’s no joining fee. From month five, the rental continues at ${PRICE.monthly} a month by direct debit, for as long as you need the violin.`
  : `${PRICE.upfront} upfront covers the first ${PRICE.minimumTerm} and the one-off subscription fee. From month five, the rental continues at ${PRICE.monthly} a month by direct debit, for as long as you need the violin.`;

const PREPARATION =
  "Every violin is carefully selected and expertly prepared, with superior strings, a high-quality bridge and precise adjustment to enhance tone and playability.";

const BETWEEN_SIZES =
  "If the player is between sizes, we recommend the smaller violin, as an instrument on the large side can be harder to play.";

const RENTAL_ONLY =
  "Studio Violins provides a rental service only. Instruments aren’t available to buy, and rental payments don’t count towards a purchase.";

export const DELIVERY: Guide = {
  path: "/delivery",
  linkLabel: "Collection and delivery",
  seo: {
    title: "Violin Rental Collection and Delivery | Studio Violins",
    description: `Collect your rental violin free in Hitchin, by appointment, or have it sent by courier within ${AREAS_TEXT}.`,
  },
  title: "Collection and delivery",
  intro: `Studio Violins is based in Hitchin and rents violins across ${AREAS_TEXT}. You can collect your violin in Hitchin or have it delivered by courier.`,
  sections: [
    {
      id: "areas",
      heading: "Areas we serve",
      blocks: [
        `We rent violins across ${AREAS_TEXT}. In Cambridge, that means the city rather than the wider county of Cambridgeshire.`,
        `Our only base is in Hitchin, at ${BUSINESS.address}. Visits are by appointment.`,
      ],
    },
    {
      id: "collection",
      heading: "Collecting your violin in Hitchin",
      blocks: [
        "Collection is free and by appointment. It’s our preferred way, because we can hand the violin over safely and make sure it leaves our care in excellent condition.",
        [
          "Our opening hours are Monday to Saturday, 9am to 5pm, and we’re closed on Sundays. Visits are by appointment only. ",
          { label: "Get directions", href: BUSINESS.directions, external: true },
        ],
      ],
    },
    {
      id: "courier",
      heading: "Delivery by courier",
      blocks: [
        `If you can’t collect, we can send your violin by courier to an address in ${AREAS_TEXT}, aiming for the date you request.`,
        "Delivery is charged: ask us about the cost for your address when you get in touch. Your first payment and the courier cost must clear before the violin is sent.",
        "Please make sure someone is available to receive it, as instruments travel best when handed directly to a responsible person. If delivery isn’t possible because of circumstances on your side, we may need to store the violin for a short time, and we’ll always explain any storage costs before they apply.",
        "If anything looks damaged, missing or not quite right when it arrives, let us know within seven days so we can put it right.",
      ],
    },
    {
      id: "changing-size",
      heading: "Changing size",
      blocks: [
        "As a child grows, they can move up to the next size free of charge, subject to availability. Give us as much notice as you can. Collection is free; if you need the new size delivered, ask us about courier costs.",
      ],
    },
    {
      id: "returns",
      heading: "Returning your violin",
      blocks: [
        `You can return your violin any time after the first ${PRICE.minimumTerm}. Returns are made in person in Hitchin, by appointment: contact us to arrange a time.`,
        "If you can’t return it in person, a courier can be used, but only with our prior agreement and at your cost. Please contact us first so we can advise on safe packaging.",
        `Your direct debit runs until the end of the month in which the complete outfit is returned, and we then cancel it. A violin returned within the first ${PRICE.minimumTerm} can’t be refunded.`,
        [
          "The full details are in the rental terms: ",
          { label: "delivery and collection", href: TERMS(3) },
          " and ",
          { label: "returning your instrument", href: TERMS(10) },
          ".",
        ],
      ],
    },
  ],
};

export const FOR_TEACHERS: Guide = {
  path: "/for-teachers",
  linkLabel: "For violin teachers",
  seo: {
    title: "For Violin Teachers: Renting for Pupils | Studio Violins",
    description: `How to refer a pupil to Studio Violins in Hitchin, pass on your size recommendation, and what the rental includes. ${AREAS_TEXT}.`,
  },
  title: "For violin teachers",
  intro:
    "When a pupil needs a violin, Studio Violins can rent them a carefully prepared instrument. Here’s how a referral works and what the pupil’s family can expect.",
  sections: [
    {
      id: "referring",
      heading: "Referring a pupil",
      blocks: [
        "Pass our details on to the pupil’s parent or guardian, or to the pupil if they’re an adult. They can send a message through this website, on WhatsApp or by email. There’s nothing for you to sign up to.",
        [
          `We rent violins across ${AREAS_TEXT}. Families can collect in Hitchin or have the violin delivered by courier: see `,
          { label: "collection and delivery", href: "/delivery" },
          ".",
        ],
      ],
    },
    {
      id: "size",
      heading: "Passing on your size recommendation",
      blocks: [
        "If you’ve recommended a size, ask the family to include it in their enquiry, and we’ll take it into account when choosing the instrument.",
        [
          "Families without a recommendation can use our ",
          { label: "height guide", href: HEIGHT_GUIDE },
          ", which gives a starting suggestion from the player’s height. Where a pupil is between sizes, we recommend the smaller violin, as an instrument on the large side can be harder to play.",
        ],
        "If a pupil has particular sizing needs, for instance smaller than average hands, the family can contact Nick directly to talk it through. If the violin is needed for an upcoming lesson, they can mention the date in their enquiry.",
      ],
    },
    {
      id: "outfit",
      heading: "What the pupil receives",
      blocks: [
        `${PREPARATION} Violins may be new or carefully refurbished, and each one is checked and prepared to the same high standard.`,
        "The outfit includes a bow, case, shoulder rest and rosin. Advice on sizing, care and set-up is included throughout the rental.",
      ],
    },
    {
      id: "growing",
      heading: "As pupils grow",
      blocks: [
        "Pupils can move up to the next size free of charge, subject to availability. Families should give us as much notice as they can.",
      ],
    },
    {
      id: "basics",
      heading: "Rental basics for families",
      blocks: [
        {
          list: [
            PRICE_SENTENCE,
            "Four months is the minimum rental period. Payments stop at the end of the month in which the complete outfit is returned.",
            "Collection in Hitchin is free; courier delivery is charged.",
            RENTAL_ONLY,
            "Renters should check with Nick before replacing strings or bows, as non-matching replacements are chargeable.",
          ],
        },
        ["Full details are in the ", { label: "rental terms", href: LINKS.terms }, "."],
      ],
    },
  ],
};

export const STARTING_VIOLIN: Guide = {
  path: "/starting-violin",
  linkLabel: "Starting the violin",
  seo: {
    title: "Starting the Violin: Renting a First Violin | Studio Violins",
    description:
      "A practical guide for parents and adult beginners: getting a violin, what the rental outfit includes, choosing a size and what happens next.",
  },
  title: "Starting the violin",
  intro:
    "Whether a child is starting lessons, you’re an adult beginner or you’re returning to playing, the first practical step is a violin in the right size. Here’s how renting one works.",
  sections: [
    {
      id: "getting-a-violin",
      heading: "Getting a violin",
      blocks: [
        "Renting gives a new player a carefully prepared instrument without buying one. As a child grows, the violin can be exchanged for the next size, free of charge and subject to availability.",
        "Renting is also a practical option for pupils moving on from a school loan instrument, and for families looking into the violin as a creative activity for their child.",
        RENTAL_ONLY,
      ],
    },
    {
      id: "outfit",
      heading: "What the rental outfit includes",
      blocks: [
        {
          list: [
            "a violin, new or carefully refurbished, selected for its tone and playability;",
            "a bow, case, shoulder rest and rosin;",
            "advice on sizing, care and set-up throughout your rental.",
          ],
        },
        PREPARATION,
      ],
    },
    {
      id: "choosing-a-size",
      heading: "Choosing a size",
      blocks: [
        "If a teacher has recommended a size, include it in your enquiry.",
        [
          "Otherwise, our ",
          { label: "height guide", href: HEIGHT_GUIDE },
          " gives a starting suggestion from the player’s height. It’s a starting point rather than a guarantee, and you don’t need a measurement to get in touch.",
        ],
        BETWEEN_SIZES,
        "Most adults play a full-size (4/4) violin, and our height guide suggests full size from 150 cm.",
      ],
    },
    {
      id: "adults",
      heading: "Adult beginners and returning players",
      blocks: [
        "Adults rent in the same way: get in touch, tell us a little about your playing, and we’ll help you choose the right instrument and size.",
      ],
    },
    {
      id: "costs",
      heading: "What it costs",
      blocks: [
        PRICE_SENTENCE,
        [
          "Collection in Hitchin is free, and courier delivery is charged. See ",
          { label: "pricing", href: LINKS.pricing },
          " and ",
          { label: "collection and delivery", href: "/delivery" },
          ".",
        ],
      ],
    },
    {
      id: "next-steps",
      heading: "What happens next",
      blocks: [
        {
          steps: [
            "Get in touch through the contact form, WhatsApp or email, and tell us about the player. Include a teacher’s size recommendation if you have one, and the date of any upcoming lesson.",
            "We help you choose the right instrument and size.",
            `We arrange collection in Hitchin, or courier delivery in ${AREAS_TEXT}.`,
            `Your ${PRICE.upfront} upfront payment covers the first ${PRICE.minimumTerm}. After that, payments are monthly by direct debit until you return the violin.`,
          ],
        },
      ],
    },
    {
      id: "care",
      heading: "Looking after the violin",
      blocks: [
        "Loosen the bow hair after playing and gently wipe away rosin dust with a soft cloth, taking care around the bridge.",
        [
          "Check with Nick before replacing strings or bows, as non-matching replacements are chargeable. See the ",
          { label: "rental terms", href: TERMS(9) },
          " for full details and charge limits.",
        ],
      ],
    },
  ],
};

/** In the order they're linked from the footer and from each other. */
export const GUIDES = [STARTING_VIOLIN, FOR_TEACHERS, DELIVERY];

/** The closing block on every guide: the same routes as the contact section. */
export const GUIDE_CONTACT = {
  title: "Arrange a rental",
  body: "Tell us about the player. We’ll help you choose the right instrument and size, then arrange collection or delivery.",
  formLabel: "Send a message",
  formHref: LINKS.contact,
};
