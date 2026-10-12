/**
 * Product stories (FINAL-SPEC §5).
 *
 * Every /products/<slug>/ page is one horizontal strip of 10–14 scenes in
 * three acts: I The problem, II The product, III The fit. A story carries
 * scenes 02…N−1; `visibleScenes()` adds the title scene (from the story's hero
 * fields) and the next scene (the following product), drops PREVIEW-only
 * items from production builds and numbers what is left.
 *
 * Sources. The four specified products (Tasree3, Yisbir, Mandoobee, Wasel)
 * began from plan/07-product-storyboards.md beat for beat, including its copy
 * and evidence ids; Nazo and AI in a Box follow the same conventions. Every
 * scene added in round 3 is taken from docs/r2/FINAL-SPEC.md §5.4, which cites
 * the register row for each line (docs/r2/content.json carries the checks).
 *
 * Rules that apply to every scene:
 *   · every visual carries its own data in `viz` — there are no shared
 *     fallback labels, so one product's vocabulary can never appear on
 *     another product's page;
 *   · a scene that shows real media uses `viz.kind = "screen"` and the media's
 *     own provenance; every diagram is labelled illustrative;
 *   · a real screen appears at most once per page (I9);
 *   · sample data is non-identifying: no faces, no plates, no real names;
 *   · nothing labelled `do-not-use` or `internal-only` in the register appears;
 *   · composed copy is `status: "provisional"` and marked PROVISIONAL here,
 *     listed for the owner (D4, D9); `confirm` items render in PREVIEW only.
 *
 * scripts/content-check.mjs enforces the budgets (§5.3), the evidence statuses
 * and the banned strings (§5.6) at build time.
 */

import { PREVIEW } from "../lib/flags";
import { SCREENS, type Provenance, type Screen } from "./media";
import { SHOWCASE } from "./showcase";

/* ============================================================================
   Scene model (FINAL-SPEC §5.1)
   ========================================================================== */

export type SceneKind =
  | "title"
  | "problem"
  | "people"
  | "intro"
  | "interface"
  | "walkthrough"
  | "features"
  | "output"
  | "usecases"
  | "integrations"
  | "governance"
  | "deploy"
  | "value"
  | "faq"
  | "next";

export type Act = 1 | 2 | 3;
export type Enter = "pan" | "dolly" | "wipe" | "type";
export type Layout = "split" | "reverse" | "wide" | "center";
/** ok: ships · provisional: ships, listed for owner approval · confirm: PREVIEW builds only. */
export type Status = "ok" | "provisional" | "confirm";

/** The visual kinds that existed before the scene model. */
export type BeatViz =
  | { kind: "split"; left: { label: string; items: string[] }; right: { label: string; items: string[]; warn?: string[] } }
  | { kind: "lanes"; lanes: string[]; caption: string }
  | { kind: "tiles"; items: string[] }
  /** A process graph. With `rework`, the node named "Rework" drops below the chain. */
  | { kind: "flow"; nodes: string[]; rework?: boolean }
  /** Numbered steps, from the scene's own `steps`. Drawn as stations. */
  | { kind: "steps" }
  /** A keyed feature list, from the scene's own `features`. */
  | { kind: "grid" }
  | { kind: "layers"; layers: string[] }
  | { kind: "wall" }
  | { kind: "phone"; title: string; rows: { label: string; status: string }[] }
  | { kind: "records"; rows: { label: string; meta?: string }[] }
  /** Connected nodes. `hub: false` draws them deliberately disconnected. */
  | { kind: "system"; nodes: string[]; hub: boolean }
  | { kind: "screen"; screen: Screen };

/** What a scene draws. Each kind carries all the data it renders. */
export type Viz =
  | BeatViz
  /** Typographic title art: 3–7 words. Type, not a picture. */
  | { kind: "ribbon"; words: string[] }
  /** Use-case tiles, drawn from the scene's own `cases`. */
  | { kind: "cases" }
  /** Inputs, one core, outputs. */
  | { kind: "ports"; inputs: string[]; core: string; outputs: string[] }
  /** A deployment boundary drawn around the nodes inside it. */
  | { kind: "boundary"; inside: string[]; caption: string }
  /** A left-to-right chain, with optional side branches ("Reject"). */
  | { kind: "chain"; nodes: string[]; branches?: string[] }
  /** Labelled columns of real list items. */
  | { kind: "columns"; cols: { label: string; items: string[] }[] }
  /** The end card: a link to the next product's page. */
  | { kind: "next"; slug: string }
  | { kind: "none" };

export type Scene = {
  /** Anchor, unique per page, matching /^[a-z][a-z-]*$/. */
  id: string;
  kind: SceneKind;
  act: Act;
  eyebrow: string;
  heading: string;
  body?: string;
  /** Required, except on title (it uses `story.heroEvidence`) and next. */
  evidence: string;
  /** Default "ok". Composed headings and copy are "provisional". */
  status?: Status;
  /** Default DEFAULT_LAYOUT[kind]. */
  layout?: Layout;
  /** Default DEFAULT_ENTER[kind]; forced to "wipe" on the first scene of acts II and III. */
  enter?: Enter;
  /** Outlined background type. Default: the scene number (the product name on `value`). */
  bigType?: { text: string; lang?: "ar" };
  steps?: { label: string; copy: string }[];
  features?: string[];
  cases?: { label: string; copy: string; evidence: string; status?: Status }[];
  facts?: { label: string; value: string; evidence: string }[];
  faq?: { q: string; a: string; evidence: string; status?: Status }[];
  links?: { label: string; href: string; external?: boolean }[];
  sectors?: { text: string; evidence: string };
  /**
   * Required for every pictorial viz (content-check). Not needed by `screen`
   * (the media carries its own), `none`, `next`, `columns`, `cases`, `ribbon`
   * (type, not a picture) or `grid` (a list, FINAL-SPEC §6.1).
   */
  provenance?: Provenance;
  viz: Viz;
  /** Draw the screen's own `labels` as callouts. */
  callouts?: boolean;
  /** "01"…, computed by visibleScenes() with no gaps after filtering. */
  n?: string;
};

/** A scene as rendered: numbered, with its layout and entrance resolved. */
export type ResolvedScene = Scene & { n: string; layout: Layout; enter: Enter };

export const DEFAULT_LAYOUT: Record<SceneKind, Layout> = {
  title: "split",
  problem: "split",
  people: "reverse",
  intro: "split",
  interface: "split",
  walkthrough: "wide",
  features: "reverse",
  output: "split",
  usecases: "wide",
  integrations: "split",
  governance: "reverse",
  deploy: "split",
  value: "center",
  faq: "wide",
  next: "split",
};

export const DEFAULT_ENTER: Record<SceneKind, Enter> = {
  title: "pan",
  problem: "pan",
  people: "dolly",
  intro: "pan",
  interface: "pan",
  walkthrough: "pan",
  features: "dolly",
  output: "pan",
  usecases: "pan",
  integrations: "pan",
  governance: "dolly",
  deploy: "pan",
  value: "type",
  faq: "pan",
  next: "dolly",
};

/** Page order for the `next` scene: the gallery (SHOWCASE) order, wrapping (D11). */
export const STORY_ORDER = ["mandoobee", "tasree3", "nazo", "yisbir", "wasel", "ai-in-a-box"] as const;
export type StorySlug = (typeof STORY_ORDER)[number];

/** The product after `slug`, wrapping from the last to the first. */
export function nextSlug(slug: string): StorySlug {
  const i = STORY_ORDER.indexOf(slug as StorySlug);
  return STORY_ORDER[(i + 1) % STORY_ORDER.length];
}

/* ---- story shape --------------------------------------------------------- */

/** The story fields shared by every renderer. */
type StoryFields = {
  slug: string;
  name: string;
  descriptor: string;
  /** Product's own hero line (the title scene's H1). */
  hero: string;
  heroSub: string;
  /** Arabic name meaning, where the register supports it. */
  nameMoment?: { ar: string; en: string };
  /** CTA label and its interest value for /contact. */
  cta: string;
  interest: string;
  /** External product site, where one exists. */
  external?: string;
  /** Brand surfaces, from brand-reference.md §2. */
  surface: { bg: string; fg: string; accent: string; accent2?: string };
  /** The title scene's screen, where the title art is one. Omitted where the
   * title is a ribbon, so a product screen appears once per page (I9). */
  heroScreen?: Screen;
  /**
   * The next scene's statement. PROVISIONAL – owner approval required: the old
   * shared line ("See X on your own process") was wrong for cameras, gates and
   * desks.
   */
  closingLine: string;
};

