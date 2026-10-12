# YISBIR — capabilities, use cases and the insight layer

**Prepared:** 2026-10-10, after the owner's decisions of the same day.

**Owner decisions:**
- Yisbir covers **media indexing and CCTV camera analytics**, "with all the use cases you can imagine": universities, police departments, supermarkets and retail, and "even analysing product misplacements" [EV-533].
- **Face recognition is a toggleable feature.** The site focuses on fire detection, attendance, uniform and PPE, "not just detection but using that data for insights" [EV-534, EV-535].

**Evidence:** `plan/03-evidence-register.csv` + `docs/evidence-addendum-2026-10-10.csv` (EV-5xx). Demo facts are in `docs/DEMO-MEDIA-PLAN.md` (EV-520–525, proposed).

**Governing skills:** `modern-ai-company` (honest AI language, sample data, sensitive capabilities), `meerana-evidence`, `landing-page`.

---

## 1. One product, two pillars, one insight layer

```
          ┌────────────────────────────── YISBIR · Operational intelligence ──────────────────────────────┐
 Sources  │ recorded media (archives, lectures, interviews, broadcasts)   live CCTV streams (existing cameras) │
          │            │                                                        │                            │
 Pillar   │   1  VIDEO INDEXING & SEARCH                              2  LIVE CAMERA ANALYTICS              │
          │   speech (50+ languages, speakers) · on-screen text ·      fire & smoke · PPE · uniform ·         │
          │   objects · people · scenes · documents                    attendance · zones · falls · intrusion │
          │            └──────────────────────────┬─────────────────────────────┘                            │
 Insight  │                       3  INSIGHT LAYER — events → trends, rates, heatmaps, timelines, reports     │
 Action   │                       alerts · tasks · evidence packages · scheduled reports                     │
          └────────────────────────────────────────────────────────────────────────────────────────────────────┘
          Face recognition: an optional module, switched on per deployment (EV-535). Not part of any public demo.
```

| Pillar | What it does | Evidence |
|---|---|---|
| **1 · Video indexing & search** | Indexes recorded video and audio: transcription in 50+ languages with speaker diarization, on-screen text and documents (OCR), objects, scenes and people. Then natural-language, phrase, metadata, similarity and vector search, a cited AI answer, key moments, compare, and evidence packages with access control. | EV-440, EV-442, EV-524 |
| **2 · Live camera analytics** | Watches existing CCTV and raises events: PPE, restricted zones, falls, unsafe practices, intrusion, perimeter breaches, vehicle anomalies, fire and smoke, crowd heatmaps, attendance, uniform. "No hardware changes required." | EV-133, EV-134, EV-136, EV-138, EV-444, EV-534, EV-537 |
| **3 · Insight layer** | Turns detections into numbers people act on: compliance rates, occupancy and attendance curves, heatmaps, incident timelines, response times, and shelf-availability trends, through "fully customisable dashboard[s]" and "tailored analytics, alerts, and visualizations" | EV-138, EV-132 ("Actionable Insights"), EV-534 |

**Positioning line (proposed):**
> "YISBIR turns the video you already have — archives and live cameras — into answers: what happened, where, how often, and what to do next."

Built from EV-440, EV-133, EV-534.

---

## 2. Evidence tiers for every use case

| Tier | Meaning | How it may appear |
|---|---|---|
| **A · Documented** | In Meerana's own sources: meerana.ae `/yisbir`, yisbir.com, the Yisbir promo video, or the demo | As a capability |
| **B · Owner-stated** | Stated by the owner on 2026-10-10 (uniform compliance, product misplacement, the named verticals) | As a capability, once the product owner confirms model readiness per deployment |
| **C · Composed** | A use case assembled from A/B detections plus the insight layer. No new model is needed, only zones, rules and reports. | As a **use case** ("Yisbir can be configured to…"), never as a packaged feature with numbers |
| **D · Needs confirmation** | Requires a detection not documented anywhere (e.g. spills, abandoned objects, fights) | **Not published** until Meerana confirms it |

