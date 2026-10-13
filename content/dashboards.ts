/**
 * The homepage's coded product dashboards: what each one is called for
 * assistive technology, its honest provenance level, and the region shown on
 * phones. Rendered by components/dashboards/DashboardFrame.tsx.
 *
 *   reconstruction — rebuilt from a real screen or recording supplied by the
 *                    owner (Nazo screenshot 2026-10-13; the Yisbir indexing
 *                    and AI in a Box demo recordings);
 *   illustrative   — no real screen exists: Yisbir operations follows the
 *                    owner's Figma design, Wasel the owner's 2026 brochures.
 */
import type { DashboardSpec } from "@/components/dashboards/DashboardFrame";

export const DASHBOARDS = {
  nazo: {
    id: "nazo",
    alt: "Nazo admin overview: template, active, completed and user counts, AI tools to build templates and workflows, correspondence in progress, and the recent review, approval and signing activity",
    provenance: "Interface reconstruction · sample data",
    crop: { x: 272, y: 72, w: 748 },
  },
  yisbirOps: {
    id: "yisbir-ops",
    alt: "Yisbir site operations: an alert queue for restricted-zone entries, missing helmets and vests, smoke and falls, with a live camera zone and PPE compliance",
    provenance: "Illustrative interface · sample data",
    crop: { x: 352, y: 66, w: 700 },
  },
  yisbirIndex: {
    id: "yisbir-index",
    alt: "Yisbir video indexing: a question answered from video, audio and documents, with its sources, match scores and the matching results",
    provenance: "Interface reconstruction · sample data",
    crop: { x: 344, y: 66, w: 740 },
  },
  aiboxChat: {
    id: "aibox-chat",
    alt: "AI in a Box assistant: a question about a vendor contract answered with two flagged clauses and fixes, waiting for a person to approve",
    provenance: "Interface reconstruction · sample data",
    crop: { x: 262, y: 84, w: 806 },
  },
  aiboxAnalytics: {
    id: "aibox-analytics",
    alt: "AI in a Box analytics: emails, tasks, meetings and agent messages, task completion and priorities, tool usage and a task board",
    provenance: "Interface reconstruction · sample data",
    crop: { x: 250, y: 76, w: 780 },
  },
  wasel: {
    id: "wasel",
    alt: "Wasel gate console: six gates with their state, type, connectivity mode, sensors and last command, the audit trail and access keys",
    provenance: "Illustrative interface · sample data",
    crop: { x: 256, y: 84, w: 790 },
  },
} satisfies Record<string, DashboardSpec>;
