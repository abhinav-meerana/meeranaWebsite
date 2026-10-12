# Evidence register schema (`plan/03-evidence-register.csv`)

| Column | Required | Allowed values / format |
|---|---|---|
| `id` | yes | `EV-###`. Unique; never reused. |
| `topic` | yes | `company` `product:<slug>` `service` `award` `certification` `partner` `client` `figure` `office` `event` `brand` `asset` `legal` |
| `item` | yes | The claim or content item, short. |
| `verbatim` | when quoting | Exact source wording, in quotes. |
| `class` | yes | `verified-fact` `company-claim` `interpretation` `proposed-copy` `illustrative` `unknown` |
| `source` | yes (except `unknown`) | Source name. |
| `location` | yes (except `unknown`) | URL plus anchor/section, PDF page, file path or bundle offset. |
| `published` | if known | YYYY-MM-DD, YYYY-MM or YYYY. Use `undated` if none is shown. |
| `accessed` | yes for web | YYYY-MM-DD |
| `confidence` | yes | `high` `medium` `low` `none` |
| `conflicts` | optional | Semicolon-separated EV ids and/or a short note. |
| `public_status` | yes | `ok-to-use` `use-with-edit` `confirm-with-meerana` `internal-only` `do-not-use` |
| `notes` | optional | Recommendation and reasoning; decision-log id (`DL-##`). |

Rules enforced by `scripts/check_register.py`:
- Required columns are present.
- Enumerations are valid.
- IDs are unique and well-formed.
- `ok-to-use` rows have `confidence` high/medium and a non-empty `location`.
- `illustrative` rows are never `ok-to-use` as fact. Use `internal-only` or `use-with-edit` with a label note.
- `unknown` rows are `confirm-with-meerana` or `do-not-use`.
- `conflicts` EV references resolve.
