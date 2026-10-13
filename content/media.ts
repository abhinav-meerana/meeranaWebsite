/**
 * Real product media, in one registry.
 *
 * Every entry is from the reviewed v3 set in public/media/v3 and carries its
 * honest provenance (plan/13 §E1; allowed labels per JUDGE-VERDICT 0.3).
 * Widths and heights are the files' intrinsic sizes, so pages can reserve the
 * box before decode and never display an image larger than it really is.
 *
 * Nothing here is AI-generated product imagery (plan/13 §A9), and no image
 * shows people or faces.
 *
 * Withdrawn (FINAL-SPEC §5.2, D6, D7), and kept out of this registry so no
 * page can pick them up again; scripts/content-check.mjs rejects their paths:
 *   · mandoobee-phones-cutout.webp: blurred personal photos, source EV-117 is
 *     confirm-with-meerana. `mandoobeeApp` (wall-08) replaces it everywhere.
 *   · card-yisbir-ppe.webp: a camera tile with six small workers.
 *     `yisbirPpeWall` (wall-01, no camera image) replaces it.
 */

/**
 * The controlled vocabulary for provenance labels (JUDGE-VERDICT 0.3 plus the
 * diagram labels). Typed as a union so a free-form or mislabelled string fails
 * `tsc`. A diagram is never labelled "Product screen".
 */
export type Provenance =
  | "Product screen · demo data"
  | "App mock-up"
  | "Design concept · sample data"
  | "Illustration"
  | "Illustrative diagram"
  | "Illustrative diagram · sample data"
  | "Illustrative diagram · rendered scene, no real footage"
  /* Coded dashboards (components/dashboards), per the meerana-product-ui
     provenance levels: rebuilt from a real screen or recording, or an
     illustrative interface where no screen exists. */
  | "Interface reconstruction · sample data"
  | "Illustrative interface · sample data";

/**
 * A callout anchored on a screen (FINAL-SPEC §5.1, §6.1). `at` is [x, y] as
 * fractions (0–1) of the image box; the ring sits there and the chip runs to
 * `side` (default "right"). `text` must be visible verbatim in the image at
 * 1:1; `note` is a description from the register and needs an ok-to-use `ev`.
 * At most 3 per screen, each ≤28 characters (content-check).
 */
export type MediaLabel = {
  at: [number, number];
  side?: "left" | "right";
  text?: string;
  note?: string;
  ev?: string;
};

export type Screen = {
  src: string;
  width: number;
  height: number;
  alt: string;
  provenance: Provenance;
  /** A cut-out with a transparent background: drawn without a frame. */
  bare?: boolean;
  /** Callouts, drawn only where a scene sets `callouts: true`. */
  labels?: MediaLabel[];
  /** The asset already prints its own provenance, so the frame's label is
   * kept for assistive technology only (sr-only). */
  labelInAsset?: boolean;
};

