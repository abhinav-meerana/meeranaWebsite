# Meerana product evidence dossier (web research)

- **Prepared for:** Meerana website redesign
- **Research and access date:** 2026-10-02. Every finding in this file was accessed on 2026-10-02 unless a row says otherwise.
- **Method:** I fetched public pages with curl (browser user-agent) and WebFetch, and ran web searches. On single-page-app sites the visible copy only exists inside the public JavaScript bundle, so I read those bundles (meerana.ae, tasree3.ae app, yisbir.com, app.meerana.ae) and the public JSON content API that meerana.ae itself calls. I also read Google Play and Apple listings (Apple via the public iTunes Search/Lookup API), the public LinkedIn guest view, YouTube, the Cert Spotter certificate-transparency API, and press or directory pages.
- **Limits I kept to:** no logins, no form submissions (that includes search forms that need a POST), no app installs, and no file downloads apart from page assets (HTML, JS, JSON and the cover images shown on the pages). I did not download videos or PDFs; I only sent HEAD requests to confirm they exist, their size and their date.
- **Confidence scale (as briefed):**
  - **High:** an official Meerana or product property. This includes app-store listings published by Meerana's own developer account.
  - **Medium:** a reputable third party, or an official social post.
  - **Low:** a directory or aggregator, a search snippet, or unclear attribution.
  - **Analysis:** my own inference from code or metadata, not a published claim.
- **LinkedIn dates:** Post dates come from decoding the LinkedIn activity ID (timestamp = id >> 22, Unix ms). They match the relative ages LinkedIn shows ("3mo", "2mo").
- **Personal data:** I left out personal e-mail addresses and phone numbers I came across, and the names of LinkedIn commenters.

---

## 0. Summary of the official properties discovered

| Property | What it is | Owner signal | Status 2026-10-02 |
|---|---|---|---|
| https://www.meerana.ae/ | Corporate site. React single-page app with hidden product routes `/tasree3`, `/yisbir`, `/mandobee`, `/nazoo`, `/wasel`, `/asset-tracking`, `/accelerator` | Official | Live. Bundle `main.5717dfa4.js` Last-Modified 22 Sep 2026 |
| https://api.meerana.ae/allDataInfo/*.php | JSON content API the corporate site loads (solutions, news, partners, testimonials) | Official | Live |
| https://uat1.meerana.ae/ | Older staging copy of the corporate site (bundle `main.82bbce3f.js`, Last-Modified 30 Dec 2024). Has a Mandoobee page with pricing | Official | Live and public |
| https://tasree3.ae/ (+ `/ar/`) | Dedicated Tasree3 product site, English and Arabic | Footer: "Developed by Meerana" | Live. Last-Modified 8 Jul 2026 |
| https://app.tasree3.ae/ | Tasree3 web application (login) | Same product | Live. Redeployed 30 Sep 2026 |
| https://yisbir.com/ | Dedicated Yisbir product site | "YISBIR by Meerana Technologies"; "© … Meerana Technologies" | Live. Last-Modified 27 Jan 2026 |
| https://demo.yisbir.com/ | Yisbir demo/guest portal (login and self-registration) | Same product | Live |
| https://app.meerana.ae/ | Mandoobee web app (login). Page title "Mandoobee" | Official | Live. Last-Modified 9 Sep 2025 |
| https://hrms.meerana.ae/ | "Tamkeen HRMS": "Multi-tenant SaaS HRMS — Hire-to-Retire" | Hosted on a meerana.ae subdomain | Live (login shell) |
| nazo.meerana.ae, location.meerana.ae, inventory.meerana.ae | Product-related subdomains found through certificate transparency | Meerana subdomains | nazo: no response. location: 502. inventory: "Inventory Management System & Asset Register" (login) |
| Google Play developer "Meerana Information Technology" (id 4788093691730668868) | Mandoobee, Hi Legal, Campus 360, Skillyfy, Noon Herb | Official developer account | Live |
| Apple developer "Meerana Information Technology" (artist id 1664675580) | Mandoobee, Hi Legal only | Official developer account | Live |
| https://www.linkedin.com/company/meerana | Company page ("MEERANA", 3,948 followers) | Official social | Public guest view readable (recent posts only) |
| https://www.youtube.com/@MeeranaTechnologies | YouTube channel | Official social | Exists. **No videos** (1 subscriber) |

---

## 1. Tasree3 (Arabic: تسريع)

All findings in this section accessed 2026-10-02.

