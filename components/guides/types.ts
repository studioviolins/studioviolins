/** A piece of running text: plain, or a link (internal links stay in the same tab). */
export type GuideSegment = string | { label: string; href: string; external?: boolean };

/** A paragraph (plain text or segments), a bullet list, or a numbered list of steps. */
export type GuideBlock =
  | string
  | GuideSegment[]
  | { list: (string | GuideSegment[])[] }
  | { steps: (string | GuideSegment[])[] };

export type GuideSection = {
  /** Anchor for links to this part of the page, e.g. /starting-violin#choosing-a-size. */
  id: string;
  heading: string;
  blocks: GuideBlock[];
};

export type Guide = {
  path: string;
  /** Short name for links between guides and the footer. */
  linkLabel: string;
  seo: { title: string; description: string };
  title: string;
  intro: string;
  sections: GuideSection[];
};
