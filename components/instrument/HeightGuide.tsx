"use client";

import { useEffect, useState, type CSSProperties, type KeyboardEvent } from "react";
import { LineArrowIcon } from "@/components/hero/icons";
import { HEIGHT_RANGES_PROBLEM, HEIGHT_SIZES, SIZES_AVAILABLE, heightText, suggestedSizeFor } from "./height-sizes";
import {
  CONTACT_FORM_ID,
  CONTACT_OPTIONS_ID,
  HEIGHT_SLIDER_ID,
  SIZE_GUIDE_ID,
  setSelectedHeight,
  useSelectedHeight,
} from "./size-selection";
import { INSTRUMENT_COPY as COPY, INSTRUMENT_LINKS } from "./content";
import styles from "./InstrumentExplorer.module.css";

const { min, max, start } = HEIGHT_SIZES.slider;
const NOTE_ID = `${HEIGHT_SLIDER_ID}-note`;
// Keys that adjust a range input. Pressing one counts as choosing the height, even at either end.
const SLIDER_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);

/**
 * "Player's height": one slider and, once Nick approves the ranges (or on the local dev server), its suggested
 * starting size, with the "Between sizes? Choose the smaller one." callout beside it; a height between two sizes
 * is given the smaller one (height-sizes.ts). It has no link to the 3D violin. Moving, tapping or keying the slider chooses the height, which
 * the contact form then shows and sends to Nick; an untouched slider attaches nothing. The link to Nick is always
 * shown, and the line under it links to the WhatsApp and email options (and clears any chosen height from the
 * form), so the slider can be skipped entirely.
 */
export default function HeightGuide() {
  const selected = useSelectedHeight();
  const [height, setHeight] = useState(start);

  useEffect(() => {
    if (HEIGHT_RANGES_PROBLEM) console.error(`components/instrument/height-sizes.ts: ${HEIGHT_RANGES_PROBLEM}`);
  }, []);

  // Keep the slider on the chosen height (it is null again after "contact Nick directly" or sending; the slider
  // stays put).
  useEffect(() => {
    if (selected !== null) setHeight(selected);
  }, [selected]);

  const choose = (cm: number) => {
    setHeight(cm);
    setSelectedHeight(cm);
  };
  const onKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (SLIDER_KEYS.has(e.key)) choose(Number(e.currentTarget.value));
  };

  const text = heightText(height);
  const size = SIZES_AVAILABLE ? (suggestedSizeFor(height) ?? COPY.noSuggestion) : null;
  const pct = ((height - min) / (max - min || 1)) * 100;
  const valueText = size ? `${text.spoken}. Suggested size: ${size}` : text.spoken;

  return (
    <div id={SIZE_GUIDE_ID} className={styles.guide}>
      <div className={styles.heightRow}>
        <label htmlFor={HEIGHT_SLIDER_ID} className={styles.heightLabel}>
          {COPY.heightLabel}
        </label>
        <span className={styles.heightValue} aria-hidden="true">
          {text.metric}
          <span className={styles.heightImperial}> · {text.imperial}</span>
        </span>
      </div>
      <input
        type="range"
        id={HEIGHT_SLIDER_ID}
        className={styles.slider}
        min={min}
        max={max}
        step={1}
        value={height}
        onChange={(e) => choose(Number(e.target.value))}
        onPointerUp={(e) => choose(Number(e.currentTarget.value))}
        onKeyUp={onKeyUp}
        aria-valuetext={valueText}
        aria-describedby={NOTE_ID}
        style={{ "--pct": `${pct}%` } as CSSProperties}
      />
      <div className={styles.sliderEnds} aria-hidden="true">
        <span>{heightText(min).metric}</span>
        <span>{heightText(max).metric}</span>
      </div>

      {size ? (
        <p className={styles.suggested}>
          <span className={styles.suggestedLabel}>{COPY.suggestedLabel}</span>{" "}
          <strong className={styles.suggestedSize}>{size}</strong>
        </p>
      ) : null}

      {/* Always shown, straight after the result (or the slider, before sizes are approved). */}
      <div id={NOTE_ID} className={styles.tip}>
        <p className={styles.tipTitle}>{COPY.sizeTip.title}</p>
        <p className={styles.tipBody}>{COPY.sizeTip.body}</p>
      </div>
      {/* Once a height is chosen, straight to the form on this page, where it's shown above the fields. A bare
          "#…" link stays on this page even when its address has a query (from a campaign link, say); "/#…" would
          reload it and lose the height. */}
      <a href={selected !== null ? `#${CONTACT_FORM_ID}` : INSTRUMENT_LINKS.contact} className={styles.cta}>
        {COPY.cta}
        <LineArrowIcon />
      </a>
      <p className={styles.shortcut}>
        {COPY.direct.before}
        {/* Choosing to talk it through with Nick takes the height and size off the form. */}
        <a href={`#${CONTACT_OPTIONS_ID}`} className={styles.shortcutLink} onClick={() => setSelectedHeight(null)}>
          {COPY.direct.link}
        </a>
        {COPY.direct.after}
      </p>
    </div>
  );
}
