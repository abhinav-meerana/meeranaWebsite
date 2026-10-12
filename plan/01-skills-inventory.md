# 01 — Skills inventory

**Created:** 2026-10-02.
**Location:** `C:\Users\abhin\Desktop\meerana\.claude\skills\` (Claude Code project-scoped skills).

Each skill is a folder with `SKILL.md` (YAML frontmatter `name` + `description`, then the body). Some have `references/` or `scripts/`. The format follows the documented skill anatomy from the `skill-creator` skill. No existing or unrelated skills were touched: the `.claude/skills` folder was empty and nothing exists under `~/.claude/skills`.

## 1. Skills audited in the environment

| Skill | Reused? | How |
|---|---|---|
| `anthropic-skills:skill-creator` | **Yes** | Format and conventions for the skills below. Triggering evals were deliberately not run at planning stage (see §5). |
| `anthropic-skills:built-in-browser` | **Yes** | Used for the Figma Make preview and live-site inspection. Reuse for screenshot capture and live-site checks. |
| `figma:figma-design-to-code` | **Yes (partially)** | Followed for the Figma Make file. The Figma connector only returned resource links this environment cannot read, so the source was recovered from the preview's inline sourcemap instead. |
| `dataviz` | **Will reuse** | Referenced by `meerana-product-ui` for any chart inside product demos. |
| `artifact-design` / `artifact-diagramming` | Will reuse | Only if a plan summary is published as a shareable page. |
| `figma:figma-generate-library`, `figma:figma-generate-design`, `figma:figma-use` | Optional, later | Only if the approved design system or screens must also live in Figma. Needs the Figma plugin connector authorised. |
| `deep-research` | Not used | Research was split across 4 parallel subagents with explicit evidence formats instead. That fits better with the evidence register. |
| `run`, `code-review`, `simplify`, `security-review` | Will reuse during implementation | QA of the built site (security review for the contact form). |
| `web-artifacts-builder`, `docs`, `docx`, `pptx`, `xlsx`, `pdf` | Not relevant | The deliverables are repo files. A production site is not a claude.ai artifact. |

## 2. Project skills created

| Skill | Purpose (short) | Bundled resources |
|---|---|---|
| `meerana-evidence` | Every public claim traces to evidence; conflicts are logged, never silently resolved | `references/register-schema.md`, `scripts/check_register.py` (validates `plan/03-evidence-register.csv`) |
| `meerana-brand` | Verified brand and sub-brand rules, tokens, contrast, logos, fonts; prevents off-brand drift | `references/brand-reference.md` (PyMuPDF-verified values, PDF errors, superseded hidden boards), `scripts/contrast_check.py` |
| `meerana-narrative` | Question-led IA, homepage section specs, product storyboards, copy voice, CTA mapping | `references/templates.md` (section spec + storyboard templates) |
| `meerana-scroll-choreography` | Motion spec format; native-scroll GSAP rules; pin limits; reduced-motion branches | — |
| `meerana-webgl-scenes` | Purpose test for 3D; lattice visual language; budgets; lifecycle; fallbacks | — |
| `meerana-product-ui` | Real / reconstructed / illustrative provenance; task-first demos; synthetic-data rules | — |
| `meerana-a11y-responsive` | WCAG 2.2 AA, responsive, reduced motion, RTL readiness; acts as the release gate | — |
| `meerana-frontend` | Stack, boundaries, content schema with evidence IDs, contact contract, CI, budgets, sequencing | — |

Every SKILL.md contains:
- purpose and when to use
- required inputs
- workflow
- expected outputs
- quality checks / acceptance
- project constraints
- failure modes / anti-patterns

**Why nothing was merged.** Scroll choreography and WebGL were kept separate on purpose:
- Many scroll reveals involve no 3D (dashboard step-throughs, proof reveals).
- 3D asset and performance work involves no choreography.

The coupling risk (two systems driving the same camera) is handled by an explicit contract in both skills: *the chapter's GSAP timeline is the single owner; scenes expose setters and never read scroll.* Accessibility is a separate skill because it is the release gate that every other skill hands off to.

## 3. How the skills work together

```
                 ┌──────────────────────┐
  sources ──────►│  meerana-evidence    │──► evidence register + decision log
                 └──────────┬───────────┘
                            │ approved facts & positioning
            ┌───────────────┼──────────────────┐
            ▼               ▼                  ▼
   meerana-narrative   meerana-brand     meerana-product-ui
   (IA, storyboards,   (tokens, logos,   (screens, provenance,
    copy, CTAs)         contrast)         demo data)
            │               │                  │
            └──────┬────────┴─────────┬────────┘
                   ▼                  ▼
      meerana-scroll-choreography ◄─► meerana-webgl-scenes
      (timelines own progress)        (scenes expose setters)
                   │                  │
                   └────────┬─────────┘
                            ▼
                   meerana-frontend  (build, content:check, CI, budgets)
                            │
                            ▼
                   meerana-a11y-responsive  (release gate)
```

**Typical flow for one product chapter:**
1. Evidence: confirm the dossier facts.
2. Narrative: storyboard beats and copy with EV ids.
3. Product UI: screen specs and provenance.
4. Brand: product tokens and type.
5. Choreography: `M-` specs.
6. WebGL: the scene only if it passes the purpose test.
7. Frontend: build and tests.
8. A11y gate.

## 4. Deterministic checks provided

| Command | Checks |
|---|---|
| `python .claude/skills/meerana-evidence/scripts/check_register.py plan/03-evidence-register.csv` | Register schema, enums, unique IDs, status/confidence consistency, conflict references |
| `python .claude/skills/meerana-brand/scripts/contrast_check.py [--all \| fg bg]` | WCAG ratios for brand and product token pairs |
| (planned in repo) `npm run content:check` | zod content schemas + evidence-ID status gate for production builds (spec in 11) |

## 5. Not done yet

- **Trigger-description optimisation and with-skill/without-skill evals** (the skill-creator loop) were not run. They are worth doing once implementation starts and real prompts exist. Until then, the descriptions are written to trigger generously.
- The Figma plugin connector (`plugin:figma`) is not authorised in this session. The other Figma connector could not read Figma Make resources, so it was bypassed as described above.
