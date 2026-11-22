import { ANALYTICS_ENABLED } from "@/components/analytics/config";
import { BUSINESS } from "@/components/site/business";
import type { LegalDoc, LegalSection } from "./types";

/**
 * Privacy policy for the new site, revised 22 Nov 2026 from the live policy (studioviolins.co.uk/privacy,
 * "last updated 29 July 2026") to match what this site actually does:
 *   - no accounts, cookies, local storage, analytics, advertising or embedded third-party content;
 *   - fonts, images and video are served from the site itself;
 *   - one contact form (name, email, message, an optional phone number, plus the player's height and suggested size when the visitor has
 *     chosen a height on the rental section's slider), emailed to Nick and not stored by the site; a short-lived,
 *     in-memory count per IP address limits spam (components/contact/actions.ts);
 *   - enquiries also arrive by WhatsApp or email, and rentals are paid by direct debit.
 *
 * Analytics: the wording follows components/analytics/config.ts. While NEXT_PUBLIC_GA_MEASUREMENT_ID is unset, the
 * page says the site uses no cookies or analytics, which is true. Once it is set and the site rebuilt, "Our website"
 * changes, an "Analytics and cookies" section appears (anchor #privacy-analytics, linked from the first-visit notice),
 * and Google is added to the lawful basis, sharing and transfers text. Analytics (GA4 property G-DTHTWQM125) was
 * switched on with an "Accept" banner on 23 Nov 2026, then made default-on with "Turn analytics off" under the UK's
 * statistical-purposes exception for analytics cookies. That wording relies on the GA settings recorded in
 * docs/seo-geo-aeo-handover-2026-11-22.md (no ads links, Google signals, data sharing or ads personalisation);
 * if any of those change, this page must change first. GA_RETENTION must match GA's "User data retention".
 * If the form changes, or any embed is ever added, update "Our website" first.
 * Open points (hosting provider, payment provider, retention periods, ICO registration, the date) are in
 * docs/nick-confirmation-checklist.md. Not legal advice; Nick may want it checked before launch.
 */
/** Admin > Data collection and modification > Data retention > "User data retention" in the GA property. */
const GA_RETENTION = "14 months";

/** Shown only when analytics is configured (see the note above). */
const ANALYTICS_SECTION: LegalSection = {
  heading: "Analytics and cookies",
  id: "privacy-analytics",
  blocks: [
    "We use Google Analytics only to produce statistics about how this website is used, such as how many people visit, which pages they look at, which websites sent them here and how many enquiries are sent, so we can see what helps and improve the site. We look at totals, not at individual visitors. We don’t use it for advertising, and we don’t use it to build a profile of you or to make decisions about you.",
    "Google Analytics is on unless you turn it off. It sets cookies (named _ga and _ga_ followed by a code) that tell one visit from another, and records the pages you visit, the website that referred you, your browser and device type, and your approximate location, which Google works out from your IP address. It also records when the contact form sends a message, when a WhatsApp or email link is used, and when you continue from the size guide to the form, and it may record general interactions such as how far down a page you scroll, when you start filling in the form (not what you type) and when you follow a link to another website. We don’t send Google your name, contact details, the player’s height or size, or anything you type into the form, and page addresses are sent without any details added to them, apart from campaign tags.",
    "Google provides Google Analytics to us as a service provider and processes the data on our behalf. We have turned off Google signals, advertising features, ads personalisation and sharing the data with Google for its own purposes, and Google Analytics isn’t linked to any advertising account. Detailed records are deleted after " +
      GA_RETENTION +
      ".",
    "You can turn analytics off at any time, free and in one click: choose “Turn analytics off” on the notice shown on your first visit, or at the bottom of any page. The analytics cookies are then deleted, and nothing more is sent to Google Analytics from your browser. Your choice is remembered in your browser’s storage (not in a cookie) on that browser and device, and you can turn analytics back on in the same place. If your browser blocks website storage, we can’t remember a choice, so analytics stays off.",
  ],
};

export const PRIVACY: LegalDoc = {
  title: "Privacy Policy",
  intro: "How Studio Violins looks after your personal information.",
  updated: ANALYTICS_ENABLED ? "23 November 2026" : "22 November 2026",
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
        ANALYTICS_ENABLED
          ? "This website has no accounts and no advertising trackers. It uses Google Analytics to produce statistics that help us improve it, unless you turn it off, as explained in the next section."
          : "This website has no accounts, and it doesn’t use cookies, analytics or advertising trackers.",
        "If you use the contact form, your name, email address, message and phone number (if you give one) are sent to us by email so we can reply; the website itself doesn’t keep them. If you choose a height on the size slider, the form shows it above the fields and sends it with your message, together with the suggested size when there is one. To help prevent spam, the website briefly keeps a count of recent messages from each IP address in memory, which is cleared within minutes. The WhatsApp and email links simply open WhatsApp or your own email app.",
        "Like any website, it is delivered by a hosting provider, which automatically records technical information when pages are requested, such as your IP address, browser type and the date and time of the request. This is used to deliver the site and keep it secure.",
        "Links to WhatsApp, Instagram, Google Maps and Google reviews take you to those services, and their own privacy policies apply there.",
      ],
    },
    ...(ANALYTICS_ENABLED ? [ANALYTICS_SECTION] : []),
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
            ...(ANALYTICS_ENABLED
              ? [
                  "Legitimate interests: for Google Analytics statistics that help us improve this website. UK law allows analytics cookies used only for this purpose without asking first, as long as you’re told about them and can easily turn them off. You can object at any time with “Turn analytics off”.",
                ]
              : []),
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
            ANALYTICS_ENABLED
              ? "the providers of our email, messaging and website hosting;"
              : "the providers of our email, messaging and website hosting.",
            ...(ANALYTICS_ENABLED
              ? ["Google, which provides Google Analytics, for the website statistics described above (unless you turn analytics off)."]
              : []),
          ],
        },
        "We may also share information where the law requires it.",
      ],
    },
    {
      heading: "International transfers",
      blocks: [
        `Some of these providers, such as email and messaging services${ANALYTICS_ENABLED ? " and Google Analytics" : ""}, may store information outside the UK. Where they do, we rely on the safeguards UK law provides, such as adequacy regulations or standard contractual clauses.`,
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
