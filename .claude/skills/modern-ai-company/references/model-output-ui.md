# Model-output UI patterns

All of these live inside a `DemoFrame` with a visible provenance label, step buttons, and an `aria-live="polite"` summary (`ui-system/references/component-inventory.md`).

## 1. Detection overlay (YISBIR real-time module)
| Element | Spec |
|---|---|
| Frame | `bg-surface-deep` (abyss-950). Perspective ground grid at 6–8 % opacity. Figures drawn as **outlines only** (head circle + body capsule), so they are non-identifying by construction. |
| Box | 1.5 px `--product-accent` (aqua 11.77:1 on abyss-950) **plus a 1 px abyss outline**, giving ≥ 3:1 over any footage (SC 1.4.11). Corner brackets 8–10 px; no full rectangle needed. |
| Label chip | Above the box: mono 11 px, uppercase, e.g. `PERSON 0.94 · ID 07`. Background abyss-950 at 85 %; text aqua. |
| Violation | Chip turns warning (`#FDB022`, 10.58:1) or danger (`#F97066`, 6.99:1), e.g. `NO HELMET`. Use a text label, never colour alone. |
| Zones | Restricted zone: a dashed 2 px danger polygon + mono label `ZONE B · RESTRICTED`. Allowed zone: aqua dashed. |
| Track trail | Polyline of the last N positions at 30 % opacity. Track IDs persist across frames. Deep Sort / tracking is a brief-only claim, so the demo labels it sample and the `[CONFIRM]` flag stays until documented. |
| Chrome | `CAM-03 · GATE 2 — NORTH ENTRANCE` (generic site names) · `● REC` (≤ 1 Hz blink, WCAG 2.3.1) · sample timecode `07:42:13` · `LOCAL NODE · ON-PREM` (deployment fact EV-443) |
| Classes | **Documented only:** person, helmet / no-helmet, vest / no-vest, restricted-zone entry, fall, unsafe practice, intrusion after hours, vehicle movement anomaly [EV-133–EV-135]. **Never:** face, gender, plate, emotion, age. |
| Motion | Lock-on: brackets snap from 140 % → 100 % at `--dur-1` when a track is acquired. Loop → **Pause feed** control. Reduced motion → one annotated still. |
| A11y | Canvas `aria-hidden`. A DOM `<ol>` event list mirrors the states (time, camera, event, zone). Summary: "Sample feed: 2 people in Zone B, 1 missing helmet." |

## 2. Index search result (YISBIR core)
```
[▣ inset frame 16:9]  02:14:07 · CAM-11 · TRANSCRIPT · EN
                      "…the permit is ■approved■ for zone B…"      (match: aqua-050 bg, abyss text 17.51:1)
                      Speaker 2 · 00:06 clip  [Open clip] [Copy link]
```
- **Hit types:** `TRANSCRIPT` · `ON-SCREEN TEXT` · `OBJECT` · `ZONE` · `METADATA` (EV-442). There is no `FACE` type in public demos (DL-P07).
- **Language tag** `EN` / `AR`. Arabic snippets use `lang="ar" dir="rtl"` in Tajawal; the timecode stays LTR inside `<bdi>`.
- **Index timeline:** a 24 h bar with hour ticks (mono 10 px) and hit markers (2 × 12 px, `--yisbir-blue` 6.55:1 on white). Density shows as marker clustering. It is labelled "Sample index · 24 h".
- **Search field:** a real `<input type="search">` with a visible label. Filter chips are `aria-pressed` buttons. The result count is announced politely.

## 3. Bounded assistant (Nazo, Mandoobee)
| Element | Spec |
|---|---|
| Entry | Action chips, not an empty chat box: **Summarize · Draft my comment · Anything missing? · What should I do?** (observed in the Nazo demo) |
| Output | A card labelled `AI DRAFT · review before posting`, with citations as links to document sections ("§2 Budget line", "Attachment 1") |
| States | idle → working (skeleton ≤ `--dur-3`; no fake typing) → **draft** → user edits → **user posts / discards**. Never auto-send. |
| Copy | "Drafts a comment for you to review." Not "Responds on your behalf." |
| A11y | Output region `aria-live="polite"`. Buttons named by action. |

## 4. Ranked recommendation (Tasree3)
```
#1  Parallelize "Legal review" and "Finance check"     IMPACT ▮▮▮▯  EFFORT ▮▯▯▯
    Why: in the sample log, cases wait 3.1 days between these steps.     [Apply as draft version]
```
- Ranked by impact × effort (EV-402). The evidence comes from the sample event log. "Apply" creates a **draft version** that goes Submit → Review → Approve → Publish (EV-405).
- Orange marks the problem (Tasree3 accent; ink text on orange buttons, 5.78:1).

## 5. Event stream
- Columns: time (mono) · source · event · zone · state (`NEW` / `ACK`).
- Max 6 visible rows. New rows enter at `--dur-2`. `aria-live="off"`, so a summary updates instead. Pausable with the frame's control. `data-lenis-prevent` if it scrolls.

## 6. Confidence, accuracy, latency: display rules
| Quantity | Where it may appear | Format | Never |
|---|---|---|---|
| Confidence | Inside illustrative overlays only | `0.94` (two decimals) | As a headline or a product claim |
| Accuracy | Only with a registered evaluation (dataset, metric, date) | "mAP@0.5 0.81 on <dataset>, 2026-09" | "99.2% accurate" |
| Latency / throughput | Only measured | `p50 0.8 s · p95 1.6 s · <hardware> · <date>` | "Instant", "zero latency" |
| Counts ("people in zone") | Inside illustrative frames, purposeful to the task | `2` | Animated counters; "842 workers on-site" as decoration |
