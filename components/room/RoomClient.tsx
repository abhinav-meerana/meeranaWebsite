"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type MutableRefObject } from "react";
import { MQ } from "@/lib/breakpoints";
import RoomDepth from "./RoomDepth";
import { RoomBoundary, hasWebGL } from "./RoomBoundary";
import { MIN_WEBGL_COLUMN, type Rect } from "./room-layout";
import type { RoomApi } from "./Room";

/* The scene is its own chunk. Nothing below imports it statically (the Room
   import above is type-only), so in portrait, below 1024 wide, below 500 tall
   or on a low-power device the three.js chunk is never requested (H-05). */
const Room = dynamic(() => import("./Room"), { ssr: false, loading: () => null });

type Mode = "pending" | "webgl" | "depth" | "none";

/** L-phone (hero.css): landscape phones and 200% zoom show the copy only, so
    the band is not rendered at all and its images are never fetched. */
const COPY_ONLY = "(orientation: landscape) and (max-height: 499px)";

/** Save-Data and low device memory both mean "do not spend the user's budget on
   decoration". `deviceMemory` is Chromium-only; absent means unknown, not low. */
function lowPower(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  return nav.connection?.saveData === true || (nav.deviceMemory ?? 8) <= 4;
}

let webglProbe: boolean | undefined;
/** Probed once per page: creating a context is not free. */
function canWebGL(): boolean {
  if (webglProbe === undefined) webglProbe = hasWebGL();
  return webglProbe;
}

/**
 * Chooses the live room or the depth stack (FINAL-SPEC §7.4).
 *
 *   landscape and ≤499 tall (L-phone)                        → none
 *   MQ.roomWebgl + not low-power + WebGL + column ≥ 440×380  → webgl
 *   anything else, or a lost context                        → depth
 *
 * The decision is made on the client after mount, so the exported HTML is the
 * same for everyone and there is no hydration mismatch. The hero copy never
 * waits on this: it is server-rendered static HTML.
 */
export default function RoomClient({
  frame,
  onReady,
  apiRef,
}: {
  /** The room column in hero px, or null outside the split tier. */
  frame: Rect | null;
  onReady?: () => void;
  apiRef?: MutableRefObject<RoomApi | null>;
}) {
  /* null until measured; then "the live room may run here" (media query,
     power and WebGL), before the column check. */
  const [wide, setWide] = useState<boolean | null>(null);
  const [copyOnly, setCopyOnly] = useState(false);
  const [lost, setLost] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MQ.roomWebgl);
    const short = window.matchMedia(COPY_ONLY);
    const apply = () => {
      setCopyOnly(short.matches);
      setWide(mq.matches && !lowPower() && canWebGL());
    };
    apply();
    mq.addEventListener("change", apply);
    short.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      short.removeEventListener("change", apply);
    };
  }, []);

  let mode: Mode = "pending";
  if (copyOnly) mode = "none";
  else if (wide === false || lost) mode = "depth";
  else if (wide) {
    if (!frame) mode = "pending";
    else {
      const fits = frame.r - frame.l >= MIN_WEBGL_COLUMN.w && frame.b - frame.t >= MIN_WEBGL_COLUMN.h;
      mode = fits ? "webgl" : "depth";
    }
  }

  if (mode === "pending" || mode === "none") return null;
  if (mode === "depth") return <RoomDepth />;

  return (
    <RoomBoundary fallback={<RoomDepth />}>
      <Room frame={frame!} onReady={onReady} onLost={() => setLost(true)} apiRef={apiRef} />
    </RoomBoundary>
  );
}
