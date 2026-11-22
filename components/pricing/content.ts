import pricingViolin from "@/assets/pricing-violin-transparent.png";
import { LINKS } from "@/components/hero/content";
import { NEW_PRICES_LIVE } from "./schedule";

/**
 * Rental pricing, in two sets that switch on 1 January 2027 (./schedule.ts decides which, when the site is built):
 *   - until then, the current prices, as on the live site: £65 upfront covering the first four months and the
 *     one-off subscription fee (£25), then £10 a month;
 *   - from 1 January 2027, the new prices set by Oliver on 22 Nov 2026: £56 upfront covering the first four
 *     months, no joining fee, then £14 a month.
 * Both: four-month minimum, direct debit from month five, free collection, delivery charged. The minimum term,
 * direct debit and return wording follow the Terms & Conditions (6.4, 6.6, 6.7, 10.1). Edit the figures here,
 * nowhere else: the FAQs read PRICE and NEW_PRICES_LIVE too, and terms clause 6.4 follows NEW_PRICES_LIVE.
 *
 * One rental arrangement in two stages, not two packages.
 */
export { NEW_PRICES_LIVE } from "./schedule";

export const PRICE = NEW_PRICES_LIVE
  ? { upfront: "£56", monthly: "£14", minimumTerm: "four months" }
  : { upfront: "£65", monthly: "£10", minimumTerm: "four months" };

export const PRICING = {
  title: "Simple, straightforward rental.",
  /** The two successive payments, shown side by side on wide screens: upfront, then per month. */
  stages: [
    { label: "First four months", amount: PRICE.upfront, unit: "upfront" },
    { label: "Then", amount: PRICE.monthly, unit: "per month" },
  ],
  /**
   * The terms behind the two prices, kept short: what the upfront payment covers, the minimum term, direct debit
   * from month five and when payments stop (Terms 6.4, 6.6, 6.7, 10.1); then the joining fee (none, from January),
   * collection and delivery.
   */
  details: NEW_PRICES_LIVE
    ? [
        `${PRICE.upfront} upfront covers your first ${PRICE.minimumTerm}, then ${PRICE.monthly} monthly. Four months is the minimum rental period. From month five, payments are by direct debit and stop at the end of the month you return the complete outfit.`,
        "No joining fee. Collection is free. Delivery charges apply.",
      ]
    : [
        `${PRICE.upfront} upfront covers your first ${PRICE.minimumTerm} and the one-off subscription fee, then ${PRICE.monthly} monthly. Four months is the minimum rental period. From month five, payments are by direct debit and stop at the end of the month you return the complete outfit.`,
        "Collection is free. Delivery charges apply.",
      ],
  cta: { label: "Start your rental", href: LINKS.contact },
  /**
   * Supporting image: the approved transparent violin and bow (2172 × 724 RGBA, 3:1), copied unchanged from
   * output/design/pricing-photo-handover/violin-transparent-v1-approved.png. Its own alpha channel lets the
   * section's green show through: no masks, fades or overlays. Show it whole at its own proportions; never
   * crop, reshape, recolour or add effects. It's an AI-produced image based on the live site's violin
   * photograph (see FOR-CLAUDE-final-transparent-pricing.txt in that folder), not a photograph of a rental
   * instrument, so nothing on the page may call it the rental violin, a model or the outfit. Open questions
   * for Nick are in docs/nick-confirmation-checklist.md.
   */
  photo: {
    image: pricingViolin,
    alt: "Violin and bow.",
  },
};
