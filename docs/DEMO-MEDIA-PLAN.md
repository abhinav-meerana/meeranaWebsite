# Demo media plan: product recordings → loops, films and screenshots

**Date:** 2026-10-05
**Inputs:** the four recordings supplied in `Desktop\demo_video`:
- `demoAgenticAi.mov`
- `nazo.mp4`
- `tashree_demo_v4.mp4`
- `Vide4oIndexingDemo_ready.mp4`

**Status:** analysis complete. A review set is rendered: 12 screenshots and 4 loops. **Nothing is cleared for publication yet.** Section 3 lists what blocks publication; section 10 lists the decisions needed.

**Method:**
- The video was read frame by frame through timecoded contact sheets (`demo-media/sheets/`), with full-resolution checks at key frames.
- The Tasree3 voiceover was transcribed with Whisper (Appendix B). The other three recordings are silent: digital silence at −91 dB.
- Every candidate segment in this plan was checked at full resolution for real organisations, real people, private data and product bugs.

---

## 1. Summary

The plan has had **no real product footage** until now:
- DL-A01 asked Meerana for recordings.
- DL-A03 bans the AI-generated videos on the live site.
- `plan/10` §8 therefore said "v1 uses no existing product videos".

These four recordings are **real interfaces**, so they can replace the illustrative UI that `plan/10` planned as a stopgap. That is the "reconstructed" provenance step and backlog item L-02. But **every recording has at least one blocker** before it can go public.