export type ProductStory = StoryFields & {
  /** Evidence for the title scene (hero, sub-line and title art). */
  heroEvidence: string;
  /** The title scene's visual: a real screen or a ribbon. */
  titleArt: Viz;
  /** Scenes 02…N−1. The title and next scenes are added by visibleScenes(). */
  scenes: Scene[];
};

/** A story as written in this file. */
type StorySource = Omit<ProductStory, "name" | "descriptor">;

/* ============================================================================
   Tasree3 (14 scenes)
   ========================================================================== */

const TASREE3: StorySource = {
  slug: "tasree3",
  hero: "Zero bureaucracy. One process solution.",
  heroSub:
    "Re-engineer, mine and govern every process on one AI-native platform — designed and developed in the UAE.",
  nameMoment: { ar: "تسريع", en: "acceleration" },
  cta: "Request a process discovery session",
  interest: "tasree3",
  external: "https://tasree3.ae",
  /* Orange marks only problems; sky marks normal flow. Never green or teal. */
  surface: {
    bg: "var(--tasree3-ink)",
    fg: "var(--meerana-white)",
    accent: "var(--tasree3-orange)",
    accent2: "var(--tasree3-sky)",
  },
  heroScreen: SCREENS.tasree3CommandCenter,
  closingLine: "See Tasree3 on your own process.",
  heroEvidence: "EV-400 EV-401 EV-410",
  titleArt: { kind: "screen", screen: SCREENS.tasree3CommandCenter },
  scenes: [
    /* ---- Act I · the problem ---- */
    {
      id: "problem",
      kind: "problem",
      act: 1,
      eyebrow: "Problem",
      heading: "Every process has a version nobody drew.",
      body: "On paper, six steps. In practice: loops, waits and workarounds.",
      evidence: "EV-402 EV-404",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "split",
        left: { label: "As drawn", items: ["Request", "Review", "Finance", "Approval", "Issue", "Close"] },
        right: {
          label: "As it runs",
          items: ["Request", "Review", "Wait", "Finance", "Loop", "Review", "Approval", "Issue"],
          warn: ["Wait", "Loop"],
        },
      },
    },
    {
      id: "people",
      kind: "people",
      act: 1,
      eyebrow: "People and place",
      heading: "Work cuts across departments. The map rarely does.",
      body: "Process owners and approvers need facts about how work really flows across departments — not workshop guesses.",
      evidence: "EV-403 EV-405",
      provenance: "Illustrative diagram · sample data",
      viz: { kind: "lanes", lanes: ["Intake", "Review", "Finance", "Approval"], caption: "One case, four departments" },
    },
    /* ---- Act II · the product ---- */
    {
      id: "intro",
      kind: "intro",
      act: 2,
      eyebrow: "The platform",
      heading: "Three modules. One AI-native core.",
      body: "Re-engineering, process mining and governance work on one model of your process, so a change in one is visible in all three.",
      evidence: "EV-401",
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["Re-engineering", "Process mining", "Governance"] },
    },
    {
      id: "interface",
      kind: "interface",
      act: 2,
      eyebrow: "Interface",
      heading: "Connect your systems. Tasree3 mines how work actually runs.",
      body: "The discovered process is drawn from real event data, so what you see is what happened — not what was agreed.",
      evidence: "EV-404",
      provenance: "Illustrative diagram · sample data",
      viz: { kind: "flow", nodes: ["Intake", "Review", "Rework", "Finance", "Approval"], rework: true },
    },
    {
      id: "walkthrough",
      kind: "walkthrough",
      act: 2,
      eyebrow: "Walkthrough",
      heading: "Mine, find, re-engineer, ask, govern.",
      body: "Five moves from a discovered process to a governed one.",
      evidence: "EV-402 EV-403 EV-404 EV-405",
      provenance: "Illustrative diagram",
      viz: { kind: "steps" },
      steps: [
        { label: "Mine", copy: "See every path the work actually takes." },
        { label: "Find", copy: "Spot where cases wait — and where they loop back." },
        { label: "Re-engineer", copy: "Redesign with proven moves: eliminate, simplify, parallelize, automate, standardize." },
        { label: "Ask", copy: "Ask in plain language. Get recommendations ranked by impact and effort." },
        { label: "Govern", copy: "Approve and publish the new process — every version kept, every change traceable." },
      ],
    },
    {
      id: "features",
      kind: "features",
      act: 2,
      eyebrow: "Built for process work",
      heading: "Enterprise process management, not a flowchart tool.",
      body: "The features a process team is actually measured on.",
      evidence: "EV-402 EV-403 EV-408 EV-123",
      viz: { kind: "grid" },
      features: [
        "APQC L1–L4 benchmarking",
        "BPMN 2.0, EPC and value chains",
        "Co-editing with live presence",
        "Arabic and RTL",
        "SSO — Entra ID, SAML, OIDC",
        "Export to PDF, Excel and PowerPoint",
      ],
    },
    {
      id: "output",
      kind: "output",
      act: 2,
      eyebrow: "Output",
      heading: "Then keep it honest.",
      body: "Tasree3 replays the approved process against new event data and reports where reality drifts from the model.",
      evidence: "EV-402 EV-404 EV-557",
      viz: { kind: "screen", screen: SCREENS.tasree3Conformance },
      callouts: true,
      features: [
        "Conformance Center global audit",
        "Conformance report in PDF or Excel",
        "RACI matrix and process manuals",
        "Gap and process analysis",
      ],
    },
    /* ---- Act III · the fit ---- */
    {
      id: "usecases",
      kind: "usecases",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Use cases",
      heading: "From the first map to the next audit.",
      /* Alignment with the programme, never endorsement (EV-410 note). This is
         the Zero Government Bureaucracy line from the dropped value scene. */
      body: "Built for the re-engineering work the UAE's Zero Government Bureaucracy programme calls for.",
      evidence: "EV-410",
      viz: { kind: "cases" },
      cases: [
        {
          label: "Government service redesign",
          copy: "Map a service as it runs, remove the steps that add nothing, publish the approved version.",
          evidence: "EV-410 EV-403 EV-405",
        },
        {
          label: "Event logs to an as-is map",
          copy: "Upload CSV, JSON, PDF or DOCX files, or connect an HRMS, and mine how work really runs.",
          evidence: "EV-552",
        },
        {
          label: "Bottlenecks before the workshop",
          copy: "Switch between frequency and performance views and inspect any step for waiting time.",
          evidence: "EV-556",
        },
        {
          label: "Audit against the approved model",
          copy: "Run a global audit from the Conformance Center and export the report as PDF or Excel.",
          evidence: "EV-557 EV-404",
        },
        {
          label: "Manuals and RACI from one source",
          copy: "Generate process manuals, RACI matrices and gap analyses from the shared repository.",
          evidence: "EV-557 EV-402",
        },
        {
          label: "Governed change, department-wide",
          copy: "Route a revised model through ordered reviewers, with an AI summary of what changed.",
          evidence: "EV-555",
        },
      ],
      sectors: {
        text: "Sectors: Manufacturing · Banking and finance · Healthcare · Government · Enterprise",
        evidence: "EV-124",
      },
    },
    {
      id: "integrations",
      kind: "integrations",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Data in, documents out",
      heading: "Start from the event data you already have.",
      body: "Load files or connect an HRMS. Tasree3 maps the columns and explains anything it cannot read.",
      evidence: "EV-552",
      facts: [
        { label: "Sources", value: "CSV, JSON, PDF or DOCX files, or a connected HRMS", evidence: "EV-552" },
        { label: "Documents", value: "AI extracts events from PDF and Word files", evidence: "EV-552" },
        { label: "Required fields", value: "Case ID, activity and timestamp, mapped automatically", evidence: "EV-552" },
        { label: "Models", value: "BPMN 2.0 XML import and export", evidence: "EV-554" },
        { label: "Exports", value: "PDF, Excel and PowerPoint", evidence: "EV-402" },
        { label: "Maps", value: "PNG, PDF (A4 or A3), HTML or animated GIF", evidence: "EV-554 EV-556" },
      ],
      provenance: "Illustrative diagram",
      viz: {
        kind: "ports",
        inputs: ["CSV", "JSON", "PDF", "DOCX", "HRMS"],
        core: "Tasree3",
        outputs: ["As-is process map", "BPMN 2.0 XML", "PDF · Excel · PowerPoint"],
      },
    },
    {
      id: "governance",
      kind: "governance",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Governance",
      heading: "Every change approved. Every version kept.",
      /* Never "immutable" (EV-405). */
      body: "Submit, review, approve, publish: a version is captured on every approval, with full history and one-click rollback.",
      evidence: "EV-405",
      facts: [
        { label: "Roles", value: "Viewer, Author, Reviewer, Endorser, Approver, Admin", evidence: "EV-405" },
        { label: "Review", value: "An ordered chain of reviewers and a final approver", evidence: "EV-555" },
        { label: "Changes", value: "Reviewers read an AI summary of what changed", evidence: "EV-555" },
        { label: "History", value: "Approval cycle time and the full workflow trail", evidence: "EV-555" },
        { label: "Restore", value: "Archived versions can be restored as a draft", evidence: "EV-555" },
      ],
      provenance: "Illustrative diagram",
      viz: {
        kind: "chain",
        nodes: ["Submit", "In review", "Approved", "Published"],
        branches: ["Request changes", "Return to author", "Reject"],
      },
    },
    {
      id: "deploy",
      kind: "deploy",
      act: 3,
      eyebrow: "Deployment and security",
      heading: "It can run in your own cloud or data centre.",
      body: "In the region you choose, under your rules. No black box and no offshore lock-in.",
      evidence: "EV-407",
      facts: [
        { label: "Identity", value: "SSO via Microsoft Entra ID, SAML 2.0 and OIDC", evidence: "EV-408" },
        { label: "Accounts", value: "Provisioned by your administrator; no self-registration", evidence: "EV-551" },
        { label: "Data", value: "Encryption at rest and role-based access control", evidence: "EV-408" },
        { label: "Staging", value: "Separated as-is and to-be environments", evidence: "EV-408" },
        { label: "Logging", value: "SIEM-compatible", evidence: "EV-408" },
        { label: "Language", value: "English and Arabic, with right-to-left layouts", evidence: "EV-551 EV-123" },
      ],
      provenance: "Illustrative diagram",
      viz: {
        kind: "boundary",
        inside: ["Tasree3", "Your event data", "Your identity provider"],
        caption: "Your cloud or data centre",
      },
    },
    {
      id: "faq",
      kind: "faq",
      act: 3,
      // PROVISIONAL – owner approval required (heading and questions, D4).
      status: "provisional",
      eyebrow: "Questions",
      heading: "What process teams ask first.",
      evidence: "EV-552 EV-554 EV-403 EV-553 EV-407 EV-551 EV-123",
      viz: { kind: "none" },
      faq: [
        {
          q: "Do we need clean event logs to start?",
          a: "No. Model in the editor, describe a process in plain language, or upload files; AI extracts events and the wizard maps the fields.",
          evidence: "EV-552 EV-554",
          status: "provisional",
        },
        {
          q: "Which notations does Tasree3 support?",
          a: "BPMN 2.0, EPC and value chains, plus organisation diagrams, with BPMN 2.0 XML import and export.",
          evidence: "EV-403 EV-553 EV-554",
          status: "provisional",
        },
        {
          q: "Can it run on our own infrastructure?",
          a: "It can run in your own cloud or data centre, in the region you choose. We confirm the configuration with you.",
          evidence: "EV-407",
          status: "provisional",
        },
        {
          q: "Does Tasree3 work in Arabic?",
          a: "Yes. Users switch between English and Arabic at sign-in, and layouts support right-to-left.",
          evidence: "EV-551 EV-123",
          status: "provisional",
        },
      ],
    },
  ],
};

