# Honest capability language

## The claims ladder (climb only as far as evidence allows)
1. **Capability:** "Yisbir transcribes and indexes speech in 50+ languages." [EV-440]
2. **Specific mechanism:** "…with speaker turns, so a phrase is searchable like a filename." [EV-442]
3. **Measured performance:** "Indexes one hour of 1080p video in N minutes on <hardware>." Needs a measurement and a register row.
4. **Customer outcome:** "<Client> cut incident review from 3 hours to 20 minutes (2026)." Needs a named, consenting case study.

Today, Meerana's AI products can claim rungs 1–2. Rungs 3–4 are **empty**, so their absence must not be papered over with invented numbers.

## Sentence templates
- **"<Product> <verb> <input> to <output>, so <user> can <task>."**
  "Yisbir indexes camera footage by what is said and what appears on screen, so investigators can find a moment in seconds."
- **"<Product> flags <documented event> in <environment>, and <what the user does>."**
  "Yisbir flags missing helmets and restricted-zone entry on existing CCTV, and alerts the site team."
- **"<Assistant> drafts <artefact> for you to review."**
  "Nazo's assistant drafts a comment on the correspondence for you to review before posting."

## Live claims → rewrites
| Live (source) | Problem | Rewrite |
|---|---|---|
| "99.2% AI Detection Accuracy" (meerana.ae/yisbir) | Unmeasured; conflicts with yisbir.com's "95%" | Remove. "Detects missing PPE and restricted-zone entry on existing cameras." [EV-133/134] |
| "10M+ Hours of Videos Processed" | Unsourced | Remove |
| "Mandoobee is not just another software. It's an intelligent workplace that thinks…" | Anthropomorphic, vague | "Mandoobee drafts, summarises and answers questions about your documents, inside the workplace app." [EV-114/421] |
| "100% Secure & Compliant" (Nazo) | An absolute; implies certification | "Roles, audit trails, e-signatures and a sealed archive." [EV-142; demo] |
| "10x Faster Processing" (Nazo) | Unmeasured | Remove, or measure: "Routes a circular to three approvers in one step." (demo task) |
| "Reduce process modeling time by up to 70%" (Tasree3) | Unsourced | "Generate a first process model from your system logs." [EV-404] |
| "Yisbir is an AI-powered talent acquisition…" (chatbot) | Wrong product | Delete (DL-P01) |

## Sensitive capabilities (PDPL, reputational)
| Capability | Public wording (pending legal, DL-P07) | Demo |
|---|---|---|
| Face search / person identification | "Person search for authorised investigations, with role-based access control and audit logs." | **Not demonstrated**; outlines only |
| Gender attribute | Not mentioned | Never |
| Licence plates | Not mentioned until approved | Never |
| Speech transcription | "Transcribes speech in 50+ languages." [EV-440] | Sample transcripts with fictional content |

## Words
| Prefer | Avoid |
|---|---|
| detects, flags, indexes, transcribes, extracts, searches, ranks, suggests, drafts, summarises | understands, thinks, knows, sees everything, never misses |
| "on your own servers", "in your own cloud or data centre" | "fully sovereign", "air-gapped" (unless documented) |
| "alerts the team as it happens" (once the bound is measured: "within N seconds") | "instantly", "zero latency", "real-time" (unbounded) |
| "AI model endpoint you choose" (Tasree3, PRODWEB §1.6) | "any LLM", "all models" |
