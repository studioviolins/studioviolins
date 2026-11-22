import nickSeated from "@/assets/nick-seated-4k.png";
import { LINKS, NICK } from "@/components/hero/content";

/**
 * Meet Nick. The photograph is the original, conventionally resized to 3840 × 2560 with no AI generation,
 * retouching or cropping; the section frames it with CSS only (object-fit), so the file itself is untouched.
 * Every fact is from the live site's About section and credentials: professional violinist and teacher,
 * Associate of the Royal Academy of Music, 30+ years in the violin business, knowledge gained in instrument
 * retail and then the charity sector managing loans of high-end instruments to advanced students.
 */
export const MEET_NICK = {
  title: "Meet Nick.",
  body: [
    `${NICK.name} is a professional violinist, teacher and Associate of the Royal Academy of Music, with over 30 years’ experience in the violin business. He built his knowledge of violin-family instruments in instrument retail and, more recently, in the charity sector, managing the loan of high-end instruments to advanced students.`,
    "With every rental, that experience means personal guidance in choosing the right instrument and size, and careful preparation so your violin is ready to play.",
  ],
  cta: "Get Nick’s advice",
  href: LINKS.contact,
  photo: {
    image: nickSeated,
    alt: `${NICK.name} seated outdoors with his violin`,
  },
};