**Privacy class** used below:
- **None:** no people involved (fire, shelves).
- **Presence:** people detected, but not identified (PPE, headcount, zones).
- **Identity:** a person is identified (face recognition, plates). Always behind the toggle and governance (§6).

---

## 3. Detection library (the building blocks)

| # | Detection / index layer | Pillar | Tier | Evidence | Privacy class | Typical insight it feeds |
|---|---|---|---|---|---|---|
| D1 | **Fire & smoke** | 2 | A | EV-138 ("SMOKE & FIRE DETECTION") | None | Time from first frame to alert; locations with repeat events; after-hours events |
| D2 | **PPE**: helmet, safety vest | 2 | A | EV-134 | Presence | Compliance rate by zone, shift and contractor; repeat locations |
| D3 | **PPE, extended** (gloves, goggles, lab coats, hairnets) | 2 | B/D | EV-534 ("PPE") | Presence | As D2 — **confirm which items are trained** |
| D4 | **Uniform compliance** (staff wearing the defined uniform) | 2 | B | EV-534 | Presence | Uniform compliance by team, shift and site |
| D5 | **Attendance: headcount mode** (people counted in a space at set times) | 2 | A/C | EV-138 ("SMART ATTENDANCE"), EV-534 | Presence | Occupancy and attendance curves per room or shift, without identifying anyone |
| D6 | **Attendance: identity mode** (named attendance) | 2 | A | EV-138, EV-535 | **Identity**: needs the face-recognition toggle | Named attendance registers; only where consent or a lawful basis exists |
| D7 | **Restricted-zone entry** | 2 | A | EV-134 | Presence | Breaches per zone per week; time-of-day pattern |
| D8 | **Falls & incidents** | 2 | A | EV-134 | Presence | Incident timeline; response time |
| D9 | **Unsafe work practices / workers in hazardous areas** | 2 | A | EV-134 | Presence | Exposure minutes per zone |
| D10 | **Intrusion after hours, perimeter breach, unauthorised access** | 2 | A | EV-537 | Presence | Hotspots by gate and hour |
| D11 | **Vehicle movement anomalies** | 2 | A | EV-537 | Presence (plates = identity) | Anomaly log; gate-traffic patterns |
| D12 | **Crowd density / heatmaps** | 2 | A | EV-138 ("CROWD HEATMAP ANALYSIS") | Presence | Peak-hour heatmaps; dwell by area |
| D13 | **Object & motion detection; scene change; cross-camera search** | 1+2 | A | EV-136 | Presence | Find-the-moment search across cameras |
| D14 | **Shelf compliance: product misplacement, gaps, wrong facing** | 2 | B | EV-533 ("analysing product missplacements") | None | Misplacement and gap rate by aisle and hour; restock tasks |
| D15 | **Person attributes** (clothing, helmet, vest colour) | 1+2 | A | EV-135 | Presence | Investigation search. **Gender is excluded** (DL-P07). |
| D16 | **Speech: transcription in 50+ languages, speaker diarization, translation** | 1 | A | EV-440, EV-442, EV-524 | Presence (voices) | Topic and keyword frequency; key moments |
| D17 | **On-screen text and documents (OCR)** | 1 | A | EV-442, EV-136 | None | Search signage, slides and documents in video |
| D18 | **Licence plates** | 1+2 | A | EV-136 | **Identity** | Governed search only. Not in public demos. |
| D19 | **Face recognition / face search / person clips** | 1+2 | A | EV-440, EV-442 | **Identity** | **Toggle, off by default** (§6) |
| D20 | Spills, abandoned objects, fights/violence, weapons | 2 | **D** | none | — | **Do not publish** until confirmed |

---

## 4. The insight layer: from detection to decision

**How it works (use this sequence in diagrams and copy):**

1. **Detect.** A camera or recording produces an event: what, where (camera/zone), when, and a confidence that stays inside the UI.
2. **Store.** Events land in an index alongside the video. The same store serves search (pillar 1) and analytics (pillar 2).
3. **Aggregate.** Rules turn events into measures: rates, counts, durations, curves and heatmaps by zone, shift, site or day.
4. **Act.** Alerts go to the right team; incidents are acknowledged and closed; evidence packages are exported with access control.
5. **Learn.** Dashboards and scheduled reports show trends. *Repeated* hotspots become process or staffing changes.