/* ============================================================================
   Yisbir (14 scenes)
   ========================================================================== */

const YISBIR: StorySource = {
  slug: "yisbir",
  hero: "Turn hours of video into searchable intelligence.",
  /* PROVISIONAL – owner approval required. Was "— who appears, what is said,
     what text is on screen —": "who appears" reads as face recognition, which
     stays out of heroes and demos (EV-535, DL-P07, D7). */
  heroSub:
    "Yisbir indexes video with AI — what is said, what is on screen, what happens — so teams can search hours of footage in seconds, on their own infrastructure.",
  nameMoment: { ar: "يسبر", en: "to probe, to examine in depth" },
  cta: "Request a Yisbir demo",
  interest: "yisbir",
  external: "https://yisbir.com",
  surface: {
    bg: "var(--yisbir-abyss)",
    fg: "var(--meerana-white)",
    accent: "var(--yisbir-aqua)",
    accent2: "var(--yisbir-blue)",
  },
  heroScreen: SCREENS.yisbirFireSmoke,
  closingLine: "See Yisbir on your own cameras.",
  heroEvidence: "EV-440",
  /* Screens (I9): fire and smoke here, alerts in use cases, PPE in value. */
  titleArt: { kind: "screen", screen: SCREENS.yisbirFireSmoke },
  scenes: [
    /* ---- Act I ---- */
    {
      id: "problem",
      kind: "problem",
      act: 1,
      eyebrow: "Problem",
      heading: "Hours of footage. One minute that matters.",
      body: "Nobody can watch it all, and nobody can search it — until it is indexed.",
      evidence: "EV-440",
      provenance: "Illustrative diagram · rendered scene, no real footage",
      viz: { kind: "wall" },
    },
    {
      id: "people",
      kind: "people",
      act: 1,
      // PROVISIONAL – owner approval required (D9): "organisations" became
      // "teams" to meet the 60-character heading budget (§5.3).
      status: "provisional",
      eyebrow: "People and place",
      heading: "For teams whose video cannot leave their data centre.",
      body: "Investigations, operations and safety, and records teams — on infrastructure you control.",
      evidence: "EV-443 EV-444 EV-446",
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["Investigations", "Operations and safety", "Records teams"] },
    },
    /* ---- Act II ---- */
    {
      id: "intro",
      kind: "intro",
      act: 2,
      eyebrow: "How it reads video",
      heading: "One frame, four layers.",
      body: "People, speech, on-screen text, objects and events — indexed separately, searchable together.",
      evidence: "EV-442",
      provenance: "Illustrative diagram",
      viz: { kind: "layers", layers: ["People", "Speech", "On-screen text", "Objects and events"] },
    },
    {
      id: "interface",
      kind: "interface",
      act: 2,
      eyebrow: "Interface",
      heading: "Search video the way you search documents.",
      body: "A query returns moments across every recording, with who said it and when.",
      evidence: "EV-442 EV-440",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "records",
        rows: [
          { label: "“loading bay” · spoken, Bay 3 camera", meta: "00:14:32" },
          { label: "“exit B” · sign text, Gate camera", meta: "01:02:10" },
          { label: "“delivery” · spoken, Dock camera", meta: "02:47:05" },
        ],
      },
    },
    {
      id: "walkthrough",
      kind: "walkthrough",
      act: 2,
      eyebrow: "Walkthrough",
      heading: "Index, search, read the frame, watch live, export.",
      body: "From source footage to an evidence-ready package.",
      evidence: "EV-133 EV-134 EV-136 EV-442",
      provenance: "Illustrative diagram",
      viz: { kind: "steps" },
      steps: [
        { label: "Index", copy: "Upload or connect your sources — Yisbir indexes them automatically." },
        { label: "Search", copy: "Find any phrase, in 50+ languages, with who said it and when." },
        { label: "Read", copy: "Read the text in the frame — signs, screens, documents." },
        { label: "Watch live", copy: "On sites, the same AI watches live: missing helmets, restricted zones, falls." },
        { label: "Export", copy: "Share exactly the clips that matter, with access control." },
      ],
    },
    {
      id: "features",
      kind: "features",
      act: 2,
      eyebrow: "Capability",
      heading: "Built for archives that matter.",
      body: "Search and review capabilities, on your own infrastructure.",
      evidence: "EV-136 EV-442",
      viz: { kind: "grid" },
      features: [
        "Semantic and similarity search",
        "Scene-change detection",
        "Video summarisation",
        "API integration",
        "Role-based access",
        "Cloud, on-premise or hybrid",
      ],
    },
    {
      id: "output",
      kind: "output",
      act: 2,
      eyebrow: "Output",
      heading: "From a question to an evidence-ready package.",
      body: "Clips, transcript excerpts and a timeline — without replaying the day.",
      evidence: "EV-133 EV-442",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "records",
        rows: [
          { label: "Clips", meta: "the moments that matter" },
          { label: "Transcript excerpts", meta: "who said it, and when" },
          { label: "Timeline", meta: "in recorded order" },
          { label: "Sharing", meta: "with access control" },
        ],
      },
    },
    /* ---- Act III ---- */
    {
      id: "usecases",
      kind: "usecases",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      layout: "reverse",
      eyebrow: "Use cases",
      heading: "From the archive to the live site.",
      body: "The same platform indexes recorded video and watches live cameras.",
      evidence: "EV-533 EV-534",
      viz: { kind: "screen", screen: SCREENS.yisbirAlerts },
      callouts: true,
      /* Copy-column variant (2 × 2). Headcount and retail are PREVIEW-only
         until the models are confirmed (D7). */
      cases: [
        {
          label: "Lecture and meeting archives",
          copy: "Find a topic, phrase or slide across years of recordings.",
          evidence: "EV-533 EV-440 EV-442",
        },
        {
          label: "Evidence review",
          copy: "Index CCTV exports and interviews; share only the relevant clips.",
          evidence: "EV-533 EV-442",
        },
        {
          label: "Construction safety",
          copy: "Missing helmets and vests, restricted-zone entry and falls, flagged.",
          evidence: "EV-133 EV-134",
        },
        {
          label: "After-hours site security",
          copy: "Intrusion, perimeter breaches and unauthorised access, after hours.",
          evidence: "EV-537",
        },
        {
          label: "Headcount attendance",
          copy: "Count people by room or shift, with nobody identified.",
          evidence: "EV-138 EV-534 EV-535",
          status: "confirm",
        },
        {
          label: "Retail shelves",
          copy: "Spot misplaced products beside footfall by zone.",
          evidence: "EV-533 EV-138",
          status: "confirm",
        },
      ],
    },
    {
      id: "search",
      kind: "integrations",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Search and integration",
      heading: "Ask for a moment the way you would describe it.",
      body: "Phrase, metadata, similarity, fuzzy and synonym, vector and natural-language search over one index.",
      evidence: "EV-442 EV-136",
      facts: [
        { label: "Transcripts", value: "50+ languages, with speaker diarization", evidence: "EV-440 EV-442" },
        { label: "On-screen text", value: "Signage, slides and paperwork read with OCR", evidence: "EV-442 EV-136" },
        { label: "Sharing", value: "Secure downloads with access control", evidence: "EV-442" },
        { label: "Systems", value: "API integration with your existing systems", evidence: "EV-442" },
      ],
      provenance: "Illustrative diagram",
      viz: {
        kind: "ports",
        inputs: ["Recorded video", "Existing cameras", "Scanned documents"],
        core: "Yisbir index",
        outputs: ["Search", "Clips", "API"],
      },
    },
    {
      id: "deploy",
      kind: "deploy",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Deployment",
      heading: "Your infrastructure, the cameras you have.",
      body: "Cloud, on-premise or hybrid. It can run fully on-premises, with no hardware changes required.",
      evidence: "EV-444 EV-443",
      facts: [
        { label: "Deployment", value: "Cloud, on-premise or hybrid", evidence: "EV-444" },
        { label: "Public cloud", value: "Not required: it can run fully on-premises", evidence: "EV-443" },
        { label: "Cameras", value: "Your existing cameras and infrastructure", evidence: "EV-444" },
        { label: "Overhead", value: "Runs in your own data centre with minimal GPU overhead", evidence: "EV-443" },
        { label: "Sovereignty", value: "Built for organisations that prioritise data sovereignty", evidence: "EV-446" },
      ],
      provenance: "Illustrative diagram",
      viz: {
        kind: "boundary",
        inside: ["Existing cameras", "Yisbir", "Your teams"],
        caption: "Can run fully on-premises",
      },
    },
    {
      id: "value",
      kind: "value",
      act: 3,
      /* A real screen sits beside the statement, so the copy keeps its own
         column (the centred layout is for type-only value scenes). */
      layout: "split",
      eyebrow: "Value",
      heading: "Operational intelligence, on your terms.",
      body: "No hardware changes required. Existing cameras, existing network.",
      evidence: "EV-440 EV-444 EV-133",
      viz: { kind: "screen", screen: SCREENS.yisbirPpeWall },
      features: ["Multimodal search", "On your infrastructure", "Ready for sites"],
    },
    {
      id: "faq",
      kind: "faq",
      act: 3,
      // PROVISIONAL – owner approval required (heading and questions, D4).
      // The face-recognition question is excluded (D7).
      status: "provisional",
      eyebrow: "Questions",
      heading: "What operations teams ask first.",
      evidence: "EV-444 EV-443 EV-134 EV-138 EV-534 EV-537 EV-440 EV-442",
      viz: { kind: "none" },
      faq: [
        {
          q: "Do we need new cameras?",
          a: "No. Yisbir works with your existing cameras and infrastructure, with no hardware changes required.",
          evidence: "EV-444",
          status: "provisional",
        },
        {
          q: "Can Yisbir run without the public cloud?",
          a: "Yes. It can run fully on-premises, or in the cloud or a hybrid set-up if you prefer.",
          evidence: "EV-443 EV-444",
          status: "provisional",
        },
        {
          q: "What can it detect on live cameras?",
          a: "Fire and smoke, missing helmets and vests, restricted-zone entry, falls, after-hours intrusion and perimeter breaches.",
          evidence: "EV-134 EV-138 EV-534 EV-537",
          status: "provisional",
        },
        {
          q: "Which languages can it transcribe?",
          a: "More than 50, with speaker diarization so each passage is attributed to a speaker.",
          evidence: "EV-440 EV-442",
          status: "provisional",
        },
      ],
    },
  ],
};

