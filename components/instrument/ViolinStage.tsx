"use client";

import { useEffect, useRef, useState } from "react";
import { INSTRUMENT_COPY as COPY, VIOLIN_3D } from "./content";
import styles from "./InstrumentExplorer.module.css";

type Viewer = { goTo: (view: string) => void; dispose: () => void };

const VIEWS = [
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "back", label: "Back" },
  { id: "reset", label: "Reset view" },
];

/**
 * The one rotatable full-size violin, on deep green with the studio lighting from the design preview.
 * The three.js viewer (public/violin-3d/viewer.js) loads only when the stage nears the screen; until then,
 * and wherever WebGL is missing or the model fails, a still image of the same view is shown.
 * Add ?fallback to the URL to force the still image.
 */
export default function ViolinStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const viewerRef = useRef<Viewer | null>(null);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    let io: IntersectionObserver | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // the viewer also sets data-state (dragging / ready), so it is kept out of React's attributes
    const showFallback = (message: string) => {
      stage.dataset.state = "fallback";
      setStatus(message);
      setReady(false);
    };

    const hasWebGL = () => {
      if (new URLSearchParams(window.location.search).has("fallback")) return false;
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    };

    async function start() {
      stage!.dataset.state = "loading";
      setStatus("Loading 3D model…");
      try {
        const url = VIOLIN_3D.viewer;
        const mod = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url);
        if (cancelled) return;
        const viewer: Viewer | null = await mod.mount(stage, {
          modelUrl: VIOLIN_3D.model,
          label: VIOLIN_3D.label,
          reducedMotion,
          before: statusRef.current,
          onReady: () => {
            if (cancelled) return;
            stage!.dataset.state = "ready";
            setStatus("");
            setReady(true);
          },
          onError: () => {
            if (!cancelled) showFallback("The 3D model could not be loaded. Showing a still image instead.");
          },
        });
        if (cancelled) {
          viewer?.dispose();
          return;
        }
        viewerRef.current = viewer;
      } catch (err) {
        console.error(err);
        if (!cancelled) showFallback("The 3D view could not start. Showing a still image instead.");
      }
    }

    if (!hasWebGL()) {
      showFallback("3D is not available in this browser. Showing a still image instead.");
    } else if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            start();
          }
        },
        { rootMargin: "300px 0px" },
      );
      io.observe(stage);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      io?.disconnect();
      viewerRef.current?.dispose();
      viewerRef.current = null;
    };
  }, []);

  return (
    <div className={styles.viewer}>
      <div ref={stageRef} className={styles.stage}>
        {/* eslint-disable-next-line @next/next/no-img-element -- a fixed still under the canvas, not a content image */}
        <img className={styles.still} src={VIOLIN_3D.still} width={960} height={1200} alt={VIOLIN_3D.alt} />
        <p className={styles.modelNote}>{COPY.modelNote}</p>
        <p ref={statusRef} className={styles.status} role="status" aria-live="polite">
          {status}
        </p>
        <div className={styles.viewControls} role="group" aria-label="Viewing angle" hidden={!ready}>
          {VIEWS.map((v) => (
            <button key={v.id} type="button" onClick={() => viewerRef.current?.goTo(v.id)}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      {/* Visual only: the canvas's own label already gives screen readers the arrow-key instructions.
          Space is kept while loading, so nothing below moves when it appears. */}
      <p className={styles.hint} aria-hidden="true" data-show={ready ? "" : undefined}>
        <RotateIcon />
        <span className={styles.hintPointer}>{COPY.rotateHint.pointer}</span>
        <span className={styles.hintTouch}>{COPY.rotateHint.touch}</span>
        <span className={styles.hintKeys}>{COPY.rotateHint.keys}</span>
      </p>
    </div>
  );
}

function RotateIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 15.6C4.5 15 2 13.6 2 12c0-2.2 4.5-4 10-4s10 1.8 10 4c0 1.5-2.1 2.8-5.2 3.5" />
      <path d="M11 13.2l2.6 2.5-2.6 2.5" />
    </svg>
  );
}
