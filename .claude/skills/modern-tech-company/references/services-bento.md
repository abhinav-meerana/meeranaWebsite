# Services bento ("how Meerana delivers")

**Source:** DL-S01 (four service lines), EV-030–034. Legacy items are pruned per DL-S02/S03.

## Grid
```
Desktop (4 cols × 2 rows, gap 16 px)          Tablet (2 cols)             Mobile (1 col, reading order)
┌───────────────┬───────────────┐             ┌──────┬──────┐             Consulting
│ Consulting    │ Bespoke dev   │             │ Cons │ Cons │             Bespoke development
│ (2×2)         ├───────┬───────┤             ├──────┴──────┤             Partnerships
│               │ Part- │ Staff │             │ Bespoke     │             Staff augmentation
│               │ ners  │ aug.  │             ├──────┬──────┤             Bridge → Tasree3
└───────────────┴───────┴───────┘             │ Part │ Staff│
  + bridge cell (full width, slim): "Process re-engineering → Tasree3"
```

```css
.bento { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr);
  grid-template-areas: "consult consult bespoke bespoke" "consult consult partners staff" "bridge bridge bridge bridge"; }
@media (max-width: 1023px) { .bento { grid-template-columns: repeat(2, 1fr);
  grid-template-areas: "consult consult" "bespoke bespoke" "partners staff" "bridge bridge"; } }
@media (max-width: 767px) { .bento { grid-template-columns: 1fr;
  grid-template-areas: "consult" "bespoke" "partners" "staff" "bridge"; } }
```

## Cells (copy proposed; ≤ 2 sentences + mono list)
| Area | Title | Copy | Mono list | Evidence |
|---|---|---|---|---|
| consult | Consulting | Advisory for organisations modernising how they manage data, infrastructure and service. It begins with how your processes actually run. | DATA MANAGEMENT · DATA CENTRE · CUSTOMER EXPERIENCE · DIGITAL TRANSFORMATION · ENTERPRISE ARCHITECTURE · PROCESS RE-ENGINEERING | EV-030 |
| bespoke | Bespoke development | Software, cloud and IoT systems built to your requirements. Delivered by Meerana's own engineering team. | SOFTWARE & CLOUD · ERP · RPA · DATA SERVICES · CYBERSECURITY TESTING · IOT SOLUTIONS | EV-031 (pruned, DL-S02) |
| partners | Technology partnerships | Platforms from verified partners, deployed and supported locally. | SOFTWARE AG · COMMVAULT · FPT SOFTWARE · CYBERHIVE · BOTMINDS → placards | EV-240, EV-506, EV-505, EV-507, EV-508 |
| staff | Staff augmentation | Skilled technology professionals on flexible terms. | AI · CLOUD · DATA · SOFTWARE | EV-032, EV-033 |
| bridge | Process re-engineering → Tasree3 | When the work is a process, the product is Tasree3. | → /products/tasree3 | EV-401 |

**Surface rules:**
- **M1 (dark):** cells are `bg-surface-raised` (navy-900, DD-14) with `border border-line`. One cell, the bridge, uses `data-product="tasree3"` for its rule colour.
- **M2 (light):** cells on neutral, with one navy emphasis cell.
- **Hover:** a 2 px translate, `--dur-1`. No scale, no glow.
- **Never:**
  - identical cells, or icons as the main content;
  - "Managed services" unless Meerana operates support or monitoring (DL-S01);
  - legacy lines (metaverse, NFT, e-commerce, FinTech, ZingHR) (DL-S02/S03).