/* ============================================================================
   Mandoobee (12 scenes)
   ========================================================================== */

const MANDOOBEE: StorySource = {
  slug: "mandoobee",
  hero: "Your whole working day, in one app.",
  heroSub:
    "Mandoobee brings attendance, HR requests, tasks, documents, meetings and an AI assistant into one workplace app — on web and mobile.",
  cta: "See Mandoobee in a demo",
  interest: "mandoobee",
  surface: {
    bg: "var(--mandoobee-royal)",
    fg: "var(--mandoobee-mist)",
    accent: "var(--mandoobee-azure)",
  },
  closingLine: "See Mandoobee with your own team.",
  heroEvidence: "EV-113",
  /* A ribbon, so the app screen appears once on the page, in Interface (I9). */
  titleArt: { kind: "ribbon", words: ["Attendance", "Requests", "Tasks", "Documents", "Assistant"] },
  /* No language claim anywhere on this page until EV-427 is confirmed (D5). */
  scenes: [
    /* ---- Act I ---- */
    {
      id: "problem",
      kind: "problem",
      act: 1,
      eyebrow: "Problem",
      heading: "Too many tools. Not enough productivity.",
      body: "Attendance in one system, leave in another, documents in a third — and none of them talk.",
      evidence: "EV-113",
      provenance: "Illustrative diagram",
      viz: { kind: "system", nodes: ["Attendance system", "Leave system", "Document store"], hub: false },
    },
    {
      id: "people",
      kind: "people",
      act: 1,
      eyebrow: "People and place",
      heading: "One app, three points of view.",
      body: "Employees act from anywhere. Managers see their team. HR and admin keep the record straight.",
      /* EV-422 is internal-only: re-cited (§5.6). */
      evidence: "EV-421 EV-115",
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["Employees", "Managers", "HR and admin"] },
    },
    /* ---- Act II ---- */
    {
      id: "intro",
      kind: "intro",
      act: 2,
      eyebrow: "The app",
      heading: "Attendance, requests, tasks, documents, assistant.",
      body: "Clock in and out with location. Raise a request and watch it move. Keep the documents where the work is.",
      evidence: "EV-113 EV-421",
      provenance: "Illustrative diagram",
      viz: { kind: "system", nodes: ["Attendance", "Requests", "Tasks", "Documents", "Assistant"], hub: true },
    },
    {
      id: "interface",
      kind: "interface",
      act: 2,
      eyebrow: "Interface",
      heading: "Clock in from the office, remotely, or on site.",
      body: "Location-aware attendance, and a manager dashboard that shows the whole picture.",
      evidence: "EV-421",
      /* The three-phone cut-out is withdrawn (D6). */
      viz: { kind: "screen", screen: SCREENS.mandoobeeApp },
      callouts: true,
    },
    {
      id: "walkthrough",
      kind: "walkthrough",
      act: 2,
      eyebrow: "Walkthrough",
      heading: "A working day, end to end.",
      body: "From the first clock-in to the approved request.",
      evidence: "EV-421 EV-114 EV-115",
      provenance: "Illustrative diagram",
      viz: { kind: "steps" },
      steps: [
        { label: "Clock in", copy: "Clock in and out with location, from the office or remotely." },
        { label: "Request", copy: "Raise leave or a service request in a few taps." },
        { label: "Approve", copy: "Managers approve with the context they need, on any device." },
        { label: "Record", copy: "Documents, meetings and minutes stay with the work that produced them." },
        { label: "Assist", copy: "An AI assistant answers questions about your own workplace data." },
      ],
    },
    {
      id: "features",
      kind: "features",
      act: 2,
      eyebrow: "Capability",
      heading: "Built for the whole organisation.",
      /* Was "From a single team to a group with several entities." (§5.6). */
      body: "HR, projects, documents, communication and AI in one platform.",
      evidence: "EV-113 EV-116 EV-421",
      viz: { kind: "grid" },
      features: [
        "Location-aware attendance",
        "Approval workflows",
        "Document and meeting records",
        "AI assistant on your data",
        "Web and mobile",
        "On-premise, cloud or hybrid",
      ],
    },
    {
      id: "output",
      kind: "output",
      act: 2,
      eyebrow: "Output",
      heading: "One record of the working day.",
      /* Was "…exportable for HR and audit." (§5.6). */
      body: "Attendance, requests and approvals in one record, with admin dashboards and reports.",
      evidence: "EV-421 EV-115",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "records",
        rows: [
          { label: "Attendance", meta: "where and when" },
          { label: "Requests", meta: "raised and routed" },
          { label: "Approvals", meta: "who, and when" },
          { label: "Reports", meta: "admin dashboards" },
        ],
      },
    },
    /* ---- Act III ---- */
    {
      id: "usecases",
      kind: "usecases",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Use cases",
      heading: "One app for the rest of the working day.",
      body: "Beyond attendance: payroll, projects, documents, meetings and an AI assistant, in the same app.",
      evidence: "EV-421 EV-114",
      viz: { kind: "cases" },
      cases: [
        {
          label: "The workforce at a glance",
          copy: "Admin dashboards and reports show who clocked in at the office, remotely, or not yet.",
          evidence: "EV-115 EV-421",
        },
        {
          label: "Meetings with shared minutes",
          copy: "Schedule meetings and record minutes, with the AI note assistant and speech to text.",
          evidence: "EV-421 EV-115",
        },
        {
          label: "Paperless document approval",
          copy: "Create, review, sign and archive documents, with OCR scanning and PDF tools.",
          evidence: "EV-421 EV-114 EV-115",
        },
        {
          label: "Payroll and assets",
          copy: "Payroll management and an asset register beside attendance and leave.",
          evidence: "EV-421",
        },
        {
          label: "Projects and tasks",
          copy: "Assign tasks, track projects and keep shared folders and links next to the work.",
          evidence: "EV-421 EV-114",
        },
        {
          label: "AI for documents and notes",
          copy: "Ask questions of a document, review a contract or summarise meeting notes.",
          evidence: "EV-114 EV-421",
        },
      ],
    },
    {
      id: "deploy",
      kind: "deploy",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Deployment",
      heading: "Deploy it your way, under your brand.",
      body: "On-premise, in the cloud or hybrid, with native apps on the App Store and Google Play.",
      evidence: "EV-116 EV-420",
      facts: [
        { label: "Deployment", value: "On-premise, cloud or hybrid", evidence: "EV-116" },
        { label: "Brand", value: "White-labelling and customisation", evidence: "EV-116" },
        { label: "Integrations", value: "Third-party integrations, scoped per project", evidence: "EV-116" },
        { label: "Apps", value: "iOS and Android", evidence: "EV-420" },
      ],
      /* Text links only, no badge artwork (D12). F checks both resolve before
         release (EV-420). */
      /* The stage adds the ↗ and "opens in a new tab" to external links. */
      links: [
        { label: "Download on the App Store", href: "https://apps.apple.com/app/id6473241950", external: true },
        {
          label: "Get it on Google Play",
          href: "https://play.google.com/store/apps/details?id=ae.meerana.mandoobee",
          external: true,
        },
      ],
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["On-premise", "Cloud", "Hybrid"] },
    },
    {
      id: "faq",
      kind: "faq",
      act: 3,
      // PROVISIONAL – owner approval required (heading and questions, D4).
      status: "provisional",
      eyebrow: "Questions",
      heading: "What HR and operations teams ask first.",
      evidence: "EV-420 EV-116 EV-114 EV-115 EV-421",
      viz: { kind: "none" },
      faq: [
        {
          q: "Is Mandoobee on iOS and Android?",
          a: "Yes. Mandoobee is listed on the App Store and Google Play.",
          evidence: "EV-420",
          status: "provisional",
        },
        {
          q: "Can we host Mandoobee ourselves?",
          a: "Yes. It deploys on-premise, in the cloud or as a hybrid.",
          evidence: "EV-116",
          status: "provisional",
        },
        {
          q: "Can it carry our brand?",
          a: "Yes. Mandoobee supports white-labelling and customisation.",
          evidence: "EV-116",
          status: "provisional",
        },
        {
          q: "What does the AI assistant do?",
          a: "It answers questions about documents, reviews contracts, keeps smart notes, turns speech into text and reads scanned paper.",
          evidence: "EV-114 EV-115 EV-421",
          status: "provisional",
        },
      ],
    },
  ],
};