**Insight types:**

| Insight type | Built from | Example question it answers (sample wording) |
|---|---|---|
| **Compliance rate** | D2, D3, D4 | "Which zone or shift has the lowest PPE or uniform compliance this month?" |
| **Occupancy / attendance curve** | D5 (D6 if enabled) | "How full are lecture halls at 8 a.m. versus 2 p.m.?" |
| **Heatmap & dwell** | D12, D13 | "Which aisles draw visitors but have empty shelves?" |
| **Incident timeline & hotspots** | D1, D7, D8, D10, D11 | "Where do after-hours intrusions cluster, and at what time?" |
| **Response time** | Any alert + acknowledgement | "How long from alert to acknowledgement, by site?" (measured per deployment) |
| **Shelf availability** | D14 | "Which products are most often misplaced or missing, and when?" |
| **Archive intelligence** | D16, D17, D13 | "Where in 3 years of recordings was this topic discussed, and by whom?" |

**Honesty rules (from `modern-ai-company`, DD-08):**
- Every number on the website is **labelled sample** unless it was measured in a named deployment and registered.
- **No accuracy percentages** (EV-447).
- **No live-looking counters.**
- Dashboards in demos use one consistent synthetic dataset where the numbers add up.

---

## 5. Use-case catalogue by vertical

**Legend:**
- **Pillar:** 1 = indexing, 2 = live analytics.
- **Tier:** as in §2.
- **Privacy:** N = none, P = presence, **ID** = identity (toggle).

The four owner-named verticals come first.

### 5.1 Universities and campuses *(owner-named)*

**Who uses it:** campus security, facilities, academic affairs, libraries, labs, events.

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| **Searchable lecture archive**: find any topic, phrase or slide across recorded lectures, in 50+ languages | D16, D17, D13 | Searchable index; key moments; topic frequency per course | 1 | A | P |
| **Lecture-hall attendance (headcount)** | D5 | Attendance curves per hall, course and time slot; under-used rooms | 2 | A/C | P |
| **Named attendance** (where policy allows) | D6 | Registers per session | 2 | A | **ID** |
| **Lab safety**: PPE in labs, restricted chemical stores | D3, D7 | Lab compliance rate; zone breaches | 2 | B/C | P |
| **Fire & smoke** in labs, dorms, kitchens, server rooms | D1 | Alerts; repeat-location report | 2 | A | N |
| **After-hours access** to labs, server rooms, sports facilities | D10 | Intrusion log by building and hour | 2 | A | P |
| **Event crowd management** (graduation, open days) | D12 | Peak density by entrance; egress timing | 2 | A/C | P |
| **Space utilisation** (libraries, study areas, cafeterias) | D5, D12 | Occupancy by hour → opening hours and staffing | 2 | C | P |
| **Campus security staff uniform** | D4 | Uniform compliance per shift | 2 | B | P |
| **Parking and vehicle anomalies** | D11 | Gate-traffic pattern; anomaly log | 2 | A/C | P (plates ID) |
| **Incident investigation** across campus cameras | D13, D15 | Evidence package with timeline | 1+2 | A | P |

**Demo storyboard (yisbir.com · universities):**
1. A search box: "renewable energy" across the "Semester archive (sample)" → transcript hits in three lectures.
2. A switch to the analytics tab: "Hall B occupancy, Week 6 (sample)" curve, with a note "Headcount mode — no one is identified".
3. A lab-safety card: "Goggles not detected · Chem Lab 2 · 10:42" → acknowledged.

**Sensitive point:** exam-hall monitoring is **not** proposed; it reads as student surveillance. Revisit only if a client requests it, with legal review.

### 5.2 Police and public safety *(owner-named)*

