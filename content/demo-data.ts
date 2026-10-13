/**
 * Sample data for the homepage's product dashboards (components/dashboards).
 *
 * Rules (meerana-product-ui skill, compliance list in the README):
 *   · role labels, never personal names; fictional sites and documents; no
 *     real organisation, ministry or tenant;
 *   · Yisbir shows only documented detection classes (EV-134 HSE detections,
 *     EV-534 fire/smoke, attendance and PPE, EV-537 perimeter and after-hours
 *     intrusion, EV-138 crowd heatmap) — no faces, plates, weapons or
 *     behaviour scoring;
 *   · AI in a Box: never the banned sovereignty line (DL-P13);
 *   · Wasel follows the owner's 2026 brochures (connectivity modes, gate
 *     types, sensors, audit fields, access model) — there is no real Wasel
 *     screen, so its console is illustrative.
 *
 * Every value is sample data; the dashboards say so on screen.
 */

export type Severity = "critical" | "high" | "medium" | "low";

/* ------------------------------------------------------------------ Nazo -- */
/* Reconstruction of the Nazo "Admin overview" screen supplied by the owner
   (2026-10-13), with its tenant branding and people replaced. */
export const NAZO = {
  kpis: [
    { label: "Templates", value: 11, tone: "blue" },
    { label: "Active", value: 5, tone: "spin" },
    { label: "Completed", value: 6, tone: "green" },
    { label: "Users", value: 12, tone: "amber" },
  ],
  buildWithAi: ["Generate a template", "Design a workflow", "Manage users"],
  activity: [
    { verb: "Commented", by: "Legal reviewer", at: "6 Oct, 14:22", note: "Reviewed and initialled by the legal reviewer." },
    { verb: "Approved", by: "Legal reviewer", at: "6 Oct, 14:22" },
    { verb: "Completed", by: "Department head", at: "2 Oct, 12:39" },
    { verb: "Signed", by: "Department head", at: "2 Oct, 12:39" },
    { verb: "Approved", by: "Department head", at: "2 Oct, 12:39" },
    { verb: "Completed", by: "Records officer", at: "1 Oct, 10:05" },
  ],
  /* Three of the five active items, each at a different stage. */
  inProgress: [
    { doc: "Public holiday announcement", stage: "Awaiting signature", owner: "Department head", due: "Today" },
    { doc: "Vendor onboarding memo", stage: "In legal review", owner: "Legal reviewer", due: "8 Oct" },
    { doc: "Records retention notice", stage: "Draft", owner: "Records officer", due: "10 Oct" },
  ],
  workspace: ["Inbox", "New correspondence", "Sent by me", "Tracking", "Archive"],
  manage: ["Overview", "Activity log", "Templates", "Workflows", "Users"],
} as const;

/* ---------------------------------------------------- Yisbir operations -- */
/* The command-centre format of the owner's Figma (Yisbir "expanded" states),
   rebuilt for a generic industrial site with documented classes only. */
export const YISBIR_OPS = {
  site: "Logistics campus · North site",
  queue: { open: 18, critical: 3, acknowledged: 9, resolved: 41 },
  alerts: [
    { p: "P1", sev: "critical" as Severity, type: "Restricted zone entry", cam: "CAM-A12", time: "14:31:50", status: "New", owner: "Duty supervisor" },
    { p: "P1", sev: "critical" as Severity, type: "Smoke detected", cam: "CAM-12", time: "14:32:08", status: "Acknowledged", owner: "Safety officer" },
    { p: "P2", sev: "high" as Severity, type: "Missing safety helmet", cam: "CAM-B04", time: "14:28:44", status: "Dispatched", owner: "Site supervisor" },
    { p: "P2", sev: "high" as Severity, type: "Worker in hazardous area", cam: "CAM-C11", time: "14:26:30", status: "Acknowledged", owner: "Safety officer" },
    { p: "P3", sev: "medium" as Severity, type: "Missing safety vest", cam: "CAM-H09", time: "14:24:55", status: "New", owner: "Site supervisor" },
    { p: "P1", sev: "critical" as Severity, type: "Fall detected", cam: "CAM-E22", time: "14:22:33", status: "Dispatched", owner: "First-aid team" },
    { p: "P2", sev: "high" as Severity, type: "Perimeter breach after hours", cam: "CAM-F03", time: "02:18:12", status: "Resolved", owner: "Site security" },
    { p: "P3", sev: "medium" as Severity, type: "Crowd density above limit", cam: "CAM-R15", time: "13:58:19", status: "Acknowledged", owner: "Control room" },
    { p: "P2", sev: "high" as Severity, type: "Restricted zone entry", cam: "CAM-A07", time: "13:50:48", status: "Resolved", owner: "Duty supervisor" },
  ],
  zones: [
    { name: "Zone A · Loading bay", count: 12 },
    { name: "Zone B · Equipment yard", count: 5 },
    { name: "Zone C · Chemical store", count: 3 },
  ],
  /* Sums to the zones' 20 entries today. */
  crossings24h: [0, 0, 0, 1, 0, 0, 0, 1, 2, 1, 2, 1, 1, 3, 2, 1, 1, 1, 2, 1, 0, 0, 0, 0],
  attendance: { onSite: 412, expected: 436 },
  ppe: { compliant: 94.2, helmet: 98.2, vest: 95.6 },
  /* The same counts as the published Yisbir alerts board (wall-15). */
  byType: [
    { label: "PPE flags", value: 41 },
    { label: "Restricted zone", value: 23 },
    { label: "Crowd density", value: 9 },
    { label: "Falls", value: 2 },
    { label: "Smoke & fire", value: 1 },
  ],
  modules: ["PPE detection", "Fire & smoke", "Restricted zones", "Perimeter", "Fall detection", "Attendance", "Crowd heatmap", "Video indexing"],
};