/* ============================================================================
   Wasel (12 scenes)
   ========================================================================== */

const WASEL: StorySource = {
  slug: "wasel",
  hero: "Open, monitor and manage gates from your phone.",
  heroSub: "Wasel runs on Meerana's own controller, with Bluetooth fallback when the internet is down.",
  cta: "Book a Wasel site assessment",
  interest: "wasel",
  surface: {
    bg: "var(--wasel-brown)",
    fg: "var(--wasel-ivory)",
    accent: "var(--wasel-copper)",
    accent2: "var(--wasel-sand)",
  },
  heroScreen: SCREENS.waselGateAccess,
  closingLine: "See Wasel on your own gates.",
  heroEvidence: "EV-101 EV-103",
  titleArt: { kind: "screen", screen: SCREENS.waselGateAccess },
  /* No parking or toll content anywhere (EV-104 note). */
  scenes: [
    /* ---- Act I ---- */
    {
      id: "problem",
      kind: "problem",
      act: 1,
      eyebrow: "Problem",
      heading: "A gate that needs a key, a guard, or a phone call.",
      body: "Access that depends on someone being there is access that fails exactly when it matters.",
      evidence: "EV-100 EV-101",
      provenance: "Illustrative diagram",
      viz: {
        kind: "split",
        left: { label: "Access depends on", items: ["A key", "A guard on shift", "A phone call"] },
        right: {
          label: "And fails when",
          items: ["The key is lost", "The shift changes", "Nobody answers"],
          warn: ["The key is lost", "The shift changes", "Nobody answers"],
        },
      },
    },
    {
      id: "people",
      kind: "people",
      act: 1,
      eyebrow: "People and place",
      heading: "Residents, staff, guards, facility managers.",
      body: "Everyone who needs to pass, and everyone who needs to know who did.",
      evidence: "EV-101 EV-102",
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["Residents", "Staff", "Guards", "Facility managers"] },
    },
    /* ---- Act II ---- */
    {
      id: "intro",
      kind: "intro",
      act: 2,
      eyebrow: "The product",
      heading: "Phone, controller, barrier.",
      body: "The app talks to Meerana's own controller. The controller talks to the gate.",
      evidence: "EV-100 EV-103 EV-530",
      viz: { kind: "screen", screen: SCREENS.waselPhoneToGate },
    },
    {
      id: "interface",
      kind: "interface",
      act: 2,
      eyebrow: "Interface",
      heading: "Real-time gate status, from anywhere.",
      body: "See whether a gate is open or closed, and act on it, without being there.",
      evidence: "EV-102",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "phone",
        title: "Gates",
        rows: [
          { label: "Main gate", status: "Closed" },
          { label: "Service gate", status: "Open" },
          /* Sample gate names only. */
          { label: "Visitor barrier", status: "Closed" },
        ],
      },
    },
    {
      id: "walkthrough",
      kind: "walkthrough",
      act: 2,
      // PROVISIONAL – owner approval required (D9): the Grant step no longer
      // says "for a period you set", which no register row supports (§5.6).
      status: "provisional",
      eyebrow: "Walkthrough",
      heading: "Grant, open, monitor, revoke.",
      body: "Access managed as a record, not as a set of keys.",
      evidence: "EV-101 EV-102 EV-103",
      provenance: "Illustrative diagram",
      viz: { kind: "steps" },
      steps: [
        { label: "Grant", copy: "Give a person or role access to the gates they need." },
        { label: "Open", copy: "Open from the phone. If the internet is down, Bluetooth still works." },
        { label: "Monitor", copy: "Watch live gate status, and see who came through and when." },
        { label: "Audit", copy: "Every open and every grant is recorded." },
        { label: "Revoke", copy: "Take access away the moment it is no longer needed." },
      ],
    },
    {
      id: "features",
      kind: "features",
      act: 2,
      eyebrow: "Capability",
      heading: "Built for real sites.",
      body: "Where power, network and weather are all variable.",
      evidence: "EV-101 EV-102 EV-103",
      viz: { kind: "grid" },
      features: [
        "Role-based access",
        "Real-time gate status",
        "Full audit trail",
        "Bluetooth fallback",
        "Meerana's own controller",
        "Cloud or local network",
      ],
    },
    {
      id: "output",
      kind: "output",
      act: 2,
      // PROVISIONAL – owner approval required (D9): direction, "to the second"
      // and "exportable" are not in EV-101–103 (§5.6).
      status: "provisional",
      eyebrow: "Output",
      heading: "One access record.",
      body: "Audit and activity logs for every gate, in one account.",
      evidence: "EV-103",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "records",
        rows: [
          { label: "Who", meta: "person or role" },
          { label: "Which gate", meta: "by name" },
          { label: "When", meta: "date and time" },
        ],
      },
    },
    /* ---- Act III ---- */
    {
      id: "usecases",
      kind: "usecases",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Use cases",
      heading: "From villas to multi-gate sites.",
      body: "Designed for residential communities, villas, apartments, commercial facilities and multi-gate environments.",
      evidence: "EV-101",
      viz: { kind: "cases" },
      cases: [
        {
          label: "Communities with several gates",
          copy: "Residents open the gates they are allowed through; managers see every gate's status.",
          evidence: "EV-101 EV-103",
        },
        {
          label: "Villas and apartments",
          copy: "Open the building door or gate from a phone, with every opening logged.",
          evidence: "EV-101 EV-103",
        },
        {
          label: "Commercial buildings",
          copy: "Give staff and contractors role-based access, secured with encrypted keys.",
          evidence: "EV-101 EV-103",
        },
        {
          label: "Sites where the network drops",
          copy: "Wasel falls back to the local network, and Bluetooth opens the gate offline.",
          evidence: "EV-102 EV-103",
        },
        {
          label: "Warehouses and industrial sites",
          copy: "Gate position, temperature and humidity at the controller, for loading gates.",
          evidence: "EV-104 EV-103",
        },
        {
          label: "Construction sites",
          copy: "Control site gates from the app and keep access working offline.",
          evidence: "EV-104 EV-103",
        },
      ],
    },
    {
      id: "deploy",
      kind: "deploy",
      act: 3,
      eyebrow: "Connectivity and security",
      /* The approved heading of the dropped value scene. */
      heading: "Access that keeps working when the network does not.",
      body: "Cellular, local Wi-Fi, Bluetooth or local offline, on Meerana's own industrial-grade controller.",
      evidence: "EV-103 EV-530",
      facts: [
        { label: "Controller", value: "Industrial-grade, plug-and-play; Meerana's own", evidence: "EV-103 EV-530" },
        { label: "Sensors", value: "Gate position, temperature and humidity", evidence: "EV-103" },
        { label: "Keys", value: "Encrypted keys and role-based access", evidence: "EV-103" },
        { label: "Setup", value: "Controllers provisioned over the air", evidence: "EV-103" },
        { label: "Sites", value: "Multi-gate management in one account", evidence: "EV-103 EV-101" },
      ],
      provenance: "Illustrative diagram",
      viz: {
        kind: "ports",
        inputs: ["Cellular", "Local Wi-Fi", "Bluetooth", "Local offline"],
        core: "Wasel controller",
        outputs: ["Gates", "Doors"],
      },
    },
    {
      id: "faq",
      kind: "faq",
      act: 3,
      // PROVISIONAL – owner approval required (heading and questions, D4).
      status: "provisional",
      eyebrow: "Questions",
      heading: "What facility managers ask first.",
      evidence: "EV-102 EV-103 EV-530 EV-101",
      viz: { kind: "none" },
      faq: [
        {
          q: "What happens if the internet goes down?",
          a: "Wasel switches to the local network. With no network at all, Bluetooth still opens the gate from the phone.",
          evidence: "EV-102 EV-103",
          status: "provisional",
        },
        {
          q: "Whose hardware does Wasel use?",
          a: "Meerana's own controller: industrial-grade, with plug-and-play connections.",
          evidence: "EV-530 EV-103",
          status: "provisional",
        },
        {
          q: "Can one account manage several gates?",
          a: "Yes. Wasel is built for multi-gate sites, with every gate managed from one app.",
          evidence: "EV-103 EV-101",
          status: "provisional",
        },
        {
          q: "What does the controller report?",
          a: "Gate position from its sensors, plus temperature and humidity.",
          evidence: "EV-103",
          status: "provisional",
        },
      ],
    },
  ],
};

