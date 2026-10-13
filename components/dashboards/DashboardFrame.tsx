"use client";

import { useEffect, useRef, type CSSProperties, type ComponentType } from "react";
import type { Provenance } from "@/content/media";
import NazoOverview from "./NazoOverview";
import YisbirOperations from "./YisbirOperations";
import YisbirIndexing from "./YisbirIndexing";
import { AiBoxAnalytics, AiBoxAssistant } from "./AiBox";
import WaselConsole from "./WaselConsole";

/* ============================================================================
   A coded product dashboard, scaled into any box.

   Every dashboard is laid out on a fixed 1440 × 900 canvas (16:10, like the
   real screens) and scaled with CSS `zoom`, so text is rasterised at its
   final size rather than shrunk from a bitmap. The factor is pure CSS
   (app/dashboards.css: the frame is a size container and the zoom is
   100cqw ÷ 1440px), so the first paint is already right and nothing has to
   be measured.

   `crop` (narrow frames): instead of shrinking the whole canvas to an
   unreadable size, show a region of it at a readable scale
   (meerana-product-ui: "never an unreadable shrunken desktop"). The region
   travels as custom properties; a container query applies it.

   The frame is one image to assistive technology (role="img" + label); the
   dashboard markup inside is aria-hidden and inert, so none of its sample
   text is read out or focusable.

   Data-focus: "0" collapses bars and holds staggered rows back, "1" lets them
   animate in. The story timeline sets it on the screen in focus; elsewhere an
   IntersectionObserver sets it when the frame scrolls into view. Without
   JavaScript or with reduced motion everything simply shows at rest.
   ========================================================================== */

export type DashboardId = "nazo" | "yisbir-ops" | "yisbir-index" | "aibox-chat" | "aibox-analytics" | "wasel";

export type DashboardSpec = {
  id: DashboardId;
  alt: string;
  provenance: Provenance;
  /** The canvas region (design px: left, top, width) shown when the frame is
   *  narrower than 560 px. */
  crop?: { x: number; y: number; w: number };
};

const COMPONENTS: Record<DashboardId, ComponentType> = {
  nazo: NazoOverview,
  "yisbir-ops": YisbirOperations,
  "yisbir-index": YisbirIndexing,
  "aibox-chat": AiBoxAssistant,
  "aibox-analytics": AiBoxAnalytics,
  wasel: WaselConsole,
};

export default function DashboardFrame({
  spec,
  focus = "auto",
  className = "",
}: {
  spec: DashboardSpec;
  /** "auto": animate in when scrolled into view; "controlled": a parent sets data-focus. */
  focus?: "auto" | "controlled";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Dash = COMPONENTS[spec.id];

  /* Animate in when scrolled into view (motion allowed only). */
  useEffect(() => {
    const el = ref.current;
    if (!el || focus !== "auto") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.focus = "0";
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.focus = "1";
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [focus]);

  return (
    <div
      ref={ref}
      className={`dash-frame ${className}`.trim()}
      role="img"
      aria-label={spec.alt}
      data-dash={spec.id}
      data-crop={spec.crop ? "" : undefined}
      style={spec.crop ? ({ "--cx": spec.crop.x, "--cy": spec.crop.y, "--cw": spec.crop.w } as CSSProperties) : undefined}
    >
      <div className="dash-zoom" aria-hidden="true" inert>
        <Dash />
      </div>
    </div>
  );
}
