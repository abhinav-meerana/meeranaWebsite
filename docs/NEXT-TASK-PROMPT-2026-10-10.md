# M3 homepage prototype: hand-off and next-task prompt (2026-10-10)

All background work was stopped at the owner's request on 2026-10-10.

## 1. Next-task prompt (paste as-is)

> Continue the Meerana M3 homepage prototype in `C:\Users\abhin\Desktop\meerana`. Read `docs/NEXT-TASK-PROMPT-2026-10-10.md` §2–§4 first, then:
>
> 1. **Finish the hero 3D dashboard wall.**
>    - The spike is `prototypes/_hero-wall-spike.html` and the spec is `docs/review/m3-2026-10-10/HERO-WALL-SPEC.md`. Its fixer pass was interrupted.
>    - Fix the verifier's open issue first: the rAF loop must stop when the hero is off-screen or the tab is hidden.
>    - Then port the final composition and JS into `prototypes/src/m3.tpl.html`. This replaces the provisional `.hero-wall` CSS and the `WALL` controller.
>    - The wall tiles come from `prototypes/src/m3_media.json` (use `"wall"`) through `build.py`'s `m3_wall()`.
> 2. **Switch the page to the v3 media.** Run `python -B prototypes/src/build.py m3`; the cards and wall pick up `m3_media.json` automatically. Check every card frame and lightbox image for legibility and compliance: no faces, names, plates, weapons, client names, "Sovereignty in Your Hands" or government templates.
> 3. **Apply the engine's template notes** (§3 below), then confirm in screenshots that the 3D seams no longer read as outlines.
> 4. **Capture a full screenshot set** at 1440×900, 1280×800, 1024×768 and 390×844 into `docs/review/m3-v3/`.
> 5. **Run a review round as in the previous one:**
>    - specialist reviewers: visual, components, 3D/motion, brand/compliance, mobile/a11y, and a benchmark re-score against `docs/review/m3-2026-10-10/benchmarks/`;
>    - then a judge pass that verifies each finding;
>    - then fix what is confirmed.
>
>    Target: at least 46/60 on the same 12-dimension scorecard (today 23/60; benchmark median 49.5).
> 6. **Gates before reporting:**
>    - `python .claude/skills/web-animations/scripts/motion_lint.py prototypes/meerana-m3-intelligent-ecosystem.html`: 0 FAIL.
>    - `python .claude/skills/anti-generic-audit/scripts/audit_page.py prototypes/meerana-m3-intelligent-ecosystem.html --brand meerana --strict`: PASS.
>    - `python .claude/skills/ui-system/scripts/contrast.py --gate`: 0 failing.
>    - No horizontal overflow at any width.
>    - No visible DL-/DV-/EV- codes.
>
> Keep the owner's mandated copy verbatim. Cards stay solid; glass only on the nav and its sheet. Write only in `prototypes/`, `docs/` and `.claude/skills/` (non-`meerana-*`). Don't call the Figma tools: the Starter-plan limit is used up.

## 2. Context

### Owner decisions and mandates (binding)

**Mandated copy, from reviewer comments the owner pasted:**
- H1 "We engineer intelligence for the real world."
- Rapid moments AI → Automation → IoT → Security.
- "Meerana Intelligence Layer".
- "Built in the UAE. Engineered for the world."
- The story Problem → AI detects → Automation acts → Dashboard shows → Business outcome.
- CTA "Together, let's build what comes next."
- "Don't add more content."

**2026-10-10 asks:**
- "Pure 3D page."
- Horizontal product scrolling with fade.
- A Dynamic Island nav.
- "Keep the cards solid, glass only where necessary."
- "Looks like MS Paint, needs refinement."
- A professional multi-agent critique and a top-company benchmark.

**Latest asks:**
- Hero right side: dashboards and screenshots, scrollable, in a 3D view. The reference is a Figma file of Zayed University CCTV dashboards; only the 21:9 frame was retrieved: `scratchpad/figma2/admin-21x9.png`.
- Proof: "bring everything from meerana.ae for now".

**Defaults applied (change plan §3), since the owner hasn't decided:**
- A 250vh gallery pin with snap.
- Wasel in Asset Tracking's slot (six cards).
- The "Intelligence Layer" heading with the caption "Six products. Each one deploys on its own."
- The hero lede "An AI-powered ecosystem of six enterprise products — for AI, automation, IoT and security."
- Yisbir and Zayed boards shown masked.
- Demo media masked.
- Motion in code.