/* ============================================================================
   Nazo (13 scenes)
   Nazo and AI in a Box have no storyboard in plan/07 — it treated them as
   optional, and the owner has since confirmed both products.
   ========================================================================== */

const NAZO: StorySource = {
  slug: "nazo",
  hero: "Official correspondence, under control.",
  heroSub:
    "Route, approve, sign and seal official correspondence in English and Arabic, with an archive you can verify.",
  cta: "Request a Nazo briefing",
  interest: "nazo",
  surface: {
    bg: "var(--surface-deep)",
    fg: "var(--meerana-white)",
    accent: "var(--meerana-cyan)",
  },
  closingLine: "See Nazo on your own correspondence.",
  heroEvidence: "EV-141 EV-142 EV-543",
  /* The document lifecycle states (EV-543). A ribbon, so the draft screen
     appears once on the page, in Interface (I9). */
  titleArt: {
    kind: "ribbon",
    words: ["Draft", "Registered", "In review", "In approval", "Signed", "Sealed", "Verified"],
  },
  /* Never "immutable", "legally binding", "10× faster" or "100% secure"
     (EV-544 note, EV-143). */
  scenes: [
    /* ---- Act I ---- */
    {
      id: "problem",
      kind: "problem",
      act: 1,
      eyebrow: "Problem",
      heading: "Correspondence that moves faster than its record.",
      body: "A letter leaves by hand, gets approved verbally, and no one can say afterwards which version was signed.",
      evidence: "EV-141 EV-543",
      provenance: "Illustrative diagram",
      viz: {
        kind: "split",
        left: { label: "The letter", items: ["Drafted", "Approved verbally", "Signed", "Sent by hand"] },
        right: {
          label: "The record",
          items: ["Version approved: unknown", "Version signed: unknown"],
          warn: ["Version approved: unknown", "Version signed: unknown"],
        },
      },
    },
    {
      id: "people",
      kind: "people",
      act: 1,
      eyebrow: "People and place",
      heading: "Drafters, approvers, signatories, archivists.",
      body: "Each needs a different view of the same document — and the record must satisfy all of them.",
      evidence: "EV-141 EV-544",
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["Drafters", "Approvers", "Signatories", "Archivists"] },
    },
    /* ---- Act II ---- */
    {
      id: "intro",
      kind: "intro",
      act: 2,
      eyebrow: "The product",
      heading: "Draft, route, approve, seal, archive.",
      body: "One chain from a template to a sealed, verifiable record.",
      evidence: "EV-142 EV-543",
      provenance: "Illustrative diagram",
      viz: { kind: "flow", nodes: ["Draft", "Route", "Approve", "Seal", "Archive"] },
    },
    {
      id: "interface",
      kind: "interface",
      act: 2,
      eyebrow: "Interface",
      heading: "Draft from a template, in either language.",
      body: "The AI proposes the draft; a person owns it.",
      evidence: "EV-142 EV-544 EV-545",
      viz: { kind: "screen", screen: SCREENS.nazoDraft },
      callouts: true,
    },
    {
      id: "walkthrough",
      kind: "walkthrough",
      act: 2,
      // PROVISIONAL – owner approval required (D9): "Approval chains with due
      // dates" is in no register row (§5.6).
      status: "provisional",
      eyebrow: "Walkthrough",
      heading: "From request to sealed record.",
      body: "Ordered approval steps, and a seal that can be checked later.",
      evidence: "EV-141 EV-142 EV-543 EV-545",
      provenance: "Illustrative diagram",
      viz: { kind: "steps" },
      steps: [
        { label: "Draft", copy: "Start from a template, or let the assistant propose one." },
        { label: "Route", copy: "Ordered review, approval and signing, set by the workflow." },
        { label: "Approve", copy: "Each approver sees the version they are approving." },
        { label: "Seal", copy: "The signed document is sealed and made verifiable." },
        { label: "Archive", copy: "A sealed, verifiable archive — not a shared folder." },
      ],
    },
    {
      id: "ai-actions",
      kind: "features",
      act: 2,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      layout: "wide",
      eyebrow: "AI by role",
      heading: "Fourteen AI actions, each scoped to a role.",
      body: "Requesters, approvers and administrators each see only the actions their role needs.",
      evidence: "EV-542",
      viz: {
        kind: "columns",
        cols: [
          { label: "Requester", items: ["Auto-fill", "Check errors", "Draft content", "Generate reference", "Translate"] },
          { label: "Approver", items: ["Draft comment", "Missing-information check", "Summarise", "What changed"] },
          {
            label: "Administrator",
            items: ["Generate template", "Translate template", "Build workflow", "Validate workflow", "Suggest variables"],
          },
        ],
      },
    },
    {
      id: "features",
      kind: "features",
      act: 2,
      // PROVISIONAL – owner approval required (D9): two items corrected (§5.6).
      status: "provisional",
      eyebrow: "Capability",
      heading: "Built for official work.",
      body: "The controls a records team and an auditor both need.",
      evidence: "EV-141 EV-142 EV-543 EV-544 EV-545",
      viz: { kind: "grid" },
      features: [
        "Ordered review, approval and signing",
        "Sealed, verifiable archive",
        "AI drafting from templates",
        "English and Arabic templates",
        "Version history",
        "On-premises or cloud",
      ],
    },
    {
      id: "output",
      kind: "output",
      act: 2,
      eyebrow: "Output",
      heading: "A record that can be proven.",
      body: "Who approved what, when, and against which version — with the seal to check it.",
      evidence: "EV-141 EV-543 EV-544",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "records",
        rows: [
          { label: "Who approved", meta: "named approver" },
          { label: "What, and when", meta: "date and time" },
          { label: "Against which version", meta: "version history" },
          { label: "The seal", meta: "checkable later" },
        ],
      },
    },
    /* ---- Act III ---- */
    {
      id: "usecases",
      kind: "usecases",
      act: 3,
      // PROVISIONAL – owner approval required (heading, D4).
      status: "provisional",
      eyebrow: "Use cases",
      heading: "Every official letter, in and out.",
      body: "Internal and external correspondence, initiated, tracked, approved, signed and archived.",
      evidence: "EV-141",
      viz: { kind: "cases" },
      cases: [
        {
          label: "Multi-signature letters",
          copy: "Ordered review, approval and signing, with each signature placed by the template.",
          evidence: "EV-545 EV-543",
        },
        {
          label: "Recipient verification",
          copy: "Scanning a sealed letter's QR code shows whether it is unchanged since sealing.",
          evidence: "EV-544",
        },
        {
          label: "Bilingual correspondence",
          copy: "English and Arabic template twins, and AI translation of a draft on request.",
          evidence: "EV-545 EV-542",
        },
        {
          label: "Reviewers who see what changed",
          copy: "An AI summary, a missing-information check and a what-changed view before deciding.",
          evidence: "EV-542 EV-543",
        },
        {
          label: "Standard templates",
          copy: "Administrators generate templates and build and validate versioned workflows.",
          evidence: "EV-542 EV-545",
        },
        {
          label: "Inbound and outbound together",
          copy: "One register for inbox and outbox, with OCR search across scanned documents.",
          evidence: "EV-142 EV-141",
        },
      ],
    },
    {
      id: "deploy",
      kind: "deploy",
      act: 3,
      eyebrow: "Security and deployment",
      /* The approved heading of the dropped value scene. */
      heading: "Your correspondence, your servers.",
      body: "On-premises or in the cloud, with its AI model on the same servers as the application.",
      evidence: "EV-142 EV-541",
      facts: [
        { label: "Seal", value: "SHA-256, on every signed document", evidence: "EV-544" },
        { label: "Verification", value: "A QR code re-checks the archived file", evidence: "EV-544" },
        { label: "AI guardrails", value: "Suggestions checked against the form; people approve", evidence: "EV-546" },
        { label: "Vault", value: "Encryption and a full audit trail", evidence: "EV-142" },
        { label: "Authority", value: "Users, roles and signature authority, managed centrally", evidence: "EV-142" },
      ],
      provenance: "Illustrative diagram",
      viz: {
        kind: "chain",
        nodes: ["Signed PDF", "SHA-256 hash", "Sealed in vault", "QR code", "Re-hash and compare"],
      },
    },
    {
      id: "faq",
      kind: "faq",
      act: 3,
      // PROVISIONAL – owner approval required (heading and questions, D4).
      status: "provisional",
      eyebrow: "Questions",
      heading: "What records teams ask first.",
      evidence: "EV-544 EV-541 EV-546 EV-543 EV-545",
      viz: { kind: "none" },
      faq: [
        {
          q: "How can a recipient tell a letter is genuine?",
          a: "By scanning its QR code. The verification page re-hashes the archived file and confirms it is unchanged since sealing.",
          evidence: "EV-544",
          status: "provisional",
        },
        {
          q: "Does Nazo send documents to an outside AI service?",
          a: "No. Nazo's AI model runs on the same servers as the application.",
          evidence: "EV-541",
          status: "provisional",
        },
        {
          q: "Can the AI change a letter on its own?",
          a: "No. AI suggestions are checked against the form before they are applied, and people approve every step.",
          evidence: "EV-546 EV-543",
          status: "provisional",
        },
        {
          q: "Does Nazo work in Arabic?",
          a: "Yes. Templates have English and Arabic twins, and the interface supports right-to-left layouts.",
          evidence: "EV-545 EV-541",
          status: "provisional",
        },
      ],
    },
  ],
};