**Who uses it:** investigation units, control rooms, evidence management, event-security planners.

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| **Evidence video indexing**: CCTV exports, body-worn and dash-cam footage, interview recordings | D13, D16, D17 | One searchable evidence index | 1 | A | P |
| **Interview transcription & translation** in 50+ languages with speaker labels | D16 | Searchable transcripts; key moments | 1 | A | P |
| **Cross-camera search** by clothing colour, vehicle type or colour, place and time | D13, D15, D11 | A timeline across cameras | 1+2 | A | P |
| **Evidence packages**: compile clips, transcripts and notes; secure download with access control | export, access control | Case package with audit trail | 1 | A (EV-442, EV-524) | P |
| **Event and crowd safety** (parades, matches, national days) | D12 | Density by sector; flow at gates | 2 | A/C | P |
| **Fire & smoke** at stations and custody areas | D1 | Alerts; repeat locations | 2 | A | N |
| **Perimeter and restricted areas** at stations, depots, evidence stores | D7, D10 | Breach log | 2 | A | P |
| **Vehicle anomalies** at facility gates | D11 | Anomaly log; traffic pattern | 2 | A | P / **ID** (plates) |
| **Incident hotspot analysis** from camera events | aggregated events | Hotspot map by hour and day | 2 | C | P |
| **Officer PPE and uniform** in operations | D2–D4 | Compliance by unit and shift | 2 | B/C | P |
| **Person search** (face) | D19 | Matches *only* in authorised investigations | 1+2 | A | **ID**: toggle, governance (§6) |

**Wording rule:**
- Lead with **evidence handling and search**, not surveillance.
- Use: "Faster evidence review" · "Every search and export is logged".
- Avoid: "track anyone", "identify everyone", or crime-prediction language. D20 ("violence detection") is not published.

**Demo storyboard (yisbir.com · public safety):**
1. "Case 0417 (sample)": 6 sources imported (CCTV ×3, body-worn ×2, interview ×1).
2. Query "white van, Gate 3, 21:00–22:00" → two clips across two cameras.
3. Query the interview transcript for "keys" → the Arabic-to-English translated passage.
4. "Compile package" → an export with an access list and an audit-log line.

Rendered scenes and synthetic audio only. No real people.

### 5.3 Supermarkets and retail stores *(owner-named, includes product misplacement)*

**Who uses it:** store operations, merchandising, loss prevention, health and safety, regional managers.

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| **Product misplacement** (wrong shelf or facing; planogram drift) | D14 | Misplacement rate by aisle and hour; a task to the nearest staff member | 2 | **B** | N |
| **Empty-shelf / gap detection** | D14 | Gap rate by category and time; restock timing | 2 | B | N |
| **Promotion and display compliance** (end-caps, campaign displays present) | D14 | Compliance by store and week | 2 | B/C | N |
| **Footfall heatmaps & dwell** by aisle and zone | D12 | Hot and cold zones; heatmap vs shelf gaps ("busy aisle, empty shelf") | 2 | A/C | P |
| **Checkout queue length & wait** | D5 + zone rules | Queue length by lane and hour → open another till | 2 | C | P |
| **Staff uniform compliance** | D4 | Compliance by store and shift | 2 | B | P |
| **Back-of-house safety**: PPE in warehouse, cold rooms, loading bays | D2, D3, D7 | Compliance and zone-breach rates | 2 | A/B | P |
| **Fire & smoke** in storage and food prep | D1 | Alerts; repeat locations | 2 | A | N |
| **After-hours intrusion** and loading-bay vehicles | D10, D11 | Intrusion log; vehicle anomalies | 2 | A | P |
| **Loss-prevention review**: find the moment by time, place and clothing colour | D13, D15 | Evidence clip | 1+2 | A | P |
| **Store opening readiness** (lights on, displays set, staff in uniform at opening) | D4, D14 | Readiness checklist per store per morning | 2 | C | P/N |

**Rules:**
- No "suspicious customer" profiling.
- Loss prevention is presented as **finding a moment after an incident**, not watching shoppers.

**Demo storyboard (yisbir.com · retail):**
1. A rendered aisle: "Breakfast cereals · Aisle 7 (sample)". Two products outlined as *misplaced*, one gap as *empty*.
2. The insight panel: "Misplacements by hour (sample)" peaking 17:00–19:00, beside a footfall heatmap → "Busy aisle, empty shelf" callout.
3. A task card: "Restock Aisle 7 · assigned to Shift B" (sample).

