"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { FILM, HERO_COPY, LINKS, NICK, PHOTO } from "./content";
import { CloseIcon, LineArrowIcon, PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from "./icons";
import styles from "./Hero.module.css";

/** How long the pointer rests on Nick before the photograph dissolves into the preview. */
const HOVER_DELAY_MS = 500;
/** Grace period after the pointer leaves, so brushing past the edge doesn't flicker. */
const LEAVE_GRACE_MS = 250;
/** Once the footage has dissolved away, stop decoding it (matches the CSS fade-out). */
const PARK_AFTER_MS = 1800;
/** Start dissolving back to the photograph this long before the phrase ends,
 *  while its last note dies away (the clip's audio fades over its final 0.8 s). */
const END_LEAD_S = 1.3;
/** Quick fade when a visitor closes the performance part-way through. */
const CLOSE_FADE_MS = 350;

/**
 * photo: the still portrait.
 * preview: muted footage while the pointer rests on Nick; leaving restores the photograph.
 * performance: "Watch & listen" — one phrase with sound, from the start. Only the
 *   visitor's own controls (or the end of the phrase) stop it.
 */
type Mode = "photo" | "preview" | "performance";

const isHoverPointer = (event: ReactPointerEvent) =>
  event.pointerType === "mouse" || event.pointerType === "pen";

const saveData = () =>
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const performanceRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const watchRef = useRef<HTMLButtonElement>(null);
  const pauseRef = useRef<HTMLButtonElement>(null);

  const [mode, setMode] = useState<Mode>("photo");
  /** Each video is only revealed once it is actually playing, never as an empty frame. */
  const [previewReady, setPreviewReady] = useState(false);
  const [performanceReady, setPerformanceReady] = useState(false);
  /** Which video sits on top while footage is showing (kept through the fade-out). */
  const [layer, setLayer] = useState<"preview" | "performance">("preview");
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const modeRef = useRef<Mode>("photo");
  const enterTimer = useRef(0);
  const leaveTimer = useRef(0);
  const visible = useRef(true);
  /** After a performance or "Stop", resting on Nick shouldn't start the preview straight away. */
  const hoverSuppressed = useRef(false);
  /** Move keyboard focus between "Watch & listen" and the playback controls as they swap. */
  const focusAfterSwap = useRef<"controls" | "watch" | null>(null);

  const changeMode = useCallback((next: Mode) => {
    modeRef.current = next;
    setMode(next);
  }, []);

  const clearTimers = () => {
    window.clearTimeout(enterTimer.current);
    window.clearTimeout(leaveTimer.current);
    enterTimer.current = 0;
    leaveTimer.current = 0;
  };

  /** Fetch the muted preview once a visitor shows interest (not for everyone on load). */
  const warmPreview = useCallback(() => {
    const video = previewRef.current;
    if (video && video.preload === "none" && !saveData()) video.preload = "auto";
  }, []);

  /** Fetch the performance when the pointer or focus reaches "Watch & listen". */
  const warmPerformance = useCallback(() => {
    const video = performanceRef.current;
    if (video && video.preload === "none" && !saveData()) video.preload = "auto";
  }, []);

  const playPreview = useCallback(() => {
    const video = previewRef.current;
    if (!video || !visible.current) return;
    video.muted = true; // the preview never makes a sound
    video
      .play()
      .then(() => {
        if (modeRef.current === "preview") setPreviewReady(true);
        else if (modeRef.current === "photo") video.pause();
      })
      .catch(() => {
        if (modeRef.current === "preview") changeMode("photo");
      });
  }, [changeMode]);

  /** Back to the photograph (end of the phrase, "Stop", or the pointer leaving the preview). */
  const returnToPhoto = useCallback(() => {
    if (modeRef.current === "photo") return;
    if (controlsRef.current?.contains(document.activeElement)) focusAfterSwap.current = "watch";
    hoverSuppressed.current = Boolean(mediaRef.current?.matches(":hover"));
    changeMode("photo");
  }, [changeMode]);

  // Mode changes: start the preview, settle the videos once the footage has faded away.
  useEffect(() => {
    const preview = previewRef.current;
    const perf = performanceRef.current;
    if (!preview || !perf) return;

    if (mode === "preview") {
      playPreview();
      return;
    }
    if (mode === "performance") {
      // Let the performance cross-fade in over the preview, then rest the preview.
      const rest = window.setTimeout(() => preview.pause(), 900);
      return () => window.clearTimeout(rest);
    }
    const park = window.setTimeout(() => {
      if (modeRef.current !== "photo") return;
      preview.pause();
      // The performance plays out its last fading note, then is reset for next time.
      if (perf.ended || perf.paused) {
        setPerformanceReady(false);
        setLayer("preview");
      }
    }, PARK_AFTER_MS);
    return () => window.clearTimeout(park);
  }, [mode, playPreview]);

  // Keyboard focus follows the controls as they swap.
  useEffect(() => {
    const target = focusAfterSwap.current;
    focusAfterSwap.current = null;
    if (target === "controls") pauseRef.current?.focus();
    else if (target === "watch") watchRef.current?.focus();
  }, [mode]);

  // Reduced motion: no hover preview; "Watch & listen" still works, with a plain short fade.
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // The muted preview rests while the hero is scrolled away or the tab is hidden.
  // A performance the visitor started is theirs to stop, so it is left alone.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => {
      visible.current = onScreen && document.visibilityState === "visible";
      if (!visible.current) previewRef.current?.pause();
      else if (modeRef.current === "preview") playPreview();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [playPreview]);

  // Mirror the performance video's own state in the controls.
  useEffect(() => {
    const video = performanceRef.current;
    if (!video) return;
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    const onVolume = () => setMuted(video.muted);
    // Dissolve back while the final note dies away; never loop the audible phrase.
    const onTime = () => {
      if (modeRef.current !== "performance" || video.paused || !video.duration) return;
      if (video.duration - video.currentTime <= END_LEAD_S) returnToPhoto();
    };
    const onEnded = () => {
      if (modeRef.current === "performance") returnToPhoto();
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("volumechange", onVolume);
    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("volumechange", onVolume);
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnded);
    };
  }, [returnToPhoto]);

  useEffect(() => clearTimers, []);

  // Hover: rest on Nick for ~0.5 s to reveal the muted preview; move away to restore the photograph.
  const onMediaPointerOver = (event: ReactPointerEvent) => {
    if (!isHoverPointer(event)) return;
    // Heading for the controls never starts the preview by itself.
    if (controlsRef.current?.contains(event.target as Node)) {
      window.clearTimeout(enterTimer.current);
      enterTimer.current = 0;
      return;
    }
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = 0;
    if (reducedMotion || hoverSuppressed.current || modeRef.current !== "photo" || enterTimer.current) return;
    warmPreview();
    enterTimer.current = window.setTimeout(() => {
      enterTimer.current = 0;
      if (modeRef.current !== "photo") return;
      setLayer("preview");
      changeMode("preview");
    }, HOVER_DELAY_MS);
  };

  const onMediaPointerLeave = (event: ReactPointerEvent) => {
    if (!isHoverPointer(event)) return;
    window.clearTimeout(enterTimer.current);
    enterTimer.current = 0;
    hoverSuppressed.current = false;
    // Only the preview follows the pointer; a performance carries on.
    if (modeRef.current !== "preview") return;
    leaveTimer.current = window.setTimeout(() => {
      leaveTimer.current = 0;
      if (modeRef.current === "preview") changeMode("photo");
    }, LEAVE_GRACE_MS);
  };

  // "Watch & listen": click, keyboard or tap. Always restarts the phrase, with sound.
  const onWatch = () => {
    const video = performanceRef.current;
    if (!video) return;
    clearTimers();
    if (controlsRef.current?.contains(document.activeElement)) focusAfterSwap.current = "controls";
    changeMode("performance");
    setLayer("performance");
    video.currentTime = 0;
    video.volume = 1;
    video.muted = false;
    setMuted(false);
    // Called directly from the click, so the browser allows sound.
    video
      .play()
      .then(() => {
        if (modeRef.current === "performance") setPerformanceReady(true);
        else video.pause();
      })
      .catch(() => {
        if (modeRef.current === "performance") returnToPhoto();
      });
  };

  const onPlayPause = () => {
    const video = performanceRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => undefined);
    else video.pause();
  };

  const onMute = () => {
    const video = performanceRef.current;
    if (video) video.muted = !video.muted;
  };

  // "Stop": a short fade rather than a hard cut, then back to the photograph.
  const onStop = () => {
    const video = performanceRef.current;
    returnToPhoto();
    if (!video || video.paused) return;
    const from = video.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / CLOSE_FADE_MS, 1);
      video.volume = from * (1 - t);
      if (t < 1 && !video.paused) requestAnimationFrame(step);
      else {
        video.pause();
        video.volume = from;
      }
    };
    requestAnimationFrame(step);
  };

  const showFootage =
    (mode === "preview" && previewReady) || (mode === "performance" && performanceReady);
  const performing = mode === "performance";

  return (
    <div
      ref={rootRef}
      className={styles.hero}
      data-site-hero=""
      onPointerEnter={(event) => {
        if (isHoverPointer(event) && !reducedMotion) warmPreview();
      }}
    >
      {/* Nick: a still portrait that reveals him playing */}
      <section
        ref={mediaRef}
        className={styles.media}
        aria-label={`${NICK.name} playing the violin`}
        data-film={showFootage || undefined}
        data-layer={layer}
        onPointerOver={onMediaPointerOver}
        onPointerLeave={onMediaPointerLeave}
      >
        <div className={styles.frame}>
          <div className={styles.scene}>
            {/* Photograph and footage share one stage, with Nick's face anchored to the
                same point, so both carry the same position and treatment. */}
            <div className={styles.stage}>
              <Image
                src={PHOTO.image}
                alt={PHOTO.alt}
                fill
                sizes="(max-width: 720px) 100vw, 80vw"
                preload
                fetchPriority="high" /* the page's largest image: load it first (no visual change) */
                placeholder="blur"
                className={styles.photo}
              />
              <div className={styles.film} aria-hidden="true">
                <video
                  ref={previewRef}
                  className={styles.video}
                  src={FILM.preview}
                  poster={FILM.poster}
                  muted
                  loop
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  disableRemotePlayback
                  tabIndex={-1}
                />
                <video
                  ref={performanceRef}
                  className={`${styles.video} ${styles.performance}`}
                  src={FILM.performance}
                  playsInline
                  preload="none"
                  disablePictureInPicture
                  disableRemotePlayback
                  tabIndex={-1}
                />
                <div className={styles.grade} />
              </div>
            </div>
          </div>
          <div className={styles.fade} aria-hidden="true" />
        </div>

        <div className={styles.footer}>
          <div className={styles.caption}>
            <p className={styles.name}>{NICK.name}</p>
            <p className={styles.role}>
              {NICK.credentials[0]}
              <br />
              {NICK.credentials[1]}
            </p>
          </div>

          <div ref={controlsRef} className={styles.controls}>
            {performing ? (
              <div className={styles.playback} role="group" aria-label="Performance">
                <button
                  ref={pauseRef}
                  type="button"
                  className={styles.round}
                  onClick={onPlayPause}
                  aria-label={paused ? "Play" : "Pause"}
                  title={paused ? "Play" : "Pause"}
                >
                  {paused ? <PlayIcon width={13} height={13} /> : <PauseIcon width={13} height={13} />}
                </button>
                <button
                  type="button"
                  className={styles.round}
                  onClick={onMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <SoundOffIcon width={16} height={16} /> : <SoundOnIcon width={16} height={16} />}
                </button>
                <button
                  type="button"
                  className={styles.round}
                  onClick={onStop}
                  aria-label="Stop and return to the photograph"
                  title="Stop"
                >
                  <CloseIcon width={15} height={15} />
                </button>
              </div>
            ) : (
              <button
                ref={watchRef}
                type="button"
                className={styles.watch}
                onClick={onWatch}
                onPointerEnter={warmPerformance}
                onFocus={warmPerformance}
              >
                <span className={styles.play} aria-hidden="true">
                  <PlayIcon width={12} height={12} />
                </span>
                Watch &amp; listen
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stationary message */}
      <section className={styles.copy} aria-labelledby="hero-title">
        <h1 id="hero-title" className={styles.title}>
          {HERO_COPY.headline.map((line, i) => (
            <span key={line}>
              {line}
              {i < HERO_COPY.headline.length - 1 ? " " : ""}
            </span>
          ))}
        </h1>
        <p className={styles.intro}>{HERO_COPY.intro}</p>
        <p className={styles.location}>{HERO_COPY.location}</p>
        <a href={LINKS.contact} className={styles.cta}>
          {HERO_COPY.cta}
          <LineArrowIcon />
        </a>
      </section>
    </div>
  );
}
