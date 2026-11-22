/** A legal page: numbered clauses (terms) or short paragraphs and lists (privacy). */
export type LegalBlock = string | { list: string[] } | { link: { before: string; label: string; href: string; after: string } };

export type LegalSection = {
  heading: string;
  /** An anchor for linking to the section (e.g. "privacy-analytics"); its heading keeps the numbered id. */
  id?: string;
  /** Numbered clauses, e.g. ["6.4", "You must pay …"]. */
  clauses?: [string, string][];
  /** Plain paragraphs and bullet lists, in order. */
  blocks?: LegalBlock[];
};

export type LegalDoc = {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  questions: { title: string; body: string };
};
