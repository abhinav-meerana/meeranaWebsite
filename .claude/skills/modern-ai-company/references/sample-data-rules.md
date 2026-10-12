# Sample (synthetic) data rules

These extend `meerana-product-ui` §5. Sample data must be **non-identifying, purposeful, consistent and labelled**.

| Rule | Do | Don't |
|---|---|---|
| People | Roles: "Site supervisor", "Director", "General Manager", "Chair", "Requester". Initials derived from roles (DR, GM, CH). | Real-sounding personal names. Names from demos: the Nazo demo's persona names stay out of marketing. |
| Organisations | "Your organisation", "ORG" prefixes | Real clients, ministries, banks (e.g. "Official Letter to ADIB Bank" in the live Nazo mock); tenant prefixes like "NEONAX" |
| Places | "Gate 2 — North entrance", "Zone B", "Yard 1", "CAM-03" | Real addresses or real project names |
| Identifiers | Formats only: `ORG/REQ/2026/031`, `ID 07` | Emirates ID, passport or plate formats that could match real people |
| Time | A fictional **sample day**: "Sample day · 07:42:13". Relative times ("2 m ago") inside the frame only. | "Live now", or dates implying real operations |
| Numbers | Only what the task needs (e.g. "2 people in Zone B" makes the alert understandable) | KPI walls, uptime, growth %, "nodes online" |
| Label | "Illustrative interface · sample data" / "simulated detections", visible near the UI | A label only in a tooltip, or none |
| Storage | One dataset per product: `content/demo-data/<product>.ts`, schema-validated, reused across pages | Ad-hoc numbers per component |

## Per-product sample sets (starting points)

**Yisbir, real-time:**
- Cameras CAM-01…CAM-12 at generic places.
- Classes per the documented list.
- 6 events across one sample hour.
- One PPE alert, one zone entry, one vehicle anomaly.

**Yisbir, search:**
- 3 sample queries: `permit approved` (transcript, EN), `GATE 2 SHIFT B` (on-screen text), `excavator` (object).
- 3–5 hits each, spread across a 24 h sample index.
- One Arabic transcript hit, labelled sample, in plain neutral content such as "تم اعتماد التصريح للمنطقة ب" ("the permit for zone B has been approved").

**Nazo:**
- Reference format `ORG/<TYPE>/2026/<NNN>`, with types REQ, CIR, MEM, HR (from the demo's format).
- Statuses: Signed & Complete · Active · Returned.
- Approver chains of 2–4 roles. One sealed record with "Verify".

**Tasree3:**
- An event log for "Procurement request": Submit → Review → Legal → Finance → Approve.
- One bottleneck: a 3.1-day sample wait between Legal and Finance.
- One recommendation: Parallelize.

**Mandoobee:**
- An employee clock-in at "Office", a leave request, and a manager approval.
- Attendance ring at sample values for one team.

**Wasel:**
- "Gate 2" open → internet off → "Bluetooth fallback" → open.
- Audit row "Opened by Resident (app)".
