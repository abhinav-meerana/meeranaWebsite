export type ProductModule = {
  title: string
  description: string
  features: string[]
}

export type MeeranaProduct = {
  slug: string
  code: string
  short: string
  product: string
  title: string
  tagline: string
  description: string
  image: string
  logo?: string
  sourceUrl?: string
  features: string[]
  modules: ProductModule[]
  environments: string[]
  outcomes: string[]
  architecture: string
}

export const products: MeeranaProduct[] = [
  {
    slug: "wasel",
    code: "01",
    short: "Access",
    product: "Wasel",
    title: "Smart Gate & Access Control System",
    tagline: "Smart access. Total control.",
    description:
      "WASEL by Meerana Technologies is a smart IoT-based gate and door access control system connecting mobile applications, IoT controller hardware, cloud services, local network access, and Bluetooth fallback modes.",
    image: "/meerana-assets/wasel_cover_banner.png",
    features: [
      "Real-time gate status",
      "Role-based access",
      "Online and offline modes",
    ],
    modules: [
      {
        title: "Remote Gate Control",
        description:
          "Open and close gates, view current status, and receive alert logs from a connected interface.",
        features: [
          "Remote open and close",
          "Instant status visibility",
          "Alert history",
        ],
      },
      {
        title: "Live Sensor Monitoring",
        description:
          "Monitor gate position sensors, temperature, humidity, active status, and connected controller signals.",
        features: [
          "Position sensors",
          "Environmental readings",
          "Controller health",
        ],
      },
      {
        title: "Multi-Gate Management",
        description:
          "Manage multiple gates and access points across different locations from a centralized control layer.",
        features: [
          "Centralized control",
          "Historic access logs",
          "Regional access points",
        ],
      },
      {
        title: "Security & Fallback Access",
        description:
          "Use encrypted access keys, administrative privileges, user roles, and offline Bluetooth access when internet connectivity is unavailable.",
        features: ["Encrypted keys", "Role management", "Offline BLE fallback"],
      },
    ],
    environments: [
      "Residential communities and visitor gates",
      "Corporate offices, parking, and server rooms",
      "Loading docks and logistics yards",
      "Construction perimeters and contractor access",
    ],
    outcomes: [
      "Centralized control for multiple access points",
      "Real-time gate and sensor visibility",
      "Improved access accountability",
      "Flexible mobile, Wi-Fi, Bluetooth, and cloud access",
    ],
    architecture:
      "The Wasel system combines mobile access, IoT gate controller hardware, cloud connectivity, local network operation, and Bluetooth fallback to avoid dependence on a single connection mode.",
  },
  {
    slug: "mandoobee",
    code: "02",
    short: "Workplace",
    product: "Mandoobee",
    title: "Digital Corporate Operations Platform",
    tagline:
      "From traditional administration to a paperless operating environment.",
    description:
      "Mandoobi, listed on digital storefronts as Mandoobee, is built by Meerana Technologies to transform traditional corporate administration into a connected digital ecosystem for internal operations, workforce coordination, projects, documents, and meetings.",
    image: "/meerana-assets/smart-office-app.png",
    features: ["People & HR", "Work & projects", "Documents & knowledge"],
    modules: [
      {
        title: "Operations & Workforce Management",
        description:
          "Coordinate attendance, leave, employee services, and everyday internal requests through one workplace layer.",
        features: [
          "Geolocation-aware clock in and clock out",
          "Leave and attendance portal",
          "AI-powered internal assistant",
        ],
      },
      {
        title: "Project Coordination & Tasks",
        description:
          "Give managers and teams shared visibility into action items, milestones, responsibilities, and progress.",
        features: [
          "Task assignment and monitoring",
          "Project lifecycle planning",
          "Synchronized operational workflows",
        ],
      },
      {
        title: "Document Management",
        description:
          "Upload, review, sign, archive, and retrieve employee records, legal filings, certificates, and other business documents without physical paper trails.",
        features: [
          "Protected document vault",
          "Review and signature workflows",
          "Digital archive",
        ],
      },
      {
        title: "Meetings & Minutes",
        description:
          "Coordinate meeting schedules, calendar notifications, reminders, summaries, action items, and stakeholder distribution.",
        features: [
          "Meeting scheduling",
          "Automated reminders",
          "Minutes of Meeting",
        ],
      },
    ],
    environments: [
      "Corporate headquarters",
      "Distributed and hybrid teams",
      "Field representatives",
      "Administrative and shared-service teams",
    ],
    outcomes: [
      "Unified office operations in one platform",
      "Reduced manual and paper-based processes",
      "Faster approvals and task execution",
      "Improved workflow and support visibility",
    ],
    architecture:
      "Mandoobee uses a cloud-connected architecture for synchronized web and mobile access. Business owners and operational managers can use a web dashboard, while employees and field teams interact through mobile experiences. Its modular structure supports localized workflows and organization-specific configurations.",
  },
  {
    slug: "tasree3",
    code: "03",
    short: "Process",
    product: "Tasree3",
    title: "AI-Native Process Management Platform",
    tagline: "Zero bureaucracy. One process solution.",
    description:
      "Tasree3 by Meerana Technologies is a sovereign, agentic, AI-native platform for enterprise process management—model, mine, govern, and optimize every process on one intelligent core.",
    image: "/meerana-assets/tasree3_cover_banner.png",
    logo: "/meerana-assets/tasree3-logo.png",
    sourceUrl: "https://tasree3.ae/",
    features: [
      "Process discovery",
      "Visual process modeling",
      "AI-powered optimization",
    ],
    modules: [
      {
        title: "Visual Process Modeling",
        description:
          "A drag-and-drop BPMN diagram builder for business and technical teams, supported by a shared process repository.",
        features: [
          "Reusable BPMN building blocks",
          "Version history",
          "Comments and review workflows",
        ],
      },
      {
        title: "Automatic Process Discovery",
        description:
          "Generate data-driven workflows from operational event logs to see how processes run in practice.",
        features: [
          "Discover workflow variants",
          "Reveal rework loops",
          "Compare current and target models",
        ],
      },
      {
        title: "Performance Insights",
        description:
          "Identify where work slows down and focus improvement activity on the steps with the greatest impact.",
        features: [
          "Bottleneck detection",
          "Delay analysis",
          "Real-time performance tracking",
        ],
      },
      {
        title: "AI-Powered Optimization",
        description:
          "Use a context-aware AI layer for prioritized recommendations, predictive analytics, and natural-language questions over process data.",
        features: [
          "Impact-ranked recommendations",
          "Predictive risk signals",
          "Natural-language analysis",
        ],
      },
      {
        title: "Instant Reports",
        description:
          "Create executive-ready reports and live operational dashboards directly from process views.",
        features: [
          "One-click reporting",
          "Live dashboards",
          "PDF, Excel, and PowerPoint export",
        ],
      },
      {
        title: "Real-Time Collaboration",
        description:
          "Bring departments together on a shared process canvas with controlled review and approval workflows.",
        features: [
          "Live co-editing",
          "Role-based access",
          "Shared process repository",
        ],
      },
    ],
    environments: [
      "Energy",
      "Government",
      "Finance",
      "Healthcare",
      "Telecommunications",
    ],
    outcomes: [
      "One platform across the process lifecycle",
      "Visibility into how processes actually run",
      "Prioritized, data-informed optimization",
      "Connected modeling, mining, reporting, and collaboration",
    ],
    architecture:
      "Tasree3 is organized around connected process lifecycle capabilities sharing one AI-native core. Visual modeling, process discovery, and governance work together with AI optimization, reporting, and collaboration rather than operating as separate tools.",
  },
  {
    slug: "yisbir",
    code: "04",
    short: "Operations",
    product: "Yisbir",
    title: "AI-Powered Construction Site Intelligence",
    tagline:
      "Transform CCTV into safety, compliance, and operational intelligence.",
    description:
      "Yisbir by Meerana Technologies applies AI video intelligence to construction-site safety, security, compliance, incident investigation, and operational visibility.",
    image: "/meerana-assets/yisbir_cover_banner.png",
    features: ["HSE compliance", "Site security", "Smart investigations"],
    modules: [
      {
        title: "Safety & HSE Compliance",
        description:
          "Monitor active work zones for missing protective equipment, restricted-area entry, unsafe practices, falls, and incidents.",
        features: [
          "Helmet and vest detection",
          "Restricted-zone alerts",
          "Fall and incident detection",
        ],
      },
      {
        title: "Site Security",
        description:
          "Protect people, equipment, materials, and project assets across gates, storage areas, yards, and site perimeters.",
        features: [
          "Unauthorized access",
          "Perimeter breaches",
          "Equipment and material protection",
        ],
      },
      {
        title: "Smart Investigations",
        description:
          "Search live and recorded video by person attributes, vehicle details, location, date, and time.",
        features: [
          "Person attribute search",
          "Vehicle and plate search",
          "Zone and timeline search",
        ],
      },
      {
        title: "Operational Visibility",
        description:
          "Use existing camera infrastructure as an operational signal layer for project and safety teams.",
        features: [
          "Multi-camera visibility",
          "Incident verification",
          "Operational monitoring",
        ],
      },
    ],
    environments: [
      "Construction work zones",
      "Entry and exit gates",
      "Storage areas and equipment yards",
      "Material warehouses and worker camps",
    ],
    outcomes: [
      "Stronger HSE compliance",
      "Reduced site risk",
      "Faster incident investigation",
      "Improved project and security visibility",
    ],
    architecture:
      "Yisbir connects AI video analytics with live and recorded camera streams, allowing teams to monitor conditions, detect defined events, and investigate incidents using existing visual infrastructure.",
  },
]