**Settled earlier (`docs/OWNER-DECISIONS-2026-10-10.md`):**
- Six products.
- Face recognition is a toggleable module, never a headline.
- Company facts come from meerana.ae.
- The live-site security findings are ignored.

### What exists now

| Item | State | Where |
|---|---|---|
| **Page template v3** | Built and screenshotted. Design system (12-column grid, 8 type sizes, one card, button, caption and segmented recipe), solid cards, desktop island with links plus a live-activity drop row, compact island and sheet below 1280, hero lede, moments driving the wall, six manifest-driven product cards, a 250vh pin with snap (≥1280×760) and a native rail elsewhere, offices table with live clocks, awards, partner lines, story rail, CTA without a card, full footer, inline posters below 1280. | `prototypes/src/m3.tpl.html` (v2 backup: `m3.v2.tpl.html.bak`; v1: `m3.v1.tpl.html.bak`) |
| **Build** | `python -B prototypes/src/build.py m3` writes `prototypes/meerana-m3-intelligent-ecosystem.html`. Generators: `m3_cards()`, `m3_wall()`, `m3_proof()`, `m3_scene()`. | `prototypes/src/build.py` |
| **Product data** | Six cards: copy, evidence IDs, fallback media. | `prototypes/src/m3_products.json` |
| **Proof** | Done and verified. 32 logos (white; the 3 state emblems in colour), 3 award placards, 13 partner lines; placeholder testimonials excluded. Inventory and risk tiers in the inventory file. | `prototypes/src/m3_proof.json`, `prototypes/media/m3/proof/`, `docs/review/m3-2026-10-10/PROOF-INVENTORY.md` |
| **Media v3** | Done and verified-and-fixed (17 findings). 17 wall tiles, card crops, mobile crops, masked loops, contact sheets. **Not yet in the built page:** rebuild to pick it up. | `prototypes/media/m3/v3/`, `prototypes/src/m3_media.json`, `docs/review/m3-2026-10-10/media-v3-*.png` |
| **3D engine** | Upgraded, two fix passes: key light with blue-shifted shadows, fog 0 at the pivot, chamfer instead of outlines, baked AO, contact shadows, in-WebGL light pool and floor grid, curved morphs, the Wasel gate micro-story, `pause(on)`, 30 fps ambient, no per-frame allocations. Not done: 4.6 one instance per object, 4.7 camera rig, 4.9 scroll scrub, 4.11 2 px lines and moods, cutting from 21 to 12 formations. | `prototypes/src/m3_engine.js`, `m3_scene.js`; before/after shots in `docs/review/m3-2026-10-10/engine-v3/` |
| **Hero wall** | Spike built. Verifier score 70: the loop doesn't stop off-screen, plus craft notes. **Fixer interrupted.** The page currently has a provisional wall. | `prototypes/_hero-wall-spike.html`, `docs/review/m3-2026-10-10/HERO-WALL-SPEC.md`, `docs/review/m3-2026-10-10/hero-wall/` |
| **Review round 1** | 4 reviews, 2 benchmarks (20 sites), judge verdict, change plan. | `docs/review/m3-2026-10-10/reviews/`, `docs/review/m3-2026-10-10/benchmarks/`, `docs/review/m3-2026-10-10/JUDGE-VERDICT.md`, `docs/M3-CHANGE-PLAN-2026-10-10.md` |
| **Research** | Motion sites and animation MCPs. | `docs/MOTION-RESEARCH-2026-10-10.md` |
| **Decisions log** | DD-17 … DD-25. | `docs/DESIGN-DIRECTIONS.md` §7 |

### Tools and harness
- **Screenshots:** headless Chrome over CDP, with WebGL through SwiftShader. Run it from **PowerShell** only (it fails in Git Bash), one call at a time:
  ```
  Set-Location "<scratchpad>"; node shot.mjs <outdir> 1440 900 "file:///C:/Users/abhin/Desktop/meerana/prototypes/meerana-m3-intelligent-ecosystem.html#qa=<beat>&webgl=force|<name>|<waitMs>|<reduce?>|<js?>"
  ```
  The scratchpad is `C:\Users\abhin\AppData\Local\Temp\claude\C--Users-abhin-Desktop-meerana\9a8ddbf2-69cd-42de-a41f-355ac87f0bec\scratchpad`; copy `shot.mjs` into the project if a new session can't reach it.
