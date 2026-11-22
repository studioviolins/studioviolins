"use client";

import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { LineArrowIcon } from "@/components/hero/icons";
import styles from "./ReviewCarousel.module.css";

export type Review = {
  name: string;
  /** The reviewer's own words. "…" marks where a review has been shortened. */
  text: string;
  shortened: boolean;
};

/**
 * Tween maths follows the Embla v8.6 "Tween Scale" example
 * (packages/embla-carousel-docs/.../SandboxFilesSrc/Scale at tag v8.6.0).
 * A base factor of 1 means a neighbouring slide reaches its resting
 * preview state (--tween: 0) exactly one snap away from the centre.
 * Scale and opacity are derived from --tween in CSS.
 */
const TWEEN_FACTOR_BASE = 1;

/**
 * Embla's `duration` is a spring stiffness, not milliseconds: each 60 Hz step
 * adds distance / duration to the velocity, then applies 0.68 friction.
 * Simulating that loop (embla-carousel 8.6.0, ScrollBody) for one review:
 *   32 → 90% of the move by ~520 ms   45 → ~750 ms, 98% by ~1.2 s
 * 45 is overdamped, so it glides and eases in softly with no overshoot.
 * Drag releases are unaffected: Embla derives those from the drag force.
 */
const GLIDE = 45;

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

// Server-rendered starting state, before Embla takes over. Constant objects
// so React never overwrites the values Embla writes while scrolling.
const ACTIVE_STYLE = { "--tween": 1 } as CSSProperties;
const IDLE_STYLE = { "--tween": 0 } as CSSProperties;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

type Props = { reviews: Review[]; label: string };

export default function ReviewCarousel({ reviews, label }: Props) {
  // No autoplay: movement only ever follows the visitor.
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center", duration: GLIDE });
  const reducedMotion = usePrefersReducedMotion();
  const [selected, setSelected] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const interacted = useRef(false);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  /** The review visibly nearest the centre right now (not where it's heading). */
  const visualIndex = useRef(0);

  const setTweenNodes = useCallback((api: EmblaCarouselType) => {
    tweenNodes.current = api
      .slideNodes()
      .map((slide) => slide.querySelector<HTMLElement>("[data-tween]") as HTMLElement);
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  const tween = useCallback((api: EmblaCarouselType, eventName?: EmblaEventType) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === "scroll";
    let nearest = -1;
    let nearestSnap = visualIndex.current;

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const raw = clamp01(1 - Math.abs(diffToTarget * tweenFactor.current));
        // Settle exactly on 0 / 1 so resting cards are crisp, not 0.9996-scaled.
        const value = raw > 0.995 ? 1 : raw < 0.005 ? 0 : raw;
        tweenNodes.current[slideIndex]?.style.setProperty("--tween", value.toFixed(4));
        if (raw > nearest) {
          nearest = raw;
          nearestSnap = snapIndex;
        }
      });
    });

    visualIndex.current = nearestSnap;
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = (api: EmblaCarouselType) => {
      const index = api.selectedScrollSnap();
      setSelected(index);
      if (interacted.current) {
        setAnnouncement(`Review ${index + 1} of ${reviews.length}, from ${reviews[index].name}`);
      }
    };
    const onPointerDown = () => {
      interacted.current = true;
    };

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tween(emblaApi);
    onSelect(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tween)
      .on("scroll", tween)
      .on("settle", tween)
      .on("slideFocus", tween)
      .on("select", onSelect)
      .on("reInit", onSelect)
      .on("pointerDown", onPointerDown);

    return () => {
      emblaApi
        .off("reInit", setTweenNodes)
        .off("reInit", setTweenFactor)
        .off("reInit", tween)
        .off("scroll", tween)
        .off("settle", tween)
        .off("slideFocus", tween)
        .off("select", onSelect)
        .off("reInit", onSelect)
        .off("pointerDown", onPointerDown);
    };
  }, [emblaApi, reviews, setTweenFactor, setTweenNodes, tween]);

  /**
   * Move one review left or right. A click starts moving on the next frame;
   * Embla retargets the same glide rather than queueing animations. Clicks are
   * never allowed to run more than one review ahead of what is visibly centred,
   * so rapid clicking can't wind up a long, fast multi-review sweep.
   * Reduced motion: jump straight there instead of gliding.
   */
  const step = useCallback(
    (direction: -1 | 1) => {
      if (!emblaApi) return;
      const count = emblaApi.scrollSnapList().length;
      const target = (emblaApi.selectedScrollSnap() + direction + count) % count;
      const lead = ((((target - visualIndex.current) * direction) % count) + count) % count;
      if (lead > 1) return;

      interacted.current = true;
      emblaApi.scrollTo(target, reducedMotion);
      if (reducedMotion) tween(emblaApi);
    },
    [emblaApi, reducedMotion, tween],
  );

  // A side preview steps towards whichever side it's visibly on.
  const onPreviewClick = (index: number) => {
    if (!emblaApi) return;
    const count = emblaApi.scrollSnapList().length;
    if (index === (visualIndex.current + 1) % count) step(1);
    else if (index === (visualIndex.current - 1 + count) % count) step(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    if (event.repeat) return; // holding a key shouldn't spin through reviews
    step(event.key === "ArrowLeft" ? -1 : 1);
  };

  return (
    <div
      className={styles.carousel}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      <div className={styles.viewport} ref={emblaRef}>
        <div className={styles.container}>
          {reviews.map((review, index) => {
            const isSelected = index === selected;
            return (
              <div
                key={review.name}
                className={styles.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${reviews.length}`}
                aria-hidden={!isSelected}
                data-selected={isSelected || undefined}
                // Side previews are a mouse/touch shortcut; the arrows cover keyboard use.
                onClick={isSelected ? undefined : () => onPreviewClick(index)}
              >
                <figure
                  className={styles.card}
                  data-tween=""
                  style={index === 0 ? ACTIVE_STYLE : IDLE_STYLE}
                >
                  <blockquote className={styles.quote}>
                    <p>“{review.text}”</p>
                  </blockquote>
                  <figcaption className={styles.cite}>
                    <span className={styles.rule} aria-hidden="true" />
                    <span className={styles.name}>{review.name}</span>
                    <span className={styles.source}>
                      Google review{review.shortened ? " · shortened" : ""}
                    </span>
                  </figcaption>
                </figure>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => step(-1)}
        aria-label="Previous review"
      >
        <LineArrowIcon width={20} height={10} className={styles.flip} />
      </button>

      <p className={styles.dots} aria-hidden="true">
        {reviews.map((review, index) => (
          <span key={review.name} data-active={index === selected || undefined} />
        ))}
      </p>

      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => step(1)}
        aria-label="Next review"
      >
        <LineArrowIcon width={20} height={10} />
      </button>

      <p className={styles.srOnly} aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