/* ------------------------------------------------ Yisbir video indexing -- */
/* Reconstruction of the Yisbir indexing UI (owner's demo recording), with
   neutral sample media: no ministry, no faces. */
export const YISBIR_INDEX = {
  query: "when was the north gate fire drill signed off?",
  results: 9,
  answer:
    "The north gate fire drill was signed off on 14 March at the weekly safety briefing. The safety officer confirmed every assembly point was cleared inside the target time, and the drill report records the sign-off on page 4.",
  sources: [
    { kind: "doc", title: "Fire drill report — North gate", meta: "Safety records · Page 4", match: 96 },
    { kind: "video", title: "Weekly safety briefing — Week 11", meta: "Briefings · 32:14", match: 95 },
  ],
  items: [
    { kind: "doc", title: "Fire drill report — North gate", meta: "Safety records / Drills / 2026", snippet: ["…sign-off of the north gate ", "fire drill", " is recorded on page 4…"], extra: "12 pages", conf: 96, actions: ["Open page", "Download section"] },
    { kind: "video", title: "Weekly safety briefing — Week 11", meta: "Briefings / Operations", snippet: ["“…every assembly point on the north gate ", "fire drill", " was cleared…”"], extra: "46:02", conf: 95, actions: ["Play segment", "Export"] },
    { kind: "audio", title: "Control room handover — 14 March", meta: "Audio / Control room", snippet: ["“…confirm the north gate ", "drill", " is closed and logged…”"], extra: "18:40", conf: 91, actions: ["Play segment", "Export"] },
  ],
  transcript: [
    { t: "00:14", text: "Good morning. This is the weekly safety briefing for week eleven." },
    { t: "31:40", text: "All assembly points on the north gate drill were cleared inside the target time." },
    { t: "32:14", text: "Signed off. Please file the drill report with today's date." },
  ],
};

/* ------------------------------------------------------- AI in a Box -- */
export const AIBOX_NAV = ["Assistant", "Analytics", "Executive", "Agent matrix", "Knowledge hub", "Governance", "Integrations", "Settings"];

/* The assistant: the contract review the published screen shows (EV-520,
   owner-pending, so no claims beyond the screen itself), as a conversation. */
export const AIBOX_CHAT = {
  question: "Has the phase 2 vendor contract been reviewed?",
  answer: "Yes. The legal agent reviewed it this morning. Two clauses need your decision before signing:",
  flags: [
    { clause: "§7.3", title: "Limitation of liability", note: "Cap set at 50% of contract value, below the procurement minimum.", fix: "Renegotiate the cap to 100% before signing." },
    { clause: "§12.1", title: "Data residency", note: "Allows processing in another region during maintenance windows.", fix: "Remove the exception; process in-country at all times." },
  ],
  files: [
    { name: "Vendor_Agreement_Phase2.pdf", meta: "Legal · 612 KB" },
    { name: "Procurement_Policy.docx", meta: "Policy · 540 KB" },
  ],
  citations: [
    { n: 1, title: "Procurement policy §4.2", src: "Procurement_Policy" },
    { n: 2, title: "Agreement §7.3", src: "Vendor_Agreement_Phase2" },
  ],
  trail: [
    { agent: "Legal agent", what: "Contract review complete", when: "2 min ago" },
    { agent: "Research agent", what: "Policy brief retrieved", when: "5 min ago" },
    { agent: "Finance agent", what: "Standing by", when: "18 min ago" },
  ],
};

/* Analytics: the real layout (owner's demo recording 2:24–2:52) with the
   ministry replaced by neutral departments; latency figures left out. */