### 5.4 Construction and infrastructure *(documented module)*

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| PPE compliance (helmets, vests) | D2 | Compliance by zone, shift, contractor | 2 | A | P |
| Restricted-zone entry; workers in hazardous areas | D7, D9 | Breaches; exposure minutes | 2 | A | P |
| Falls & incidents | D8 | Incident timeline; response time | 2 | A | P |
| Unsafe work practices | D9 | Trend by activity | 2 | A | P |
| Site security: after-hours intrusion, perimeter, theft of equipment and material | D10, D11 | Hotspots; anomaly log | 2 | A | P |
| Fire & smoke on site and in material stores | D1 | Alerts | 2 | A | N |
| Smart investigations across site cameras | D13, D15 | Evidence package | 1+2 | A | P |
| Worker headcount by zone / camp occupancy | D5 | Occupancy curves (no identity) | 2 | A/C | P |

### 5.5 Warehouses, logistics and manufacturing

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| PPE and uniform on the floor | D2–D4 | Compliance by line and shift | 2 | A/B | P |
| Forklift and pedestrian zones; restricted areas | D7, D13 | Zone breaches by aisle and hour | 2 | A/C | P |
| Fire & smoke in racks and battery-charging areas | D1 | Alerts; repeat locations | 2 | A | N |
| Loading-dock vehicle movement anomalies | D11 | Dock utilisation and anomalies | 2 | A/C | P |
| Line occupancy and staffing (headcount) | D5 | Staffing vs plan by hour | 2 | C | P |
| Incident review across cameras | D13, D15 | Evidence clip | 1+2 | A | P |

### 5.6 Healthcare and hospitals

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Falls in corridors and public areas (not patient rooms) | D8 | Incident timeline; response time | 2 | A | P |
| Restricted areas (pharmacy stores, labs, server rooms) | D7, D10 | Breach log | 2 | A | P |
| Staff PPE and uniform in defined zones | D3, D4 | Compliance by ward and shift | 2 | B | P |
| Fire & smoke | D1 | Alerts | 2 | A | N |
| Waiting-area occupancy | D5, D12 | Occupancy by hour → staffing | 2 | C | P |
| Training and meeting recording archive | D16, D17 | Searchable knowledge | 1 | A | P |

**Note:** clinical areas and patient rooms are excluded from proposed use cases (health-data sensitivity).

### 5.7 Schools

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Classroom headcount at registration time | D5 | Attendance curves (no identity) | 2 | A/C | P |
| Named attendance (if policy allows) | D6 | Registers | 2 | A | **ID** |
| Gate safety at pick-up and drop-off (crowding, vehicles) | D12, D11 | Peak times; congestion | 2 | C | P |
| Fire & smoke | D1 | Alerts | 2 | A | N |
| After-hours intrusion | D10 | Intrusion log | 2 | A | P |

**Note:** minors are present, so recommend identity mode **off**. Any identity use needs parental consent and legal review.

### 5.8 Government entities and customer-service centres

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Service-centre occupancy and waiting | D5, D12 | Waiting load by hour and branch | 2 | C | P |
| Staff uniform at counters | D4 | Compliance by branch | 2 | B | P |
| Meeting, committee and media archive search | D16, D17 | Searchable archive; topic frequency | 1 | A | P |
| Restricted areas and after-hours access | D7, D10 | Breach log | 2 | A | P |
| Fire & smoke | D1 | Alerts | 2 | A | N |

### 5.9 Banking and branches

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Branch queue and waiting time | D5 + zones | Queue by hour → staffing | 2 | C | P |
| After-hours intrusion; ATM-area vehicle anomalies | D10, D11 | Incident log | 2 | A | P |
| Restricted areas (vault, cash rooms) | D7 | Breach log | 2 | A | P |
| Staff uniform | D4 | Compliance | 2 | B | P |
| Incident review | D13, D15 | Evidence package | 1+2 | A | P |

