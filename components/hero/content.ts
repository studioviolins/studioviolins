import nickPlaying from "@/assets/nick-playing-4k.png";

/**
 * Every link on the site that stays on the site. Section links start with "/" so they also work from the terms
 * and privacy pages. Every "Talk to Nick" / "Start your rental" / "Find your size" button uses `contact`, so
 * changing it here changes them all.
 */
export const LINKS = {
  home: "/",
  pricing: "/#prices",
  meetNick: "/#about",
  faqs: "/#faqs",
  contact: "/#contact",
  terms: "/terms",
  privacy: "/privacy",
};

/** The default hero: the close-up of Nick concentrating while he plays. */
export const PHOTO = {
  image: nickPlaying,
  alt: "Nick Evans-Pughe playing the violin",
};

/**
 * The footage the photograph dissolves into. Both files share one framing
 * (the 688×640 crop, upscaled to 1548×1440 at 60 fps in OpenArt), so they line
 * up with the photograph in the same way.
 *
 * preview: muted, looping, 29:10–29:37 — plays while the pointer rests on Nick.
 *   scripts/build-hero-video.py (crop, loop points) → OpenArt → scripts/encode-hero-web.py
 * performance: one complete phrase with the concert sound, 29:13.78–29:32.78,
 *   played once from the start by "Watch & listen". scripts/build-hero-performance.py
 */
export const FILM = {
  preview: "/video/nick-hero.mp4",
  poster: "/video/nick-hero-poster.jpg",
  performance: "/video/nick-performance.mp4",
};

export const HERO_COPY = {
  /** Three balanced lines where space allows. */
  headline: ["Rent your violin", "from a professional", "violinist."],
  intro:
    "Find the right violin for you, with personal advice from professional violinist Nick Evans-Pughe.",
  location: "Violin rental in Hertfordshire, Bedfordshire & Cambridge",
  cta: "Talk to Nick",
};

export const NICK = {
  name: "Nick Evans-Pughe",
  credentials: ["Professional violinist & teacher", "Associate of the Royal Academy of Music"],
};
