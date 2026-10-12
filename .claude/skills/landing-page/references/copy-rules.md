# Copy rules

## 1. Lengths
| Element | Rule |
|---|---|
| H1 / display line | ≤ 8 words. One idea. No colon chains. |
| H2 | ≤ 8 words |
| Lede | ≤ 2 sentences, ≤ 60 characters per line visually (max 60ch) |
| Card | Title ≤ 5 words + ≤ 2 sentences |
| CTA | Verb + object, ≤ 4 words |
| Eyebrow | A fact (place, year, category, product), never a slogan. Mono or label style. |

## 2. Numbers over adjectives: the metric ladder
Use the highest rung you can **prove** (register id required):
1. **Measured outcome** with method and date: "Approval cycle cut from 9 to 4 days at <client>, 2026". None exists yet; this needs a case study.
2. **Measured performance** with conditions: "Indexes 1 hour of 1080p video in N minutes on <GPU>". Not registered. Never publish unmeasured accuracy, uptime or latency.
3. **Checkable capability count** (registered):
   - "50+ transcription languages" [EV-440];
   - "3 modules" [EV-401];
   - "6 search types" [EV-442];
   - "On-prem · cloud · hybrid" [EV-116, EV-444].
4. **Concrete specific** (registered):
   - "Bluetooth fallback when the internet is down" [EV-103];
   - "Sealed, verifiable archive" (Nazo demo).
5. **Plain capability** with no number: "Lets managers approve leave from their phone."

**Never:** "99.2% accuracy", "10M+ hours", "512+ organisations", "50K+ users", "99.9% uptime", "10x faster", "100% secure & compliant". They are all live today without evidence (REPORT §4.4).

## 3. British English (UAE market, enterprise tone)
- organisation · optimise · programme · centre · licence (noun) / license (verb) · colour · behaviour · catalogue · enrol · analyse · modelling · travelling · artefact (prefer "artifact" only in software terms) · whilst → **while** (plain English)
- Dates: 4 October 2026 (copy); 2026-10-04 (data/mono).
- Tone: confident, precise, formal-friendly. No slang, no exclamation marks, no puns (they must transcreate into Arabic, `meerana-narrative`).
- Address the buyer as "you / your team". Say "Meerana" (not "we") in factual claims about company facts.

## 4. Banned or flagged words → replacements
| Avoid | Write instead |
|---|---|
| revolutionary, revolutionise | The specific change: "removes the paper approval step" |
| cutting-edge, state-of-the-art, next-gen | The capability: "indexes speech, on-screen text and objects" |
| seamless, seamlessly | What connects to what: "signs in with Entra ID / SAML" [EV-408] |
| unleash, unlock, supercharge, empower | A verb from the workflow: approve, search, route, open, find |
| AI-powered (more than once per page) | Say what the model does: "detects missing helmets" |
| synergy, holistic, best-in-class, world-class | Delete |
| solutions (as a vague noun) | Name the product or service |
| trusted by … (without evidence) | A placard with relationship + year + source |

## 5. Rewrites from the live sites
| Live today | Rewrite (≤ 8-word H / ≤ 2-sentence body) | Evidence |
|---|---|---|
| "Connecting the World Through Smart Technologies." | "From the front gate to the final approval." | `plan/06` H1; product scope |
| "Meerana is your Digital Transformation Partner — An Emarati Group of Companies" | "Built in the UAE. Deployed where your data has to stay." | EV-007, EV-461 (the "group" claim is unsupported, DL-C02) |
| "Turn Every Video into Intelligent Data." (96 px, 900 weight) | "Search hours of video like a document." | EV-440, EV-442 |
| "Smarter Correspondence. Stronger Decisions." + "100% Secure & Compliant" | "The final approval, signed and sealed." + "Every closed record is sealed and verifiable." | EV-141/142; Nazo demo |
| "We offer a vast range of high quality products that help us stand out in the market…" (×4) | Delete. Each service gets its own 2-sentence card. | DL-S01 |
| "Reach out effortlessly! Our dedicated team is ready to assist." | "Tell us what you want to run better." | — |

## 6. Arabic readiness
- Write sentences that translate cleanly: no idioms or wordplay.
- Arabic is **transcreated** by a qualified translator, never machine-translated for launch (DL-L01).
- Keep product wordmarks Latin (DL-L03). Reference IDs and codes stay LTR inside RTL text: `<bdi>` / `dir="ltr"`.