- **QA hashes:** `#qa=hero|ai|auto|iot|sec|layer-0..5|world|story-1..5|next`.
- **Engine-only test build:** `scratchpad\build_engine_test.py`, which uses a frozen v2 template.
- **Figma MCP:** works, but the Starter-plan monthly call limit is used up. The Yisbir boards (file `Yg7y7kTxiUCtE3bY3EZiyb`) are already exported to `scratchpad\figma\`.
- **ffmpeg 8.0.1 and Pillow** are available. pip installs are blocked by app control.
- **Known benign console error:** a Tailwind browser-build `ERR_FILE_NOT_FOUND …/tailwindcss` on `file://`. It is pre-existing and also appears in M1.

## 3. Open items (for the next task)

1. **Engine notes for the template** (from the engine agent):
   - Keep the poster styling scoped `.m3p:not(.m3p-probe)` (already applied).
   - The stage light pool is applied.
   - Wire `GL.pause(true/false)` (done in `setBeat`).
   - Replace any remaining reference to the cut formations once 4.12 is done.
2. **Hero wall:** fix the off-screen loop; check tile legibility at wall size; port the composition to the template; add a mobile strip. The tablet layout (768–1279) puts the wall under the text.
3. **The "dubaiPolice" and Zayed boards:** masked versions only. Public use needs permission. Five Zayed frames are still un-exported; ask the owner for PNG exports.
4. **Logos:** 11 high-risk marks (banks, government bodies, DEWA group, Neonax) need permission before any public use. Recolouring the 3 state emblems needs a legal check (they are kept in colour).
5. **Not yet done from the change plan:**
   - 3D camera rig and scroll-scrubbed story (4.7, 4.9);
   - one instance per object (4.6);
   - 2 px flow lines and lighting moods (4.11);
   - precompiling Tailwind at build time (Phase 6);
   - real-GPU and Android performance traces.
6. **Production backlog:** enquiry form (`POST /v1/enquiries`), product pages, legal pages, Arabic, permitted logos, re-recorded neutral demos, clean Tasree3 captures.

## 4. Skills used (project skills, `.claude/skills/`)

| Skill | Use in this work | Key files |
|---|---|---|
| `ui-system` | Tokens, semantic surfaces, component rules, contrast gate | `SKILL.md`, `references/tokens.css`, `references/contrast-pairs.json`, `references/component-inventory.md`, `scripts/contrast.py` |
| `web-animations` | One signature motion, LCP-safe hero, reduced motion, pause control, motion tokens, motion lint | `SKILL.md`, `references/motion-tokens.css`, `references/gsap-recipes.md`, `references/performance-budget.md`, `references/reduced-motion-and-a11y.md`, `scripts/motion_lint.py` |
| `anti-generic-audit` | Template-marker audit (G01–G24); page waivers (G10 with reason) | `SKILL.md`, `references/checklist.md`, `references/fix-recipes.md`, `scripts/audit_page.py` |
| `landing-page` | Section formula, copy rules (headline ≤ 8 words), CTA mapping | `SKILL.md`, `references/copy-rules.md`, `references/hero-patterns.md` |
| `modern-tech-company` | Brand voice, canonical names, product cards, partner placards | `SKILL.md`, `references/product-cards.md`, `references/partner-band.md`, `references/positioning-and-voice.md` |
| `modern-ai-company` | Honest AI language, sample-data rules, face-recognition governance, sovereignty claims | `SKILL.md`, `references/honest-language.md`, `references/sample-data-rules.md`, `references/model-output-ui.md` |
| `meerana-brand` | Colours, logos, sub-brand palettes, contrast rules | `SKILL.md`, `references/brand-reference.md`, `scripts/contrast_check.py` |
| `meerana-evidence` | Evidence register discipline (EV/DL IDs) | `SKILL.md`, `scripts/check_register.py` |
| `meerana-webgl-scenes` | Purpose test, budgets, one canvas, poster fallbacks | `SKILL.md` |
| `meerana-scroll-choreography` | Native scroll, pin limits (exception in DD-23), skippable pins | `SKILL.md` |
| `meerana-a11y-responsive` | Breakpoints, focus, contrast gate | `SKILL.md` |
| `meerana-narrative`, `meerana-product-ui`, `meerana-frontend` | Narrative rules, provenance levels, the Next.js production path | their `SKILL.md` |

**Rule:** the `meerana-*` skills and `plan/` are read-only; record disagreements as DD entries in `docs/DESIGN-DIRECTIONS.md`.

**Recommended (not installed; owner to approve):**
- GSAP AI skills: `/plugin marketplace add greensock/gsap-skills`.
- The shadcn MCP: `npx shadcn@latest mcp init --client claude`.
- Details in `docs/MOTION-RESEARCH-2026-10-10.md`.
