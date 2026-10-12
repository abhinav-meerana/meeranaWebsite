---
name: modern-ai-company
description: Rules that separate a real AI company's website from an AI-template site, applied to Meerana's AI products (YISBIR video intelligence, Tasree3 process intelligence, Nazo correspondence assistant, Mandoobee AI assistant, AI in a Box agentic assistant). Show model output instead of robot or brain imagery. Use mono/telemetry details that are true or labelled sample. Data-viz decorates only with real numbers. Confidence, latency and live-counter motifs follow strict honesty rules. Capability language must be honest, with no "revolutionary AI-powered" filler. Also covers human-in-the-loop assistant patterns, governance wording for sensitive capabilities (face search, PDPL) and sovereign-deployment claims. Use it whenever you design, write or review anything that presents AI features — hero visuals, demo UIs, overlays, search results, assistant panels, accuracy or performance claims, AI copy — or when someone asks to "show the AI", "add a live dashboard" or "can we say 99% accurate".
---

# Modern AI company

## Purpose
Credibility for an AI product comes from **visible, specific model output and honest limits**, not from glowing brains, neural wallpaper or accuracy percentages nobody measured. Buyers in government and regulated sectors check claims. Every AI surface on our sites must survive that check.

## Relationship to project skills
| Concern | Authority |
|---|---|
| Provenance levels (real / reconstructed / illustrative), synthetic-data rules, documented detection classes | `meerana-product-ui` (this skill adds AI-specific patterns on top) |
| Whether a claim may be published | `meerana-evidence` (register) |
| Visual tokens for overlays and states | `ui-system` |
| Telemetry and live counters (the brief) vs no fake telemetry (the plan) | **DD-08:** allowed only inside labelled illustrative UI, tied to the task shown; no latency, uptime or accuracy figures unless measured and registered |

## The ten rules
1. **Show the output, not the idea of AI.**
   - Bounding boxes with class + confidence + track ID; transcript hits with timecodes; OCR'd text; a ranked process recommendation; a drafted reply awaiting approval.
   - Never robots, brains, glowing networks, holograms or "AI" chips (`references/ai-visual-language.md`).
2. **Capability, not magic.**
   - Say what the model does to which input, with which output: "detects missing helmets and vests in existing CCTV" [EV-134].
   - Not "AI that understands your site". No anthropomorphism ("thinks", "knows", "understands").
3. **Numbers only from the register.**
   - Accuracy, uptime, latency, hours processed, user counts → **measured, dated and registered, or omitted**.
   - The live "99.2% / 10M+ / 500+ / 99.9%" claims all fail this rule (REPORT §4.4).
4. **Confidence is model output, not marketing.**
   - Show it in demo overlays as two decimals (`0.94`) on sample data.
   - Never turn it into an accuracy claim. Confidence ≠ accuracy; explain the difference if anyone asks.
5. **Latency only when measured.**
   - Show it as `p50 0.8 s · p95 1.6 s · 1080p@25 · <GPU> · 2026-10-01`, or don't show it.
   - "Real-time" needs a stated, measured bound (e.g. "alerts within N s").
6. **Telemetry details must be true or labelled.**
   - True: HQ coordinates, founding year, reference-ID formats, version numbers from store listings, deployment modes.
   - Sample (inside `data-illustrative` frames with a visible label): camera IDs, timecodes, track IDs, event rows, live counters.
7. **Data-viz decorates only with real data.**
   - A partner timeline (2022 → 2025, real years); a deployment matrix (real modes); an index timeline of a **labelled** sample search.
   - No fake charts or "growth" sparklines.
8. **Human in the loop.**
   - Assistant output is a **draft**: suggestions, summaries and comments the user reviews and approves. Nothing is auto-sent or auto-approved in demos (Nazo: "Draft my comment" → the user posts it).
   - Recommendations show *why*: the evidence in the sample data.
9. **Govern sensitive capabilities in the open.**
   - Face search, person attributes (gender) and plates are PDPL-sensitive.
   - Public demos use **non-identifying outlines** and documented safety classes.
   - **Face recognition is a toggleable module** (owner, 2026-10-10, EV-535). Present it as optional and off unless the customer switches it on, with role-based access and audit. Mention it once in governance or feature lists, never in heroes or demos. Wording: `docs/YISBIR-USE-CASES.md` §6.
   - Lead YISBIR with the other detections (fire and smoke, PPE, uniform, attendance in headcount mode, zones) **and what the data becomes**: compliance rates, occupancy curves, heatmaps, incident timelines (EV-534). Every number stays labelled sample unless measured.
   - Police and public-safety copy leads with evidence search and packages, never "track anyone" or prediction language.
10. **Sovereignty with facts.**
    - State *where it runs* per product (on-premise / own cloud / hybrid; own model endpoint for Tasree3) [EV-407, EV-443, EV-444, EV-116].
    - Never imply certifications (DL-R03).
    - **AI in a Box:** no deployment or "no public cloud" claim until DL-P13 is resolved. Its POC spec uses an external inference API (EV-571). Spec features are *planned* (EV-570) and are shown only if the demo shows them (EV-520).

## Patterns to use
Specs are in `references/model-output-ui.md`:
- **Detection overlay** (Yisbir real-time): corner brackets, class/confidence/ID chip, restricted-zone polygon, track trail, lock-on motion, outline figures.
- **Index search result** (Yisbir core): timecode, source, hit type, language tag, highlighted match, 24 h index timeline.
- **Bounded assistant** (Nazo, Mandoobee): action chips (Summarize · Draft my comment · Anything missing?), draft state, citations to the document, explicit "Post" by the human.
- **Ranked recommendation** (Tasree3): impact × effort, the evidence (wait time between steps), "Apply" creates a draft version under governance.
- **Event stream:** time · source · event · zone · state (sample), pausable.

## Language
Rules and rewrites are in `references/honest-language.md`. Short form:
- **Allowed:** "detects", "indexes", "transcribes", "searches", "suggests", "drafts", "flags", "ranks".
- **Avoid:** "revolutionary", "understands", "thinks", "fully autonomous", "100% secure", "zero errors", "any language", "instantly", "AI-powered" more than once per page.
- "Agentic": only when quoting the product's own wording (Tasree3, EV-400), and say what the agent does.

## Workflow
1. List the AI features from the dossier (documented only).
2. For each, pick the **output** to show and its **input**. Write the capability sentence (`honest-language.md` template).
3. Design the demo: sample data per `references/sample-data-rules.md`, a provenance label, step buttons, and a reduced-motion state.
4. Check every number against the register. Remove or label everything else.
5. Run `anti-generic-audit --strict` (catches unbacked numbers, robot imagery, hype) and the manual checklist.

## Files
- `references/model-output-ui.md`: component specs for overlays, results, assistants, recommendations and streams, with tokens and a11y.
- `references/honest-language.md`: the claims ladder, sentence templates, live-claim rewrites, sensitive-capability wording.
- `references/sample-data-rules.md`: synthetic data rules and per-product sample sets.
- `references/ai-visual-language.md`: what to show instead of AI clichés, including data-viz with real numbers.
