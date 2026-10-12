# Meerana brand reference (verified)

Source: `MEERANA-BRAND IDENTITY-04062026.pdf` (3 pages, Canva export, created 2026-06-03, author field "Mostafa Adel").
Verification method: PyMuPDF vector extraction of swatch fills, text spans (font name, size, colour), and embedded images (2026-10-02). Values below come from vector swatch fills, which match their printed labels exactly. Do not re-derive colours by sampling page renders.

## 1. Master brand

| Token (proposed name) | Hex | Role in PDF |
|---|---|---|
| `brand.blue` | `#0D3BFF` | Primary swatch 1; "Aa"/"أب" specimens |
| `brand.navy` | `#071B36` | Swatch 2 |
| `brand.cyan` | `#3FD0FF` | Swatch 3 |
| `brand.neutral` | `#EDEDED` | Swatch 4 |
| `brand.white` | `#FFFFFF` | Swatch 5 |

The gradient strip under the swatches runs from blue through navy and cyan to near-white. It appears as a decorative ramp, not a UI rule.

**Typography**
- English: **Poppins**. The PDF shows ExtraBold, SemiBold, Medium and Regular. Bold is used for the "MEERANA" title and the specimen, and Light for labels on page 3.
- Arabic: **Almarai**. The PDF shows ExtraBold, Bold and Regular. Its weight labels are mis-set: "عادي" (regular) is set in Almarai-Bold.

**Taglines.** These appear as raster text in the hero image, on two lines:
- "AI-POWERED ENTERPRISE PRODUCTS ECOSYSTEM"
- "BUILT IN THE UAE FOR A SMARTER FUTURE", with "THE UAE" in blue.

**Brand essence** (visible page 1): AI-Driven · Future-Ready · Enterprise · Integrated · Scalable.

**Logo**
- Parts: an isometric parallelogram-lattice symbol with ™, the "MEERANA" wordmark (custom "Λ" in place of A), and "TECHNOLOGIES".
- Lockups shown: horizontal, stacked, and symbol-only. Each appears white-on-blue and blue-on-white.
- **Not documented:** clear space, minimum size, misuse rules, or a mono/inverse spec.
- Files available are raster only:
  - PDF images: 401 px tiles and a 1001 px stacked white logo on transparency.
  - `www.meerana.ae/assets/MEERANA Logo final transparent white-08.png`: 1579×333 white horizontal.
  - The dark draft logo: 235×60.
- The tile rasters render blue as `#0433BF` and the symbol as `#0436CA`, not `#0D3BFF`. **Use the swatch value. Request vector (SVG/EPS) master logos.**

**Inconsistencies inside the PDF.** Log these; don't copy them.
- The page-1 title "MEERANA" is `#0C1A27` and "BRAND IDENTITY" is `#0141F4`. Both are off-palette.

## 2. Product sub-brands (page 3, visible vector content)

| Product | Subtitle as printed | Palette (swatch fills) | Latin type | Arabic type |
|---|---|---|---|---|
| Wasel | "SMART GATE & ACCESS CONTROL SYSTEM" (subtitle colour `#D9C1A3`); hexagon reads "WASEL -IOT" | `#6B3E26` `#D9C1A3` `#C58A52` `#F7F4EF` | Avenir LT Pro (Black / Heavy / Medium / Light) | Cairo (Bold / Regular / Light) |
| Mandoobee | "SMART OFFICE APPLICATION" (subtitle colour `#3D73D1`, not in palette); logo lockup reads "Mandoobee / Smart Office Application" | `#0D3D91` `#047AFF` `#6C819A` `#F0F4F9` | Kufam (ExtraBold / Bold / SemiBold labelled "Medium" / Regular) | Alexandria (ExtraBold / Medium / Light) |
| Tasree3 | "AI ASSISTED PROCESS MINING & PROCESS ENGINEERING"; hexagon reads "AI PROCESS INTELLIGENCE" | `#001731` `#009BFD` `#FD5D01` `#FFFFFF` | Exo 2 (ExtraBold / Bold / Medium / Light) | Changa (Bold / Regular / Light) |
| Yisbir | **"SMART GATE & ACCESS CONTROL SYSTEM" — a copy error (Wasel's line).** Hexagon reads "YISBIR OPERATIONAL INTELLIGENCE"; the superseded board reads "OPERATIONAL INTELLIGENCE THROUGH AI" | `#0045F8` `#43DAFE` `#00132D` `#FFFFFF` | Montserrat (ExtraBold / SemiBold / "Medium" rendered Regular / ExtraLight) | Tajawal (Black / Medium / Light); the PDF misspells it "Tajwal" |

All product rows also use Poppins for colour/typography labels.

Card surfaces in the PDF:
- Wasel: brown gradient
- Mandoobee: navy-to-blue
- Tasree3: orange gradient
- Yisbir: cyan-to-navy

**Product logos.** Raster, white-only, transparent:
- Wasel: 205 px (boxed "WASEL / Powered by www.meerana.ae")
- Mandoobee: 644×271 lockup
- Yisbir: 279×67
- Tasree3: 308×308

The dark draft also holds small white logos for Nazo (108×120), Smart Tracking (154×70) and AI in a Box (238×120, a line drawing). **No colour or vector product logos exist in the supplied material.**

**Licensing flag.** Avenir LT Pro is a commercial Linotype/Monotype face, so web use needs a webfont licence. Every other product face is on Google Fonts.

## 3. Superseded content hidden in the PDF — do NOT use

Two full-page raster boards are embedded beneath the visible layouts:
- `research/brand/pdf-images/p1_x16_1536x1024.png`: its top band *is* the visible page-1 hero. Its lower bands are hidden. They give **different** product palettes, and they set every product in Poppins/Almarai:
  - Mandoobee `#214E9D #3D73D1 #7DBCA3 #F4F7FA`
  - Tasree3 `#06233F #1CA6FF #FF6A00`
  - Yisbir `#0D57FF #5EEBFF #071B36`
  - Brand essence "Secure, Scalable, AI-Driven, Integrated, Future-Ready"
- `research/brand/pdf-images/p3_x432_1536x1024.png`: an AI-generated-looking concept board. It shows **unofficial logos**, a **teal Tasree3** ("AI-Powered Process Intelligence"), Yisbir as "AI-Powered Operations Management", and invented dashboard numbers. This is the likely origin of the green Tasree3 in Figma Make. Treat it as rejected.

Use these only as evidence: the Yisbir subtitle error (supports "Operational Intelligence") and the history of the Tasree3 colour mistake.

## 4. Contrast facts

Run `python .claude/skills/meerana-brand/scripts/contrast_check.py`. It computes WCAG 2.x ratios for every foreground/background pair defined in `TOKENS`.

The key results drive the usage rules in SKILL.md. Re-run the script if tokens change.