export const SCREENS = {
  /** Positions checked against the file at 1:1: the swipe handle, and the
   * orange (remote) arc of the attendance ring, which the legend names
   * "Clocked In from Remote". Both chips land in the margin left of the card,
   * never over the ring or the legend. */
  mandoobeeApp: {
    src: "/media/v3/wall-08-mandoobee-app.webp",
    width: 1200,
    height: 750,
    alt: "Mandoobee clock-in screen: working hours today, a swipe-to-clock-in control and the team's attendance status",
    provenance: "App mock-up",
    labels: [
      { at: [0.385, 0.36], side: "left", text: "Swipe here to clock in" },
      { at: [0.345, 0.695], side: "left", text: "Clocked In from Remote" },
    ],
  },
  tasree3CommandCenter: {
    src: "/media/v3/card-tasree3-command-center.webp",
    width: 1920,
    height: 1200,
    alt: "Tasree3 Command Center: processes, reports and configuration health",
    provenance: "Product screen · demo data",
  },
  /** Labels sit on each card's icon, so the chip lands in the card's empty
   * space and never covers the title it names. */
  tasree3Conformance: {
    src: "/media/v3/wall-10-tasree3-conformance.webp",
    width: 1200,
    height: 750,
    alt: "Tasree3 conformance: global fitness, compliance, risk exposure and deviations",
    provenance: "Product screen · demo data",
    labels: [
      { at: [0.07, 0.135], side: "right", text: "Global fitness" },
      { at: [0.584, 0.642], side: "right", text: "Deviations" },
    ],
  },
  nazoDraft: {
    src: "/media/v3/card-nazo-ai-draft.webp",
    width: 1920,
    height: 1200,
    alt: "Nazo drafting an official letter from a template, with typed fields such as Holiday Date",
    provenance: "Product screen · demo data",
    labels: [{ at: [0.515, 0.335], side: "left", text: "Holiday Date" }],
  },
  yisbirFireSmoke: {
    src: "/media/v3/card-yisbir-fire-smoke.webp",
    width: 1920,
    height: 1200,
    alt: "Yisbir fire and smoke: smoke flagged on camera 12, with the event timeline",
    provenance: "Design concept · sample data",
  },
  /** The hero poster: 71 KB, within the 120 KB poster budget (plan/13 G). */
  yisbirFireSmokePoster: {
    src: "/media/v3/wall-11-yisbir-fire-smoke.webp",
    width: 1200,
    height: 750,
    alt: "Yisbir flagging smoke on a warehouse camera, with the event timeline",
    provenance: "Design concept · sample data",
  },
  /** The verified review: PPE compliance by zone, no camera image, no people. */
  yisbirPpeWall: {
    src: "/media/v3/wall-01-yisbir-ppe-compliance.webp",
    width: 1200,
    height: 750,
    alt: "Yisbir PPE compliance for one warehouse bay: helmet and safety-vest rates, and compliance by zone",
    provenance: "Design concept · sample data",
  },
  /** A 600 px downscale of `yisbirPpeWall` (20 KB) for the hero depth stack
   * (owner C). Same file content, so the same provenance and alt. */
  yisbirPpeCompliance600: {
    src: "/media/v3/wall-01-yisbir-ppe-compliance-600.webp",
    width: 600,
    height: 375,
    alt: "Yisbir PPE compliance for one warehouse bay: helmet and safety-vest rates, and compliance by zone",
    provenance: "Design concept · sample data",
  },
  /** "PPE flags" is printed verbatim in the file's list of alert types. */
  yisbirAlerts: {
    src: "/media/v3/wall-15-yisbir-alerts.webp",
    width: 1200,
    height: 750,
    alt: "Yisbir alerts across all sites over four hours, by severity and by type",
    provenance: "Design concept · sample data",
    /* One callout: its chip lands in the clear band above the bars. The other
       alert types would put chips over the chart's data. */
    labels: [{ at: [0.594, 0.328], side: "left", text: "PPE flags" }],
  },
  /** The SVG prints "Illustration" in its own top-right corner. */
  waselGateAccess: {
    src: "/media/v3/wasel-gate-access.svg",
    width: 1200,
    height: 750,
    alt: "Wasel gate access: app, controller and barrier",
    provenance: "Illustration",
    labelInAsset: true,
  },
  waselPhoneToGate: {
    src: "/media/v3/wasel-phone-to-gate.svg",
    width: 1200,
    height: 750,
    alt: "How a Wasel gate opens: phone, controller, gate",
    provenance: "Illustration",
    labelInAsset: true,
  },
  aiboxAgentMatrix: {
    src: "/media/v3/card-aibox-agent-matrix.webp",
    width: 1920,
    height: 1200,
    alt: "AI in a Box agent matrix: legal, finance, HR, research and IT security agents",
    provenance: "Product screen · demo data",
  },
  /** Already published in public/media/v3 (the retired hero room used it with
   * this provenance). No callouts: EV-520 is owner-pending. */
  aiboxGovernance: {
    src: "/media/v3/wall-12-aibox-governance.webp",
    width: 1200,
    height: 750,
    alt: "AI in a Box summary for today: actions taken by the agents and approvals, each reviewed by a person",
    provenance: "Product screen · demo data",
  },
  /** No callouts: the AI in a Box rows (EV-520) are still owner-pending. */
  aiboxContractReview: {
    src: "/media/v3/card-aibox-contract-review.webp",
    width: 1920,
    height: 1200,
    alt: "AI in a Box contract review flagging two clauses with suggested fixes",
    provenance: "Product screen · demo data",
  },
} satisfies Record<string, Screen>;
