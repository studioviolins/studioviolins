import { NEW_PRICES_LIVE } from "@/components/pricing/schedule";
import type { LegalDoc } from "./types";

/**
 * Studio Violins' instrument hire terms, carried over from the live site (studioviolins.co.uk/terms,
 * "last updated 29 July 2026") on 22 Nov 2026, with sentence-case headings and one stray line break fixed (6.1).
 * Changed on 22 Nov 2026 with Oliver's approval for Studio Violins, so the date below is that day (1 January 2027
 * once the new prices start):
 *   - 5.1–5.2: rental only; instruments aren't for sale and rental payments never count towards a purchase
 *     (the live terms allowed buying outright);
 *   - 6.4: from 1 January 2027, when the new prices start, no joining fee; until then it keeps the live wording
 *     with the one-off subscription invoice (components/pricing/schedule.ts decides, at build time, and the date
 *     below moves to 1 January 2027 with it);
 *   - 8.4–8.6 (wording set by Oliver): other repairs at reasonable cost, with no charge for normal wear and tear
 *     or faults that are Studio Violins' responsibility; minor repairs included (delivery at the customer's
 *     expense); replacement if lost, stolen or beyond repair at reasonable cost; repair and replacement charges
 *     together capped at £125 per rented outfit, per incident, applied separately to each outfit affected (the
 *     live terms charged full repair and replacement costs).
 *   - 9.1 (wording set by Oliver): strings damaged beyond repair charged at wholesale cost on return; normal wear
 *     not charged; counts towards the 8.6 limit when part of an incident (the live terms made renters replace worn
 *     or broken strings themselves). Nick replaces worn strings between rentals; the site doesn't say so;
 *   - 9.2 (wording set by Oliver): bow replacement for excessive bow-hair wear or damage beyond normal use at
 *     reasonable cost, capped at £40 per bow; counts towards the 8.6 limit when part of a damage incident (the live
 *     terms charged the full cost of a replacement bow).
 * These match the FAQs. Clauses still unclear or inconsistent are listed in docs/nick-confirmation-checklist.md;
 * update the date when any changes.
 */