| Product | Recording | What it shows | Verdict | Blockers (§3) |
|---|---|---|---|---|
| **AI in a Box** (the user's "Agentic AI"; working name, DV-01) | `demoAgenticAi.mov` · 4:16 · 1080p30 · silent · DaVinci Resolve export | "Meerana OS v2.7.4": an executive assistant ("Aria") reviews contracts, schedules, drafts letters, approves spend, writes a report, takes voice commands, runs five agents, and switches EN/DE/AR | **Use clean segments now** (once the name is decided). **Re-record** the beats that use "Ministry of Finance" data | B5, B6, B12, B15 |
| **Nazo** | `nazo.mp4` · 6:26 · 1080p60 · silent · Screen-Studio-style framing | "NAZO AI — Correspondence management": AI drafting and templates, decision panel with initials, document history, workflow builder, Arabic letters, signature profile | **Re-record on a neutral demo tenant.** The AI-drafting loop is usable now | **B1**, B11 |
| **Tasree3** | `tashree_demo_v4.mp4` · 1:52 · 1080p30 · voiceover and music | The finished 13-beat product film (AI text→BPMN, governance, mining, conformance, enterprise) | **Fix, then use.** Re-voice it, because the narration says "Tashree", and trim two beats. Loops need calm re-records | **B7**, B8, B9, B10, B15 |
| **YISBIR** media indexing | `Vide4oIndexingDemo_ready.mp4` · 3:43 · 1080p30 · silent | Natural-language search with a cited AI answer, transcripts in many languages, people and keyword layers, compare, export package, dashboard | **Re-record before any use.** The sample library is real archival photos of identifiable people, and the UI says "MediaVault" | **B2**, **B3**, B4, B14 |

**Usable today:** `docs/demo-media/` holds 12 screenshots and 4 loops (Appendix A). They were checked frame by frame and are clean of the blockers. Two caveats:
- Only the **Tasree3** screenshots are publishable today.
- The AI in a Box and Nazo items show product names that are still undecided (DV-01, DV-03).

**What unblocks everything:**
1. **Three naming decisions:** AI in a Box versus "Meerana OS"; YISBIR versus "MediaVault"; and "NAZO AI".
2. **One demo-data policy:** fictional organisations, people and media only (DV-04).
3. **A re-voice of the Tasree3 film.**

---

## 2. The recordings, scene by scene

Times are source `m:ss`. Status values:
- **clean:** verified usable;
- **blocked:** see §3;
- **review:** usable only after a judgement call.

Full contact sheets are in [demo-media/sheets/](demo-media/sheets/).

### 2.1 AI in a Box: `demoAgenticAi.mov`

**On-screen identity:**
- "MEERANA — AI in a Box. Sovereignty in Your Hands" (sidebar and footer);
- "Meerana OS v2.7.4" (header);
- assistant persona "Aria";
- language switch EN/AR/DE;
- user "Exec. Director, Executive Office (Admin · L5)".

**Layout:** UI 1920×912, letterboxed at y=84.

This substantiates the CEO's announcement (EV-460): *"reviewing contracts, orchestrating AI agents, automating workflows, generating executive reports"*. It is a **working demo** of what EV-160 recorded as "announced concept only".

| # | Time | Screen | Shows | Status |
|---|---|---|---|---|
| 1 | 0:02–0:15 | Assistant home | "Good evening. How can I assist?"; upload, voice, select agent; Context & Intelligence panel (files, cited clauses, agent execution trail) | clean |
| 2 | 0:15–0:38 | Daily briefing | Top priorities, including "Respond to the Ministry of Finance"; risk alert; scheduling begins | blocked (B5) |
| 3 | 0:39–0:48 | Scheduling + conflict check | Invite sent; Thursday overlap found and moved | clean |
| 4 | 0:48–1:02 | Contract review | Vendor agreement: liability cap "below the sovereign-procurement minimum"; data-residency clause, "mandate in-country processing"; fixes saved to the file | **clean: the strongest beat** |
| 5 | 1:03–1:21 | Inbox → formal letter | Triage of three emails; drafts and sends "Your Excellency…" to the Ministry of Finance | blocked (B5) |
| 6 | 1:21–1:40 | Proactive approval | Purchase request (AED 1,240,000) → reject with a note | review: the MoF letter is still in view above |
| 7 | 1:42–2:01 | Report | "Generate the Q3 executive report" → steps → a Meerana-branded PDF | blocked: the PDF lists the MoF priority; a localhost URL shows at 1:51 (B12) |
| 8 | 2:03–2:11 | Voice mode | Orb; "What is the status of the vendor contract?" | clean |
| 9 | 2:11–2:20 | Voice approval | "Approve the Ministry of Finance request" | blocked (B5) |
| 10 | 2:21–2:24 | Multi-agent brief | "National AI Policy — Q3 2026 Updates" | review (B12) |
| 11 | 2:24–2:52 | Analytics | Tasks, email summary (MoF), charts, task board | blocked (B5) |
| 12 | 2:54–3:07 | Executive dashboard | Approval queue; "Draft Official Ministerial Letter" | review (B12) |
| 13 | 3:09–3:19 | Agent Matrix | Legal, Finance, Research, HR and IT Security agents with live activity | clean |
| 14 | 3:21–3:28 | Knowledge Hub | Sources and documents, including "Ministerial Correspondence — MoF Q3" | blocked (B5) |
| 15 | 3:30–3:37 | Governance | Actions, approvals, reviews, flagged issue; roles and permissions | clean |
| 16 | 3:39–3:49 | Integrations | SharePoint, Oracle ERP Cloud, SAP S/4HANA, Salesforce, SMTP, Azure AD, vector store, secure file drop | clean, pending confirmation (B15) |
| 17 | 3:51–4:16 | Languages | EN → DE → AR with a mirrored RTL layout | clean |

### 2.2 Nazo: `nazo.mp4`

**On-screen identity:**
- "NAZO AI — Correspondence management", with an "N" mark;
- fictional personas, for example "Noura Al Suwaidi, Commercial Registry Officer" and "Layla Al Marri, System Administrator".

**Framing:** a Screen-Studio-style frame, the app window on a red desert wallpaper with smooth zoom-ins.

This confirms EV-141/142: correspondence initiation with AI assistance, templates, workflow, signature authority and e-signatures. It goes further with an **AI template generator** ("prompt → draft → typed variables → suggested workflow"), **template matching**, **AI summary**, **AI-suggested comments** and **EN↔AR letters**.

| # | Time | Screen | Shows | Status |
|---|---|---|---|---|
| 1 | 0:00–0:32 | My Workspace | KPIs; correspondence cards (approval, circular, announcement); statuses; card and table views; AI assistant panel | review: card titles reference real programmes and the ministry context |
| 2 | 0:36–0:44 | Arabic workspace | Full RTL interface | review (same data) |
| 3 | 0:48 | Notifications | "Awaiting your action" items | review |
| 4 | 0:52–1:38 | Decision panel | MoET letterhead letter; AI Summary; Review / Return / Redirect; AI-suggested comment; apply initials; document history | **blocked (B1)** |
| 5 | 1:40–2:15 | AI Template Generator | Prompt → Generate → "Drafting your document…"; template library (EN and AR) | **clean** |
| 6 | 2:16–3:20 | Draft editor | Dynamic and manual modes, field chips, suggested workflow, signature blocks, MoET letterhead | blocked (B1) |
| 7 | 3:24–3:58 | Workflow builder | Step chain; assignment by role or user; actions; step type; "regenerate on sign" | review: persona and department names |
| 8 | 4:00–4:44 | New correspondence | Describe the request → suggest template → match → fields → approval route | blocked (B1) |
| 9 | 4:48–5:18 | Arabic letter → approval | RTL official letter; translate; AI summary; history | blocked (B1) |
| 10 | 5:20–5:58 | My Profile | Draw or upload signature; initials; access permissions | clean |
| 11 | 6:00–6:18 | Activity log | Event list; **black rectangle glitch at 6:12** | review (B11) |

### 2.3 Tasree3: `tashree_demo_v4.mp4`

This is the finished film from the earlier session. The source recording is `tashree.mov`; the script, analysis and build log sit next to it in `demo_video/`.

Its look is browser chrome on a Windows wallpaper, with push-ins, motion blur and 0.5 s crossfades. **That makes it unsuitable as a source for loops**, since nearly every second is in motion. The settled frames do make good screenshots.

| Time | Beat | Status |
|---|---|---|
| 0:00–0:05 | Title card "TASREE3 — Intelligent Business Process Management" | VO (B7) |
| 0:05–0:20 | Catalogue → Command Center | B7, B10 |
| 0:20–0:31 | **AI text → BPMN** (Command Center prompt → diagram → Add to canvas) | B10; the screenshot at 0:28 is clean |
| 0:31–0:39 | Editor | B10 |
| 0:39–0:50 | Submit for approval → final approver | Fictional demo email shown (OK) |
| 0:50–0:57 | Process Dependency Matrix | — |
| 0:57–1:12 | Process mining + AI insights | **B8 at 1:09** |
| 1:12–1:20 | AI analyst chat | **B9** |
| 1:20–1:29 | Conformance Center | — |
| 1:29–1:42 | Users, SSO, AI settings, Integration Studio | B15 |
| 1:42–1:47 | Command Center | — |
| 1:47–1:52 | End card "TASREE3 — Design · Govern · Improve — tasree3.ae" | VO (B7) |

### 2.4 YISBIR media indexing: `Vide4oIndexingDemo_ready.mp4`

**On-screen identity:**
- the login reads "Meerana Technologies — *Index everything. Find anything.*";
- the app header reads **"MediaVault · ADMIN"**;
- exports download as `mediavault-report.zip`.

**Layout:** UI 1920×912, letterboxed. The file is encoded at 589 kb/s, so small text is soft. This also argues for a re-record.

The demo confirms EV-440/442:
- search across video, audio and documents;
- transcription and translation into many languages;
- keywords, key moments, people, objects and events;
- export and share.

It adds a **natural-language answer with cited sources**, **side-by-side compare** and **"Compile package"** export.

| # | Time | Screen | Status |
|---|---|---|---|
| 1 | 0:00–0:04 | Login | clean (low value) |
| 2 | 0:05–0:14 | Search home and stats (1,543,872 files, 412 TB…) | blocked: the mini-player with the archival photo (B2), "MediaVault" (B3) |
| 3 | 0:15–0:34 | "approved ICT budget last quarter" → cited AI answer → results; document viewer | blocked (B2, B4) |
| 4 | 0:35–1:34 | Player + transcript, summary, keywords, key moments, people, objects, events; EN→DE→AR translation | blocked (B2) |
| 5 | 1:36–2:09 | "every appearance of Director Ahmad" → results → compare | blocked (B2, B14) |
| 6 | 2:12–2:27 | German and Arabic interface | blocked (same data) |
| 7 | 2:30–2:50 | Dashboard (hours indexed, index time, queries, entities, pipeline health including face recognition) | blocked (B2, B14) |
| 8 | 2:51–3:04 | Library grid | blocked (B2) |
| 9 | 3:05–3:19 | Upload / import from URL | blocked (B2, mini-player) |
| 10 | 3:20–3:43 | Select → Compile package → download | blocked (B2, B3) |

---

## 3. Blockers: fix these before anything is public

| ID | Recording | Issue | Where | Kind | Fix |
|---|---|---|---|---|---|
| **B1** | Nazo | Every letter uses a **real federal ministry's identity**: "United Arab Emirates — Ministry of Economy & Tourism", `www.moet.gov.ae`, MoET reference numbers, a P.O. box and phone number, and citations of UAE federal decree-laws (at least one real: No. 36 of 2021 on Trademarks). Arabic versions too. A card is titled after a real federal programme ("National SME Programme") | 0:52–5:18 | Legal / reputational | Re-record on a **neutral demo tenant** (DV-04): a fictional authority and letterhead, fictional laws and programmes. Or obtain MoET's written approval, which would make it a client reference with its own sign-off |
| **B2** | YISBIR indexing | The sample library uses what appear to be **real archival news photographs of identifiable people**, including a government press briefing and a hearing room. They are relabelled with invented titles, and people search ties "Director Ahmad" and the "Minister of Finance" to them. The mini-player keeps one in almost every frame | 0:05–3:43 | Legal (likeness, misattribution), DL-P07 | Replace all sample media with **cleared footage**: Meerana-shot material with signed releases, or licensed stock with model releases. Re-record |
| **B3** | YISBIR indexing | The UI is branded **"MediaVault"**, not YISBIR | Header throughout; export file name | Brand | Re-skin the demo instance before recording (DV-02) |
| B4 | YISBIR indexing | A fake "Ministry of Finance — Consolidated Budget Report — OFFICIAL" | 0:24–0:34 | Legal / reputational | Fictional entity (DV-04) |
| B5 | AI in a Box | Sample data names the **"Ministry of Finance"**: letters ("Your Excellency"), approvals, the report, knowledge hub and analytics | 0:15–0:38, 1:03–1:21, 1:42–2:01, 2:11–2:20, 2:24–2:52, 3:21–3:28 | Legal / reputational (same class as EV-145) | Swap in a fictional ministry and re-record those beats only. The clean beats stay |
| B6 | AI in a Box | Product name: the UI says "AI in a Box" and "Meerana OS". The register flags a **name collision** (other vendors use "AI in a Box", EV-160) | Throughout | Brand | Decide the name before publishing any of its media (DV-01) |
| **B7** | Tasree3 | The voiceover says **"Tashree"** six times. Arabic speakers hear تشريع ("legislation"); the product is تسريع, "acceleration" (EV-415) | 0:13, 0:23, 0:45, 1:05, 1:19, 1:46 | Brand | Fix the script and re-voice (v5). Captions say "Tasree3". Confirm the spoken form (DV-07) |
| B8 | Tasree3 | The AI Insights panel shows a **raw JSON array** under "Suggestions" | 1:09 (source raw ≈ 61 s) | Product bug | Trim the beat now; fix in the product before any re-record |
| B9 | Tasree3 | Analyst chat: "Is it 0.1 Hrs?" → "Yes… approximately 0.065 hours", which contradicts itself | 1:12–1:20 | Credibility | Replace with a clearer Q&A in the re-record. For v5, cut or cover with the VO only |
| B10 | Tasree3 | Browser chrome ("Ask Gemini", "Action required" badges), the Windows wallpaper, and tilt/blur zooms | Throughout | Quality / brand | Crop for screenshots. Re-record the hero beats in a clean profile without auto-zoom (§8) |
| B11 | Nazo | A black rectangle covers the activity log | 6:12 | Quality | Skip that range or re-record |
| B12 | AI in a Box | A localhost URL in the status bar at 1:51. "National AI Policy — Q3 2026" content reads as real government policy. "Ministerial" wording throughout | 1:51, 2:21, 2:54–3:07 | Accuracy / reputational | Neutral topic and wording in the re-record. Crop the status bar |
| B14 | YISBIR indexing | Person search and a "face recognition" pipeline row are demonstrated | 1:36–2:09, 2:30–2:50 | DL-P07 (open) | Leave people and face features out until DL-P07 is decided |
| B15 | Tasree3, AI in a Box | Third-party product names (SAP, Oracle, Salesforce, Microsoft…) as integrations. EV-409 records Tasree3's own site contradicting itself on connector maturity | Integration screens; Tasree3 VO "connectors for SAP" | Accuracy / trademarks | Show only integrations Meerana confirms as production-ready (DV-08). Nominative use only, no third-party logos as decoration |

**Not blockers, but rules:**
- Every on-screen number (1.5 M files, 412 TB, AED amounts, KPIs) is sample data. All media carries the label **"Real interface · sample data"** (§5).
- The demo emails use fictional domains (`electricwater.demo`). That's acceptable.

---

## 4. Where the media goes

**Principles:**
- **The product is the hero.** Real UI over illustration (DESIGN-DIRECTIONS P4).
- **One moving thing per viewport.** A loop never competes with a page's signature motion (`web-animations`).
- **Video is never the LCP element.** The poster and the H1 load first.
- **Media carries a provenance label.** Every screenshot or loop is labelled "Real interface · sample data", and anything that isn't a capture is labelled "Illustrative".

| Surface | Section | Asset | Source | Ready |
|---|---|---|---|---|
| meerana.ae home (M1/M2) | Product catalogue rows | One screenshot per product (WebP/AVIF), with a "Watch" link to the product page | Review set (Tasree3, AI in a Box, Nazo); YISBIR after re-record | Tasree3 now; others after DV-01/03 |
| meerana.ae home | Sovereign-AI moment *(new, if AI in a Box is included)* | Loop: **contract review**, where the clause fixes enforce in-country processing | `aibox-loop-contract-review` | After DV-01 |
| meerana.ae home (M1) | The lattice | Option: AI in a Box as the lattice's **core cell**, the sovereign layer under the five products | Design follow-up | — |
| /products/tasree3 (and tasree3.ae) | Hero | Loop: describe → diagram (≤ 12 s) | **Re-record** (v4 has no clean loop span) | Phase 2 |
| /products/tasree3 | Feature rows ×4 (Govern · Mine · Audit · Enterprise) | Screenshots now; 10–20 s feature clips later | v4 settled frames; re-records | Screenshots now |
| /products/tasree3 | "Watch the 2-minute tour" | **Film v5** (re-voiced v4), click to play, EN captions (AR in phase 2), chapters and transcript | v4 + new VO | Phase 1 |
| /products/ai-in-a-box *(name per DV-01)* | Hero | Loop: contract review (13.5 s) | Review set | After DV-01 |
| same | Feature rows | Agents (Agent Matrix loop), Voice (screenshot 04), Governance (screenshot 06), Languages (loop), Integrations (screenshot 07, after DV-08) | Review set | After DV-01 |
| same | Film | 90–120 s film after the data-swap re-record | Phase 2 | — |
| /products/nazo | Hero | Loop: AI drafting (10 s) | Review set | After DV-03 |
| same | Feature rows | AI templates, decision panel, workflow builder, bilingual letters, signatures | Neutral-tenant re-record | Phase 2 |
| yisbir.com (Y2) | Hero | **Keep the interactive sample index.** It's faster and accessible, and its sample data is honest | Y2 prototype | Now |
| yisbir.com | "See it on real footage" | 3 clips: cited answer; transcript + translation; compare → compile package | Re-record (B2/B3) | Phase 2 |
| yisbir.com / Y1 | Real-time site safety | Needs its **own** recording: this demo is indexing, not live detection (A4) | — | Ask (A4) |
| All pages | Open Graph / social cards | 1200×630 cards built from screenshots plus the wordmark (generated) | Review set | With the site build |

**What to lead with, per product:**
- **AI in a Box:** contract review. It shows agentic work and the sovereignty promise in one beat.
- **Tasree3:** "describe a process → get a BPMN diagram". This matches the previous analysis's top-ranked feature.
- **Nazo:** AI drafting from a sentence, then the bilingual letter.
- **YISBIR:** the cited answer. Search across video, audio and documents with sources is the headline (DL-P01: lead with search).

---

## 5. Formats and rules

| Format | Purpose | Length | Audio | Captions | Plays | Budget (measured) |
|---|---|---|---|---|---|---|
| **Loop** | Show one interaction | 6–15 s | None (no audio track) | None needed. A text description via `figcaption` or `aria-describedby` satisfies WCAG 1.2.1 | Autoplay **muted** only if motion is allowed, Save-Data is off and it's in view; a visible Pause control; poster otherwise | **≤ 1 MB** at 1280 px. Measured 0.2–0.74 MB (H.264), 0.17–0.56 MB (AV1) |
| **Feature clip** | Explain a feature | 15–45 s | None, or VO | HTML step captions synced to the clip | Click to play, or autoplay as a loop | ≤ 3 MB |
| **Film** | The product tour | 90–150 s | VO + music, −16 LUFS | **Closed captions (WebVTT) EN + AR**, chapters, transcript on the page | **Click to play only**, `preload="none"` | ≈ 10–15 MB at 1080p; costs nothing until played |
| **Screenshot** | Cards, feature rows, OG | — | — | `alt` describes the task shown, not the pixels | — | ≤ 120 KB (AVIF/WebP, `srcset`). Measured 17–111 KB (WebP at full resolution) |
| **Social cut** | LinkedIn / X | 15–45 s | VO or music | **Burned-in** captions (watched muted) | Platform | Platform |

**Proposed amendment to `plan/10` §8 (DV-05).** It currently says "≤ 60 s, burned-in captions, ≤ 6 MB per clip". Make it:
- loops ≤ 15 s and ≤ 1 MB;
- films ≤ 2:30, click to play only, with **closed** WebVTT captions in EN and AR.

Closed captions give one file in two languages, can be switched off and searched, and feed the transcript. Burned-in captions are for social cuts only.

**Provenance label:** "Real interface · sample data". In Arabic: «واجهة حقيقية · بيانات نموذجية» (نموذجية = sample/illustrative; avoid تجريبية, which reads as "trial/beta"). It goes on every loop, film and screenshot frame.

---

## 6. How to implement it on the site

### 6.1 Encoding

These settings were proven on the review set; see `demo-media/render.py`.

| Output | Settings |
|---|---|
| Loop, H.264 | Crop to the UI → 1280 px wide (lanczos) → 30 fps, `yuv420p`, no audio. x264 High, `-crf 24 -preset slow -g 60 -movflags +faststart`. `codecs="avc1.64001F"` |
| Loop, AV1 | Same chain. SVT-AV1 `-crf 38 -preset 6 -g 60`. `codecs="av01.0.05M.08"`. Serve first; H.264 is the fallback |
| Loop, 1920 px variant | Only for ≥ 1440 px layouts: AV1 CRF 36, H.264 CRF 23. Expect about 2× the size |
| Poster | The loop's first frame. WebP q80 (19–52 KB measured); AVIF in the production pipeline (`sharp`) |
| Film | 1080p and 720p H.264 (CRF 22/23), AAC 128 k, loudness −16 LUFS / −1.5 dBTP, `+faststart`. AV1 1080p optional |
| Screenshot | Exact frame → crop to the UI (no browser chrome or wallpaper) → AVIF + WebP at 1×/2× via `srcset` |

### 6.2 Components (Next.js + Tailwind v4 + shadcn/ui; additions to `ui-system`)

- **`MediaFrame`** (server component): a neutral frame with a hairline border, `radius-card` and the provenance label. **No fake window controls** (anti-generic G12).
- **`DemoLoop`** (client component): the loop behaviour.

```tsx
// components/media/DemoLoop.tsx (sketch)
'use client'
export function DemoLoop({ id, w, h, desc }: { id: string; w: number; h: number; desc: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)                              // an explicit Pause wins over autoplay
  const [paused, setPaused] = useState(true)                    // SSR and reduced motion: the poster
  useEffect(() => {
    const v = ref.current!, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const saveData = (navigator as any).connection?.saveData
    if (reduce || saveData) { userPaused.current = true; return } // the poster stays; Play is an explicit choice
    const io = new IntersectionObserver(([e]) => { e.isIntersecting && !userPaused.current ? v.play().catch(() => {}) : v.pause() }, { threshold: 0.5 })
    io.observe(v); return () => io.disconnect()
  }, [])
  const toggle = () => { const v = ref.current!; userPaused.current = !v.paused; v.paused ? v.play().catch(() => {}) : v.pause() }
  return (
    <MediaFrame>
      <video ref={ref} muted playsInline loop preload="none" width={w} height={h}
             poster={`/video/${id}.poster.avif`} aria-describedby={`${id}-d`}
             onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
        <source src={`/video/${id}.av1.mp4`} type='video/mp4; codecs="av01.0.05M.08"' />
        <source src={`/video/${id}.mp4`} type='video/mp4; codecs="avc1.64001F"' />
      </video>
      <p id={`${id}-d`} className="sr-only">{desc}</p>
      <MotionControl pressed={paused} onToggle={toggle} label="Pause video" />  {/* constant label, aria-pressed */}
    </MediaFrame>
  )
}
```

- **`DemoFilm`** (client component):
  - `<video controls preload="none" poster>` with tracks: `<track kind="captions" srclang="en" default>`, `<track kind="captions" srclang="ar">` and `<track kind="chapters">`.
  - **Chapter buttons** under the player that seek. Browsers barely surface native chapter UI.
  - A **Transcript** panel (`<details>`, RTL in Arabic). On yisbir.com the transcript is searchable, the product idea in miniature.
- **Screenshot:** `next/image` with AVIF/WebP, explicit dimensions, `sizes`, and `alt` that names the task ("Contract review flags two clauses and proposes fixes").

### 6.3 Accessibility (WCAG 2.2 AA)

| SC | Rule |
|---|---|
| 1.2.1 Video-only | Loops have a text description (`aria-describedby`) |
| 1.2.2 Captions | Films have captions in EN, and in AR once the AR VO or subtitles exist |
| 1.2.3 / 1.2.5 Audio description | Write the VO to narrate what matters on screen (integrated description); the on-page transcript also describes visual-only steps |
| 1.4.2 Audio control | Nothing plays sound automatically |
| 2.2.2 Pause, stop, hide | Every loop over 5 s has a visible Pause control (`data-motion-control`, constant label, `aria-pressed`) |
| 2.3.1 Three flashes | Check the transitions; no white-flash cuts between dark and light UIs |
| 2.1.1 / 2.4.7 | All player controls work by keyboard with visible focus. Chapter buttons are real `<button>`s |
| Reduced motion | No autoplay. The poster plus a Play button |

### 6.4 Performance

- **Hold the line on Core Web Vitals.** LCP stays the H1 or the poster; video is `preload="none"`.
- **Autoplay limits.** At most one loop autoplays per viewport and none above the fold on mobile.
- **Data saving.** Under Save-Data, nothing autoplays and the poster shows.
- **Page weight.** Autoplay-eligible media is ≤ 2 MB per page on desktop and 0 on mobile, where it's tap to play.
- **Caching.** Hashed file names with `Cache-Control: immutable`. Range requests for seeking (standard on CDNs).

### 6.5 Hosting (DV-06)

**Recommended: self-host progressive MP4** (AV1 + H.264) from the site's own CDN, with no third-party player or tracker.
- **Why:** it is simplest and matches the "sovereignty" message.
- **When to revisit:** add HLS (adaptive bitrate) only if films grow past about 3 minutes, or analytics show weak connections stalling.

### 6.6 SEO and sharing

- **Structured data.** Films get `VideoObject` JSON-LD (`name`, `description`, `thumbnailUrl`, `uploadDate`, `duration`, `contentUrl`, `inLanguage`, `transcript`).
- **Transcripts as text.** Each transcript is on the page as text, which is indexable.
- **Social cards.** `og:image` cards come from the screenshots.
- **No rich results expected.** Product pages aren't "watch pages", so don't expect video rich results; the transcript and stills still help.

### 6.7 Bilingual

- **Captions and transcript.** Arabic captions in MSA, and an RTL transcript.
- **Arabic VO.** A later phase, with its **own cut list**. The Smart Library work showed Arabic VO drifting about 14 s from English.
- **Screenshots.** Arabic product pages use screenshots of the Arabic UI where the recording has one: AI in a Box and Nazo both do.

### 6.8 Analytics

Anonymous and consent-aware: `video_play`, progress at 25/50/75/100 %, `captions_on`, `chapter_jump`, `loop_paused`. This tells us which product stories hold attention.

---

## 7. Production pipeline (source → site)

1. **Select.** Cut lists are JSON: source, in, out, crop, status. They start in [demo-media/cutlist.json](demo-media/cutlist.json) and grow as segments are cleared. Use one cut list per language for films.
2. **Fix.** Clear the §3 blockers: re-records (§8), the Tasree3 script and VO.
3. **Render.** `render.py` (ffmpeg 8 with x264, SVT-AV1 and libwebp) produces loops, posters and screenshots. Films are assembled in DaVinci Resolve or with the existing Python/ffmpeg build scripts. The earlier Tasree3 build log says *"never speed video to fit voice"*.
4. **Captions.**
   - Draft with Whisper (`openai/whisper-large-v3-turbo` on this laptop's CPU at about 1.5× realtime, or the LAN server).
   - A human reviews names and terms against the evidence register.
   - Then the Arabic translation (MSA).
5. **QA.** The release gate before any file leaves `docs/` or `prototypes/`:
   - **Privacy and brand:** a frame-by-frame scrub for real organisations, people, emblems, laws, programmes, URLs and IPs, and browser extensions.
   - **Bugs:** none on screen.
   - **Legibility:** UI text readable at 375 px.
   - **Flashing:** none.
   - **Audio:** loudness −16 LUFS.
   - **Captions:** spelled against the register ("Tasree3", "YISBIR", "Nazo").
   - **Provenance:** the label is present.
6. **Publish.**
   - Copy into `public/video/`; posters into `public/posters/` (`plan/11` §8).
   - Add the JSON-LD.
   - Add the evidence rows (§9).

---

## 8. Re-record briefs

**Global capture settings (all products):**
- **Browser:** a clean profile with no extensions or bookmarks bar, and OS "Do not disturb" on. The viewport is 1440×900 CSS px at 2× device scale, so screenshots are crisp.
- **Framing:** a full-window app capture, with no desktop wallpaper. If a framed look is wanted, use the brand navy `#071B36` or the product surface, applied in post.
- **Camera:** no auto-zoom during capture. In the edit, zoom only on settled frames, ≤ 2×, consistently.
- **Pacing:** 3–5 s holds on every settled screen; deliberate cursor moves (target → pause → click → wait); an enlarged, smoothed cursor.
- **Data:** a neutral demo tenant (DV-04):
  - a fictional organisation, wordmark and letterhead, with no emblems;
  - fictional people (search the names first);
  - fictional laws and programmes;
  - `.example` or `.demo` email domains;
  - visibly sample numbers;
  - an Arabic counterpart for every entity.
- **Capture:** constant 30 fps (60 for scroll-heavy flows), silent; the VO comes later. Record each flow in **EN, then the same flow in AR**.

**Per product:**

| Product | Re-record | Keep from the current recording | Length to capture |
|---|---|---|---|
| **AI in a Box** | Briefing; inbox → formal letter; proactive approval; report → PDF; voice approval; knowledge hub; analytics; executive dashboard. All on fictional entities with a neutral research topic | Home, scheduling, contract review, voice question, Agent Matrix, Governance, Integrations, languages | ≈ 3 min raw → 90–120 s film |
| **Nazo** | The full flow on the neutral tenant: workspace (EN/AR), AI summary → decision with initials, AI template generator → draft with field chips → suggested workflow, workflow builder, new correspondence → template match → Arabic letter → approval → history, signature profile | Nothing for publication. The current file is the storyboard | ≈ 5 min raw → 2 min film + loops |
| **YISBIR indexing** | Rebrand the instance to YISBIR (DV-02). Replace the library with cleared media. Flow: natural-language question → cited answer → open the source at the timestamp → transcript and translation EN→AR → keywords and key moments → compare → compile package → dashboard (face-recognition row hidden per DL-P07) | Storyboard only | ≈ 3 min raw → 2 min film + 3 clips |
| **Tasree3** | Calm takes of the hero beats: AI generation (type → build → Add to canvas), mining → bottleneck → AI insight (with the JSON bug fixed), conformance map toggle, approval to v1.0. Same process name end to end. This is the briefing in `tashree_animatic_v1_README.md` | All of v4 for the v5 film, after the re-voice | ≈ 2 min raw → loops + film v6 |

---

## 9. Evidence the recordings add (proposed register rows)

**Status:** these are proposals only. Writing to `plan/03-evidence-register.csv` needs your approval; it's outside the agreed write scope. IDs EV-520 to EV-525 are free (the highest row in use is EV-515).

| ID (proposed) | Product | Claim the recording supports | Status |
|---|---|---|---|
| EV-520 | ai-in-a-box | A working product UI exists: "Meerana OS v2.7.4", "AI in a Box. Sovereignty in Your Hands", assistant "Aria", EN/AR/DE (demo 2026-06-29). Supersedes "announced concept only" in EV-160 | internal until DV-01 |
| EV-521 | ai-in-a-box | Demonstrated: contract review with clause flags and fixes; scheduling and conflict resolution; email triage and formal drafting; approvals; executive report PDF; voice mode; five coordinated agents; knowledge sources; governance roles; integration connectors. This is a demo, not a deployment | use-with-edit; integrations confirm-with-meerana |
| EV-522 | nazo | Demonstrated: "NAZO AI" with AI assistant, AI summary, AI-suggested comments, review/return/redirect, initials and e-signature, document history, AI template generator, template matching, workflow builder, EN/AR UI and letters, activity log, role permissions (demo 2026-07-29). Supports EV-141/142 | ok-to-use for capabilities; footage do-not-use until re-recorded (B1) |
| EV-523 | tasree3 | Demonstrated in the app: AI text→BPMN, approval chain to v1.0, dependency matrix, process mining with AI insights and analyst chat, conformance center, SSO setting, AI-provider settings with own keys, Integration Studio (demo 2026-06-30). Supports EV-402/405/408 | ok-to-use; connectors stay confirm-with-meerana (EV-409) |
| EV-524 | yisbir | Demonstrated: natural-language search with a cited answer across video, audio and documents; transcript, summary, keywords, key moments, people, objects and events; translation; compare; compile package; dashboard; upload and import (demo 2026-06-29; UI "MediaVault"). Supports EV-440/442 | capabilities ok-to-use; footage do-not-use (B2/B3) |
| EV-525 | legal | The demo data uses a real ministry's identity (Nazo), real archival photographs of people (YISBIR) and "Ministry of Finance" (AI in a Box, YISBIR) | do-not-use, as with EV-145 |

**Decision-log updates to record:**
- **DL-P05:** Nazo and AI in a Box are now in scope, by the user on 2026-10-04 and 2026-10-05.
- **DL-A01:** partly fulfilled.
- **DL-A03:** unaffected, since these are real captures, not AI-generated video.

---

## 10. Decisions needed

| ID | Decision | Recommendation |
|---|---|---|
| **DV-01** | AI in a Box's public name: "AI in a Box" (CEO's announcement, but it collides with other vendors), "Meerana OS" (the UI), or another. Is "Aria" the assistant persona? | Decide before publishing any of its media. Until then, use "AI in a Box" as the working name in documents only |
| **DV-02** | The YISBIR indexing UI says "MediaVault" | Rebrand the demo instance to YISBIR before re-recording. Or, if "MediaVault" is a real module name, add evidence and explain it on yisbir.com |
| **DV-03** | Nazo's name and wordmark (DL-P08). The app says "NAZO AI" | Pick one public form ("Nazo" in running text, "NAZO" as the wordmark?) and match the app to it |
| **DV-04** | Demo-data policy | **Adopt:** fictional organisations, people, laws, programmes and media only, with legal sign-off. It's added to `modern-ai-company` sample-data rules |
| **DV-05** | Video rules (amend `plan/10` §8) | Adopt the §5 table: loops ≤ 15 s and ≤ 1 MB; films click to play with closed EN/AR captions |
| **DV-06** | Hosting | Self-host progressive MP4 (AV1 + H.264). Revisit HLS later |
| **DV-07** | Tasree3 spoken name and the v5 re-voice | Confirm the pronunciation of تسريع. Approve the script edits in Appendix B |
| **DV-08** | Which integrations may be named | Only those Meerana confirms production-ready (EV-409) |
| **DV-09** | Order of films | Tasree3 (v5, days) → AI in a Box (after the data swap) → Nazo (neutral tenant) → YISBIR (re-record) |
| **DV-10** | Product pages for Nazo and AI in a Box in the sitemap | Add both. This formally reverses the DL-P05 exclusions per the user's direction |

---

## 11. Work plan

| Phase | Work | Owner | Effort | Output |
|---|---|---|---|---|
| **0 · Decide** | DV-01 to DV-10; legal check of the demo-data policy | Meerana leadership, product owners | 1–3 days | Decisions recorded |
| **1 · Use what's clean** | Build `MediaFrame`, `DemoLoop`, `DemoFilm` and `Transcript` in a prototype page with the review set. Write the Tasree3 v5 script and VO, with EN captions. Update the skills (§12) | Me | 2–3 days | Prototype page; `tasree3-film-v5.mp4` + `.en.vtt` |
| **2 · Re-record** | The neutral tenant (Nazo, YISBIR, AI in a Box data), YISBIR rebrand and cleared media, and the Tasree3 hero beats, all per §8 | Product owners, with me directing shot lists | 1–2 weeks | Clean raw captures (EN + AR) |
| **3 · Edit and encode** | Cut lists per product and language; loops, films and screenshots; captions EN → AR; QA (§7.5) | Me | 3–5 days | `public/video/` set + captions |
| **4 · Ship** | Integrate into the Next.js build; JSON-LD; analytics; acceptance (`plan/13`: A9, the E-rows) | Front-end | With the site build | Live pages |

## 12. Skill updates this plan implies (Phase 1)

- **`ui-system`:** add `MediaFrame`, `DemoLoop`, `DemoFilm` and `Transcript` to the component inventory.
- **`web-animations`:** a video section in `performance-budget.md` covering autoplay rules, Save-Data and sizes.
- **`landing-page`:** a "real-UI loop" hero pattern.
- **`modern-ai-company`:** extend `sample-data-rules.md` with no real ministries, laws, programmes, emblems or archival photos of people, and fictional domains only.
- **`anti-generic-audit`:** a new check, G25. It flags a video without a poster, with autoplay but no `muted`, with no Pause control on a loop over 5 s, or a film with no captions track.
- **`modern-tech-company`:** an AI in a Box product card (after DV-01); the Nazo card notes "NAZO AI" in the UI.

---

## Appendix A: review set (`docs/demo-media/`)

Re-render with `python docs/demo-media/render.py`. These files are internal until the decisions in §10 are made.

| File | What | Size | Clean for |
|---|---|---|---|
| `stills/aibox-01-assistant-home.webp` | Assistant home + context panel | 111 KB | Content ✓ · name (DV-01) |
| `stills/aibox-02-schedule-conflict.webp` | Scheduling + conflict resolved | 55 KB | ✓ · DV-01 |
| `stills/aibox-03-contract-review.webp` | Clause flags + fixes | 71 KB | ✓ · DV-01 |
| `stills/aibox-04-voice.webp` | Voice mode | 17 KB | ✓ · DV-01 |
| `stills/aibox-05-agent-matrix.webp` | Five agents | 41 KB | ✓ · DV-01 |
| `stills/aibox-06-governance.webp` | Governance | 52 KB | ✓ · DV-01 |
| `stills/aibox-07-integrations.webp` | Integrations | 52 KB | DV-01 + DV-08 |
| `stills/aibox-08-arabic.webp` | Arabic RTL home | 100 KB | ✓ · DV-01 |
| `stills/nazo-01-template-generator.webp` | AI Template Generator (zoomed) | 47 KB | ✓ · DV-03 |
| `stills/nazo-02-templates-page.webp` | Templates page | 34 KB | ✓ · DV-03 |
| `stills/tasree3-01-command-center.webp` | Command Center | 36 KB | **✓ now** |
| `stills/tasree3-02-text-to-bpmn.webp` | Generated BPMN diagram | 51 KB | **✓ now** |
| `clips/aibox-loop-contract-review.{mp4,av1.mp4,poster.webp}` | 13.5 s | 651 / 413 / 29 KB | ✓ · DV-01 |
| `clips/aibox-loop-languages.*` | 13.0 s, EN → DE → AR | 737 / 562 / 52 KB | ✓ · DV-01 |
| `clips/aibox-loop-agent-matrix.*` | 10.0 s | 215 / 165 / 19 KB | ✓ · DV-01 |
| `clips/nazo-loop-ai-drafting.*` | 10.0 s | 454 / 366 / 24 KB | ✓ · DV-03 |
| `sheets/*.webp` | 21 timecoded contact sheets (3–4 s sampling) | 1.4 MB total | Reference |

## Appendix B: Tasree3 v4 voiceover (Whisper transcript) and required edits

Lines are in order, with cue start times.

| Time | VO as recorded | Edit |
|---|---|---|
| 0:00 | "Every organization runs on processes, but too often, they live in people's heads, undocumented, unmeasured, impossible to improve." | Keep (British spelling in captions: "organisation") |
| 0:13 | "This is **Tashree**, the intelligent platform for designing, governing, and improving how your enterprise works." | **"This is Tasree3…"** (B7) |
| 0:20 | "It begins with an idea. Describe a process in plain language, and **Tashree** designs it for you. A complete, standards-based diagram, in seconds." | Name (B7). Keep "in seconds" only if a timed run confirms it; otherwise "in moments" |
| 0:31 | "Refine it your way. Drag, connect, and lay out every step, with real-time collaboration and a single source of truth." | Keep (EV-402) |
| 0:39 | "Then, put it under control. Route any process through review and approval. **Tashree** versions it, locks it, and keeps **a complete audit trail**." | Name (B7). Change to "…and keeps the full history" (EV-405) |
| 0:49 | "Nothing works in isolation. See how every process connects and understand the impact of a change before you make it." | Keep |
| 0:57 | "Models show how work should run. Process mining shows how it actually runs, reconstructed from your own data." | Keep (EV-404) |
| 1:05 | "**Tashree** finds your bottlenecks, measures your cycle times, and tells you, in plain language, exactly where to improve." | Name (B7). The picture at 1:09 shows the JSON bug (B8): cut or replace it |
| 1:13 | "And when you have a question, just ask, your AI analyst answers, from your own data." | Keep the line. Replace the picture (B9) |
| 1:19 | "For what matters most, compliance, **Tashree** compares reality against your approved model… every deviation, every risk, ready to report" | Name (B7) |
| 1:28 | "…and it's built for the enterprise: single sign-on, granular roles, **connectors for SAP and your architecture stack**, your own AI, your own keys…" | SSO ✓ (EV-408). Connectors only after DV-08 |
| 1:37 | "…all of it in one command center. Designed, governed, and improving continuously." | Keep. The transcript's doubled "designed" at 1:42 is a Whisper artefact: the two word timings overlap. The VO itself is fine; a listen will confirm |
| 1:46 | "**Tashri.** Design. Govern. Improve. The way your enterprise should work." | **"Tasree3."** (B7) |

## Appendix C: other files in `demo_video` (not analysed here)

| File | Notes |
|---|---|
| `AgenticAI.mov` | An earlier AI in a Box export (61 MB) |
| `demoAgenticAi_ready.mp4` | A compressed AI in a Box export (22 MB) |
| `tashree.mov` | The raw Tasree3 recording; silent, 151 s |
| `tashree_demo_v1`–`v3.mp4` | Earlier Tasree3 cuts |
| `tashree_animatic_v1.mp4` | The Tasree3 animatic |
| `Vide4oIndexingDemo.mov` | The higher-bitrate indexing master. Use it for any interim stills: the `_ready` file is 589 kb/s |
| `SignLanguageV1.mov` | Possibly another product. Tell me if it should be included |
| `demo2.mov`, `demo3.mov`, `demo4.mov` | Unidentified |
| `Recording 2026-04-15 133416.mp4` | 1.7 GB, unidentified |
