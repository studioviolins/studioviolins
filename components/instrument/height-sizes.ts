/**
 * HEIGHT TO STARTING SIZE: APPROVED (22 Nov 2026)
 *
 * Height only gives a starting suggestion, never a guaranteed fit. No approval notes appear on the page.
 * The ranges below were approved as they stand (see `approval`), so every build, production included, shows the
 * suggested size beside the slider, and the contact form sends it with the height. If `status` is ever set
 * back to "draft" (to try new ranges), production hides the sizes again and sends the height only, while the
 * local dev server (`next dev`) still shows them for review.
 * Shared by the slider (client), the contact form's summary (client) and its server action, which works the
 * size out again from the height itself rather than trusting what the browser sent, so all three always agree.
 *
 * BETWEEN SIZES, THE SMALLER SIZE: the same principle as the "Between sizes?" note beside the result. Two
 * neighbouring ranges may share a boundary value (1/8 up to 130 cm, 1/4 from 130 cm), and a height on that
 * boundary is given the smaller size. Neighbouring ranges may also overlap to mark a wider "between sizes"
 * band (say 1/4 to 136 cm and 1/2 from 132 cm); every height inside it is given the smaller size too, and the
 * email tells Nick the height was between the two. Only Nick defines overlaps: the approved ranges have none,
 * only shared boundaries.
 *
 * Where the ranges come from: Corilon violins' violin size chart, "Approx height" column
 * (https://www.corilon.com/gb/library/practical-advice/finding-a-student-violin-in-the-proper-size,
 * read 2026-11-22): 1/16: 1.00 to 1.20 m · 1/8: 1.10 to 1.30 · 1/4: 1.20 to 1.35 · 1/2: 1.20 to 1.45 ·
 * 3/4: 1.35 to 1.50 · 4/4: over 1.50. That chart has no 1/10, and it says arm length matters more than height.
 * Its own bands overlap widely, which is not Nick's "between sizes" call, so each size ends at the top of its
 * Corilon band and the next size starts there: 1/16 to 120, 1/8 120 to 130, 1/4 130 to 135, 1/2 135 to 145,
 * 3/4 145 to 150, 4/4 from 150. With the smaller size on each boundary, that leans small: 130 cm gives 1/8.
 *
 * To change them: edit `ranges`, update `approval`. Ranges are whole centimetres, smallest size first. Each must
 * start no later than one centimetre after the previous one ends (no gaps), and may start on or before it (a
 * shared boundary, or a between-sizes band). The last range may have `toCm: null`, meaning "and taller".
 * `label` is optional and replaces the size in the text ("4/4 (full size)"). Heights on the slider outside
 * every range get no suggestion ("Ask Nick").
 */
export type HeightRange = { size: string; fromCm: number; toCm: number | null; label?: string };

export type HeightSizes = {
  status: "draft" | "approved";
  approval: null | { by: string; date: string; chart?: string };
  /**
   * What the slider can be set to, in cm. These only bound the slider; they are not sizing thresholds.
   * `start` is where it sits before the visitor touches it, and an untouched slider is never sent to Nick.
   * The top end reads "and taller" (180+ cm).
   */
  slider: { min: number; max: number; start: number };
  ranges: HeightRange[];
};

export const HEIGHT_SIZES: HeightSizes = {
  status: "approved",
  // Confirmed by Oliver for Studio Violins: "we are happy with the height to size ranges".
  approval: { by: "Oliver, for Studio Violins", date: "2026-11-22", chart: "Corilon approx-height chart, as adapted below" },
  slider: { min: 90, max: 180, start: 130 },
  ranges: [
    { size: "1/16", fromCm: 100, toCm: 120 },
    { size: "1/8", fromCm: 120, toCm: 130 },
    { size: "1/4", fromCm: 130, toCm: 135 },
    { size: "1/2", fromCm: 135, toCm: 145 },
    { size: "3/4", fromCm: 145, toCm: 150 },
    { size: "4/4", fromCm: 150, toCm: null, label: "4/4 (full size)" },
  ],
};

/** Draft sizes (if `status` is ever "draft") show on the local dev server only. The client and the server both use this. */
export const ALLOW_DRAFT_SIZES = process.env.NODE_ENV !== "production";

