/**
 * The homepage story (brief §3): the copy for each beat and the screens on
 * its stage.
 *
 * Copy is the brief's, adapted only where a line would claim more than the
 * evidence register supports (docs/REDESIGN-PLAN-2026-10-12.md §4):
 *   · "connected" is dropped: there is no verified cross-product integration
 *     (EV-473 "Meerana Intelligence Layer" is do-not-use; DD-20);
 *   · stage 2 uses the brief's own fallback line ("six distinct platforms");
 *   · stage 3 names the verified domains (the EV-checked lede: AI,
 *     automation, IoT and security);
 *   · the brief gives stage 4 and the final 3D universe the same headline, so
 *     the stage-5 transition plays before it and the headline is the
 *     universe's, revealed last.
 *
 * Every screen is from content/media.ts with its honest provenance; nothing
 * here is generated imagery.
 */

import type { DashboardSpec } from "@/components/dashboards/DashboardFrame";
import { DASHBOARDS } from "./dashboards";
import { SCREENS, type Provenance, type Screen } from "./media";
import { SHOWCASE } from "./showcase";

export type BeatId = "opening" | "reveal" | "platforms" | "capability" | "next" | "universe";

export type StoryBeat = {
  id: BeatId;
  title: string;
  lede: string;
  /** Where the copy sits in the cinematic layout. */
  place: "center" | "top";
};

export const STORY_BEATS: StoryBeat[] = [
  {
    id: "opening",
    title: "Complexity, Meet Clarity.",
    lede: "One ecosystem. Purpose-built technology. A clearer way forward.",
    place: "center",
  },
  {
    id: "reveal",
    title: "See Beyond the Interface.",
    lede: "Discover the technology shaping the way work gets done.",
    place: "top",
  },
  {
    id: "platforms",
    title: "Six Platforms. A World of Possibilities.",
    lede: "Explore six distinct digital platforms, each built for a different need.",
    place: "center",
  },
  {
    id: "capability",
    title: "Built to Move Ideas Forward.",
    lede: "Purposeful interfaces. Thoughtful technology. Built for AI, automation, IoT and security.",
    place: "center",
  },
  {
    id: "next",
    title: "Explore What Comes Next.",
    lede: "Find the platform, solution or capability that fits your next step.",
    place: "center",
  },
  {
    id: "universe",
    title: "Different Platforms. One Bigger Picture.",
    lede: "Explore the products and possibilities behind Meerana.",
    place: "top",
  },
];

/** A screen on the stage: a real image, or a coded dashboard
 *  (components/dashboards). `product` screens are the platforms (stage 2 and
 *  the universe); `detail` screens are the atmosphere of the opening and the
 *  interface details of stage 3. */
export type StageScreen = {
  key: string;
  role: "product" | "detail";
  screen?: Screen;
  dash?: DashboardSpec;
  /** Product slug, for products. */
  slug?: string;
  /** Loaded with the first paint (the opening composition) or deferred,
   *  per layout. */
  initial: boolean;
  initialNarrow?: boolean;
  /** Shown on narrow (portrait) screens. */
  narrow: boolean;
  /** Labelled in the universe (one tag per platform). */
  tag?: boolean;
};

/** Alt text and provenance, whichever kind of visual a screen is. */
export const visualOf = (s: StageScreen): { alt: string; provenance: Provenance } =>
  s.dash ? { alt: s.dash.alt, provenance: s.dash.provenance } : { alt: s.screen!.alt, provenance: s.screen!.provenance };

const bySlug = (slug: string) => SHOWCASE.find((p) => p.slug === slug)!;

/** The platform screens, in focus order (= stage-2 order). Yisbir has two:
 *  operations, then video indexing (owner, 2026-10-13: "in Yisbir there is
 *  also a product called video indexing"). */