### 1.1 Names and spellings found
| Spelling | Where | Conf. |
|---|---|---|
| **Tasree3** | Everywhere: tasree3.ae (including the Arabic pages, which keep the Latin name), meerana.ae `/tasree3`, LinkedIn, the app | High |
| **تسريع** (Arabic) | Only in a Meerana LinkedIn company post: "منصة تسريع (Tasree3)". **Not used on tasree3.ae/ar/**, which writes "Tasree3" in Latin script throughout | Medium |
| "Tasree3 Process Reengineering" | Browser title of app.tasree3.ae and the app's default `browser_title` | High |
| "T3" | Monogram on the tasree3.ae security diagram and the meerana.ae page | High |
| Chatbot fuzzy matches: "tasree", "tasre3" | meerana.ae chatbot code (input variants it recognises, not published names) | High (code) |
| Name collisions (unrelated) | A 2010 Jordanian food-ordering service called "Tasree3" (thenextweb.com); a GitHub "Tasree3-library" | Low (not Meerana) |

### 1.2 Official properties (URLs)
- **Main site:** https://tasree3.ae/ — home, why.html, uae.html, process-management.html, process-mining.html, process-governance.html, security.html, terms.html. All return 200.
- **Arabic mirror:** https://tasree3.ae/ar/index.html plus /ar/why, uae, process-management, process-mining, process-governance, security, terms. All return 200.
- **Pages that do not exist:** /pricing.html, /about.html, /contact.html, /blog.html, /docs.html, /features.html, /solutions.html, /robots.txt and /sitemap.xml all serve the homepage (soft 404). There is no pricing, blog, docs or case-study page. /assets/ returns 403.
- **App (login only; "Explore the platform" links here):** https://app.tasree3.ae/ — title "Tasree3 Process Reengineering".
- **Corporate product page:** https://www.meerana.ae/tasree3 (single-page-app route; content in https://www.meerana.ae/static/js/main.5717dfa4.js).
- **Enquiries:** every CTA ("Enquire now") goes to https://www.meerana.ae/#contact. There is no Tasree3-specific contact.
- **tasree3.com is NOT a working Meerana property.** It redirects to `/lander`, then to a GoDaddy "forsale" URL; its nameservers are `ns1/ns2.afternic.com` (a domain marketplace). Even so, the app.tasree3.ae JS bundle references `app.tasree3.com`, an SSO callback on `api.tasree3.com`, and `https://tasree3.com/renew` ("Renew Now" button). Analysis: High.

### 1.3 Positioning statements (verbatim)
| Claim (verbatim) | Source | Date | Conf. |
|---|---|---|---|
| "Tasree3, AI-Native Process Management Platform" (page title) | https://tasree3.ae/ | LM 2026-07-08 | High |
| "Zero bureaucracy. One process solution." (hero) | https://tasree3.ae/ | LM 2026-07-08 | High |
| "Tasree3 is the sovereign, agentic, AI-native platform for enterprise process management, model, mine, govern and optimize every process on one intelligent core." | https://tasree3.ae/ | LM 2026-07-08 | High |
| "AI-native process management, modeling, mining, governance and optimization, unified in one platform." (footer tagline) | https://tasree3.ae/ (all pages) | — | High |
| "Three modules. One AI-native core." | https://tasree3.ae/#modules | — | High |
| "The next generation of process excellence" / "Built for speed, cost efficiency, and regional impact, not retrofitted from legacy global tools." | https://tasree3.ae/why.html | — | High |
| "Tasree3 is a sovereign, AI-native process platform, designed and developed in the United Arab Emirates by Meerana, and engineered to a global standard for organizations anywhere." | https://tasree3.ae/uae.html | — | High |
| "The UAE's Zero Government Bureaucracy programme set out to strip needless procedures out of government by re-engineering how the work is actually done. That is precisely what Tasree3 is built for." | https://tasree3.ae/uae.html | — | High |
| Tagline "AI-Assisted Process Mining & Process Engineering"; hero "Design Smarter. Optimize Faster. Transform Continuously." | https://www.meerana.ae/tasree3 | bundle LM 2026-09-22 | High |
| "Tasree3 is an AI-assisted process mining and process engineering platform that helps organizations design, analyze, optimize, and improve business processes through intelligent workflow discovery, visual modeling, performance insights, and AI-powered recommendations." | meerana.ae/tasree3 and the meerana.ae chatbot | 2026-09-22 | High |
| Breadcrumb label "AI Process Intelligence"; badge "AI-Powered BPM Platform" | meerana.ae/tasree3 | 2026-09-22 | High |
| "Tasree3 (Digital Transformation)" (chatbot's one-line product list) | meerana.ae chatbot fallback text | 2026-09-22 | High (but low quality) |
| "At Meerana Technology, this philosophy is reflected in Tasree3, our solution for accelerating Business Process Reengineering (BPR), simplifying workflows, and enabling faster digital transformation." (Arabic: "…تجسد منصة تسريع (Tasree3) هذه الرؤية من خلال تسريع إعادة هندسة العمليات…") | https://ae.linkedin.com/posts/meerana_dubaiit-tasree3-meerana-activity-7474399838999101440-42vU | 2026-06-21 | Medium |
| "That is why Tasree3 was born. Not as a software platform. Not as a methodology. But as a commitment to help organizations remove barriers, simplify complexity, accelerate results, and turn ambition into achievement." (CEO post; link preview "Zero bureaucracy. One process solution. tasree3.ae") | https://www.linkedin.com/posts/mataralmehairi_zero-bureaucracy-one-process-solution-activity-7474032132705640448-sUQP | 2026-06-20 | Medium |

### 1.4 Users and industries
| Claim | Source | Conf. |
|---|---|---|
| "Engineered for enterprises across the region" followed by "Energy Government Finance Healthcare Telecom". These are sector words, not client logos. | tasree3.ae home | High |
| "From SMEs to large enterprises across government, finance, healthcare and more" | tasree3.ae/why.html | High |
| "Enterprises, government and SMEs, in the UAE, the wider GCC, and internationally." | tasree3.ae/uae.html | High |
| Industries: "Manufacturing", "Banking & Finance", "Healthcare", "Government", "Enterprise", "And Many More" | meerana.ae/tasree3 | High |
| "Scalable for SMEs, enterprises, and government organizations" | meerana.ae/tasree3 | High |
| Collaboration roles shown in the demo UI: Process Owner, Finance, Compliance | tasree3.ae home | High |

### 1.5 Features and modules
**Modules (tasree3.ae):**
- "1 Process Re-engineering Manage, re-engineer and improve processes."
- "2 Process Mining Discover as-is flows from system event logs."
- "3 Process Governance Control approvals, versions and publishing."
- Surrounding layer: "AI-native capabilities, generative modeling, predictive analytics, anomaly detection and more." (High)

**Lifecycle (home):** "01 Visual Modeling 02 Process Discovery 03 Performance Insights 04 AI Optimization", plus "Instant Reports" and "Collaboration" across every stage. Feature bullets include:
- "Drag-and-drop BPMN editor with reusable building blocks"
- "Shared process repository as a single source of truth"
- "Reveal hidden variants and rework loops"
- "Automatic bottleneck and delay detection"
- "Smart recommendations ranked by impact and effort"
- "Natural-language questions over your process data"
- "Export to PDF, Excel, and PowerPoint"
- "Co-edit models with live presence and comments"

(High)

**Module 01, Management and Re-Engineering** (process-management.html):
- Notations: "Value Chains", "EPC", "BPMN 2.0".
- APQC Process Classification Framework drill-down L1 to L4 with benchmarking ("benchmarks against the APQC global standard").
- "Cross-functional Process Inter-relationships" with a flow view and a dependency-matrix view.
- Lean redesign moves: "Eliminate", "Simplify", "Parallelize", "Automate", "Standardize".

(High)

**Module 02, Process Mining** (process-mining.html):
- "Connect your source systems and Tasree3 mines the as-is process from their event data, then audits it against the process you approved."
- Process discovery with variants and bottlenecks.
- Conformance audit ("replays the approved model against reality… scores conformance").

(High)

**Module 03, Governance** (process-governance.html):
- Pipeline "Submit → In Review → Approved → Published".
- Reviewer actions "Approve / Request changes / Return to author / Reject".
- Roles: Viewer, Author, Reviewer, Endorser, Approver, Admin.
- "Immutable version captured on every approval"; "Full history with one-click rollback".
- "ISO 9001 aligned, controlled and documented processes by default."

(High)

**meerana.ae feature list:**
- Automatic Process Discovery
- Visual Process Modeling
- AI-Powered Optimization
- Performance Insights
- Instant Reports ("audit-ready process reports in seconds")
- Real-Time Collaboration
- Smart AI Layer
- Continuous Improvement
- "Regional Readiness: Full support for Arabic, RTL layouts, and regional business requirements."

(High)

**App evidence (public JS bundle of app.tasree3.ae; existence of strings is High, interpretation is Analysis):**
- Per-organisation feature flags: "Organization Structure", "Process Designer", "Process Mining" ("AI-driven process analysis from event logs"), "AI Assistant" ("AI Companion for queries and automated insights"), "Business Dictionary", "Framework Analysis Diagram (FAD)", "Governance Workflow".
- AI features named "Process Copilot", "AI Copilot Consultant" and "Generate with AI".
- Multi-tenant: "Create Organization / Join Organization".
- White-label branding settings: company name, logos, colours, browser title, support e-mail.
- An EPC theme named "ARIS Default" ("Standard industrial EPC symbols").
- Arabic UI strings are present.

### 1.6 Deployment, hardware and integrations
| Claim (verbatim) | Source | Conf. |
|---|---|---|
| "Run it in your own cloud or data centre, in the region you choose, under your rules." / "No black box and no offshore lock-in." / "Deploy in your own environment, your data residency" | tasree3.ae/uae.html | High |
| "Tasree3 is designed with encryption at rest, RBAC controls, separated as-is / to-be staging and SIEM-compatible logging." | tasree3.ae/security.html | High |
| "SSO via Microsoft Entra ID (Azure AD), SAML 2.0 and OIDC" | tasree3.ae/security.html | High |
| Connectors: "SAP S/4HANA & ECC", "Oracle E-Business & Fusion", "Microsoft Dynamics 365", "ServiceNow", "Salesforce", "REST API & databases". Each card says "Connector ready". | tasree3.ae/process-mining.html | High |
| "Any SQL database or REST API connects through a configurable mapping, and pre-built adapters for the major ERP, ITSM and CRM platforms are being added to the connector library." | tasree3.ae/process-mining.html | High |
| The app lists **"Tamkeen HRMS"** as a "Supported" event-stream connection ("Sync recruitment stages, leave approv…"), with default base URL on `hrms.meerana.ae` | app.tasree3.ae bundle | High (code) |
| Bring-your-own LLM settings: Google Gemini, OpenRouter, OpenAI, Anthropic, Azure OpenAI, and any "OpenAI-compatible endpoint (Ollama, LM Studio, vLLM…)". In other words, local or on-prem models are supported. | app.tasree3.ae bundle | High (code) |
| SSO domain verification through a DNS TXT record "tasree3-verification=…" | app.tasree3.ae bundle | High (code) |
| The production API endpoint referenced in the bundle sits on Azure "uaenorth" (UAE North region) | app.tasree3.ae bundle | Analysis |

### 1.7 Interfaces and media available publicly
- **tasree3.ae:** **no screenshots, no videos, no images** apart from the logo (`assets/Tasree Logo.png`). Every product visual is a CSS/SVG mock-up marked "illustrative" (procure-to-pay flow, APQC cascade, conformance 87%, and so on).
- **Video:** https://www.meerana.ae/assets/tasree.mp4 (8,352,369 bytes; Last-Modified 13 Aug 2026; plays in a modal on meerana.ae/tasree3). HEAD only, not viewed.
- **Cover image:** https://www.meerana.ae/assets/tasree3_cover_banner.png. This is actually a JPEG, 1024×1024, AI-generated. The monitor in it is branded "**BPM INSIGHTS**", not Tasree3.
- **Simulated UI on meerana.ae/tasree3:** "Visual Process Modeling Simulator" (Order Received → Validate Order "Auto Match: 99.8%" → Check Inventory → Order Completed; "24% delay").
- **Live app:** https://app.tasree3.ae (login wall; no public demo or trial found).

### 1.8 Proof (clients, case studies, awards)
- **No named clients, case studies, testimonials or awards for Tasree3 anywhere public.** The only proof-like items are illustrative metrics: "−34% Cycle time", "98.2% Conformance", "12 Bottlenecks found" on tasree3.ae, and "70% Modeling Speedup", "Zero Manual Mapping Errors", "100% Process Visibility" on meerana.ae. None is sourced.
- **Social traction:** LinkedIn posts drew 48 reactions (CEO post) and 8 (company post).
- **Context only (Medium):** Meerana signed a Software AG partnership at GITEX Global 2022 covering "IoT, Integration, API Management, Business & IT Transformation technologies" (Channel Post MEA, 2022-10-21). Software AG's BPM tool is ARIS, and the Tasree3 app has an "ARIS Default" EPC theme. There is no published statement linking the two.

### 1.9 Status assessment
**Active standalone product. This is the best-documented Meerana product.**

Reasons:
- It has a dedicated bilingual site (live by at least 2026-06-20 and updated 2026-07-08).
- A working multi-tenant web app was redeployed on 2026-09-30.
- It has Terms of Service (last updated 1 Jan 2026), a product page on meerana.ae, and launch posts on LinkedIn in June 2026.

The gaps are commercial proof: no clients, no pricing, no screenshots.

### 1.10 Conflicts noticed
1. **Category label varies:**
   - "AI-Native Process Management Platform" (tasree3.ae)
   - "AI-Assisted Process Mining & Process Engineering" and "AI Process Intelligence" (meerana.ae)
   - "Process Reengineering" (app title)
   - "solution for accelerating Business Process Reengineering (BPR)" (LinkedIn)
   - "Digital Transformation" (meerana.ae chatbot)
   - "Not as a software platform" (CEO post)
2. **"Native" against "assisted":** tasree3.ae says "AI-native… not bolted on"; meerana.ae says "AI-assisted".
3. **Connector maturity:** the same page says adapters "are being added to the connector library", but every card says "Connector ready".
4. **Industries differ:** Energy/Government/Finance/Healthcare/Telecom (tasree3.ae) against Manufacturing/Banking & Finance/Healthcare/Government/Enterprise (meerana.ae).
5. **Ownership wording:** the footer says "Developed by Meerana", but the Terms say the Services "are owned by Tasree3 and its licensors" and the governing law is "laws applicable to your agreement with Tasree3". No Meerana legal entity is named.
6. **Domains:** the app code depends on tasree3.com subdomains, but tasree3.com is listed for sale on Afternic/GoDaddy.
7. **Cross-linking:** meerana.ae does not link to tasree3.ae or app.tasree3.ae; tasree3.ae links back only to meerana.ae/#contact.
8. **Arabic name:** تسريع appears on LinkedIn but not on the Arabic site.

### 1.11 Unknowns
- Pricing and licensing model.
- Real customers or pilots.
- Whether on-prem or sovereign deployment has actually been delivered.
- Which LLM is used by default.
- Whether the SAP/Oracle/ServiceNow connectors are production-ready.
- Who legally owns the "Tasree3" brand and whether it is trademarked.
- The exact launch date.
- Contents of tasree.mp4 (not viewed).

---

## 2. Mandoobee / Mandoobi (smart office / corporate operations)

All findings in this section accessed 2026-10-02.

### 2.1 Names and spellings found
| Spelling | Where | Conf. |
|---|---|---|
| **Mandoobee** | meerana.ae product page; Google Play and App Store title; contact-form option; web-app title (app.meerana.ae) | High |
| **Mandobee** (one "o") | The product URL is `https://www.meerana.ae/mandobee`. The older staging nav reads "New Mandobee". `/mandoobee` (the correct spelling) is **not** a route and renders no page. | High |
| **Mandoobi** | Entrepreneur Middle East "Future 100 (2023)" profile; repeated by aggregators (Tracxn, search snippets) | Medium / Low |
| "Mandoobee (Smart Office)" / "Smart Office Application" / "Smart Office Solution" | Staging pricing header; web-app login subtitle; solutions API; meerana.ae breadcrumb | High |
| Chatbot fuzzy matches: "mandobe", "mandoobe" | meerana.ae chatbot code | High (code) |
| Name collisions (unrelated) | "Mandoobi" parcel app (com.mandoob.sender); "MANDOOBi" FMCG ordering app (BI-Technologies); "مندوبي - Mandooby" (Khtwah); "MandoBee" transport/shipping app (YouTube channel, about 2019) | Low |

### 2.2 Official properties (URLs)
- **Product page:** https://www.meerana.ae/mandobee (single-page-app route).
- **Web app (login):** https://app.meerana.ae/ — title "Mandoobee", login subtitle "Smart Office Application"; bundle Last-Modified 9 Sep 2025.
- **Google Play:** https://play.google.com/store/apps/details?id=ae.meerana.mandoobee
- **App Store:** https://apps.apple.com/ae/app/mandoobee/id6473241950
- **Older page with pricing (staging):** https://uat1.meerana.ae/ (bundle main.82bbce3f.js, 30 Dec 2024).
- **Not Meerana's:** mandoobee.com is a GoDaddy parking page (owner unknown). mandoobee.ae, mandoobi.ae and mandobee.ae do not resolve.

### 2.3 Positioning statements (verbatim)
| Claim (verbatim) | Source | Date | Conf. |
|---|---|---|---|
| Tagline "AI-Powered Workplace Platform"; hero "The Future of Work is Intelligent." | meerana.ae/mandobee | bundle 2026-09-22 | High |
| "Mandoobee brings HR, projects, documents, communication and AI together in one unified platform to help your organization move faster, smarter and better." | meerana.ae/mandobee and chatbot | 2026-09-22 | High |
| "Mandoobee is not just another software. It's an intelligent workplace that thinks, assists, and automates—so your teams can focus on what truly matters." | meerana.ae/mandobee | 2026-09-22 | High |
| Breadcrumb "Smart Office Solution" | meerana.ae/mandobee | 2026-09-22 | High |
| "Mandoobee (PRO Automation)" | meerana.ae chatbot product list | 2026-09-22 | High (but low quality) |
| "Mandoobee is an innovative solution designed to streamline and simplify the daily operations of an office. The app allows employees to punch in and out of the office with ease, ensuring accurate time tracking and efficient payroll management." | uat1.meerana.ae (staging) | 2024-12-30 | High (old) |
| "Smart Office Application": "A smart office application enabling seamless collaboration, smart scheduling, and efficient task management for enhanced productivity and workplace efficiency." | https://api.meerana.ae/allDataInfo/solutionInfo.php?id=3 | — | High |
| "Meerana Information Technology / Business Application with features: …" (store description) | Google Play and App Store | updated 2026-07-23 | High |
| "Meerana offers an artificial intelligence(AI)-driven B2B one-stop smart office application called Mandoobi…" | https://mena.entrepreneur.com/entrepreneurs/meerana/466516 | 2023-09-01 | Medium |

Note: the live site's front-end code filters "Smart Office Application" and "Smart Office Solution" out of the solutions lists. That suggests Mandoobee is the rebrand of the earlier "Smart Office Application". (Analysis)

### 2.4 Users and industries
- **Implied users:** employees, HR, managers and executives ("CEO Dashboard"); no industries are named on the page.
- **Pain points listed:** "Switching between multiple apps", "Delays in approvals and communication", "No real-time visibility or insights", "Repetitive manual tasks".
- **Staging (2024):** "Tailored to the unique needs of UAE businesses"; "Ensure Compliance"; "hybrid work models".
- **Sister app Campus 360 (ae.meerana.campus):** the same attendance, location, meeting and task concept aimed at "schools, colleges, and staff management". (High)

### 2.5 Features and modules
**Product page (meerana.ae):**
- "People & HR": "Manage employees, attendance, leaves, requests and more with complete automation."
- "Work & Projects"
- "Documents & Knowledge": "Smart document workflows, shared folders, OCR, PDF tools and more."
- "Communication": "Chat, groups, announcements and directories…"
- "AI Intelligence": "AI assistant, document Q&A, contract review, smart notes and powerful AI tools."

(High)

**Store listing modules:**
- Task Management
- Meeting Management
- Document Management ("Create, review, sign, and archive")
- Clock In - Clock Out
- Minutes of Meeting
- Chatbot
- Leave and Attendance Management
- Project Management
- Payroll Management
- Internal Chat
- Shared Folder
- Links and Videos
- Asset Management
- AI Document Engine
- OCR and Scan
- AI Note Assistant
- Profile Management

(High)

**Solutions API ("Smart Office Application"):** "GPS Clock In | Out", "Admin Dashboard & Reports", "Asset Management", "Project Management", "Document Management", "Task Management", "Meeting Management". (High)

**Web-app strings (app.meerana.ae bundle):**
- Clock-in/out with "Clocked In From Office / Remote" and clock-in/out location
- Leave and sick-leave requests
- "Request-Work From Remote"
- "Smart Services"
- "CEO Dashboard"
- "Advanced AI"
- "ChatBot"
- "OCR Scanner"
- "AI Notes"
- "AI PDF Generator"
- "AI Document Engine"
- Smart Document approve, reject, sign and archive ("Document desk")
- Minutes of Meeting with signing ("Sign MOM")
- Payroll dashboard and reports
- Employee Directory
- Groups and teams
- Assets
- Announcements
- Holidays
- Chat
- Business card sharing

Arabic translations are present in the web app. (High, code)

**2024 pricing (staging only, no longer live).** Heading "Mandoobee (Smart Office) Plans", "On Cloud (AED)", "One Month Free Trial":

| Plan | Price | Includes |
|---|---|---|
| Basic | "AED 25" per user per month, billed yearly at "AED 300" | Smart Attendance, Smart Service, Dashboard, Employee Directory, Task Management, Meeting Management, Bilingual (EN/AR) |
| Typical | "AED 45" (AED 540 per year) | Smart Document & E-Approvals, Project Management, Group Management, MoM Management, 1GB Storage Cloud Space |
| Advanced | "AED 95" (AED 1140 per year) | Whitelabeling, AI Note Assistant, All Mandoobee Bot, Chat, Asset Register, Shared Folder, Links & Video, 2GB Storage Cloud Space |
| Enterprise | "Contact Us" | All additional features, Customizable IT Support, Custom Document Engine, **IoT Gate Pass**, White labeling, Unlimited Storage |

Every paid plan carries the note "* Integration with any third-party system is excluded." (High, staging, old)

### 2.6 Deployment, hardware and integrations
- "Flexible deployment: on-premise, cloud, or hybrid"; "Bilingual support: Arabic and English"; "White-labeling, customization, and third-party integrations" (meerana.ae, High).
- 2024 plans were "On Cloud (AED)" and excluded third-party integration (staging, High).
- The web-app backend is hosted on Azure App Service, with a further API endpoint on Azure UAE North. (Analysis, from public bundle URLs)
- No integrations are named. The Enterprise plan's "IoT Gate Pass" points to a link with Wasel or smart-gate work (Analysis).

### 2.7 Interfaces and media available publicly
- **Product mock-up (real app UI):** https://www.meerana.ae/assets/smart-office-app.png (825×653). It shows three phones:
  - Services: Smart Attendance, Smart Services, Meeting Calendar, My Project, My Task, Smart Document, MOM, plus a Knowledge Hub.
  - Home: "Swipe here to clock in", total workforce attendance, inbox.
  - CEO Dashboard.

  It also shows an "En | Ar" toggle and is dated 18 Nov 2024. (High)
- **Video:** https://www.meerana.ae/assets/mandoobee_video.mp4 (32,445,796 bytes; LM 13 Aug 2026; plays in a modal). HEAD only.
- **Google Play screenshots (8):**
  - https://play-lh.googleusercontent.com/2Tp6nOThPzP9pYzolmOLZTo-BIIkPOzqjEF5R5NHB_uHyT7Qtnt-_vxAmW1vgpEQdWNNN0yXWETxPeCpzyp2cg
  - https://play-lh.googleusercontent.com/LGGz8N9RX5jRiSM2oTri6xe7YUGUy-lMKWHKd9k1n51Dc42fZf0G0gTuIsORfrXVf07ZcC6eKpMZO6VFuWQy
  - https://play-lh.googleusercontent.com/4ranmW0sKrfI6PqK0PCCwqTqOK52uLOMd-BdyETR8-kouV45OsvqpsdKASX39m5pML7xRAlUpmV2ChhuJUfB
  - https://play-lh.googleusercontent.com/2LWgK5Qs1YY41VhtZd84nPcbOqMtVLRA4UcYCPgQntfbyT4bg6EE11g8pisgn0xtLsjctQ_GQLPsjSX-tUQCqg
  - https://play-lh.googleusercontent.com/3q53V5slgHDZ1j12pCBLgNDGAGgkIl-71HVG31uoa_8VTjStqZWn0C6irF1XTVEjHOLJH-GSZXbLbngguIewMw
  - https://play-lh.googleusercontent.com/S_uhmM6AY58lWOuh1A3-F-hbIjcaJUMAIkj0Dxy97HpcKBPEqpnNw-zUPG7uhn6QR919NoxIDjUZIxDwLhA2tg
  - https://play-lh.googleusercontent.com/LNtPaPDOw-r7mrEcxnNisQ5li7m7utT_JqFMtjSrqIiv_k_yBhiY4u07FqGH9_617avTZAK4e6_BVlVFWCBRKA
  - https://play-lh.googleusercontent.com/JD2ZF39Nc8ztqn-TSDNM6Y4Wyd1LKsHLiSqeNrASoGq59Vxp7gOIzJzpC1nV7O5rdY_bTHjGoPL-OjniaGSj
- **App Store screenshots:** 8 iPhone screenshots taken in the iPhone 16 Pro Max simulator on 2024-12-03; no iPad screenshots. For example:
  - https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4b/b1/88/4bb18891-7e51-606d-bcde-3c72d50dee1e/Simulator_Screenshot_-_iPhone_16_Pro_Max_-_2024-12-03_at_12.34.21.png/320x480bb.jpg
  - The other 7 follow the same path pattern and are available through the listing.

### 2.8 App-store facts
| Field | Google Play | App Store |
|---|---|---|
| Title | Mandoobee | Mandoobee |
| Developer | Meerana Information Technology | Meerana Information Technology (artist 1664675580) |
| Package / bundle | ae.meerana.mandoobee | ae.meerana.mandoobee |
| Category | Business | Business, Productivity |
| First release | — | 2024-12-06 |
| Last update | Jul 23, 2026 | 2026-07-23 (v1.0.17, notes: "Toke issues fix" [sic]) |
| Installs / ratings | **50+ downloads**, 3.9★ | **2 ratings**, 5★ |
| Languages | — | **EN only** (store metadata) |
| Other | PEGI 3; privacy https://www.meerana.ae/privacy; site https://meerana.ae/ | min iOS 18.6; 114 MB; free; 4+ |
| Developer address on Play | "Office No. 110-B, Deira – Abu Hail, Dubai, UAE" (not Business Bay) | — |

All rows: High.

### 2.9 Proof (clients, case studies, awards)
- **Stats on the page** ("512+ Active Organizations", "50K+ Happy Users", "99.9% Uptime & Reliability", "24/7 Dedicated Support") are **not supported** by public data (50+ Android installs, 2 iOS ratings).
- **The "trusted by" strip is placeholder names:** "TechSolutions", "InnoWave", "DigitalCorp", "NextGen", "AlphaSoft", "CloudSync". (High: the content is official; the logos are fake.)
- **Company-level only (not product-specific):** Entrepreneur ME Future 100 (2023) profile naming "Mandoobi". Meerana's MOHRE Emirates Labour Market Award (Workforce Wellbeing & Quality of Life, 2023) is a company HR award, not a product award.

### 2.10 Status assessment
**Active standalone product with low public adoption.** It has native apps on both stores (updated July 2026), a web app, and a product page. Positioning has drifted from "smart office / attendance and payroll" (2023–2024) to "AI-Powered Workplace Platform" (2026).

### 2.11 Conflicts noticed
1. **Name:** Mandoobee, Mandobee (URL) and Mandoobi (press).
2. **Category:** "AI-Powered Workplace Platform" (page) against "PRO Automation" (chatbot) against "Smart Office Application/Solution" (web app, breadcrumb, solutions API).
3. **Bilingual claim:** "Arabic and English" on the site (the web app does contain Arabic strings), but the App Store metadata lists English only.
4. **Deployment:** "on-premise, cloud, or hybrid" (2026 page) against cloud-only plans (2024).
5. **Adoption:** 512+ organisations and 50K users against store data.
6. **Typo on the page:** "Improved HQ, payroll, workflow, and support visibility" (likely "HR").
7. **Web-app link typo:** business-card sharing uses "https://meeerana.ae" (three e's).
8. **Dates:** the web app was last deployed Sep 2025; the mobile apps were updated Jul 2026.

### 2.12 Unknowns
- Current pricing.
- Real customers.
- Whether "512+ organisations" counts something else (for example, tenants on Tamkeen HRMS).
- Whether the "PRO automation" positioning (Gulf mandoob or PRO services) is still intended.
- Relationship to Campus 360 (sister white-label?).
- Contents of mandoobee_video.mp4.

---

## 3. Wasel (IoT smart gate and access control)

All findings in this section accessed 2026-10-02.

### 3.1 Names and spellings found
| Spelling | Where | Conf. |
|---|---|---|
| **Wasel** | Product name, contact-form option and route `/wasel` on meerana.ae | High |
| **WASEL** | Upper case in the page body copy and chatbot | High |
| Chatbot fuzzy matches: "wasal", "wassel" | meerana.ae chatbot code | High (code) |
| "Remotioo Smart Gate" (likely predecessor or related) | meerana.ae `/accelerator`. **This is the third-party product "Remootio"** (see 9.2) | High |
| "Smart Gate Management" | Clutch ("Meerana Accelerator Products such as Smart Gate Management, Green Hub") | Low |
| "IoT Gate Pass" | 2024 Mandoobee Enterprise plan (staging) | High (old) |
| Name collisions (unrelated) | Dozens of "Wasel" apps: delivery, VPN, transport, Egypt's MCIT accessibility app, "Wasel - واصل للمراسلات" (Edrak, correspondence), Wasl properties. **None** is published by Meerana. | Low |

### 3.2 Official properties (URLs)
- **Product page:** https://www.meerana.ae/wasel (single-page-app route).
- **No app in either store.** Neither Google Play nor App Store has a Wasel app from "Meerana Information Technology". Guessed package IDs such as ae.meerana.wasel return 404, and App Store searches for "wasel" in the AE and US stores return no Meerana results.
- **No dedicated domain:** wasel.ae and waselgate.ae do not resolve; wasel.meerana.ae does not exist.
- The "Powered by www.meerana.ae" logo mentioned in the brief **was not found on any public page or search result.** The cover image does not show it.

### 3.3 Positioning statements (verbatim)
| Claim | Source | Conf. |
|---|---|---|
| Tagline "Smart Gate & Access Control System"; hero "Smart Access. Total Control. Anywhere." | meerana.ae/wasel | High |
| "WASEL is an IoT door and gate management solution that modernizes access control through multi-mode connectivity, real-time monitoring, and secure role-based access. It is designed for residential communities, villas, apartments, commercial facilities, and multi-gate environments." | meerana.ae/wasel (and chatbot) | High |
| "WASEL is a smart IoT-based gate and door access control system that connects mobile applications, IoT gate controller hardware, cloud services, local network access, and Bluetooth fallback modes to provide flexible, secure, and real-time access management." | meerana.ae/wasel | High |
| Breadcrumb "IoT Access Solution"; section "IoT Door & Gate Management Excellence" | meerana.ae/wasel | High |
| "Wasel (Logistics)" | meerana.ae chatbot product list | High (but contradicts the page) |

### 3.4 Users and industries
Use cases (meerana.ae):
- "Residential Communities" (resident gates, visitor passes)
- "Commercial Buildings" (office floors, staff parking, server rooms)
- "Industries & Warehouses" (loading docks, yards)
- "Parking Lots" ("Integrate automatic ticketing arm control and smart parking sensors.")
- "Toll Gates" ("High-speed automatic barrier controls linked to billing systems.")
- "Construction Sites" ("Perimeter gate tracking for safety compliance and contractor check-ins.")

(High)

### 3.5 Features and modules (verbatim titles)
- "Multi-Mode Connectivity": "Connect via Cellular, Local Wi-Fi, Bluetooth, or local offline configurations."
- "Mobile App Control"
- "Real-Time Monitoring": "Track gate position sensors, temperature, humidity, and active status feeds."
- "IoT Gate Controller": "Industrial-grade hardware controller unit with plug-and-play connections."
- "Audit & Activity Logs"
- "Multi-Gate Management"
- "Access Security": "Encrypted keys, administrative privileges, user management, and roles."
- "Device Provisioning": "Fast OTA provisioning, setup wizards, and automatic device configurations."
- "Fallback & Offline Modes": "Offline BLE Bluetooth access ensures you never get locked out during internet downtime."

(High)

### 3.6 Deployment, hardware and integrations
- **Hardware:** an "IoT gate controller" unit is claimed, but there is **no model name, spec sheet, certification or photo of real hardware.**
- **Connectivity:** cellular, Wi-Fi, BLE and offline.
- **Stats:** "99.9% System Uptime", "BLE Offline Fallback", "256-bit AES Encryption", "<1s Response Delay".
- **Simulated UI:** "Wasel Mobile Key", "Device: Main Entry Gate 01", "Auto-Close configured for 60 seconds. Uses BLE Local Key fallback mode automatically if Wi-Fi goes offline."

(High as claims; unverified)

### 3.7 Interfaces and media available publicly
- **Video:** https://www.meerana.ae/assets/wasel.mp4 (2,066,755 bytes; LM 13 Aug 2026; modal on /wasel). HEAD only.
- **Cover:** https://www.meerana.ae/assets/wasel_cover_banner.png (JPEG 1024×1024). It is an AI-generated scene: a fictional "OAKWOOD RESERVE" community, a barrier arm, and a phone showing "GATE OPEN".
- No app screenshots exist anywhere public.

### 3.8 Proof
None: no clients, installations, case studies or certifications.

### 3.9 Status assessment
**Insufficiently documented (product page plus video only).**
- It is possibly the productised successor of the accelerator-era "Remotioo/Remootio Smart Gate" and the "IoT Gate Pass" add-on (Analysis).
- No evidence of a shipped app or hardware in public channels.

### 3.10 Conflicts noticed
- Chatbot calls it "Logistics"; the page says gate access control.
- Badge typo: "Secure & Encripted".
- The meerana.ae accelerator page still shows a third-party gate controller (Remootio) under a misspelled name.

### 3.11 Unknowns
- Controller hardware (in-house or OEM), its certifications, and the app name in the stores.
- Pricing, installations, and whether the "Powered by www.meerana.ae" logo is in use.

---

## 4. Yisbir (Arabic: يسبر). AI video intelligence

All findings in this section accessed 2026-10-02.

### 4.1 Names and spellings found
| Spelling | Where | Conf. |
|---|---|---|
| **Yisbir** | meerana.ae, LinkedIn, demo portal title | High |
| **YISBIR** | yisbir.com wordmark: "YISBIR by Meerana Technologies" | High |
| **يسبر** (Arabic) | LinkedIn launch post: "الاسم مستمد من 'السبر' ليعبر عن عمق المراقبة والتحليل" ("the name derives from 'al-sabr' [probing] to express the depth of monitoring and analysis") | Medium |
| Chatbot fuzzy matches: "yisbeer", "yasbir", "yisbr" | meerana.ae chatbot code | High (code) |

### 4.2 Official properties (URLs)
- **Dedicated site:** https://yisbir.com/. Separate domain, Vite/React; Last-Modified 27 Jan 2026. Footer: "© [year] Meerana Technologies. All rights reserved."
- **Demo portal:** https://demo.yisbir.com/. Title "Yisbir"; "Guest Login"; "Video Analytics / Video Indexer"; self-registration with "Residential / Institution" types; "Welcome to Yisbir Dashboard: Experience the power of our advanced Video Analytics and Video Indexer." Not used.
- **Other subdomain:** indexer.yisbir.com (certificate exists; no response).
- **Corporate product page:** https://www.meerana.ae/yisbir (single-page-app route).
- **Contact e-mail on yisbir.com:** `info@yisbir.ai`. **yisbir.ai does not exist (NXDOMAIN)**, so enquiries sent there will bounce. yisbir.com itself has Microsoft 365 MX records.

### 4.3 Positioning statements (verbatim). Settling the conflict
| Claim | Source | Date | Conf. |
|---|---|---|---|
| Eyebrow "AI-Powered Video Intelligence"; H1 "Transform Your Video Into Searchable Intelligence" | https://yisbir.com/ | LM 2026-01-27 | High |
| "YISBIR indexes video with AI-powered face recognition, multilingual transcription in 50+ languages, and powerful semantic search — turning hours of footage into instantly accessible knowledge." | yisbir.com | 2026-01-27 | High |
| "The Complete AI Video Intelligence Platform" / "YISBIR AI Video Intelligence Platform" | yisbir.com | 2026-01-27 | High |
| About section: "Pioneering AI-Powered Operational Intelligence": "YISBIR is developed by Meerana Technologies, experts in crafting cutting-edge AI and robotics solutions that seamlessly integrate into existing technology ecosystems…" | yisbir.com | 2026-01-27 | High |
| "MEERANA is pleased to introduce Yisbir, our Agentic AI-powered video indexing system. Derived from the Arabic term for surveillance, Yisbir is engineered as a fully on-premise solution, eliminating the need for public cloud connectivity. By utilizing internal data centers with minimal GPU overhead…" | https://ae.linkedin.com/posts/meerana_meerana-yisbir-agenticai-activity-7470169460633554944-2uxA | 2026-06-09 | Medium |
| Tagline "AI-Powered Video Analytics & Indexing"; hero "Turn Every Video into Intelligent Data."; "Yisbir uses advanced AI to analyze, index, and understand videos—so you can find anything, faster, unlock insights, and take action in real time." | meerana.ae/yisbir | bundle 2026-09-22 | High |
| Breadcrumb "Video Analytics Solution" | meerana.ae/yisbir | 2026-09-22 | High |
| Vertical module: "Yisbir for Construction & Infrastructure": "AI-Powered Construction Site Intelligence Platform": "Transforming CCTV Cameras into Safety, Compliance & Operational Intelligence Tools" | meerana.ae/yisbir | 2026-09-22 | High |
| **Outlier:** "Yisbir is an AI-powered talent acquisition and smart recruitment matching platform designed to streamline enterprise hiring." and "Yisbir (AI HR)" | meerana.ae chatbot fallback text | 2026-09-22 | High as text; **wrong** |

**Resolution (Analysis):** Every dated official source (yisbir.com in Jan 2026, the LinkedIn launch in Jun 2026, the demo portal, and meerana.ae in Sep 2026) agrees on the core product: **an AI video indexing and search platform.** It indexes faces, transcribes speech in 50+ languages, extracts text from documents, and offers multimodal search. It is sold as "AI video intelligence".
- "Construction Site Intelligence" is a **vertical module or use case** on meerana.ae only.
- "Operational Intelligence" is the **About-section framing** on yisbir.com (and a phrase in the construction tagline).
- The "AI HR / recruitment" description exists only in chatbot fallback text. It is almost certainly a leftover error.

A Meerana employee's comment on the launch post summarises it as "VIDEO, AUDIO & DOCUMENT INDEXING", which matches yisbir.com's feature set.

### 4.4 Users and industries
| Source | Users and industries |
|---|---|
| meerana.ae | "Smart Cities", "Retail", "Transportation", "Banking", "Manufacturing", "Healthcare", "Education", "Energy", "Hospitality", plus the construction and infrastructure module |
| LinkedIn | "national and large organizations" (Arabic post) and "organizations that prioritize data sovereignty"; alignment with the "UAE government's strategy to integrate AI into 50% of government operations" |
| Demo portal | Registration types "Residential / Institution" |

### 4.5 Features and modules
**yisbir.com:**
- "Video Indexing" (person identification and face recognition)
- "Audio Transcription" ("50+ languages with speaker diarization")
- "Document Scanning" ("LLM-powered document analysis… with OCR")
- "Person Clips"
- "50+ Languages"
- "Secure Downloads"
- "Video Library"
- "Access Control"
- "System Integration" ("Seamless API integration")
- Search types: "Face Search", "Phrase Search", "Metadata Search", "Similarity Search", "Fuzzy & Synonym", "Vector Search"
- Workflow: "Upload Content → AI Processing → Search & Discover → Export & Share"

(High)

**meerana.ae:**
- Capabilities: "Object & Motion Detection", "Facial Recognition", "Video Summarization", "Metadata Extraction" (text, license plates, logos), "Scene Change Detection", "Cross-Camera Search".
- Construction detections: "Missing Safety Helmets", "Missing Safety Vests", "Unsafe Work Practices", "Restricted Zone Entry", "Fall & Incident Detection", "Workers in Hazardous Areas".
- "Site Security & Asset Protection".
- "Smart Investigations: Find. Verify. Act." (search by person attributes, vehicle and plate, location, date and time).

(High)

### 4.6 Deployment, hardware and integrations
| Claim (verbatim) | Source | Conf. |
|---|---|---|
| "fully on-premise solution, eliminating the need for public cloud connectivity… internal data centers with minimal GPU overhead" | LinkedIn, 2026-06-09 | Medium |
| "Built for scale with cloud, on-premise, and hybrid deployment options." / "Solutions that work with your existing infrastructure, no hardware changes required." | yisbir.com | High |
| "Real-Time Processing", "500+ Cameras Supported" | meerana.ae | High |

### 4.7 Interfaces and media available publicly
- **Video:** https://www.meerana.ae/assets/yisbir.mp4 (27,845,919 bytes; LM 13 Aug 2026; modal). HEAD only. yisbir.com has a "Watch Video" button (target not resolved).
- **Covers and screenshots:**
  - https://www.meerana.ae/assets/yisbir_cover_banner.png (AI-generated construction-site image; the camera is labelled "**SENTINEL** AI-V12 Site Monitor", not Yisbir).
  - yisbir.com hero image `/assets/hero-bg-*.jpg` and a dashboard image labelled "yisbir.ai/dashboard".
- **Simulated console on meerana.ae:** "Yisbir Video AI Console v2.4" (24,331 videos; "AI Accuracy 98.6%").
- **Live demo portal:** https://demo.yisbir.com (registration or login needed).

### 4.8 Proof
- No clients or case studies.
- Unverified metrics: "99.2% AI Detection Accuracy", "10M+ Hours of Videos Processed", "500+ Cameras Supported" (meerana.ae); "95% Search Accuracy", "10x Faster Review" (yisbir.com).
- LinkedIn launch post: 48 reactions, 2 comments.

### 4.9 Status assessment
**Active standalone product.** It has a dedicated domain and site (Jan 2026), a live demo portal, a launch post (Jun 2026) and a product page (Sep 2026).

### 4.10 Conflicts noticed
1. Category: video indexing and search against CCTV construction safety analytics against HR recruitment (chatbot).
2. Deployment: "fully on-premise… no public cloud" (LinkedIn) against "cloud, on-premise, and hybrid" (yisbir.com).
3. Accuracy figures disagree: 99.2%, 98.6% and 95%.
4. Contact domain yisbir.ai does not exist.
5. meerana.ae does not link to yisbir.com, and yisbir.com does not link to meerana.ae.
6. The cover image shows "SENTINEL" branding.

### 4.11 Unknowns
- Clients and pilots.
- Hardware sizing (GPUs).
- Whether face recognition is offered in the UAE and how it is governed.
- Pricing.
- What indexer.yisbir.com is.
- Contents of yisbir.mp4.

---

## 5. Nazo / Nazoo (correspondence and workflow management)

All findings in this section accessed 2026-10-02.

### 5.1 Names and spellings found
| Spelling | Where | Conf. |
|---|---|---|
| **Nazoo** | Product page name, route `/nazoo`, cover file `nazoo_cover_banner.png` | High |
| **NAZO** | Contact-form option; chatbot list "NAZO (Document Management)"; video file `nazo.mp4`; subdomain `nazo.meerana.ae` (certificate seen through Cert Spotter) | High |
| Chatbot fuzzy match: "naazoo" | meerana.ae chatbot code | High (code) |
| "NAZO Crystal Clear" | **Not found** in any public source | — |
| Name collisions (unrelated) | nazoo.com (Japanese sports-massage studio); several "Nazo" puzzle and food apps | Low |

### 5.2 Official properties (URLs)
- **Product page:** https://www.meerana.ae/nazoo
- **Subdomain:** `nazo.meerana.ae` has a TLS certificate but **did not respond** on 2026-10-02.
- No app and no dedicated domain: nazo.ae and nazoo.ae do not resolve.

### 5.3 Positioning statements (verbatim)
| Claim | Source | Conf. |
|---|---|---|
| Tagline "Correspondence & Workflow Management System"; hero "Smarter Correspondence. Stronger Decisions. Zero Chaos." | meerana.ae/nazoo | High |
| "Nazoo empowers organizations to initiate, manage, track, approve, sign, and archive internal and external communications through a secure digital platform." | meerana.ae/nazoo and chatbot | High |
| "Nazoo is a digital correspondence platform that simplifies how organizations manage official communication, documents, approvals, templates, tracking, and archiving. It supports secure workflows from document initiation to review, approval, e-signature, status tracking, and final storage." | meerana.ae/nazoo | High |
| Breadcrumb "Correspondence Management"; section "Digital Correspondence & Workflow Excellence" | meerana.ae/nazoo | High |
| "NAZO (Document Management)" | meerana.ae chatbot list | High (but differs) |

### 5.4 Users and industries
Use cases: "Corporate Offices", "Executive Admin", "Document Control", "Legal Compliance", "HR & Finance", "Correspondence Desk". (High)

### 5.5 Features and modules
- "Inbox & Outbox Management"
- "Template Management" (letters, circulars, memos)
- "Correspondence Initiation" ("…instantly with AI assistance")
- "Workflow Management"
- "Search & Filter" ("smart metadata and OCR text search")
- "User Management" ("signature authority levels")
- "Document Management"
- "Data Security & Vault" ("encryption keys, and complete audit trail logs")
- "E-Signatures" ("Legally compliant, secure electronic signatures…")

(High)

### 5.6 Deployment and integrations
- "Flexible deployment: on-premises or cloud". (High)
- No integrations are named (for example, government e-correspondence networks or e-signature providers).

### 5.7 Interfaces and media available publicly
- **Video:** https://www.meerana.ae/assets/nazo.mp4 (23,483,149 bytes; LM 13 Aug 2026). HEAD only.
- **Cover:** https://www.meerana.ae/assets/nazoo_cover_banner.png (AI-generated "Secure Digital Mail Inbox and Document Workflow Management System" monitor).
- **Simulated "Nazoo Workflow Dashboard":** 12,842 letters; approval queue includes "**Official Letter to ADIB Bank**" (a real bank name in mock data; ADIB also appears among company-level partner/client logos).

### 5.8 Proof
None product-specific. Badges and stats ("10x Faster Processing", "100% Secure & Compliant", "Zero Manual Follow-ups") are unverified.

### 5.9 Status assessment
**Insufficiently documented.** There is a product page, a video, and a dormant or unresponsive subdomain. There are no external mentions, no app, and no clients.

### 5.10 Conflicts noticed
1. Name spelled Nazoo and NAZO.
2. Category "Correspondence & Workflow" against "Document Management" (chatbot).
3. The "Crystal Clear" tagline from the brief is not public.
4. The mock UI uses a real bank's name.

### 5.11 Unknowns
- Whether NAZO is the same system that runs at nazo.meerana.ae.
- Arabic support (likely needed for government correspondence; not stated).
- E-signature legal basis (UAE PASS?).
- Clients and pricing.

---

## 6. Smart Tracking / Asset Tracking

All findings in this section accessed 2026-10-02.

### 6.1 Names and spellings found
| Spelling | Where | Conf. |
|---|---|---|
| **Asset Tracking** | Product name, route `/asset-tracking`, contact-form option | High |
| **Smart Tracking** | Hero copy, "What is Smart Tracking?", "Key Benefits of Smart Tracking", "Smart Tracking Console v1.0", "ST" monogram | High |
| "IoT Asset Tracking" | Chatbot product list | High |
| "RFID & IoT Powered Asset Tracking System" / "RFID & IoT Solution" | Tagline / breadcrumb | High |

### 6.2 Official properties (URLs)
- **Product page:** https://www.meerana.ae/asset-tracking (cover image updated 22 Sep 2026, the newest product asset on the site).
- **Related subdomains (Analysis; linkage unconfirmed):**
  - https://inventory.meerana.ae: "Inventory Management" / "Inventory Management System & Asset Register" (login)
  - `location.meerana.ae`: returned 502
- No app in either store.

### 6.3 Positioning statements (verbatim)
| Claim | Source | Conf. |
|---|---|---|
| Hero "Track Every Asset. Maximize Every Opportunity."; "Smart Tracking helps organizations gain real-time visibility, improve asset utilization and reduce losses with RFID-powered intelligence." | meerana.ae/asset-tracking | High |
| "Our Asset Tracking system is an enterprise-grade IoT platform that maps and monitors company inventory, heavy machineries, fleet shipments, and tools using rugged RFID tags and active GPS telemetry, giving organizations absolute operational visibility and audit-readiness." | meerana.ae/asset-tracking | High |
| "Our Asset Tracking system leverages IoT, RFID, and Bluetooth BLE technology for real-time location tracking, inventory management, and equipment security." | meerana.ae chatbot | High |

### 6.4 Users and industries
- "Construction", "Healthcare", "Manufacturing", "Logistics", "Retail", "Government". (High)
- **Workforce tracking is NOT described on this page.** Workforce or staff location tracking appears instead in Mandoobee (GPS clock-in/out, "Clocked In From Office/Remote") and Campus 360 ("real-time location tracking").

### 6.5 Features and modules
- "Real-time Tracking"
- "Inventory Management"
- "Maintenance Management"
- "Loss Prevention" ("geofencing alerts, unauthorized movement alarms")
- "Compliance & Audit"

Benefits include "Integrates with existing CRM, ERP, and databases" and "Supports active GPS, BLE beacons, and passive RFID hardware". (High)

### 6.6 Interfaces and media available publicly
- **Cover:** https://www.meerana.ae/assets/asset_tracking_cover_banner.png (AI-generated RFID warehouse scene).
- **Simulated console:** "Smart Tracking Console v1.0" with "EXCAVATOR_123" and "GENERATOR_RFID", over the map image `/assets/earth-night.jpg`.
- **No video** (the only product page without one).

### 6.7 Proof
None. The "stats" ("12,548 Total Assets Tracked", "99.8% Accuracy Rate", "-18% Loss Reduction", "87% Asset Utilization") **are the same numbers as the simulated console** (Total Assets 12,548; Utilization 87%). In other words, demo data is presented as results (Analysis). "Reduced asset retrieval and lookup times by 90%" is unsourced.

### 6.8 Status assessment
**Solution category / insufficiently documented.** There is a page with no app, no video, no hardware partner and no clients. It possibly sits on the inventory and asset-register app (unconfirmed).

### 6.9 Conflicts noticed
1. Product name: "Asset Tracking" against "Smart Tracking".
2. The brief calls it "asset & workforce tracking", but the public page covers assets only.
3. Demo numbers are presented as results.

### 6.10 Unknowns
- RFID and GPS hardware vendors.
- Whether inventory.meerana.ae or location.meerana.ae is the product.
- Workforce-tracking scope.
- Clients.

---

## 7. "MEERANA AI in a Box" (on-prem AI appliance)

All findings in this section accessed 2026-10-02.

### 7.1 Names and spellings found
| Spelling | Where |
|---|---|
| "Meerana AI in a Box" | CEO post |
| "#Ai in a box" | CEO post hashtag |
| "Sovereignty Is Your Right. Meerana Delivers It." | Company reshare |

The all-caps "MEERANA AI in a Box" spelling used in the brief was not seen publicly. "AI in a Box" is also used by other vendors (Beyond.ai, Understand Tech, Blackbeard), so there is a **naming-collision risk**.

### 7.2 Official properties
**None.** There is no page on meerana.ae, tasree3.ae or yisbir.com, and no domain (aiinabox.ae does not resolve; ai.meerana.ae does not exist). The only sources are LinkedIn posts.

### 7.3 Positioning statements (verbatim)
| Claim | Source | Date | Conf. |
|---|---|---|---|
| "AI is powerful. Sovereign AI is transformational. Imagine an AI platform that runs entirely inside your organization—reviewing contracts, orchestrating AI agents, automating workflows, generating executive reports, and protecting every piece of data. No public cloud. No compromise. Just enterprise intelligence with complete data sovereignty. Meerana AI in a Box. Sovereignty in Your Hands." | https://www.linkedin.com/posts/mataralmehairi_ai-ai-sovereignai-activity-7480383760581050368-ovz8 (CEO; 104 reactions, 12 comments) | 2026-07-07 | Medium |
| "#Sovereignty Is Your Right. Meerana Delivers It." (company reshare) | https://www.linkedin.com/posts/meerana_sovereignty-activity-7480385897809694720-Bqox | 2026-07-07 | Medium |
| "At Meerana, this is the work we do every day: building sovereign AI solutions and enterprise platforms, deployed locally and secured by design." | https://www.linkedin.com/posts/meerana_sovereignai-uae-artificialintelligence-activity-7482585075105116161-AKFN | 2026-07-14 | Medium |
| A third-party commenter: "…no more headaches around AI pricing or token consumption." | Comments on the CEO post | 2026-07 | Low |

### 7.4 Users, features, hardware
- Features implied: contract review, AI-agent orchestration, workflow automation, executive reports, data protection.
- **No hardware specification, model list, GPU sizing, pricing or customers are public.**
- Related evidence: the Tasree3 app supports local OpenAI-compatible LLM endpoints (Ollama, vLLM); Yisbir claims on-prem operation with "minimal GPU overhead"; Mandoobee advertises "contract review" and an AI document engine. Whether "AI in a Box" bundles these is unknown (Analysis).

### 7.5 Media and proof
None found. No video, and the YouTube channel is empty.

### 7.6 Status assessment
**Announced concept / insufficiently documented.** Two LinkedIn posts in July 2026 are the only evidence.

### 7.7 Unknowns
Everything beyond the post copy: form factor (appliance or software stack), included products, models, pricing, availability.

---

## 8. "Meerana Intelligence Layer"

All findings in this section accessed 2026-10-02.

- **Not found** in any public source:
  - meerana.ae bundle and API
  - tasree3.ae and app bundle
  - yisbir.com
  - LinkedIn guest pages
  - web search for the exact phrase
- **Closest phrases:**
  - "A context-aware AI layer that reads your process data…" (tasree3.ae home)
  - "Smart AI layer" (tasree3.ae/why.html; meerana.ae/tasree3 feature "Smart AI Layer")
- **Status:** not public. If it is a planned umbrella brand, nothing yet supports it.

---

## 9. Other Meerana products, solution items and apps

All findings in this section accessed 2026-10-02. The source for the "Our Unique Products" list is https://api.meerana.ae/allDataInfo/solutionInfo.php?id=3. That list contains "Smart Office Application, Hi Legal Management Apllication [sic], Real Estate & E-Commerce Application, EV Charger, Green Hub, Warehouse Management". (High)

### 9.1 Green Hub
| Claim | Source | Conf. |
|---|---|---|
| "A green hub serving as a sustainable ecosystem fostering environmental awareness, innovation, and collaboration towards a greener future." Features: "EV Charging Station", "Donation Boxes", "Locker Systems", "Converter chargers", "Plants & Food Corner" | solutionInfo.php?id=3; meerana.ae `/accelerator` ("Meerana Accelerator") | High |
| "Meerana Accelerator Products such as Smart Gate Management, Green Hub" | https://clutch.co/profile/meerana-technologies | Low |

- **Media:** https://www.meerana.ae/assets/greenhub.webp is an architectural rendering captioned "BUSINESS CENTER". Its origin is unknown.
- **Status:** legacy / concept. No activity since 2023–2024; the accelerator page is not linked from navigation.

### 9.2 "Remotioo Smart Gate" is Remootio, a third-party product
- **meerana.ae `/accelerator`:** "The First end to end encripted Wi-Fi and bluetooth  enabled smart remote controller that let you control and monitor your gates and garage doors using your smartphone". The image https://www.meerana.ae/assets/remotioo.webp **is Remootio's own branded marketing image** (REMOOTIO logo, "Remootio 3" box). (High)
- **remootio.com:** "Remootio smart gate and garage door opener is an end-to-end encrypted Wi-Fi and Bluetooth enabled smart remote controller, that lets you control and monitor your gates and garage doors using your smartphone." Remootio is made by Assemblabs Ltd, Budapest, Hungary (App Store artist "Assemblabs Ltd"; seller "Assemblabs Korlatolt Felelossegu Tarsasag"; app id1456463154). (High for Remootio)
- **Status:** a third-party product presented under a misspelled name. It should not be shown as a Meerana product. Whether Meerana is a reseller is unknown.

### 9.3 Legal management: "Hi Legal"
| Claim | Source | Conf. |
|---|---|---|
| "Hi Legal Management Application": "A legal management application streamlining legal workflows, document management, and case tracking for efficient law practice management." Features: Litigation Case Management, Document & Contracts Management, Task Management, Meeting Management | solutionInfo.php?id=3 | High |
| "Hi Legal is a comprehensive and user-friendly app that simplifies the legal process for individuals and businesses…" | Google Play `ae.meerana.hilegal` (updated Aug 27, 2025; **10+ downloads**) and App Store id1669429571 (released 2023-02-07; v2.0.4, 2025-08-27; 1 rating) | High |
| "…an AI-driven legal application called Hi Legal." | Entrepreneur ME, 2023-09-01 | Medium |

- **Media:** Play listing has 22 screenshots; App Store has 8 iPhone and 5 iPad screenshots.
- The Play privacy link points to `https://www.meerana.ae/#/privacy`, an old hash route.
- **Status:** legacy app. No update for 13 months and minimal installs.

### 9.4 Real estate and e-commerce
- "Real Estate & E Commerce Application": "A real estate application empowering users to seamlessly search, buy, sell, and manage properties with comprehensive listings, interactive maps, and personalized features." Features: "Land Selling/Buying", "Property Selling/Buying", "Admin Portal with Reports & Dashboards", "Client Portal with end-to-end Land acquisition". (High)
- No public app was found.
- The "Noon Herb" e-commerce app (`ae.meerana.noonherb`; India storefront only; updated Sep 25, 2024; privacy policy on noonherb.in) is published under Meerana's developer account and looks like a client build.
- **Status:** legacy / solution category.

### 9.5 EV charging
- "EV Charger": "An EV charger providing fast, convenient, and eco-friendly charging solutions for electric vehicles, promoting sustainable transportation." Features: "Type 1 chargers", "Type 2 chargers", "CHAdeMO chargers", "GB/T Chargers". (High)
- Entrepreneur ME (2023) lists "electric vehicle charging" among Meerana's solution areas. (Medium)
- **Status:** legacy / solution category. No product or brand.

### 9.6 Warehouse management
- "Warehouse Management": "Warehouse management system optimizing inventory control, logistics, and operations…" Features: "Automated Sortation system", "Overlapping Process", "Master Data", "Inbound and Outbound", "Inventory Management", "Logistic Management", "Finance Management", "Order Management". (High)
- Possibly related: inventory.meerana.ae (Analysis).
- **Status:** solution category.

### 9.7 Items discovered that were not in the brief
| Item | Evidence | Conf. | Status |
|---|---|---|---|
| **Tamkeen HRMS** | https://hrms.meerana.ae and https://meerana.hrms.meerana.ae: title "Tamkeen HRMS", meta "Multi-tenant SaaS HRMS — Hire-to-Retire". Listed in the Tasree3 app as a "Supported" connector (recruitment, leave, onboarding). Not mentioned on meerana.ae. The name collides with Saudi "Tamkeen Human Resources" and others. | High (existence) | Undocumented product or internal system |
| **Campus 360** | Google Play `ae.meerana.campus` ("smart mobile solution designed for schools, colleges, and staff management… automated attendance, real-time location tracking, meeting scheduling, and task management"; updated Sep 24, 2026; 100+ downloads; AE and IN storefronts). Also campus360.meerana.ae (a school website). | High | Active small app (an education variant of the smart-office concept) |
| **Skillyfy** | Google Play `ae.meerana.skillyfy` (learning platform; updated Oct 17, 2025; 1+ download) | High | Dormant |
| **Zing HR** | Chatbot: "We provide Zing HR integration for comprehensive human capital management, payroll automation, leave tracking, and employee self-service." Also a contact-form option. ZingHR is a third-party HCM vendor. | High (text) | Partner or resale item, not a Meerana product |
| **Voice Assistance / "VOC Solution Using Gen AI"** | Contact-form option "Voice Assistance"; solutions API "VOC Solution Using Gen AI" ("live integration, sentiment analysis, feedback monitoring…" per chatbot) | High | Solution item |
| Client or other apps on meerana.ae subdomains | crm.meerana.ae ("Meerana CRM"), hotel.meerana.ae ("Hotel Management"), dabweb.meerana.ae ("Dar Al Ber"), arv.meerana.ae ("Ali RV - Premium Motorhomes in Dubai"), uatcampus (502) | High (titles only) | Client projects or internal tools |

---

## 10. Cross-cutting findings relevant to the redesign

| # | Finding | Evidence | Conf. |
|---|---|---|---|
| 1 | **Product pages on meerana.ae appear to be orphaned.** The routes `/tasree3`, `/yisbir`, `/mandobee`, `/nazoo`, `/wasel`, `/asset-tracking` and `/accelerator` exist, but the nav "Solutions" menu and the homepage "Solutions" cards only map API titles (Consultation, Bespoke Products, Our Unique Products, Managed Services) to `/construction?id=N`. None of those titles matches a product, so no internal link reaches the product pages. | main.5717dfa4.js routing and nav code; solutionInfo.php | Analysis (code-level; not a visual crawl) |
| 2 | **No cross-links between properties.** meerana.ae does not link to tasree3.ae, yisbir.com, app.meerana.ae or the app stores. yisbir.com does not link to meerana.ae. tasree3.ae links only to meerana.ae/#contact. | Bundle string search | High |
| 3 | **The chatbot shows wrong positioning.** The fallback answers call Yisbir "AI-powered talent acquisition…" and list "Mandoobee (PRO Automation), Tasree3 (Digital Transformation), NAZO (Document Management), Wasel (Logistics), Yisbir (AI HR), Zing HR, ERP, IoT Asset Tracking, and Cloud Services". The live chatbot endpoint is a plain `http://` raw-IP address, which browsers block from an https page, so visitors most likely always see these fallback answers. | Bundle | High (text); Analysis (mixed-content effect) |
| 4 | **Placeholder content is live.** Testimonials in the API are Lorem Ipsum ("Lorem Ipsum is simply dummy text…"). Mandoobee's "trusted by" list is invented names. The asset-tracking "stats" equal the demo console numbers. | testimonalsInfo.php; bundle | High |
| 5 | **All product cover images are AI-generated concept art.** Some carry non-product brand names ("BPM INSIGHTS", "SENTINEL", "OAKWOOD RESERVE"). The only real product UI image is Mandoobee's `smart-office-app.png`. Real app screenshots exist only on the app stores. | Viewed images | High |
| 6 | **Entity and address inconsistencies.** Names in use: "Meerana Information Technology" (app stores, Arabic "ميرانا لتقنية المعلومات" on LinkedIn), "Meerana Technologies LLC" (site footer, still "© … 2024"), "MEERANA" (LinkedIn). Addresses in use: LinkedIn "Business Bay - Blue Bay Tower - 17 floor - 1706"; CB Insights "#1704, Blue Bay Tower"; Google Play developer "Office No. 110-B, Deira – Abu Hail". A separate Indian entity, **Meerana Technologies LLP** (Chennai, incorporated 19 Jan 2023), exists, and several store listings carry Indian (+91) phone numbers. | LinkedIn, CB Insights, Google Play, Tracxn | High / Low (aggregators) |
| 7 | **Company profile PDF.** https://www.meerana.ae/assets/Meerana%20Profile.pdf (32 MB; LM 13 Aug 2026) is directly reachable even though the site gates it behind an e-mail form. **Not downloaded or read here**, but it may contain product descriptions worth checking. | HEAD | High (existence) |
| 8 | **Social and video channels hold no product material.** YouTube @MeeranaTechnologies has no videos. The only Meerana videos on YouTube are third-party: "Dubai Dreamers: From Dubai to the World with Meerana Technologies" (Dubai Chambers, about 2 years ago, around 2.6K views; embedded on meerana.ae) and "Meet Meerana Information Technology winner of Emirates Labour Market Award" (MOHRE). Product videos exist only as MP4 files on meerana.ae. | YouTube | High |
| 9 | **Company-level proof (not product-specific)** usable on an "About" page: <br>• Software AG partnership signed at GITEX Global 2022 (Channel Post MEA, 2022-10-21) <br>• Entrepreneur ME Future 100 (2023) <br>• MOHRE Emirates Labour Market Award, Workforce Wellbeing (2023; site news and MOHRE video) <br>• FPT Software partnership (FPT release 2024-08-19; Dubai Media Office 2024-08-08) <br>• Dubai Founders HQ Accelerator Cohort 3 (LinkedIn, around 2026-09-28) <br>• Client and partner logo list in partners_clientsInfo.php: DEWA, Emirates NBD, ADIB, Ministry of Interior, Cabinet Affairs, Moro Hub, Dell, Kofax, Confluent and others. **None is tied to a specific product.** | Various | Medium / High |
| 10 | **GITEX / Expand North Star:** no exhibitor-listing evidence could be retrieved (see the access log). Only a search snippet suggests a LinkedIn post thanking Expand North Star 2024 for "supporting Meerana Technology". | Search | Low |

---

## 11. Sources consulted (all accessed 2026-10-02)

Status values: ok, blocked, 404 / not found, no response, parked, not accessed (by rule).

| # | Source | What I looked for | Status |
|---|---|---|---|
| 1 | https://www.meerana.ae/ (SPA shell) | Site, product routes | ok (909-byte shell; content in JS) |
| 2 | https://www.meerana.ae/static/js/main.5717dfa4.js | Product page copy, chatbot, contact form, routes | ok (LM 2026-09-22) |
| 3 | https://www.meerana.ae/tasree3, /yisbir, /mandobee, /nazoo, /wasel, /asset-tracking, /accelerator | Product pages | ok (single-page-app routes) |
| 4 | https://www.meerana.ae/mandoobee, /nazo | Alternative slugs | not found (no route defined) |
| 5 | https://www.meerana.ae/robots.txt, /sitemap.xml | Sitemap | not found (single-page-app fallback) |
| 6 | https://api.meerana.ae/allDataInfo/homepageInfo.php | Hero copy | ok |
| 7 | https://api.meerana.ae/allDataInfo/solutionInfo.php (+ ?id=1,2,3,6) | Solutions / unique products | ok |
| 8 | https://api.meerana.ae/allDataInfo/solutionInfo.php?id=4,5,7 | Other solution groups | not found ({"status":"failure"}) |
| 9 | https://api.meerana.ae/allDataInfo/latestnewsInfo.php | News | ok |
| 10 | https://api.meerana.ae/allDataInfo/partners_clientsInfo.php | Clients | ok |
| 11 | https://api.meerana.ae/allDataInfo/testimonalsInfo.php | Testimonials | ok (Lorem Ipsum) |
| 12 | https://api.meerana.ae/allDataInfo/aboutusInfo.php, chooseusInfo.php, experienceInfo.php, partnerinfoInfo.php, contactusinfoInfo.php, locationInfo.php, courseProviderInfo.php | Company copy | ok |
| 13 | api.meerana.ae form endpoints (contactform, carrerform, partnerform, subscribers, profiledownloders, courseRegistration) and ourteamInfo | — | not accessed (forms / personal data) |
| 14 | https://www.meerana.ae/assets/{mandoobee_video,yisbir,tasree,nazo,wasel,Meerana_Technologies}.mp4 | Videos | ok (HEAD only; not viewed) |
| 15 | https://www.meerana.ae/assets/Meerana%20Profile.pdf | Company profile | ok (HEAD only; not downloaded) |
| 16 | https://www.meerana.ae/assets/{wasel,yisbir,tasree3,nazoo,asset_tracking}_cover_banner.png, smart-office-app.png, remotioo.webp, greenhub.webp | Product imagery | ok (viewed) |
| 17 | https://uat1.meerana.ae/ + /static/js/main.82bbce3f.js | Older site version | ok (LM 2024-12-30) |
| 18 | https://app.meerana.ae/ + /static/js/main.f728200d.js | Mandoobee web app | ok (no login; LM 2025-09-09) |
| 19 | https://tasree3.ae/ (index, why, uae, process-management, process-mining, process-governance, security, terms) | Tasree3 | ok (LM 2026-07-08) |
| 20 | https://tasree3.ae/ar/ (index + 7 subpages) | Arabic mirror | ok |
| 21 | https://tasree3.ae/pricing.html, about, contact, blog, docs, features, solutions, robots.txt, sitemap.xml | — | not found (soft 404: homepage served) |
| 22 | https://tasree3.ae/assets/ | — | blocked (403) |
| 23 | https://app.tasree3.ae/ + /assets/index-DVhwPcQp.js | Tasree3 app | ok (no login; LM 2026-09-30) |
| 24 | https://tasree3.com, https://www.tasree3.com, https://tasree3.com/lander | Domain | parked / for sale (Afternic NS; GoDaddy forsale "Access Denied") |
| 25 | https://app.tasree3.com | — | no response |
| 26 | https://yisbir.com/ + /assets/index-B2BfucDc.js | Yisbir site | ok (LM 2026-01-27) |
| 27 | https://demo.yisbir.com/ | Demo portal | ok (login page; not used) |
| 28 | yisbir.ai, www.yisbir.ai | Contact domain | not found (NXDOMAIN) |
| 29 | indexer.yisbir.com, yisbir.ae | — | no response |
| 30 | https://hrms.meerana.ae/, https://meerana.hrms.meerana.ae/ | Tamkeen HRMS | ok (login shell) |
| 31 | nazo.meerana.ae | Nazo | no response (certificate exists) |
| 32 | location.meerana.ae, uatcampus.meerana.ae | — | 502 |
| 33 | https://inventory.meerana.ae/, https://campus360.meerana.ae/, crm/crm1/hotel/arv/dabweb.meerana.ae | Other apps | ok (titles only) |
| 34 | mandoobee.com | Domain | parked (GoDaddy parking lander) |
| 35 | mandoobee.ae, mandoobi.ae, mandobee.ae, mandoobee.app, nazoo.ae, nazo.ae, wasel.ae, waselgate.ae, smarttracking.ae, aiinabox.ae, ai.meerana.ae, product subdomains of meerana.ae, meerana.com | Candidate domains | no response / not found |
| 36 | nazoo.com | — | ok (unrelated Japanese business) |
| 37 | https://api.certspotter.com/v1/issuances (meerana.ae, tasree3.ae, yisbir.com) | Subdomains | ok |
| 38 | https://crt.sh/ | Subdomains | no response (502) |
| 39 | https://play.google.com/store/apps/dev?id=4788093691730668868 (gl=AE, IN, US, GB, SA) | Meerana apps | ok |
| 40 | https://play.google.com/store/apps/details?id=ae.meerana.mandoobee | Mandoobee | ok |
| 41 | https://play.google.com/store/apps/details?id=ae.meerana.hilegal, …campus, …skillyfy, …noonherb | Other apps | ok |
| 42 | Play details for ae.meerana.{wasel, nazo, nazoo, yisbir, tasree3, smartoffice, assettracking, tracking, remotioo, greenhub, smartgate, gate} | Product apps | 404 |
| 43 | https://itunes.apple.com/search and /lookup (meerana, mandoobee, mandoobi, wasel, hi legal, campus 360, nazo, yisbir, tasree3, skillyfy, remotioo; ae/us/in/gb/sa) | iOS apps | ok |
| 44 | https://apps.apple.com/ae/app/mandoobee/id6473241950 ; https://apps.apple.com/ae/app/hi-legal/id1669429571 ; https://apps.apple.com/ae/developer/meerana-information-technology/id1664675580 | iOS listings | ok |
| 45 | https://www.linkedin.com/company/meerana (guest view) | Company posts | ok (recent posts only; older posts and hashtag feeds need login) |
| 46 | https://ae.linkedin.com/in/mataralmehairi (guest view) | CEO posts | ok |
| 47 | LinkedIn posts: …meerana_meerana-yisbir-agenticai-activity-7470169460633554944…, …mataralmehairi_zero-bureaucracy-one-process-solution-activity-7474032132705640448…, …meerana_dubaiit-tasree3-meerana-activity-7474399838999101440…, …mataralmehairi_ai-ai-sovereignai-activity-7480383760581050368…, …meerana_sovereignty-activity-7480385897809694720…, …meerana_sovereignai-uae-artificialintelligence-activity-7482585075105116161… | Product posts | ok |
| 48 | https://www.linkedin.com/in/alaa-abu-holy-b-sc-mba-394b3263/ | Expand North Star mention | blocked (HTTP 999) |
| 49 | LinkedIn hashtag feeds (#tasree3, #yisbir, #meerana) | — | blocked (login wall) |
| 50 | https://www.youtube.com/@MeeranaTechnologies (+ /videos, /shorts, /streams) | Videos | ok (no content) |
| 51 | YouTube search (meerana, meerana technologies, mandoobee, tasree3, yisbir, wasel meerana, nazo meerana, meerana ai in a box) | Videos | ok (no product videos) |
| 52 | https://www.youtube.com/watch?v=VRD8hzICcYQ ; https://www.youtube.com/watch?v=3gIyjMSv-Wk (oEmbed) | Company videos | ok |
| 53 | https://www.instagram.com/meeranatechnologies/, /meerana.technologies/, /meerana/, /meerana.ae/ | Posts | blocked (login wall) |
| 54 | https://x.com/MeeranaTech1 | Posts | blocked (JS app; nothing readable) |
| 55 | https://mena.entrepreneur.com/entrepreneurs/meerana/466516 | Future 100 profile | ok (2023-09-01) |
| 56 | https://mena.entrepreneur.com/topic/future-100-2023/page/2 | Future 100 list | ok |
| 57 | https://www.mediaoffice.ae/en/news/2024/august/08-08/dubai-international-chamber-supports-uae | FPT news | ok (2024-08-08; no product names) |
| 58 | https://www.wam.ae/en/article/b4kkjto-dubai-international-chamber-supports-uae-based | FPT news | no response (connection reset) |
| 59 | https://fptsoftware.com/newsroom/…/fpt-software-and-meerana-technologies-partner-to-drive-digital-transformation-in-uae | Partnership | ok (2024-08-19; no product names) |
| 60 | https://channelpostmea.com/2022/10/21/software-ag-meerana-technologies-collaborate-build-future-ready-business-models/ | Partnership | ok (2022-10-21) |
| 61 | https://www.zawya.com/…/software-ag-and-meerana-technologies-sign-partnership…-ye77u2ab | Partnership | blocked (HTTP 400 via WebFetch) |
| 62 | https://www.theeastafrican.co.ke/tea/sponsored/-meerana-s-strategic-expansion-into-kenya-and-rwanda-4434204 | Products | blocked (403) |
| 63 | https://www.crunchbase.com/organization/meerana | Profile | blocked (403) |
| 64 | https://www.cbinsights.com/company/meerana-technologies | Profile | ok |
| 65 | https://clutch.co/profile/meerana-technologies | Profile | ok via WebFetch (403 via curl) |
| 66 | https://tracxn.com/d/legal-entities/india/meerana-technologies-llp/… | Indian entity | ok |
| 67 | https://www.remootio.com/ ; App Store "Remootio" (id1456463154) | Remotioo check | ok |
| 68 | https://exhibitors.gitex.com/gitex-global-2025/Exhibitor (and 2026) | GITEX listing | page ok; **search not performed** (it requires a POST form submission) |
| 69 | https://www.gitex.com/exhibitors?search=meerana | GITEX | not found (404 form page) |
| 70 | https://exhibitors.expandnorthstar.com/ | Expand North Star listing | no response |
| 71 | Web searches: "Tasree3" (+ process mining / tasree3.ae / Arabic تسريع), "Yisbir" (+ AI video / construction / Arabic يسبر), "Mandoobee/Mandoobi", "Wasel smart gate meerana", "powered by www.meerana.ae", "Nazoo/NAZO Crystal Clear" (+ Arabic نازو), "Meerana AI in a Box", "Meerana Intelligence Layer", "Meerana smart tracking RFID", GITEX / Expand North Star + Meerana, Gulf News / Khaleej Times / Zawya / Arabian Business + Meerana, "Tamkeen HRMS", ZingHR + Meerana | Coverage | ok. **No press coverage of any individual product found**; only company-level news |
| 72 | MOHRE Emirates Labour Market Award winners (riyada.mohre.gov.ae) | Award | search snippet only (not fetched) |

---

### Access gaps and what was not checked (summary)
- LinkedIn post history before about June 2026 (and all hashtag feeds), plus one LinkedIn profile.
- Instagram and X.
- Crunchbase, The East African, Zawya (Software AG release) and WAM.
- GITEX and Expand North Star exhibitor directories: the search needs a form POST, or the site did not respond.
- Logged-in areas of app.tasree3.ae, app.meerana.ae, demo.yisbir.com and hrms.meerana.ae.
- Product MP4 videos and the 32 MB "Meerana Profile.pdf": confirmed to exist but not downloaded.
- Local brand files in the project folder (out of scope for web research).