/* ============================================================================
   AI in a Box (10 scenes)
   No new scenes (DL-P13; EV-520 and EV-521 are unregistered; D8). Every row
   here rests on EV-520, which content-check lists as OWNER-PENDING.
   ========================================================================== */

const AIBOX: StorySource = {
  slug: "ai-in-a-box",
  hero: "An AI agent for every desk.",
  /* Was "…with voice in English and Arabic.": the demo shows English only (§5.6). */
  heroSub: "It reads, drafts, schedules and reports. Five agents working together.",
  cta: "Request an AI in a Box briefing",
  interest: "ai-in-a-box",
  surface: {
    bg: "var(--surface-deep)",
    fg: "var(--meerana-white)",
    accent: "var(--meerana-cyan)",
  },
  closingLine: "See AI in a Box on your own documents.",
  heroEvidence: "EV-520",
  titleArt: { kind: "ribbon", words: ["Legal", "Finance", "HR", "Research", "IT Security"] },
  scenes: [
    /* ---- Act I ---- */
    {
      id: "problem",
      kind: "problem",
      act: 1,
      eyebrow: "Problem",
      heading: "The work between the work.",
      body: "Reading the contract, drafting the memo, chasing the approval, writing the update. It adds up to a working week.",
      evidence: "EV-520",
      provenance: "Illustrative diagram",
      viz: {
        kind: "system",
        nodes: ["Read the contract", "Draft the memo", "Chase the approval", "Write the update"],
        hub: false,
      },
    },
    {
      id: "people",
      kind: "people",
      act: 1,
      eyebrow: "People and place",
      heading: "Every desk, not just the technical ones.",
      body: "Legal, HR, finance, procurement and the executive office — the work is documents, not code.",
      evidence: "EV-520",
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["Legal", "HR", "Finance", "Procurement", "Executive office"] },
    },
    /* ---- Act II ---- */
    {
      id: "intro",
      kind: "intro",
      act: 2,
      eyebrow: "The product",
      heading: "Five agents, one matrix.",
      body: "Legal, Finance, HR, Research and IT Security agents, working on the same tasks, visible to the person who owns them.",
      evidence: "EV-520",
      viz: { kind: "screen", screen: SCREENS.aiboxAgentMatrix },
    },
    {
      id: "interface",
      kind: "interface",
      act: 2,
      eyebrow: "Interface",
      heading: "Contract review with clause flags.",
      body: "The agent reads the agreement, flags the clauses that matter, and leaves the decision with a person.",
      evidence: "EV-520",
      /* No callouts while EV-520 is owner-pending (C13). */
      viz: { kind: "screen", screen: SCREENS.aiboxContractReview },
    },
    {
      id: "walkthrough",
      kind: "walkthrough",
      act: 2,
      // PROVISIONAL – owner approval required (D8): "The agent never signs."
      // has no register row (§5.6).
      status: "provisional",
      eyebrow: "Walkthrough",
      heading: "Assign, read, draft, decide, record.",
      body: "From a new task to a decision with a trace.",
      evidence: "EV-520",
      provenance: "Illustrative diagram",
      viz: { kind: "steps" },
      steps: [
        { label: "Assign", copy: "A task arrives and is routed to the agent that fits it." },
        { label: "Read", copy: "The agent reads the documents and extracts what matters." },
        { label: "Draft", copy: "It drafts the response, the memo or the summary." },
        { label: "Decide", copy: "A person reviews and decides." },
        { label: "Record", copy: "The task, the draft and the decision are kept together." },
      ],
    },
    {
      id: "features",
      kind: "features",
      act: 2,
      // PROVISIONAL – owner approval required (D8): "Voice in English and
      // Arabic" became "Voice mode" (§5.6).
      status: "provisional",
      eyebrow: "Capability",
      heading: "Built to sit inside a real organisation.",
      body: "The features that decide whether an agent is usable at work.",
      evidence: "EV-520",
      viz: { kind: "grid" },
      // No deployment line: DL-P13 (EV-571 vs EV-460) is unresolved, and the
      // site never prints a placeholder.
      features: [
        "Contract review with clause flags",
        "Five agents in one matrix",
        "Voice mode",
        "Task and approval trace",
        "Works alongside people",
      ],
    },
    {
      id: "output",
      kind: "output",
      act: 2,
      eyebrow: "Output",
      heading: "A day's work, accounted for.",
      body: "What was read, what was drafted, what was approved, by whom.",
      evidence: "EV-520",
      provenance: "Illustrative diagram · sample data",
      viz: {
        kind: "records",
        rows: [
          { label: "What was read", meta: "documents" },
          { label: "What was drafted", meta: "memos and replies" },
          { label: "What was approved", meta: "decisions" },
          { label: "By whom", meta: "a named person" },
        ],
      },
    },
    /* ---- Act III ---- */
    {
      id: "value",
      kind: "value",
      act: 3,
      eyebrow: "Value",
      heading: "An agent for the desk, not for the demo.",
      // PROVISIONAL – owner approval required. Replaces an internal note about
      // deployment options.
      status: "provisional",
      body: "A person decides, and every step leaves a trace.",
      evidence: "EV-520",
      provenance: "Illustrative diagram",
      viz: { kind: "tiles", items: ["Every desk", "Human decides", "Full trace"] },
    },
  ],
};

