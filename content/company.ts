/**
 * Company facts, proof, services and press.
 *
 * Every item cites the evidence register (plan/03 + docs/evidence-addendum).
 * Wording for awards and partners is verbatim from
 * docs/review/m3-2026-10-10/JUDGE-VERDICT.md §4a; do not paraphrase it.
 *
 * Status rule (meerana-frontend skill): a production build shows only
 * `ok-to-use` / `use-with-edit` items. Items still marked
 * `confirm-with-meerana` live in `UNCONFIRMED_*` and render only in a preview
 * build (NEXT_PUBLIC_PREVIEW=1), flagged "Unconfirmed".
 */

export const COMPANY = {
  legalName: "Meerana Technologies LLC", // EV-531
  address: "#1704, Blue Bay Tower, Business Bay, Dubai, UAE", // EV-531
  email: "info@meerana.ae", // EV-004, EV-531 (no phone: owner decision)
  founded: "2022", // EV-020
  /** Brand line, EV-006 — rendered in sentence case. */
  brandLine: "AI-powered enterprise products ecosystem",
} as const;

/** Recognition. EV-202 · EV-203 · EV-200 (use-with-edit). */
export const AWARDS = [
  {
    title: "Selected for Future 100 (2023)",
    issuer: "UAE Ministry of Economy & the Government Development and the Future Office",
    evidence: "EV-202",
  },
  {
    title: "Best small enterprise in the UAE",
    issuer: "Honoured at the GCC Labour Ministers Committee ceremony, Doha (September 2024)",
    evidence: "EV-203",
  },
  {
    title: "Emirates Labour Market Award 2023 (MOHRE)",
    issuer: "Workforce Wellbeing & Quality of Life",
    evidence: "EV-200",
  },
];

/** Partnerships with independent verification (all ok-to-use). */
export const PARTNERS = [
  { name: "Software AG", relationship: "Joined Software AG's PartnerConnect programme (2022)", evidence: "EV-240" },
  { name: "Commvault", relationship: "Value Added Partner for Commvault — announced at GITEX Global 2024", evidence: "EV-506" },
  { name: "FPT Software", relationship: "Strategic partnership (MoU) with FPT Software, 2024", evidence: "EV-505" },
  { name: "CyberHive", relationship: "MoU with CyberHive, 2025 — Dubai Business Forum, London", evidence: "EV-507" },
  { name: "Botminds", relationship: "Regional partner — Botminds", evidence: "EV-508" },
  { name: "Dubai Chambers", relationship: "Supported by Dubai Chambers", evidence: "EV-509" },
];

/**
 * Reselling-portfolio lines carried by meerana.ae but not independently
 * verified (EV-034, confirm-with-meerana). Preview builds only.
 * SAS, Sprinklr and Zing HR are not partnerships at all (PROOF-INVENTORY) and
 * are not listed anywhere.
 */
export const UNCONFIRMED_PORTFOLIO = [
  { name: "Kofax", relationship: "Robotic Automation Platform" },
  { name: "AgilePoint", relationship: "No Code Low Code" },
  { name: "Confluent", relationship: "Data Streaming Platform" },
  { name: "SAP", relationship: "SAP Ariba, S/4HANA, Business ByDesign, Business One, C4C, SuccessFactors" },
];

/**
 * Offices, per the owner (EV-532). No UTC offsets: they change with daylight
 * saving, and a hard-coded offset is wrong for half the year. Local time, where
 * shown, is computed from `tz`.
 */
export const OFFICES = [
  { place: "Dubai", detail: "Headquarters · United Arab Emirates", tz: "Asia/Dubai" },
  { place: "London", detail: "United Kingdom", tz: "Europe/London" },
  // The register names the country only (EV-532); no city is invented.
  { place: "Egypt", detail: "", tz: "Africa/Cairo" },
  { place: "Chennai", detail: "India", tz: "Asia/Kolkata" },
];

/**
 * Service lines. The four lines stand per the owner (DL-S01); capability areas
 * from plan/06 H9, backed by EV-030 (ok-to-use), EV-031 (use-with-edit: trimmed
 * per DL-S02) and EV-032/033.
 *
 * PROVISIONAL – owner approval required: each `summary` sentence was drafted
 * for this page and is not in the register. The capability lists are.
 */
export const SERVICES = [
  {
    id: "consulting",
    interest: "consulting" as Interest,
    name: "Consulting",
    summary: "Advisory for the systems, data and processes behind a transformation programme.",
    capabilities: [
      "Digital transformation",
      "Enterprise IT architecture",
      "Data management",
      "Data centre",
      "Customer experience",
      "Process re-engineering",
    ],
    related: [{ slug: "tasree3", name: "Tasree3", why: "for process re-engineering" }],
    evidence: "EV-030",
  },
  {
    id: "bespoke-development",
    interest: "bespoke-development" as Interest,
    name: "Bespoke development",
    summary: "Software built to your requirements, from ERP and automation to IoT.",
    capabilities: [
      "Software and cloud",
      "ERP",
      "Robotic process automation",
      "Data services",
      "Cybersecurity testing",
      "IoT solutions",
    ],
    related: [{ slug: "wasel", name: "Wasel", why: "for IoT and access control" }],
    evidence: "EV-031",
  },
  {
    id: "partnerships",
    interest: "partnership" as Interest,
    name: "Technology partnerships",
    summary: "Partnerships with technology companies, each listed as it was announced.",
    capabilities: ["Software AG", "Commvault", "FPT Software", "CyberHive", "Botminds"],
    related: [],
    evidence: "EV-240 EV-505 EV-506 EV-507 EV-508",
  },
  {
    id: "staff-augmentation",
    interest: "staff-augmentation" as Interest,
    name: "Staff augmentation",
    summary: "Skilled technology professionals who join your team on flexible terms.",
    capabilities: ["AI skills", "IT and software skills"],
    related: [],
    evidence: "EV-032 EV-033",
  },
];

