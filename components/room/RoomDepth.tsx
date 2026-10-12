"use client";

import { useState } from "react";
import { SCREENS, type Screen } from "@/content/media";
import LatticeField from "@/components/ui/LatticeField";
import ProvenanceLabel from "@/components/ui/ProvenanceLabel";
import { MQ } from "@/lib/breakpoints";

/**
 * The depth stack (FINAL-SPEC §7.4): the room's three planes in CSS 3D, for
 * everywhere the WebGL room does not run (portrait, phones, tablets, low-power
 * devices, no WebGL, a lost context, a column too small to frame into).
 *
 *   .hd-back   the lattice, pushed back      translateZ(-120px) scale(1.12)
 *   .hd-mid    the main screen, turned        rotateY(-12deg) rotateX(5deg)
 *   .hd-front  a second screen, lifted        translateZ(60px), bottom-left
 *
 * Real perspective (1100px) on the stack, so the planes separate as they
 * scroll (M-home-hero-05, CSS only, in hero.css). In tier S it fills the room
 * column; in tiers P and M it is the band under the copy.
 *
 * Both screens are Yisbir design concepts, so one provenance label covers them.
 * Decorative and aria-hidden: the hero copy carries the meaning.
 */

/* B's 600w downscale of wall-01 (20 KB) keeps the band inside the 120 KB
   poster budget alongside the 71 KB mid screen. */
const FRONT: Screen = SCREENS.yisbirPpeCompliance600;
const MID: Screen = SCREENS.yisbirFireSmokePoster;

export default function RoomDepth() {
  /* Rendered on the client only (RoomClient decides after mount), so reading
     the viewport here cannot cause a hydration mismatch. Below 1024 wide the
     band sits under the CTA, so its images never compete for the LCP. */
  const [small] = useState(() => !window.matchMedia(MQ.lg).matches);
  const imgProps = small
    ? ({ loading: "lazy", fetchPriority: "low" } as const)
    : ({ loading: "eager" } as const);

  return (
    <div className="hero-depth" aria-hidden="true">
      <div className="hd-back">
        <LatticeField />
      </div>
      <figure className="hd-mid">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={MID.src} width={MID.width} height={MID.height} alt="" decoding="async" {...imgProps} />
      </figure>
      <figure className="hd-front">
        <div className="hd-front-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FRONT.src} width={FRONT.width} height={FRONT.height} alt="" decoding="async" {...imgProps} />
        </div>
      </figure>
      <p className="hd-prov">
        <ProvenanceLabel>{MID.provenance}</ProvenanceLabel>
      </p>
    </div>
  );
}