export const PRODUCT_SCREENS: StageScreen[] = [
  { key: "mandoobee", role: "product", slug: "mandoobee", screen: SCREENS.mandoobeeApp, initial: false, narrow: true, tag: true },
  { key: "tasree3", role: "product", slug: "tasree3", screen: SCREENS.tasree3CommandCenter, initial: false, narrow: true, tag: true },
  { key: "nazo", role: "product", slug: "nazo", dash: DASHBOARDS.nazo, initial: false, narrow: true, tag: true },
  /* The narrow layout's focal screen. */
  { key: "yisbir", role: "product", slug: "yisbir", dash: DASHBOARDS.yisbirOps, initial: false, initialNarrow: true, narrow: true, tag: true },
  { key: "yisbir-index", role: "product", slug: "yisbir", dash: DASHBOARDS.yisbirIndex, initial: false, narrow: true },
  { key: "wasel", role: "product", slug: "wasel", dash: DASHBOARDS.wasel, initial: false, narrow: true, tag: true },
  /* The opening's focal screen and the universe's centre: the assistant. */
  { key: "ai-in-a-box", role: "product", slug: "ai-in-a-box", dash: DASHBOARDS.aiboxChat, initial: true, initialNarrow: false, narrow: true, tag: true },
];

/** Interface details: the opening's soft layers and stage 3's constellation.
 *  The 1200 px files, since most of the time they are blurred or small. */
export const DETAIL_SCREENS: StageScreen[] = [
  { key: "d-conformance", role: "detail", screen: SCREENS.tasree3Conformance, initial: true, narrow: true },
  { key: "d-alerts", role: "detail", screen: SCREENS.yisbirAlerts, initial: true, narrow: true },
  { key: "d-ppe", role: "detail", screen: SCREENS.yisbirPpeCompliance600, initial: true, narrow: true },
  /* AI in a Box analytics replaces the governance still (owner, 2026-10-13). */
  { key: "d-governance", role: "detail", dash: DASHBOARDS.aiboxAnalytics, initial: true, narrow: false },
  { key: "d-contract", role: "detail", screen: SCREENS.aiboxContractReview, initial: true, narrow: false },
  { key: "d-gate", role: "detail", screen: SCREENS.waselPhoneToGate, initial: true, narrow: false },
];

export const STAGE_SCREENS: StageScreen[] = [...DETAIL_SCREENS, ...PRODUCT_SCREENS];

/** Caption lines where a screen shows one part of a platform. Each line
 *  rests on the register: Yisbir operations EV-134 / EV-534 / EV-444,
 *  video indexing EV-440 / EV-442 (and the answer-with-sources view of the
 *  indexing UI the owner recorded). */
const CAPTION_OVERRIDES: Record<string, { descriptor: string; line: string; link?: string }> = {
  yisbir: {
    descriptor: "Operational intelligence",
    line: "Turn live camera events — fire and smoke, PPE, restricted zones — into alerts and insight, on the cameras you already have.",
  },
  "yisbir-index": {
    descriptor: "Video indexing",
    line: "Search hours of video like a document: transcripts in 50+ languages, answers with their sources, and the moment to jump to.",
    link: "Explore Yisbir video indexing",
  },
};

/** Stage-2 captions: the product's verified gallery copy (content/showcase.ts). */
export const PRODUCT_CAPTIONS = PRODUCT_SCREENS.map((s) => {
  const p = bySlug(s.slug!);
  const o = CAPTION_OVERRIDES[s.key];
  return {
    key: s.key,
    slug: p.slug,
    index: p.index,
    name: p.name,
    descriptor: o?.descriptor ?? p.descriptor,
    line: o?.line ?? p.line,
    accent: p.accent,
    linkLabel: o?.link ?? `Explore ${p.name}`,
    provenance: visualOf(s).provenance,
  };
});

/** One honest note for the whole composition (each screen also carries its
 *  own provenance, for assistive technology). */
export const STAGE_NOTE = "Product screens, interface reconstructions and illustrations · demo and sample data";
