import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Fine horizontal arrow with a long hairline tail — quiet, classical. */
export const LineArrowIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 28 14" width={26} height={13} strokeWidth={1.15} {...p}>
    <path d="M1 7h25.5M21 1.75 26.5 7 21 12.25" />
  </svg>
);

export const PlayIcon = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13a.6.6 0 0 0 .9.5l10.2-6.5a.6.6 0 0 0 0-1L8.9 5a.6.6 0 0 0-.9.5Z" />
  </svg>
);

export const PauseIcon = (p: IconProps) => (
  <svg {...base} {...p} fill="currentColor" stroke="none">
    <rect x="6.5" y="5" width="3.6" height="14" rx="1" />
    <rect x="13.9" y="5" width="3.6" height="14" rx="1" />
  </svg>
);

export const SoundOnIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke="none" />
    <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);

export const SoundOffIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" fill="currentColor" stroke="none" />
    <path d="m15.5 9.5 5 5m0-5-5 5" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="m6.5 6.5 11 11m0-11-11 11" />
  </svg>
);
