/**
 * Stroke icons for the dashboard reconstructions. Decorative (the frames
 * are aria-hidden; the meaning is in each frame's label), 24-unit grid,
 * currentColor, so each dashboard theme colours them.
 */
const PATHS = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm9 16-4.3-4.3",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Zm4 4h4",
  doc: "M7 3h7l4 4v14H7V3Zm7 0v4h4M9.5 12h5M9.5 15.5h5",
  check: "m5 12.5 4.5 4.5L19 7.5",
  checkCircle: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-4 9.5 2.8 2.8L16.5 9.5",
  spinner: "M12 3a9 9 0 1 0 9 9",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 6.5M21 20a6 6 0 0 0-4-5.6",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
  inbox: "M4 13h4l2 3h4l2-3h4M4 13l2.5-8h11L20 13v6H4v-6Z",
  plus: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4v8M8 12h8",
  send: "M21 3 3 10.5l7 2.5 2.5 7L21 3Zm-11 10 4-4",
  target: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 3.5v2",
  archive: "M4 5h16v4H4V5Zm1 4v10h14V9M10 13h4",
  grid: "M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  flow: "M5 4h5v5H5V4Zm9 11h5v5h-5v-5ZM7.5 9v3.5a2 2 0 0 0 2 2H14",
  sun: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4",
  mic: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Zm-6 9a6 6 0 0 0 12 0M12 18v3",
  clip: "m20 11-8.5 8.5a5 5 0 0 1-7-7L13 4a3.3 3.3 0 0 1 4.7 4.7L9.2 17.2a1.7 1.7 0 0 1-2.4-2.4L14.5 7",
  wave: "M4 12h1M7 9v6M10 6v12M13 9v6M16 7v10M19 10v4",
  play: "M8 5v14l11-7L8 5Z",
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H3",
  camera: "M4 7h11v10H4V7Zm11 3.5L20 8v8l-5-2.5",
  shield: "M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z",
  flame: "M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-1 2-2 3-3.5 3.5C9 9 7 11 7 14a5 5 0 0 0 5 7Z",
  helmet: "M4 16h16M5 16a7 7 0 0 1 14 0M12 9V6",
  gate: "M3 20V6m18 14V6M3 9h18M7 9v11m5-11v11m5-11v11",
  wifi: "M2.5 9.5a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01",
  bluetooth: "m7 7 10 10-5 4V3l5 4L7 17",
  cloud: "M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9H7Z",
  key: "M15 3a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm-4.2 9.8L3 20.5V22h3v-2h2v-2h2l1.3-1.3",
  settings: "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm7.4 3a7.5 7.5 0 0 0-.1-1.2l2-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-2-1.2L14.5 3h-5l-.4 2.5a7.5 7.5 0 0 0-2 1.2l-2.4-.9-2 3.4 2 1.6a7.5 7.5 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-.9c.6.5 1.3.9 2 1.2l.4 2.5h5l.4-2.5a7.5 7.5 0 0 0 2-1.2l2.4.9 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z",
  thermo: "M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0V4Z",
  drop: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z",
  book: "M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Zm0 14a2 2 0 0 1 2-2h12",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  home: "M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  arrowUp: "M12 19V5m-6 6 6-6 6 6",
  arrowRight: "M5 12h14m-6-6 6 6-6 6",
  external: "M14 4h6v6M20 4l-9 9M18 14v6H4V6h6",
  download: "M12 4v11m-5-5 5 5 5-5M5 20h14",
  chevronDown: "m6 9 6 6 6-6",
  zone: "M4 5h16v14H4V5Z",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, size = 16, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      className={`dz-ico ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
