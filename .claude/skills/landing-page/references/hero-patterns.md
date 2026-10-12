# Hero archetypes (choose one per page)

All four are left-aligned, with a dual CTA, LCP = H1 text, and one signature motion at most.

## A. Brand geometry hero (Meerana M1 / M2)
```
eyebrow · H1 · lede · CTAs · zone index        │ lattice (M1 canvas over SVG poster) or isometric model (M2 inline SVG)
```
- **Visual job:** show the five operating environments. The labels are DOM links (they double as the product index).
- **LCP:** H1. The poster SVG is inline (no request); the canvas mounts after first paint.
- **Reduced motion:** the poster only.

## B. Product-UI hero (Linear / Frame.io pattern; Nazo, Mandoobee)
```
eyebrow · H1 · lede · CTAs
───────────────────────────────────────────────
full-width product frame (reconstructed DOM UI, crisp at 1×/2×), provenance label
```
- **Visual job:** the product *is* the proof.
- Use real screenshots only if permission-cleared (DL-A02). Otherwise reconstructed DOM, labelled.
- **LCP:** H1, or the frame's poster image with `fetchPriority="high"` when it's an image.

## C. Search-as-hero (YISBIR Y2; Verkada pattern)
```
eyebrow · H1 · lede · CTAs                     │ <input type=search> (prefilled) · chips · result cards · index timeline
```
- **Visual job:** the visitor *uses* the product in the hero. Sample queries run locally (no network).
- **Motion:** typewriter ≤ 1.2 s once; ticks drop; rest. Reduced motion pre-fills the query.
- **A11y:** a real label on the input; results as a list; `aria-live="polite"` announces the result count.

## D. Camera-as-hero (YISBIR Y1; Intenseye pattern)
```
eyebrow · H1 · lede · CTAs                     │ camera panel: chrome (ID, REC, timecode, LOCAL NODE), detections, zones
                                               │ event list (DOM) · [Pause feed] · "Illustrative interface · simulated detections"
```
- **Visual job:** show model output (boxes, classes, confidence, track IDs) on the cameras the customer already has.
- **A loop, so a pause control is mandatory.** Reduced motion shows one annotated frame.
- **Privacy:** figures are outline-only and non-identifying. No face, gender or plate overlays (DL-P07).

## Shared rules
- **Above the fold at 1440 × 900:** eyebrow, H1, lede and both CTAs visible; the visual at ≥ 50 % visible.
- **At 390 × 844:** H1 and primary CTA visible without scrolling; the visual follows. Canvas loops are replaced by posters under 768 px unless traces pass.
- **No marquee tickers, rotating words or auto-advancing slides in the hero.** The live meerana.ae carousel is the anti-example.
- **The header CTA mirrors the hero's human CTA** ("Talk to Meerana" / "Request a demo").
