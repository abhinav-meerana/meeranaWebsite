# Anti-generic audit report: <page / URL / file>

| | |
|---|---|
| Date | YYYY-MM-DD |
| Auditor | |
| Brand | meerana / yisbir |
| Viewports | 1440 × 900 · 390 × 844 |
| Modes | default · reduced motion · no-JS |
| Automated | `audit_page.py` → score __/100 · __ FAIL · __ WARN; `motion_lint.py` → __ FAIL |
| **Verdict** | **PASS / FAIL** (PASS requires 0 FAIL) |

## Failures (each must have a fix)
| # | Check | Evidence (selector / line / screenshot) | Fix (specific: tokens, components, copy) | Owner | Status |
|---|---|---|---|---|---|
| 1 | G01 Default palette | `.hero a.bg-gradient-to-r.from-blue-600` (l. 214) | `bg-action text-on-action hover:bg-action-hover`; remove the gradient (fix-recipes G10/G11) | | open |

## Warnings (justify or fix)
| # | Check | Evidence | Decision (fix / accept, with reason) |
|---|---|---|---|

## Visual checklist (V1–V20)
| ID | Result | Note |
|---|---|---|
| V1 Swap-the-logo | | |
| V2 Product above the fold | | |
| … | | |

## Signature motion
- **Element:** `[data-signature]` = …
- **Purpose sentence:** "This shows … that static layout cannot."
- **Reduced-motion behaviour:** …
- **Pause control (if loop > 5 s):** …

## Screenshots
hero · first scroll · mid-page · footer (attach or link)
