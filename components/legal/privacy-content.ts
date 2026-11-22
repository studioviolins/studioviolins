import { BUSINESS } from "@/components/site/business";
import type { LegalDoc } from "./types";

/**
 * Privacy policy for the new site, revised 22 Nov 2026 from the live policy (studioviolins.co.uk/privacy,
 * "last updated 29 July 2026") to match what this site actually does:
 *   - no accounts, cookies, local storage, analytics, advertising or embedded third-party content;
 *   - fonts, images and video are served from the site itself;
 *   - one contact form (name, email, message, an optional phone number, plus the player's height and suggested size when the visitor has
 *     chosen a height on the rental section's slider), emailed to Nick and not stored by the site; a short-lived,
 *     in-memory count per IP address limits spam (components/contact/actions.ts);
 *   - enquiries also arrive by WhatsApp or email, and rentals are paid by direct debit.
 * If the form changes, or analytics or any embed is ever added, update "Our website" first.
 * Open points (hosting provider, payment provider, retention periods, ICO registration, the date) are in
 * docs/nick-confirmation-checklist.md. Not legal advice; Nick may want it checked before launch.
 */
export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  intro: "How Studio Violins looks after your personal information.",
  updated: "22 November 2026",
  sections: [
    {
      heading: "Who we are",
      blocks: [
        `Studio Violins rents violins from ${BUSINESS.address}. We are the controller of the personal information described here: we decide how it’s used, and we’re responsible for looking after it.`,
        "We follow the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.",
      ],
    },
    {
      heading: "The information we collect",
      blocks: [
        "We ask only for what we need to help you choose an instrument and to arrange and look after your rental:",
        {
          list: [
            "your name and contact details: email address, phone number and postal address;",
            "details that help us choose the right instrument, such as the player’s age or height, or a size their teacher has recommended;",
            "details of your rental: the instrument and its size, collection, delivery, exchanges and returns, and our messages with you;",
            "the payment details needed to set up your monthly direct debit, which are collected by the direct debit provider we use.",
          ],
        },
        "You give us this information yourself: when you send a message through the contact form on this website (your name, email address and message, and, if you choose to add them, your phone number and the player’s height), when you message or email us, and when you arrange a rental.",
      ],
    },
    {
      heading: "Our website",
      blocks: [
        "This website has no accounts, and it doesn’t use cookies, analytics or advertising trackers.",
        "If you use the contact form, your name, email address, message and phone number (if you give one) are sent to us by email so we can reply; the website itself doesn’t keep them. If you choose a height on the size slider, the form shows it above the fields and sends it with your message, together with the suggested size when there is one. To help prevent spam, the website briefly keeps a count of recent messages from each IP address in memory, which is cleared within minutes. The WhatsApp and email links simply open WhatsApp or your own email app.",
        "Like any website, it is delivered by a hosting provider, which automatically records technical information when pages are requested, such as your IP address, browser type and the date and time of the request. This is used to deliver the site and keep it secure.",
        "Links to WhatsApp, Instagram, Google Maps and Google reviews take you to those services, and their own privacy policies apply there.",
      ],
    },
    {
      heading: "How we use your information",
      blocks: [
        {
          list: [
            "to answer your enquiries and help you choose the right instrument and size;",
            "to arrange collection, delivery, size exchanges and returns;",
            "to set up and collect your rental payments;",
            "to keep the records we need to run the business and meet our legal obligations, such as tax and accounting;",
            "to keep this website working and secure.",
          ],
        },
        "We don’t sell your personal information, and we don’t share it for anyone else’s marketing.",
      ],
    },
    {
      heading: "Our lawful bases",
      blocks: [
        {
          list: [
            "Contract: to provide your rental, and to take the steps you ask for before it begins.",
            "Legitimate interests: to answer enquiries, look after our instruments and keep our website secure, in ways you would reasonably expect.",
            "Legal obligation: to keep the financial records the law requires.",
            "Consent: if we ever ask to send you news or offers, we’ll do so only with your agreement, and you can withdraw it at any time.",
          ],
        },
      ],
    },
    {
      heading: "Who we share it with",
      blocks: [
        "We share personal information only with the service providers that help us run the rental, and only what each one needs:",
        {
          list: [
            "our direct debit provider, to set up and collect payments;",
            "courier companies, when an instrument is delivered or returned by courier;",
            "the providers of our email, messaging and website hosting.",
          ],
        },
        "We may also share information where the law requires it.",
      ],
    },
    {
      heading: "International transfers",
      blocks: [
        "Some of these providers, such as email and messaging services, may store information outside the UK. Where they do, we rely on the safeguards UK law provides, such as adequacy regulations or standard contractual clauses.",
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        "We keep personal information only for as long as we need it for the purposes above, including any period the law requires us to keep records, for example for tax and accounting.",
      ],
    },
    {
      heading: "Keeping it secure",
      blocks: ["We take appropriate steps to protect your personal information from loss, misuse and unauthorised access."],
    },
    {
      heading: "Your rights",
      blocks: [
        "You have the right to:",
        {
          list: [
            "ask for a copy of the personal information we hold about you;",
            "ask us to correct it if it’s wrong or incomplete;",
            "ask us to delete it;",
            "ask us to restrict how we use it, or object to how we use it;",
            "ask us to transfer it to you or to another organisation;",
            "withdraw your consent at any time, where we rely on consent.",
          ],
        },
        "Some of these rights apply only in certain circumstances; for example, we may need to keep records the law requires. To use any of them, please contact us using the details below.",
        {
          link: {
            before:
              "If you’re unhappy with how we’ve handled your information, please tell us first so we can put it right. You also have the right to complain to the Information Commissioner’s Office (ICO) at ",
            label: "ico.org.uk",
            href: "https://ico.org.uk/make-a-complaint/",
            after: ".",
          },
        },
      ],
    },
    {
      heading: "Children",
      blocks: [
        "Rentals are arranged by a parent, guardian or other adult. When a violin is for a child, we ask that adult only for the details needed to choose the right size, such as the child’s age or height.",
      ],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        "We’ll update this page if the way we use personal information changes. The date at the top shows when it was last revised.",
      ],
    },
  ],
  questions: {
    title: "Questions about your information",
    body: "If you have any questions about this policy or your personal information, please contact us.",
  },
};