/** Returns a description of the first problem with the ranges, or null when they are usable. */
export function checkHeightRanges(ranges: HeightRange[]): string | null {
  if (!Array.isArray(ranges) || ranges.length === 0) return "no ranges";
  for (let i = 0; i < ranges.length; i++) {
    const r = ranges[i];
    const last = i === ranges.length - 1;
    if (typeof r.size !== "string" || !Number.isInteger(r.fromCm)) return `range ${i + 1}: size or fromCm missing`;
    const openEnd = r.toCm === null && last;
    if (!openEnd && !(Number.isInteger(r.toCm) && (r.toCm as number) >= r.fromCm)) return `range ${i + 1}: bad toCm`;
    const prev = ranges[i - 1];
    if (!prev) continue;
    const prevTo = prev.toCm as number; // only the last range may be open-ended
    if (r.fromCm > prevTo + 1) return `range ${i + 1}: gap before it`;
    if (r.fromCm <= prev.fromCm || (r.toCm !== null && r.toCm <= prevTo))
      return `range ${i + 1}: out of order (smallest size first, each starting and ending above the last)`;
  }
  return null;
}

const { min: MIN_CM, max: MAX_CM } = HEIGHT_SIZES.slider;

/** A whole number of centimetres the slider can actually be set to. */
export function isSliderHeight(cm: unknown): cm is number {
  return typeof cm === "number" && Number.isInteger(cm) && cm >= MIN_CM && cm <= MAX_CM;
}

/** Feet and inches, to the nearest inch: 130 → "4 ft 3 in". */
export function feetAndInches(cm: number) {
  const total = Math.round(cm / 2.54);
  return { feet: Math.floor(total / 12), inches: total % 12 };
}

export type HeightText = {
  /** "130 cm", or "180+ cm" at the slider's top end */
  metric: string;
  /** "4 ft 3 in", or "5 ft 11 in+" at the top end */
  imperial: string;
  /** For screen readers: "130 centimetres, 4 feet 3 inches" */
  spoken: string;
  /** For the email: "130 cm (4 ft 3 in)", or "180 cm or taller (5 ft 11 in or taller)" */
  plain: string;
};

export function heightText(cm: number): HeightText {
  const taller = cm >= MAX_CM;
  const { feet, inches } = feetAndInches(cm);
  const ftIn = inches ? `${feet} ft ${inches} in` : `${feet} ft`;
  const spokenFtIn = inches ? `${feet} feet ${inches} ${inches === 1 ? "inch" : "inches"}` : `${feet} feet`;
  return {
    metric: taller ? `${cm}+ cm` : `${cm} cm`,
    imperial: taller ? `${ftIn}+` : ftIn,
    spoken: taller ? `${cm} centimetres or taller, ${spokenFtIn} or taller` : `${cm} centimetres, ${spokenFtIn}`,
    plain: taller ? `${cm} cm or taller (${ftIn} or taller)` : `${cm} cm (${ftIn})`,
  };
}

const PROBLEM = checkHeightRanges(HEIGHT_SIZES.ranges);

/** A problem with the ranges, if any, so the slider can report it on the dev console. */
export const HEIGHT_RANGES_PROBLEM = PROBLEM;

/**
 * Whether suggested sizes can be shown at all: the ranges must be usable and either approved, or a draft on
 * the local dev server.
 */
export const SIZES_AVAILABLE = !PROBLEM && (HEIGHT_SIZES.status === "approved" || ALLOW_DRAFT_SIZES);

/** Every range a height falls in, smallest size first: two on a shared boundary or inside a between-sizes band. */
function rangesFor(cm: number) {
  if (!SIZES_AVAILABLE) return [];
  return HEIGHT_SIZES.ranges.filter((r) => cm >= r.fromCm && (r.toCm === null || cm <= r.toCm));
}

/**
 * The suggested starting size for a height, as shown ("1/8", "4/4 (full size)"): the smallest size whose range
 * includes it, so a height between two sizes gets the smaller one. Null when there is none: sizes unavailable
 * (awaiting approval in production), or a height outside every range.
 */
export function suggestedSizeFor(cm: number): string | null {
  const [smallest] = rangesFor(cm);
  return smallest ? (smallest.label ?? smallest.size) : null;
}

/**
 * What the contact form attaches for a chosen height: both measurements, the size when there is one, and, when
 * the height is between two sizes, those two (smaller first) so Nick can see it in the email.
 */
export type SizingSelection = {
  heightCm: number;
  height: HeightText;
  suggestedSize: string | null;
  betweenSizes: [string, string] | null;
};

export function sizingFor(cm: number): SizingSelection {
  const matches = rangesFor(cm);
  return {
    heightCm: cm,
    height: heightText(cm),
    suggestedSize: suggestedSizeFor(cm),
    betweenSizes: matches.length > 1 ? [matches[0].size, matches[matches.length - 1].size] : null,
  };
}

/** Name of the form field that carries the chosen height (whole cm) to the server action. */
export const HEIGHT_FIELD = "player_height_cm";
