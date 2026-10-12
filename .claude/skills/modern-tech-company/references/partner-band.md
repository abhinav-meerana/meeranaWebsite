# Partner band: museum placards

## Concept
- Present each verified relationship like an exhibit label in a gallery:
  - quiet, factual, generously spaced;
  - typography-led;
  - each with its provenance.
- **Why it works:**
  - It's distinctive. Every reference site uses a grey logo strip (`docs/DESIGN-DIRECTIONS.md` §1).
  - It's honest: the relationship, year and source are visible.
  - It needs **no logo licence** until permissions arrive (DL-R02).

## Anatomy (one placard)
```
01                                   ← index no. (mono, text-fg-muted)
──────────────────────────────────    ← 1 px rule (border-line-strong on neutral: 3.33:1)
Software AG                          ← name (Poppins 500, 24 px, text-fg)
PARTNERCONNECT · SIGNED GITEX 2022   ← relationship (mono label, text-fg-muted 5.55:1 on neutral)
Technology partner                   ← category (text-small)
Source: joint announcement, 2022 ↗   ← evidence line (text-link)
[ logo slot — empty until permitted ]
```

## Band layout
- **Surface:** `data-surface="light"` on the neutral wall (`bg-surface-muted`, #EDEDED), between two navy sections. This is the M1 contrast moment.
- **Eyebrow:** "PARTNERS, ON THE RECORD"; H2 optional.
- **Desktop:** a 6-placard rail (3 visible, scroll-snap), or a 3 × 2 grid. Placards are min-width 280 px with 40 px padding.
- **Mobile:** horizontal scroll-snap with visible arrow buttons, plus keyboard support (arrow keys move by one placard).
- **No auto-scroll. No marquee.**

## Data (verified; sources in the register)
| No. | Partner | Relationship (label) | Year | Evidence |
|---|---|---|---|---|
| 01 | Software AG | PartnerConnect · signed at GITEX Global | 2022 | EV-240 |
| 02 | FPT Software | Strategic MoU | 2024 | EV-505 (followed the Dubai International Chamber trade mission to Vietnam, EV-261) |
| 03 | CyberHive | MoU | 2025 | EV-507 |
| 04 | Dubai Chambers | Supporter · Dubai International Chamber trade missions | 2024 | EV-509, EV-261 |
| 05 | Commvault | Value Added Partner · GITEX Global | 2024 | EV-506 |
| 06 | Botminds | Regional partner | — | EV-508 |

**Not on placards** until verified: SAP (the "Gold Partner" badge is unsupported), Microsoft, Dell, Kofax, Confluent, AgilePoint, SAS and the other unverified vendors, and **any client** (DL-R02).

## Awards: the same device
| No. | Recognition | Label | Evidence |
|---|---|---|---|
| A1 | Future 100 | Selected, 2023 · UAE Ministry of Economy & the Government Development and the Future Office | EV-202 |
| A2 | Emirates Labour Market Award | Workforce Wellbeing & Quality of Life · 2023 (MOHRE) | EV-200 (confirm the certificate) |
| A3 | Best small enterprise in the UAE | GCC Labour Ministers Committee ceremony · Doha · September 2024 | EV-203 |

## Accessibility
- The rail is `role="list"` / `role="listitem"`, and the arrow buttons have names.
- Logos (when added) take the organisation name as alt text.
- Contrast on neutral: navy title 14.71; muted metadata 5.55; link 5.81; rule 3.33.
