# Landing page QA checklist (before review)

## Content
- [ ] Every section answers one written buyer question. Cut sections that don't.
- [ ] Every H1/H2 is ≤ 8 words. Every card is ≤ 2 sentences.
- [ ] Every number has `data-ev="EV-###"`, or sits inside a labelled `data-illustrative` frame.
- [ ] Partners and awards use verified wording (DL-R01/R02). No ISO mention without certificates.
- [ ] Canonical product names and British English spelling.
- [ ] One primary CTA per section. CTAs name their object. Contact links carry `?interest=<slug>`.

## Hero
- [ ] Left-aligned, with eyebrow (a fact), H1, lede, dual CTA, product index, and the product UI or brand geometry visual.
- [ ] LCP = H1 text (or poster) visible at first paint. The canvas mounts after first paint, over a poster. No CLS.
- [ ] Reduced motion leaves a complete, static hero. Loops over 5 s have a pause control.

## Structure
- [ ] Social proof sits directly after the hero, as placards or verified facts.
- [ ] Feature sections lead with a metric or specific (register-backed) and alternate their layout.
- [ ] A verticals section names environments and scenarios.
- [ ] A deployment/trust section for enterprise and AI products.
- [ ] The final CTA is a dark close with one action.

## Technical
- [ ] `audit_page.py --strict` → 0 FAIL. `motion_lint.py` → 0 FAIL.
- [ ] `contrast.py --gate` passes for any new token pairs.
- [ ] Metadata: title, description, canonical, OG image, `lang`/`dir`, and JSON-LD with evidence-backed fields.
- [ ] Lighthouse mobile: Performance ≥ 95 (≥ 85 on 3D routes); Accessibility, SEO and Best Practices ≥ 95.
- [ ] Keyboard pass, 320 px reflow, 200% zoom, no-JS read-through.