export const TERMS: LegalDoc = {
  title: "Terms & Conditions",
  intro: "Terms for hiring an instrument from Studio Violins.",
  updated: NEW_PRICES_LIVE ? "1 January 2027" : "22 November 2026",
  sections: [
    {
      heading: "General",
      clauses: [
        ["1.1", "These Terms and Conditions apply to all instrument hires from Studio Violins."],
        ["1.2", "They replace any other terms you, the customer, may refer to, offer, or rely on at any stage — including printed or standard terms — unless we explicitly agree in writing to accept them."],
        ["1.3", "Any changes or special arrangements must be agreed in writing by us."],
      ],
    },
    {
      heading: "About our instrument descriptions",
      clauses: [
        ["2.1", "Any descriptions or photos of the instruments are simply to help identify them."],
        ["2.2", "You agree that you’re not relying on these descriptions when deciding to hire."],
      ],
    },
    {
      heading: "Delivery and collection",
      clauses: [
        ["3.1", "You are welcome to collect your instrument by appointment. This is our preferred method, as it allows us to hand the instrument over safely and ensure it leaves our care in excellent condition."],
        ["3.2", "If you are unable to collect, we’ll courier your instrument to the address you provide, aiming for the date you request."],
        ["3.3", "Please make sure someone is available to receive the instrument — instruments travel best when handed directly to a responsible person."],
        ["3.4", "If delivery isn’t possible due to circumstances on your end, we may need to store the instrument temporarily. We’ll always explain any storage costs before they’re applied."],
        ["3.5", "If anything looks damaged, missing, or not quite right when your instrument arrives, please let us know within seven days so we can put it right."],
      ],
    },
    {
      heading: "When responsibility passes to you",
      clauses: [
        ["4.1", "Once you receive the instrument — whether by collection or delivery — you’re responsible for it."],
        ["4.2", "If you collect the instrument yourself, responsibility starts as soon as it’s handed to you or set aside for collection."],
      ],
    },
    {
      heading: "Ownership of the instrument",
      clauses: [
        ["5.1", "The instrument remains the property of Studio Violins at all times."],
        ["5.2", "Studio Violins provides a rental service only. Instruments are not available to buy, and rental payments do not count towards a purchase."],
      ],
    },
    {
      heading: "Price and payment",
      clauses: [
        ["6.1", "The total price is our advertised rate minus any discount we’ve agreed with you in writing."],
        ["6.2", "VAT does not apply."],
        ["6.3", "We do not offer credit terms."],
        [
          "6.4",
          NEW_PRICES_LIVE
            ? "You must pay for your initial four month minimum term when you collect your instrument. There is no joining fee."
            : "You must pay your initial four month minimum term plus the one off subscription invoice when you collect your instrument.",
        ],
        ["6.5", "If we arrange delivery through a courier service, your initial payment — plus courier costs — must clear before we dispatch the instrument."],
        ["6.6", "Your next payment will be the first monthly charge starting from month five of your hire."],
        ["6.7", "Your monthly direct debit will be stopped by us at the end of the month in which you return the complete instrument outfit."],
      ],
    },
    {
      heading: "Late payments and failed fees",
      clauses: [
        ["7.1", "If your monthly payment is late, we may charge daily interest on the overdue amount."],
        ["7.2", "Interest is calculated at 4% per year above the Bank of England base rate."],
        ["7.3", "You must also cover any banking fees we incur if your card expires or your bank cannot complete the payment."],
        ["7.4", "If you fail to pay, we reserve the right to request that you return the instrument straight away, at your expense."],
        ["7.5", "We are not responsible for any issues or financial losses caused by suspending or ending your hire agreement."],
        ["7.6", "We may change your payment terms before allowing the hire agreement to continue."],
      ],
    },
    {
      heading: "Damage or loss",
      clauses: [
        ["8.1", "While the instrument is with you, please look after it as you would any musical instrument."],
        ["8.2", "If anything happens — damage, deterioration, or loss — please tell us straight away."],
        ["8.3", "Don’t try to fix it yourself. Instruments can be delicate, and even small issues can affect their sound or reliability."],
        ["8.4", "You are responsible for the reasonable cost of repairs not included in your rental, subject to the combined limit in clause 8.6. You will not be charged for normal wear and tear or faults that are our responsibility."],
        ["8.5", "Minor repairs are included in your hire, but delivery is at your expense."],
        ["8.6", "If all or part of a rented outfit is lost, stolen, or damaged beyond repair, you are responsible for the reasonable replacement cost of the affected items, subject to the exclusions in clause 8.4. The combined repair and replacement charge is capped at £125 per rented outfit, per incident. An outfit consists of one violin and its supplied bow, case and accessories. If more than one outfit is affected by the same incident, the cap applies separately to each affected outfit."],
        ["8.7", "If you ever need advice on safe storage, handling, or transport — especially if you’re considering using a courier — we’re here to help."],
      ],
    },
    {
      heading: "Ongoing maintenance",
      clauses: [
        ["9.1", "If the instrument is returned with strings damaged beyond repair, you will be charged the wholesale cost of replacing the affected strings. Normal wear and tear and faults that are our responsibility are not chargeable. Any string replacement charges arising from an incident count towards the £125 per rented outfit, per incident limit in clause 8.6."],
        ["9.2", "If a bow needs replacing because of excessive bow-hair wear or damage beyond normal use, you are responsible for the reasonable replacement cost, capped at £40 per bow. Normal wear and tear and faults that are our responsibility are not chargeable. Where a bow replacement forms part of a damage incident, its charge counts towards the £125 per rented outfit, per incident limit in clause 8.6."],
        ["9.3", "If your instrument is returned to us with inappropriate replacement strings or bow, we will charge the wholesale cost of replacing them."],
      ],
    },
    {
      heading: "Returning your instrument",
      clauses: [
        ["10.1", "You can return your instrument any time after the first four months of hire. (If you return it before this time, we are unable to offer any reimbursement.)"],
        ["10.2", "Returns are normally made in person, by appointment, so we can receive and check the instrument properly."],
        ["10.3", "To arrange a return, just email us and we’ll book a time that works for you."],
        ["10.4", "If you cannot return the instrument in person, a courier service may be used — but only as a secondary option and only with our prior agreement."],
        ["10.5", "If using a courier, please contact us first so we can advise on safe packaging."],
        ["10.6", "Courier costs are your responsibility."],
      ],
    },
    {
      heading: "Our liability",
      clauses: [
        ["11.1", "If something goes wrong, our maximum liability is the amount you’ve paid under the hire contract."],
        ["11.2", "We do not exclude liability for death or personal injury caused by our negligence."],
      ],
    },
    {
      heading: "Intellectual property",
      clauses: [
        ["12.1", "Any intellectual property created as part of our service belongs to us."],
        ["12.2", "You agree to help us secure those rights if needed."],
      ],
    },
    {
      heading: "Events outside our control",
      clauses: [
        ["13.1", "We’re not responsible for delays or failures caused by things outside our control (e.g., extreme weather, strikes, accidents, supply chain issues)."],
        ["13.2", "We may take extra time to fulfil our obligations if needed."],
        ["13.3", "If the delay becomes unreasonable, we may end the contract without liability."],
      ],
    },
    {
      heading: "Our relationship",
      clauses: [["14.1", "This agreement doesn’t create a partnership, joint venture, or agency relationship between us."]],
    },
    {
      heading: "Assignment and subcontracting",
      clauses: [["15.1", "You can’t transfer your hire agreement or pass your responsibilities to someone else without our written permission."]],
    },
    {
      heading: "Waiver",
      clauses: [["16.1", "If we don’t enforce a term straight away, it doesn’t mean we won’t enforce it later."]],
    },
    {
      heading: "If part of this agreement is invalid",
      clauses: [["17.1", "If a court decides any part of this agreement is invalid, the rest still applies."]],
    },
    {
      heading: "Governing law",
      clauses: [
        ["18.1", "This agreement is governed by English law."],
        ["18.2", "Any disputes will be handled by the English courts."],
      ],
    },
  ],
  questions: {
    title: "Questions about these terms",
    body: "If you have any questions about these terms and conditions, please contact us.",
  },
};
