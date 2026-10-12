/**
 * The product gallery: one panel per product, scrolled horizontally.
 *
 * Copy is the owner-mandated text carried by the prototype build and verified
 * against the evidence register (EV ids per panel). Do not edit the wording
 * without updating the register.
 *
 * `shot` is real, reviewed product media from content/media.ts. The
 * AI-generated background plates that used to sit behind each panel were
 * removed (plan/13 §A9 and the brand's "no glow, particles or plexus" rule);
 * the panel atmosphere is now the code-drawn lattice field.
 *
 * `accent` uses product sub-brand tokens from brand-reference.md §2.
 *
 * The order of this list is the gallery order, and the product pages' "next
 * product" follows it, wrapping (D11; STORY_ORDER in content/storyboards.ts).
 */

import { SCREENS, type Screen } from "./media";

/**
 * How a gallery card composes its media (FINAL-SPEC §5.1, §8): `phones` for
 * phone mock-ups, `wide` for a desktop screen, `iso` for an isometric
 * illustration, `matrix` for a grid-like screen, `doc` for a document screen.
 * Gallery CSS keys its card variants off this value (`data-media`).
 */
export type ShowcaseLayout = "phones" | "wide" | "iso" | "matrix" | "doc";

export type ShowcasePanel = {
  slug: string;
  /** Panel index label, e.g. "01". */
  index: string;
  name: string;
  descriptor: string;
  line: string;
  capabilities: string[];
  /**
   * Deployment fact. Omitted, never "to be confirmed", when the register has no
   * confirmed answer (AI in a Box: DL-P13, EV-571 vs EV-460 unresolved).
   */
  deploy?: string;
  shot: Screen;
  /** Card media composition (FINAL-SPEC §5.5 "Layouts"). */
  layout: ShowcaseLayout;
  /**
   * One verified proof chip, shown in the regular and compact card variants
   * only (FINAL-SPEC §5.5). Omitted where the register has no chip.
   */
  proof?: { text: string; evidence: string };
  /**
   * A second real screen for the card's depth stack (FINAL-SPEC §5.5). Never
   * the same `src` as `shot`.
   */
  shot2?: Screen;
  /** Product accent token. */
  accent: string;
  cta: string;
  /** Evidence ids backing the copy. */
  evidence: string;
};