/** Events with independent sources. EV-513 · EV-512. */
export const EVENTS = [
  { year: "2025", title: "Dubai Business Forum — USA, New York", note: "Speaking on partnerships supported by Dubai Chambers", evidence: "EV-512" },
  { year: "2025", title: "Dubai Business Forum — London", note: "MoU signed with CyberHive", evidence: "EV-507" },
  { year: "2024", title: "GITEX Global, Dubai", note: "Commvault Value Added Partnership announced", evidence: "EV-513" },
  { year: "2022", title: "GITEX Global, Dubai", note: "Software AG PartnerConnect agreement signed", evidence: "EV-513" },
];

/** One "In the news" item: an outbound link only (FINAL-SPEC §5.1). */
export type PressItem = {
  outlet: string;
  /** ISO date (YYYY-MM-DD), or the year alone where the source gives no day. */
  date: string;
  title: string;
  url: string;
  /** Register id(s) backing the item. */
  evidence: string;
};

/**
 * "In the news" — outbound links only, newest first (EV-514, ok-to-use; the
 * Future 100 profile also EV-202). Outlets, dates, headlines and URLs are
 * copied from research/sources/company-web-research.md §F (FINAL-SPEC §5.5).
 * Excluded: The EastAfrican (sponsored content), Al Bayan 2024-05-10 (an
 * unverified hiring figure) and the 2022 Software AG releases (the
 * partnership is listed under PARTNERS and EVENTS instead).
 */
export const PRESS: PressItem[] = [
  {
    outlet: "Intelligent CISO",
    date: "2025-02-13",
    title: "CyberHive joins forces with UAE-based Meerana to develop cybersecurity solutions",
    url: "https://www.intelligentciso.com/2025/02/13/cyberhive-joins-forces-with-uae-based-meerana-to-develop-cybersecurity-solutions-to-protect-against-online-threats/",
    evidence: "EV-514",
  },
  {
    outlet: "Security MEA",
    date: "2024-10-17",
    title: "Commvault and Meerana to enhance cyber resilience in the UAE",
    url: "https://securitymea.com/2024/10/17/commvault-and-meerana-to-enhance-cyber-resilience-in-the-uae/",
    evidence: "EV-514",
  },
  {
    outlet: "FPT Software newsroom",
    date: "2024-08-19",
    title: "FPT Software and Meerana Technologies partner to drive digital transformation in UAE",
    url: "https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-software-and-meerana-technologies-partner-to-drive-digital-transformation-in-uae",
    evidence: "EV-514",
  },
  {
    outlet: "Dubai Media Office",
    date: "2024-08-08",
    title: "Dubai International Chamber supports UAE-based Meerana's collaboration with Vietnamese technology company FPT",
    url: "https://www.mediaoffice.ae/en/news/2024/august/08-08/dubai-international-chamber-supports-uae",
    evidence: "EV-514",
  },
  {
    outlet: "Entrepreneur Middle East",
    /* The source gives the list year only (CMS date 2023-09-01, list Dec 2023). */
    date: "2023",
    title: "Meerana: Future 100 (2023) company profile",
    url: "https://mena.entrepreneur.com/entrepreneurs/meerana/466516",
    evidence: "EV-514 EV-202",
  },
];

/** The Dubai Chambers feature (FINAL-SPEC §5.1). */
export type FeatureVideo = { title: string; outlet: string; url: string; evidence: "EV-022" };

/** Dubai Chambers feature (EV-022). Linked, not embedded: no third-party script. */
export const FEATURE_VIDEO: FeatureVideo & {
  /** @deprecated Use `outlet`. Kept until app/company/page.tsx switches (owner F). */
  publisher: string;
} = {
  title: "Dubai Dreamers: From Dubai to the World with Meerana Technologies",
  outlet: "Dubai Chambers",
  publisher: "Dubai Chambers",
  url: "https://www.youtube.com/watch?v=VRD8hzICcYQ",
  evidence: "EV-022",
};

/** The enquiry topics (plan/11 §15 `interest`, extended per JUDGE J7). */
export const INTERESTS = [
  { value: "mandoobee", label: "Mandoobee" },
  { value: "tasree3", label: "Tasree3" },
  { value: "nazo", label: "Nazo" },
  { value: "yisbir", label: "Yisbir" },
  { value: "wasel", label: "Wasel" },
  { value: "ai-in-a-box", label: "AI in a Box" },
  { value: "consulting", label: "Consulting" },
  { value: "bespoke-development", label: "Bespoke development" },
  { value: "partnership", label: "Technology partnerships" },
  { value: "staff-augmentation", label: "Staff augmentation" },
  { value: "other", label: "Something else" },
] as const;

export type Interest = (typeof INTERESTS)[number]["value"];