export const AIBOX_ANALYTICS = {
  kpis: [
    { label: "Unread emails", value: "3", note: "Higher than last week", tone: "red" },
    { label: "Pending tasks", value: "5", note: "Stable this week", tone: "muted" },
    { label: "Meetings today", value: "2", note: "Next: procurement call 09:30", tone: "muted" },
    { label: "Agent messages", value: "29", note: "4 agents active", tone: "green" },
  ],
  completion: { pct: 29, done: 2, open: 5 },
  priority: [
    { label: "Critical", value: 1, tone: "red" },
    { label: "High", value: 2, tone: "amber" },
    { label: "Medium", value: 1, tone: "blue" },
    { label: "Low", value: 1, tone: "grey" },
  ],
  senders: [
    { label: "Finance department", value: 14, tone: "blue" },
    { label: "Procurement division", value: 9, tone: "blue" },
    { label: "HR directorate", value: 7, tone: "violet" },
    { label: "IT security", value: 5, tone: "amber" },
    { label: "Policy office", value: 3, tone: "grey" },
  ],
  activity: [
    { label: "Messages", value: "63" },
    { label: "Tool calls", value: "10" },
    { label: "Initiatives", value: "2" },
  ],
  tools: [
    { label: "Read emails", value: 147 },
    { label: "Get agenda", value: 64 },
    { label: "Draft message", value: 38 },
    { label: "Search documents", value: 22 },
    { label: "Create task", value: 14 },
  ],
  hours: [0, 0, 0, 0, 0, 0, 1, 2, 4, 7, 9, 8, 5, 6, 8, 10, 8, 6, 3, 1, 1, 0, 0, 0],
  board: [
    { col: "Pending", tone: "blue", cards: [["Q3 response draft", "Critical"], ["Vendor contract review", "High"], ["Policy update", "Medium"]] },
    { col: "Urgent", tone: "red", cards: [["Phase 2 contract signature", "Critical"]] },
    { col: "Done", tone: "green", cards: [["NDA audit complete", "High"], ["Q2 budget filing", "Critical"]] },
  ],
  digest:
    "3 unread messages today. Most urgent: the finance department needs a formal response by 17:00. Procurement is waiting for your signature on the phase 2 contract renewal.",
};

/* ---------------------------------------------------------------- Wasel -- */
/* Illustrative: built from the owner's 2026 Wasel brochures (no real screen
   exists). Gate types, states, connectivity modes, sensors, audit fields and
   the access model are the brochure's; the site and values are sample. */
export type WaselMode = "Cloud" | "Local Wi-Fi" | "Bluetooth";
export const WASEL = {
  site: "Sample residential community",
  gates: [
    { name: "Main entrance", type: "Sliding", state: "Closed", mode: "Cloud" as WaselMode, temp: 31, hum: 48 },
    { name: "Visitor barrier", type: "Barrier", state: "Open", mode: "Local Wi-Fi" as WaselMode, temp: 32, hum: 46, timer: "Auto-close 0:45" },
    { name: "Villa 12 gate", type: "Double", state: "Closed", mode: "Bluetooth" as WaselMode, temp: 30, hum: 51, offline: true },
    { name: "Service door", type: "Single", state: "Moving", mode: "Cloud" as WaselMode, temp: 29, hum: 50 },
    { name: "Delivery gate", type: "Custom", state: "Closed", mode: "Cloud" as WaselMode, temp: 33, hum: 44 },
    { name: "North pedestrian gate", type: "Single", state: "Closed", mode: "Local Wi-Fi" as WaselMode, temp: 30, hum: 49 },
  ],
  /* Newest first, and consistent with the gate states above: the barrier's
     auto-close timer is running, the service door is closing, the main
     entrance closed on its timer, the villa gate closed over Bluetooth. */
  audit: [
    { t: "14:32:30", gate: "Service door", cmd: "Close", source: "Mobile app · Cloud", who: "Facility staff" },
    { t: "14:32:08", gate: "Visitor barrier", cmd: "Open", source: "Shared QR key", who: "Visitor" },
    { t: "14:29:56", gate: "Main entrance", cmd: "Close", source: "Auto-close timer", who: "System" },
    { t: "14:28:41", gate: "Main entrance", cmd: "Open", source: "Mobile app · Cloud", who: "Resident" },
    { t: "14:12:03", gate: "Villa 12 gate", cmd: "Close", source: "Bluetooth · nearby", who: "Owner" },
  ],
  access: [
    { label: "Admin master keys", value: "1" },
    { label: "Role-based users", value: "54" },
    { label: "QR keys shared today", value: "3" },
  ],
};