### 5.10 Hospitality, malls and leisure

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Footfall and dwell heatmaps (mall corridors, lobbies) | D12 | Peak flows; tenant-zone dwell | 2 | A/C | P |
| Staff uniform and grooming standards | D4 | Compliance by outlet | 2 | B | P |
| Kitchen PPE (hairnets, gloves) and fire & smoke | D3, D1 | Compliance; alerts | 2 | B/A | P/N |
| Restricted back-of-house areas | D7 | Breach log | 2 | A | P |
| Pool and beach occupancy | D5 | Occupancy curves | 2 | C | P |

### 5.11 Transport hubs (airports, metro, bus stations)

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Crowd density on platforms and concourses | D12 | Density by hour; crowd-control triggers | 2 | A/C | P |
| Restricted-zone entry (tracks, airside, depots) | D7 | Breach log | 2 | A | P |
| Staff uniform and PPE (ground crew) | D2–D4 | Compliance | 2 | A/B | P |
| Fire & smoke | D1 | Alerts | 2 | A | N |
| Incident review across many cameras | D13, D15 | Evidence package | 1+2 | A | P |

### 5.12 Events, stadiums and venues

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Gate crowding and egress | D12 | Flow by gate; egress time | 2 | A/C | P |
| Restricted zones (pitch, backstage) | D7 | Breach log | 2 | A | P |
| Steward uniform and positions | D4, D5 | Coverage by sector | 2 | B/C | P |
| Fire & smoke (pyrotechnics vs fire must be confirmed) | D1 | Alerts | 2 | A | N |
| Broadcast and media archive search | D16, D17 | Searchable highlights | 1 | A | P |

### 5.13 Energy, oil & gas and utilities

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| PPE (helmets, vests; extended items to confirm) | D2, D3 | Compliance by site | 2 | A/B | P |
| Restricted and hazardous zones | D7, D9 | Exposure minutes | 2 | A | P |
| Fire & smoke | D1 | Alerts; time-to-alert | 2 | A | N |
| Perimeter breaches at remote sites | D10 | Breach log by site and hour | 2 | A | P |
| Vehicle anomalies at site gates | D11 | Anomaly log | 2 | A | P |

### 5.14 Smart cities and municipalities

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Public-space crowd heatmaps (parks, souqs, events) | D12 | Usage by hour and season → maintenance and staffing | 2 | A/C | P |
| Vehicle movement anomalies in restricted streets | D11 | Anomaly log | 2 | A | P |
| Fire & smoke in public buildings | D1 | Alerts | 2 | A | N |
| Council and media archive search | D16, D17 | Searchable archive | 1 | A | P |

### 5.15 Media, broadcast and archives (pillar 1 showcase)

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Archive indexing: decades of footage searchable by speech, text, objects and scenes | D13, D16, D17 | A searchable library; cited AI answers | 1 | A | P |
| Multilingual transcription & translation for subtitling and research | D16 | Transcripts; translations | 1 | A | P |
| Highlights and key-moment extraction | D13, D16 | Clip lists | 1 | A (EV-524 "key moments") | P |
| Compare two recordings | — | Comparison view | 1 | A (EV-524) | P |
| Rights-safe export packages | export, access control | Packages with audit | 1 | A | P |

### 5.16 Corporate offices and facilities

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Meeting-room and floor occupancy (headcount) | D5 | Utilisation → space planning | 2 | C | P |
| Reception and security staff uniform | D4 | Compliance | 2 | B | P |
| After-hours access; server rooms | D10, D7 | Intrusion log | 2 | A | P |
| Fire & smoke | D1 | Alerts | 2 | A | N |
| Town-hall and training recording search | D16, D17 | Searchable archive | 1 | A | P |

### 5.17 Residential communities and property management

