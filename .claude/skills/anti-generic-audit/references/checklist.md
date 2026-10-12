# Manual checklist (rendered pass at 1440 × 900 and 390 × 844)

Mark each item **PASS / FAIL / N/A**. Every FAIL needs evidence (a screenshot region or selector) and a fix from `fix-recipes.md`.

## A. Identity: could this page belong to anyone else?
| ID | Check | FAIL when |
|---|---|---|
| V1 | **Swap-the-logo test** | Replacing the logo with a competitor's leaves the page just as true. Nothing on it is specific to this company: its products, its geography (built in the UAE, Business Bay), its partners, its lattice geometry, its bilingual reality. |
| V2 | **Real product visible above the fold** | The hero shows abstract art, a globe, a robot, a stock photo or a blurred dashboard instead of the product, its output or the brand's own geometry |
| V3 | **Specific headline** | The H1 could be any company's ("We engineer intelligence for the real world"), or it exceeds 8 words |
| V4 | **Proof is real** | Logos without relationship labels; awards with inflated wording; testimonials without named, consenting sources; certifications shown as badges without certificates |

## B. Typography and colour
| ID | Check | FAIL when |
|---|---|---|
| V5 | **Scale contrast** | The hero display is less than ~3× the body size, or uses 700+ weight with no tracking adjustment (shouty). Reference ratios are 4–6× (Linear 64/15, Resend 96/18). |
| V6 | **Families** | More than 3 families; no mono for metadata where it helps; or Inter/Space Grotesk/Manrope on a Meerana or YISBIR page |
| V7 | **Palette discipline** | More than one accent per surface; product colours used as page themes; neon substitutes; cyan text on white; blue text on navy |

## C. Composition and rhythm
| ID | Check | FAIL when |
|---|---|---|
| V8 | **Grid** | Centred-everything; no 12-column alignment; ragged section starts |
| V9 | **Section variety** | Three or more consecutive sections share the same layout (heading + 3–4 cards); the product card set appears more than once |
| V10 | **Density** | Walls of identical cards or KPI tiles; or empty decorative sections ("one intelligence layer" diagrams) that explain nothing |

## D. Motion and interaction
| ID | Check | FAIL when |
|---|---|---|
| V11 | **One signature that means something** | There is no signature; there are several competing ones; or the signature doesn't explain anything (a particle field, metaballs, a spinning globe). Write its purpose sentence: "This shows ___ that static layout cannot." |
| V12 | **Calm elsewhere** | Every block fades or slides; there's parallax on text; the scroll is hijacked; counters animate; a carousel auto-advances without a pause |
| V13 | **Reduced motion** | With OS reduced motion on, anything still moves, or content is missing or unreadable |
| V14 | **No-JS read** | With JS disabled, sections are blank (opacity 0) or the story doesn't read top to bottom |

## E. Imagery and data
| ID | Check | FAIL when |
|---|---|---|
| V15 | **Imagery provenance** | Stock, watermarked or AI-generated imagery appears; photos lack rights or consent; private data is visible (business cards, name lists) |
| V16 | **Product UI provenance** | A product screen has no `real` / `reconstructed` / `illustrative` label; sample data looks like real people or real customers; it uses fake OS chrome |
| V17 | **Numbers** | Any number lacks an evidence id or an illustrative label; accuracy, uptime or latency claims are unmeasured |

## F. Copy
| ID | Check | FAIL when |
|---|---|---|
| V18 | **Specific language** | Hype words appear (revolutionary, seamless, cutting-edge, next-gen, unleash); "AI-powered" more than twice per page; benefits stated as outcomes without a source |
| V19 | **Cards** | Card copy exceeds 2 sentences, or the same subtitle repeats across cards (the live meerana.ae Solutions block repeats one subtitle 4×) |

## G. Basics
| ID | Check | FAIL when |
|---|---|---|
| V20 | **Metadata and semantics** | Default or missing title/description; not exactly one h1; images without alt; `lang`/`dir` missing |

**Pass bar:** zero FAIL across the G checks (automated) and V1–V20, or each remaining WARN is justified in the report.