export const SHOWCASE: ShowcasePanel[] = [
  {
    slug: "mandoobee",
    index: "01",
    name: "Mandoobee",
    descriptor: "Smart office application",
    line: "Attendance, requests, tasks, documents and an AI assistant in one workplace app.",
    capabilities: [
      "Clock in and out with location",
      "Leave and service requests, with approvals",
      "Documents, meetings and minutes",
    ],
    deploy: "On-premise, cloud or hybrid",
    /* The three-phone cut-out is withdrawn (D6): wall-08 instead. */
    shot: SCREENS.mandoobeeApp,
    layout: "wide",
    proof: { text: "On the App Store and Google Play", evidence: "EV-420" },
    accent: "var(--mandoobee-azure)",
    cta: "Request a Mandoobee briefing",
    /* EV-422 is internal-only: re-cited to EV-421 and EV-115. */
    evidence: "EV-112 EV-113 EV-115 EV-116 EV-420 EV-421",
  },
  {
    slug: "tasree3",
    index: "02",
    name: "Tasree3",
    descriptor: "AI-native process management",
    line: "Zero bureaucracy. One process solution.",
    capabilities: [
      "Re-engineer processes",
      "Mine how work really flows",
      "Govern every change",
    ],
    deploy: "Can run in your own cloud or data centre, in the region you choose",
    shot: SCREENS.tasree3CommandCenter,
    shot2: SCREENS.tasree3Conformance,
    layout: "wide",
    proof: { text: "Three modules. One AI-native core.", evidence: "EV-401" },
    // Tasree3's brand accent is orange (#FD5D01), and never green or teal.
    accent: "var(--tasree3-orange)",
    cta: "Request a Tasree3 briefing",
    evidence: "EV-400 EV-401 EV-402 EV-403 EV-407",
  },
  {
    slug: "nazo",
    index: "03",
    name: "Nazo",
    descriptor: "Correspondence and document workflow",
    line: "Route, approve, sign and seal official correspondence, in English and Arabic.",
    capabilities: [
      /* Was "Approval chains with due dates": in no register row (§5.6). */
      "Ordered review, approval and signing",
      "A sealed, verifiable archive",
      "AI drafting from templates",
    ],
    deploy: "On-premises or cloud; its AI runs on the same servers",
    shot: SCREENS.nazoDraft,
    layout: "doc",
    proof: { text: "14 AI actions, scoped by role", evidence: "EV-542" },
    accent: "var(--meerana-cyan)",
    cta: "Request a Nazo briefing",
    /* EV-540 (product identity) is confirm-with-meerana, so it is not cited;
       every line above rests on the rows below. */
    evidence: "EV-141 EV-142 EV-541 EV-542 EV-543 EV-544 EV-545",
  },
  {
    slug: "yisbir",
    index: "04",
    name: "Yisbir",
    descriptor: "Operational intelligence",
    /* "Uniform" and "attendance" are unconfirmed (D7). */
    line: "Search hours of video like a document, and turn live camera events — fire and smoke, PPE, restricted zones — into insight.",
    capabilities: [
      "Video indexing and search",
      "Live camera analytics on existing cameras",
      "Insight dashboards",
    ],
    deploy: "On-premise, cloud or hybrid",
    /* card-yisbir-ppe (six small workers) is withdrawn. */
    shot: SCREENS.yisbirFireSmoke,
    shot2: SCREENS.yisbirPpeWall,
    layout: "wide",
    proof: { text: "Audio transcription in 50+ languages", evidence: "EV-442" },
    accent: "var(--yisbir-aqua)",
    cta: "See Yisbir on your cameras",
    evidence: "EV-131 EV-134 EV-440 EV-442 EV-443 EV-444 EV-534",
  },
  {
    slug: "wasel",
    index: "05",
    name: "Wasel",
    descriptor: "Smart gate and access control",
    line: "Open, monitor and manage gates from your phone, with Bluetooth fallback when the internet is down.",
    capabilities: [
      "Role-based access",
      "Real-time gate status",
      "A full audit trail",
    ],
    deploy: "Cloud, local network or Bluetooth, on Meerana's own controller",
    // No photographic screenshot exists; the verified illustration is used and
    // labelled as such.
    shot: SCREENS.waselGateAccess,
    shot2: SCREENS.waselPhoneToGate,
    layout: "iso",
    proof: { text: "Cellular, Wi-Fi, Bluetooth or offline", evidence: "EV-103" },
    accent: "var(--wasel-copper)",
    cta: "Book a Wasel site assessment",
    evidence: "EV-100 EV-101 EV-102 EV-103 EV-530",
  },
  {
    slug: "ai-in-a-box",
    index: "06",
    name: "AI in a Box",
    descriptor: "Agentic AI for every employee",
    line: "An AI agent for every desk: it reads, drafts, schedules and reports.",
    capabilities: [
      "Contract review with clause flags",
      "Five agents in one matrix",
      /* PROVISIONAL – owner approval required (D8). Was "Voice, in English and
         Arabic": the demo shows English only (§5.6). The spec's replacement,
         "Contract review with clause flags", is already the first item, so
         the storyboard's corrected line is used instead. */
      "A person reviews and decides",
    ],
    // No `deploy`: per DL-P13 the site makes no deployment or sovereignty claim
    // for AI in a Box while EV-571 vs EV-460 is unresolved.
    shot: SCREENS.aiboxAgentMatrix,
    shot2: SCREENS.aiboxContractReview,
    layout: "matrix",
    // No proof chip: the register has no ok-to-use row for one (§5.5).
    accent: "var(--meerana-cyan)",
    cta: "Request an AI in a Box briefing",
    /* EV-520 is OWNER-PENDING: not yet merged into the register (D8). */
    evidence: "EV-520",
  },
];