| Use case | Detections | Insight / output | Pillar | Tier | Privacy |
|---|---|---|---|---|---|
| Perimeter and after-hours intrusion | D10 | Hotspots by gate | 2 | A | P |
| Gate vehicle anomalies | D11 | Anomaly log | 2 | A | P / ID (plates) |
| Fire & smoke in car parks and plant rooms | D1 | Alerts | 2 | A | N |
| Amenity occupancy (gyms, pools) | D5 | Usage curves | 2 | C | P |
| Guard uniform and patrol coverage | D4 | Compliance | 2 | B | P |

**Note:** Wasel handles gate access; Yisbir handles camera analytics. They are presented side by side, with **no integration claim** (DL-P06).

---

## 6. Face recognition: toggle policy and wording

**The owner's decision:** a toggleable feature [EV-535]. **The website's focus:** every other detection, plus insights [EV-534].

| Rule | Detail |
|---|---|
| Default framing | "Face recognition is an **optional module**, switched on per deployment by the customer, under their own legal basis." |
| Controls to state | Role-based access; every face search logged in the audit trail; can be switched off entirely. Retention settings are **to be confirmed** by the product owner before stating them. |
| Where it appears | One line in the yisbir.com "Governance & deployment" section and in the feature list. **Never** in heroes, demos, posters or the meerana.ae chapter. |
| Demos | Non-identifying figures only. Identity mode (D6), person clips and plates are shown as *toggles in a settings screenshot*, never as results on real people. |
| Excluded entirely | Gender-attribute search; emotion detection; "watch-list" language; crime prediction |
| Legal | UAE PDPL treats biometric data as sensitive. Police and government use requires the customer's lawful authority. Wording is reviewed by legal before launch (DL-T06). |

**Approved-style wording (proposed):**
> "Face recognition is available as an optional module. It stays off unless your organisation switches it on, access is role-based, and every search is recorded in the audit log."

---

## 7. How this appears on the two sites

**yisbir.com** (the product site, DD-11):

| Page | Content |
|---|---|
| Home | Y2 "Search hours of video like a document" hero (pillar 1) + pillar 2 "Live camera analytics" band + insight band + vertical chips |
| `/live-analytics` | Y1 camera-chrome chapter: fire, PPE, uniform, attendance (headcount), zones, intrusion. One insight dashboard per detection family (sample data). |
| `/use-cases` | Hub with filters by vertical (§5) and by detection (§3). Vertical pages for **Universities, Public safety, Retail, Construction**; the other verticals as compact cards. |
| `/insights` | How detections become dashboards and reports (§4), with one end-to-end sample |
| `/governance` | Deployment (on-prem, cloud, hybrid; existing cameras), the face-recognition toggle (§6), access control, audit |
| Demo request | Interest pre-filled by vertical |

**meerana.ae** (Yisbir chapter H5 + `/products/yisbir`):
- **Chapter beat A:** "Your cameras record everything. Yisbir turns it into answers."
- **Beat B:** two pillars in one line each.
- **Interface moment:** a search result, then a PPE-compliance mini-chart (sample).
- Vertical chips (Universities · Public safety · Retail · Construction · more) link to yisbir.com use-case pages.

**Vertical page template (yisbir.com):**
1. Problem (one sentence, sector language).
2. Detections used (chips from §3, each with tier A/B).
3. Sample insight dashboard (one chart + one table, labelled sample).
4. Workflow (alert → acknowledge → report).
5. Governance note.
6. CTA "Request a [sector] demo".

## 8. To confirm with the product owner (per detection, not per page)

1. **Model readiness today:** uniform (D4), shelf / misplacement (D14), extended PPE items (D3), headcount attendance (D5), queue rules. Which run in production, and which need per-site configuration or training?
2. **"Smart attendance":** does the product support a headcount mode without face recognition? If not, attendance appears only as identity mode, behind the toggle.
3. **Face-recognition data retention and audit settings:** the exact wording for §6.
4. **Fire vs pyrotechnics, steam, dust:** what the fire/smoke model is tuned for (venues, kitchens).
5. **Demo environment:** a YISBIR-branded instance (DV-02) with cleared, synthetic or rendered media (DV-04). The current indexing demo shows "MediaVault" and real archival photos (B2, B3).
6. **Any measured figures** (alert latency, compliance improvements) from a named deployment we may cite. Until then, none.
