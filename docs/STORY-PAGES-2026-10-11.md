# Story pages and page-1 fixes — 2026-10-11

Critique of the homepage, the fixes applied, and the story engine built for the
product pages. Every claim below was measured in a headless browser, not judged
by eye.

---

## 1 · Critique of page 1, with evidence

| # | Defect | Measurement before | Verdict |
|---|---|---|---|
| 1 | **No navigation at all** | `document.querySelector('nav')` → **null** at every viewport; page is 13.7 screens | P0 |
| 2 | **H1 broke to four lines** | `<h1>` computed `max-width: 868px` but its parent clamped to **640px**, so the headline was forced narrower than its own measure | P0 |
| 3 | **Hero CTA cut off** | at **1280×720**, `ctaBottomGap: −33px` — the buttons were below the fold on a very common laptop size | P0 |
| 4 | **Hero not a full screen** | 947px tall on a 900px viewport, so 47px of the next section bled in | P1 |
| 5 | **Four dead controls** | `.moments button, .moments a` → **0**. "AI · Automation · IoT · Security" looked selectable and was not | P1 |
| 6 | **Every CTA was `mailto:`** | 4 of 4; no form, no endpoint | P1 |
| 7 | **Energy inverted** | the showcase animated; story, proof and CTA sections were static | P2 |

### The find that shaped the work

`plan/07-product-storyboards.md` already contained **complete 8-beat storyboards
for Tasree3, Yisbir, Mandoobee and Wasel** — proposed copy, evidence ids,
per-product brand language, motion ids — and `plan/08-scroll-animation-spec.md`
already specified the motion engine, pin budgets and reduced-motion branches.
Neither had been built. Nazo and AI in a Box had no storyboard, because `plan/07`
treated them as optional and the owner has since confirmed both.

So the story pages were **implemented to an existing specification**, not
designed from scratch here.

---

## 2 · Page-1 fixes, measured after

Verified by `scripts/verify-page1.mjs`, which asserts against the defects above:

```
1440x900  nav=Y h1=3L hero=900/900   ctaBottom=811 moments=4 productLinks=4 ovf=false  PASS
1280x720  nav=Y h1=3L hero=720/720   ctaBottom=669 moments=4 productLinks=4 ovf=false  PASS
1920x1080 nav=Y h1=3L hero=1080/1080 ctaBottom=901 moments=4 productLinks=4 ovf=false  PASS
1024x768  nav=Y h1=3L hero=1177/768 (stacked)  ctaAboveFold=Y ovf=false  PASS
390x844   nav=Y h1=3L hero=1176/844 (stacked)  ctaAboveFold=Y ovf=false  PASS
```

- **Navigation** built to `plan/08 M-global-02`: transparent over the hero, solid
  + 1px border after 80px, **never hides on scroll**, links always reachable.
  Below 1024px a sheet lists the six products first.
- **H1 measure** fixed by removing the conflicting clamp; 4 lines → **3 lines**.
- **Hero** is now exactly one viewport where it is a full-screen statement, and a
  stacked section below 1280px where the room moves under the copy by design.
- **Moments are real links** into each product's story, accented per product.
- **Short-viewport branch** (`max-height: 800px`) steps the type down so the CTA
  stays above the fold — this is the fix for the 1280×720 case.

---

## 3 · The story engine

Three layers move at **measurably different rates**. That rate difference *is*
the cinematic effect; one layer alone would read as a slideshow.

| Layer | Rate | Travel measured (1440×900) |
|---|---|---|
| Background plate | `0.14 × 0.5svh` | **107px** |
| Midground visual | `0.38 × 0.5svh` | **291px** |
| Foreground text | page rate (normal flow) | — |

Both rates sit inside the 0.10–0.45 band that research on parallax found reads
as depth rather than nausea.

**Beat transitions are continuous**, not triggered: the active beat is derived
from the beat nearest the viewport centre, so visuals cross-fade and scale rather
than cutting. Beat text renders twice — in the sticky stage at desktop widths and
inline below 1024px and under reduced motion — so no beat is ever invisible.

### Bugs found and fixed during the build

These are worth recording because each one would have shipped as a visible
defect:

1. **`story.css` was never imported.** The stage computed `position: static` and
   `height: 3993px`, which caused *three* separate symptoms at once: the visual
   scaled to ~1200px, the hero text appeared at the bottom of the page, and there
   was no stickiness. One missing import.
2. **Parallax rates used `yPercent`.** That is relative to the element's own
   height, and the stage layers hold all eight visuals, so their height has
   nothing to do with the viewport — the midground travelled **617px** against
   the background's 58px. Switched to pixel travel derived from `svh`.
3. **One ScrollTrigger per beat.** Adjacent beats overlapped, so several were
   active at once and the last to toggle won: measured **3 of 8** beats ever
   activating.
4. **Uniform index division.** Deriving the beat index by dividing the container
   evenly was **7/8** correct, because beats have unequal heights. Now anchored to
   each beat's real midpoint: **8/8**.
5. **Copy and diagram overlapped.** Text occupied 128–660px and the centred
   visual 352–1088px, so labels and copy fought each other. The visual moved to
   the right column and the scrim now protects the reading zone.

---

## 4 · Verified outcome

Six product pages, each 8 beats, from `scripts/verify-pages.mjs`:

```
mandoobee     200 beats=8 h1=1 h2=9 nav=Y accent=#047AFF ok docH=8380 ovf=false noAlt=0 err=0
tasree3       200 beats=8 h1=1 h2=9 nav=Y accent=#FD5D01 ok docH=8403 ovf=false noAlt=0 err=0
nazo          200 beats=8 h1=1 h2=9 nav=Y accent=#3FD0FF ok docH=8334 ovf=false noAlt=0 err=0
yisbir        200 beats=8 h1=1 h2=9 nav=Y accent=#43DAFE ok docH=8390 ovf=false noAlt=0 err=0
wasel         200 beats=8 h1=1 h2=9 nav=Y accent=#C58A52 ok docH=8380 ovf=false noAlt=0 err=0
ai-in-a-box   200 beats=8 h1=1 h2=9 nav=Y accent=#3FD0FF ok docH=8380 ovf=false noAlt=0 err=0

mobile 390x844
tasree3  beats=8 stage=none inlineVisible=true ovf=false err=0
yisbir   beats=8 stage=none inlineVisible=true ovf=false err=0
```

| Gate | Result |
|---|---|
| `npm run build` | **7 routes** exported |
| Differential parallax | **YES** — 107px vs 291px |
| Beat transitions | **8/8** correct |
| Per-product accents | all 6 match `brand-reference.md` §2 |
| Reduced motion | engine off, 8 static beats, visuals inline |
| Mobile | sticky stage dropped, visuals inline, no overflow |
| Console errors | **0** on every route |
| Images missing `alt` | **0** |
| Horizontal overflow | **none** at 390/1024/1280/1440/1920 |
| Forbidden strings across all exported HTML | **0** |
| Contrast gate | 64 pairs, **0 failing** |

### Compliance carried into the new copy

Orange marks only problems for Tasree3 (its brand rule); Yisbir demos contain no
faces, plates or person search; AI in a Box carries **no sovereignty claim**
(DL-P13) and its deployment line reads "options to be confirmed"; the
Zero-Government-Bureaucracy line is worded as *alignment, never endorsement*;
Nazo's mock-ups use neutral template names rather than the Ministry material that
was removed earlier.

---

## 5 · What is still thin

Stated plainly, because the pages look more finished than they are:

1. **The beat diagrams are illustrative SVG/DOM**, not real product UI. There is
   no public UI for Tasree3, Yisbir, Nazo or AI in a Box beyond the stills
   already cleared, so beats use diagrams in each product's own language. Each
   carries its provenance label. Real recordings would replace them.
2. **The mobile story is a flat list of beats.** The sticky stage is dropped
   below 1024px by design, so mobile gets no differential parallax. A
   lighter-weight mobile treatment is possible but not built.
3. **Still no enquiry form.** Every CTA points at `/contact?interest=…`, and that
   route does not exist yet — so the CTAs currently 404.
4. **No `/services`, `/company`, `/privacy`.** The header links to `/#world` and
   `/#contact` anchors on the homepage, which work, but the dedicated routes do
   not exist.
5. **No git repository or CI.** The verification scripts are runnable but nothing
   runs them automatically.