/* ============================================================================
   Stories
   ========================================================================== */

const pad = (i: number) => String(i).padStart(2, "0");

/** Name and descriptor come from the product registry (content/showcase.ts),
 * so each is written once. */
function productMeta(slug: string) {
  const p = SHOWCASE.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown product slug: ${slug}`);
  return { name: p.name, descriptor: p.descriptor };
}

/** Shown in this build: `confirm` items appear in PREVIEW builds only. */
const shown = (x: { status?: Status }) => x.status !== "confirm" || PREVIEW;

/** In gallery order (STORY_ORDER). */
export const STORIES: ProductStory[] = [MANDOOBEE, TASREE3, NAZO, YISBIR, WASEL, AIBOX].map((s) => ({
  ...s,
  ...productMeta(s.slug),
}));

export function getStory(slug: string): ProductStory | undefined {
  return STORIES.find((s) => s.slug === slug);
}

/**
 * The scenes a page renders, in order: the title scene, the story's scenes and
 * the next scene, numbered "01"… with layout and entrance resolved.
 *
 * The next scene carries the product's own site, where one exists, as its
 * one link; the stage adds the CTA and the products index as buttons.
 */
export function visibleScenes(story: ProductStory): ResolvedScene[] {
  const title: Scene = {
    id: "overview",
    kind: "title",
    act: 1,
    eyebrow: `Products · ${story.name}`,
    heading: story.hero,
    body: story.heroSub,
    evidence: story.heroEvidence,
    viz: story.titleArt,
    bigType: story.nameMoment ? { text: story.nameMoment.ar, lang: "ar" } : { text: story.name },
  };
  const next: Scene = {
    id: "next",
    kind: "next",
    act: 3,
    eyebrow: "Next",
    heading: story.closingLine,
    evidence: "",
    viz: { kind: "next", slug: nextSlug(story.slug) },
    /* The stage renders the CTA and "All six products" as the next scene's
       buttons; the product's own site is the one closing link (§5.4). */
    links: story.external
      ? [{ label: `Visit ${story.external.replace(/^https?:\/\//, "")}`, href: story.external, external: true }]
      : undefined,
  };
  const list = [title, ...story.scenes.filter(shown), next].map((s) => ({
    ...s,
    cases: s.cases?.filter(shown),
    faq: s.faq?.filter(shown),
  }));
  return list.map((s, i) => ({
    ...s,
    n: pad(i + 1),
    layout: s.layout ?? DEFAULT_LAYOUT[s.kind],
    enter: i > 0 && list[i - 1].act !== s.act ? "wipe" : (s.enter ?? DEFAULT_ENTER[s.kind]),
    bigType: s.bigType ?? (s.kind === "value" ? { text: story.name } : undefined),
  }));
}
