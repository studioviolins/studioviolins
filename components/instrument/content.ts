import { LINKS } from "@/components/hero/content";

/**
 * The rental section: the upgrade statement and height slider on the left, the rotatable violin on the right,
 * three rental benefits underneath. The pricing and contact links also sit in the hero navigation.
 */
export const INSTRUMENT_COPY = {
  eyebrow: "Renting with Nick",
  introTitle: "Enhanced tone. Optimised playability.",
  // Wording set by Oliver (22 Nov 2026). Whether a violin is new or refurbished is answered in the FAQ
  // ("Will my violin be new?"), not here.
  introBody:
    "Every violin is carefully selected and expertly prepared, with superior strings, a high-quality bridge and precise adjustment to enhance tone and playability.",
  heightLabel: "Player’s height",
  suggestedLabel: "Suggested size:",
  // Shown instead of a size for heights outside every range (local dev server only, until Nick approves sizes).
  noSuggestion: "Ask Nick",
  // Beside the result, always shown (also in production before sizes are approved). It folds in the old note
  // "Children grow differently. Nick can help confirm the right fit." The slider follows the same rule: a height
  // between two sizes gets the smaller one (see height-sizes.ts).
  sizeTip: {
    title: "Between sizes? Choose the smaller one.",
    body: "If a student is between sizes, we recommend the smaller violin, as an instrument on the large side can be harder to play.",
  },
  // Takes the chosen height (and size) to the contact form; the arrow is the button's icon.
  cta: "Continue with this size",
  // Under the button: one line for anyone who'd rather talk it through. The link goes to the WhatsApp and email
  // options in the contact section.
  direct: {
    before: "If you have a teacher’s size recommendation or would like to discuss any sizing concerns, for instance a student with smaller than average hands, please ",
    link: "contact Nick directly",
    after: ".",
  },
  // On the stage: the 3D violin is an example, not the exact instrument every renter receives.
  modelNote: "Illustrative model",
  // Under the violin. Only one shows: mouse, touch, or keyboard (while the violin has focus).
  rotateHint: {
    pointer: "Drag to rotate",
    touch: "Swipe sideways to rotate",
    keys: "Arrow keys to rotate · Home to reset",
  },
};

// The same three points the live site lists under "Why choose us".
export const RENTAL_BENEFITS = [
  { title: "Complete outfit included", body: "Bow, case, shoulder rest and rosin supplied." },
  { title: "Free upsizing", body: "Move to a larger violin as your child grows, subject to availability." },
  { title: "Ongoing support", body: "Advice and support throughout your rental." },
];

export const INSTRUMENT_LINKS = {
  contact: LINKS.contact,
};

/**
 * The 3D viewer and its files are served from public/violin-3d, copied from the design preview by
 * `node scripts/sync-violin-3d.mjs` (three.js is vendored there, not an npm dependency).
 */
export const VIOLIN_3D = {
  viewer: "/violin-3d/viewer.js",
  model: "/violin-3d/models/violin-4-4.glb",
  still: "/violin-3d/fallback/violin-4-4.webp",
  label: "Illustrative full-size violin",
  alt: "Illustrative full-size violin shown at a three-quarter angle",
};
