import { useEffect, useRef, useState, type FormEvent } from "react"
import ClickSpark from "../components/ClickSpark"
import GradualBlur from "../components/GradualBlur"
import MetaBalls from "../components/MetaBalls"
import ScrollReveal from "../components/ScrollReveal"
import { products as services } from "../data/products"

// ─────────────────────────────────────────────────────────────
// Brand & Navigation
// ─────────────────────────────────────────────────────────────

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? "brand-compact" : ""}`} href="/" aria-label="Meerana Technologies home">
      <img
        className="brand-logo"
        src="/meerana-assets/MEERANA-Logo-final-transparent-white-08.png"
        alt="Meerana Technologies"
      />
    </a>
  )
}

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="announcement">
        <span>MEERANA / AN EMIRATI GROUP OF COMPANIES</span>
        <a href="/#recognition">Future-ready technology, built in the UAE <span aria-hidden="true">↗</span></a>
      </div>
      <div className="nav-shell">
        <Brand />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span /><span className="sr-only">Toggle navigation</span>
        </button>
        <nav
          id="primary-navigation"
          className={open ? "nav-links is-open" : "nav-links"}
          aria-label="Primary navigation"
        >
          {["Solutions", "Products", "Ecosystem", "Impact"].map((label) => (
            <a key={label} href={`/#${label.toLowerCase()}`} onClick={() => setOpen(false)}>{label}</a>
          ))}
          <a className="nav-cta" href="/#contact" onClick={() => setOpen(false)}>
            Talk to us <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  )
}

// ─────────────────────────────────────────────────────────────
// Hero — Orbital Core + Data Lines
// ─────────────────────────────────────────────────────────────

function HeroDataLines() {
  return (
    <svg className="hero-data-lines" viewBox="0 0 800 600" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="dl1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dl2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0052FF" stopOpacity="0" />
          <stop offset="50%" stopColor="#00E5FF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0052FF" stopOpacity="0" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d="M0 180 Q200 155 400 195 Q600 235 800 185" stroke="url(#dl1)" strokeWidth="1">
        <animate attributeName="opacity" values="0.15;0.65;0.15" dur="4s" repeatCount="indefinite" />
      </path>
      <path d="M0 320 Q150 285 350 325 Q550 365 800 295" stroke="url(#dl1)" strokeWidth="0.8">
        <animate attributeName="opacity" values="0.08;0.45;0.08" dur="5.5s" repeatCount="indefinite" begin="1s" />
      </path>
      <path d="M0 450 Q250 415 450 455 Q650 495 800 435" stroke="url(#dl2)" strokeWidth="0.6">
        <animate attributeName="opacity" values="0.05;0.3;0.05" dur="7s" repeatCount="indefinite" begin="2s" />
      </path>
      <path d="M120 0 L340 600" stroke="#00E5FF" strokeWidth="0.4" strokeDasharray="4 14">
        <animate attributeName="opacity" values="0.03;0.12;0.03" dur="6s" repeatCount="indefinite" />
      </path>
      <path d="M420 0 L600 600" stroke="#00E5FF" strokeWidth="0.4" strokeDasharray="4 18">
        <animate attributeName="opacity" values="0.02;0.09;0.02" dur="8s" repeatCount="indefinite" begin="1.5s" />
      </path>
      {([[200, 180], [400, 200], [600, 190], [300, 330], [560, 310]] as [number, number][]).map(([cx, cy], i) => (
        <g key={i} filter="url(#glow)">
          <circle cx={cx} cy={cy} r="2.5" fill="#00E5FF" opacity="0.9">
            <animate attributeName="opacity" values="0.3;1;0.3" dur={`${2.8 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
          </circle>
          <circle cx={cx} cy={cy} r="6" fill="none" stroke="#00E5FF" strokeWidth="0.8" opacity="0">
            <animate attributeName="r" values="4;16;4" dur={`${2.8 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
            <animate attributeName="opacity" values="0.5;0;0.5" dur={`${2.8 + i * 0.6}s`} repeatCount="indefinite" begin={`${i * 0.7}s`} />
          </circle>
        </g>
      ))}
    </svg>
  )
}

function OrbitalCore() {
  const NODES = [
    { label: "AI Core", id: "01", status: "ONLINE", x: "50%", y: "2%" },
    { label: "Automation", id: "02", status: "ACTIVE", x: "93%", y: "50%" },
    { label: "IoT Gateways", id: "03", status: "LIVE", x: "50%", y: "92%" },
    { label: "Security", id: "04", status: "ARMED", x: "7%", y: "50%" },
  ]

  return (
    <div className="orbital-system" aria-hidden="true">
      <svg className="orbital-svg" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer orbit ring */}
        <circle cx="300" cy="300" r="268" stroke="rgba(0,229,255,0.18)" strokeWidth="1" strokeDasharray="5 10">
          <animateTransform attributeName="transform" type="rotate" from="0 300 300" to="360 300 300" dur="40s" repeatCount="indefinite" />
        </circle>
        {/* Inner orbit ring */}
        <circle cx="300" cy="300" r="172" stroke="rgba(0,82,255,0.22)" strokeWidth="1" strokeDasharray="3 14">
          <animateTransform attributeName="transform" type="rotate" from="360 300 300" to="0 300 300" dur="22s" repeatCount="indefinite" />
        </circle>
        {/* Corner glow halos */}
        <circle cx="300" cy="300" r="80" fill="rgba(0,229,255,0.025)" />
        <circle cx="300" cy="300" r="120" fill="rgba(0,82,255,0.015)" />
        {/* Radial connector lines to center */}
        {([[300,32],[568,300],[300,568],[32,300]] as [number,number][]).map(([x,y],i) => (
          <line key={i} x1={x} y1={y} x2="300" y2="300" stroke="rgba(0,229,255,0.14)" strokeWidth="0.75">
            <animate attributeName="opacity" values="0.08;0.4;0.08" dur={`${3.2 + i * 0.9}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} />
          </line>
        ))}
        {/* Data packets traveling inward */}
        {(["M300,32 L300,300","M568,300 L300,300","M300,568 L300,300","M32,300 L300,300"]).map((path,i) => (
          <circle key={`pkt${i}`} r="2.8" fill="#00E5FF">
            <animateMotion path={path} dur={`${2.2 + i * 0.55}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
            <animate attributeName="opacity" values="0;0.9;0.6;0" dur={`${2.2 + i * 0.55}s`} repeatCount="indefinite" begin={`${i * 0.8}s`} />
          </circle>
        ))}
        {/* Outer node dots with pulse rings */}
        {([[300,32],[568,300],[300,568],[32,300]] as [number,number][]).map(([cx,cy],i) => (
          <g key={`nd${i}`}>
            <circle cx={cx} cy={cy} r="5" fill="#00E5FF">
              <animate attributeName="r" values="4;7;4" dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
            </circle>
            <circle cx={cx} cy={cy} r="14" fill="none" stroke="#00E5FF" strokeWidth="0.8">
              <animate attributeName="r" values="7;20;7" dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
              <animate attributeName="opacity" values="0.6;0;0.6" dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
            </circle>
          </g>
        ))}
      </svg>

      {/* Floating node label cards */}
      {NODES.map((node) => (
        <div key={node.id} className="orbital-node-card" style={{ left: node.x, top: node.y }}>
          <span className="onc-id">{node.id}</span>
          <strong className="onc-label">{node.label}</strong>
          <span className="onc-status">{node.status}</span>
        </div>
      ))}

      {/* Live system metrics at the bottom */}
      <div className="orbital-metrics">
        {([
          { label: "NODES", value: "2,450", unit: "ACTIVE" },
          { label: "LATENCY", value: "<12ms", unit: "P99" },
          { label: "UPTIME", value: "99.97%", unit: "SLA" },
        ]).map((m) => (
          <div key={m.label} className="orbital-metric">
            <span>{m.label}</span>
            <strong>{m.value}</strong>
            <small>{m.unit}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

const HERO_MOMENTS = [
  { label: "AI", sub: "Intelligent detection" },
  { label: "Automation", sub: "Instant response" },
  { label: "IoT", sub: "Connected environments" },
  { label: "Security", sub: "Real-world control" },
]

function Hero() {
  const [active, setActive] = useState(0)
  const [momentIndex, setMomentIndex] = useState(0)
  const [momentVisible, setMomentVisible] = useState(true)
  const selected = services[active]

  useEffect(() => {
    const id = setInterval(() => {
      setMomentVisible(false)
      setTimeout(() => {
        setMomentIndex((prev) => (prev + 1) % HERO_MOMENTS.length)
        setMomentVisible(true)
      }, 320)
    }, 2400)
    return () => clearInterval(id)
  }, [])

  const moment = HERO_MOMENTS[momentIndex]

  return (
    <section className="hero" id="top">
      <HeroDataLines />
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-badge">
            <i aria-hidden="true" />
            <span>SOVEREIGN INTELLIGENCE / DUBAI, UAE</span>
          </div>
          <h1>
            We engineer intelligence
            <span>for the real world.</span>
          </h1>
          <div className={`hero-moment ${momentVisible ? "is-visible" : ""}`} aria-live="polite" aria-label="Technology domain">
            <span className="hero-moment-label">{moment.label}</span>
            <span className="hero-moment-sub">{moment.sub}</span>
          </div>
          <p className="hero-intro">
            An enterprise technology ecosystem connecting access, workplaces, process intelligence, and physical operations.
          </p>
          <div className="hero-actions">
            <a className="button button-azure" href="#products">
              Explore Ecosystem <span aria-hidden="true">↓</span>
            </a>
            <a className="button button-glass" href="#contact">
              Talk to Meerana <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-scope">
            <span>Consultation</span><i aria-hidden="true" />
            <span>Bespoke products</span><i aria-hidden="true" />
            <span>Managed services</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="scene-system-label" aria-hidden="true">
            <span>LIVE TELEMETRY</span>
            <strong>4</strong>
            <small>OPERATING LAYERS</small>
          </div>
          <div className="scene-marker marker-a" aria-hidden="true">
            <span>EDGE / CONNECTED</span><i />
          </div>
          <div className="scene-marker marker-b" aria-hidden="true">
            <i /><span>AI / INFERENCE</span>
          </div>
          <div className="metaballs-stage">
            <OrbitalCore />
            <MetaBalls
              color="#00E5FF"
              cursorBallColor="#0052FF"
              cursorBallSize={1.35}
              ballCount={15}
              animationSize={29}
              enableMouseInteraction
              enableTransparency
              hoverSmoothness={0.075}
              clumpFactor={0.78}
              speed={0.18}
            />
            <GradualBlur target="parent" position="bottom" height="7rem" strength={2.2} divCount={7} curve="bezier" exponential animated="scroll" />
          </div>
          <div className="metaballs-caption" aria-hidden="true">
            <span>NEURAL FIELD</span>
            <span>WEBGL / POINTER RESPONSIVE</span>
          </div>
        </div>
      </div>

      <div className="service-control">
        <div className="service-control-head">
          <span>MEERANA PRODUCT ECOSYSTEM</span>
          <span>SELECT A CONNECTED SYSTEM / {selected.code} OF 04</span>
        </div>
        <div className="service-buttons" role="tablist" aria-label="Connected system focus">
          {services.map((service, index) => (
            <button
              key={service.short}
              id={`service-tab-${index}`}
              role="tab"
              aria-selected={active === index}
              aria-controls="service-description"
              type="button"
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <span>{service.code}</span>
              <strong>{service.product}</strong>
              <small>{service.short}</small>
            </button>
          ))}
        </div>
        <div id="service-description" className="service-description" role="tabpanel" aria-live="polite">
          <div>
            <span>SELECTED NODE</span>
            <strong>{selected.product}</strong>
          </div>
          <div>
            <span>{selected.title}</span>
            <p>{selected.description}</p>
          </div>
          <div className="service-features">
            {selected.features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
          <a href={`/products/${selected.slug}`}>
            Open {selected.product} <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Intelligence Ticker (live data bus)
// ─────────────────────────────────────────────────────────────

function IntelligenceTicker() {
  const items = [
    { type: "node", label: "Mandoobee" },
    { type: "arrow" },
    { type: "node", label: "Tasree3" },
    { type: "arrow" },
    { type: "node", label: "Yisbir" },
    { type: "arrow" },
    { type: "node", label: "Wasel" },
    { type: "arrow" },
    { type: "node", label: "Asset Tracking" },
    { type: "arrow" },
    { type: "node", label: "AI Core", highlight: true },
  ]

  return (
    <div className="intelligence-ticker" aria-label="Meerana Intelligence Layer data bus">
      <div className="ticker-prefix">
        <i aria-hidden="true" />
        <span>INTELLIGENCE LAYER</span>
      </div>
      <div className="ticker-track" aria-hidden="true">
        <div className="ticker-inner">
          {[...items, ...items].map((item, i) =>
            item.type === "arrow" ? (
              <span key={i} className="ticker-arrow">→</span>
            ) : (
              <span key={i} className={`ticker-node ${item.highlight ? "is-highlight" : ""}`}>
                {item.label}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Authority Banner
// ─────────────────────────────────────────────────────────────

function AuthorityBanner() {
  return (
    <section className="authority-banner" aria-labelledby="authority-title">
      <svg className="authority-contour" viewBox="0 0 1200 220" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        {[260, 200, 148, 108, 74, 46, 24, 10].map((rx, i) => (
          <ellipse key={i} cx="600" cy="110" rx={rx * 4.2} ry={rx * 0.95} stroke={`rgba(0,229,255,${0.04 + i * 0.012})`} strokeWidth="1" />
        ))}
        {/* Grid lines */}
        {[200, 400, 600, 800, 1000].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="220" stroke="rgba(0,229,255,0.03)" strokeWidth="1" />
        ))}
        {[55, 110, 165].map((y) => (
          <line key={y} x1="0" y1={y} x2="1200" y2={y} stroke="rgba(0,229,255,0.03)" strokeWidth="1" />
        ))}
      </svg>
      <div className="authority-content">
        <p className="eyebrow">SOVEREIGN AI INFRASTRUCTURE / UAE</p>
        <h2 id="authority-title">
          Built in the UAE.<br />Engineered for the world.
        </h2>
        <div className="authority-badges">
          {[
            { icon: "◆", label: "Gov-Ready", sub: "Compliant architecture" },
            { icon: "◆", label: "ISO-Aligned", sub: "Enterprise standards" },
            { icon: "◆", label: "Sovereign On-Prem / Cloud", sub: "Full deployment flexibility" },
          ].map((b) => (
            <div key={b.label} className="auth-badge">
              <span className="auth-badge-icon">{b.icon}</span>
              <strong>{b.label}</strong>
              <small>{b.sub}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Solutions
// ─────────────────────────────────────────────────────────────

function Solutions() {
  const solutionAreas = [
    {
      code: "01",
      title: "Consultation",
      description: "Advisory across data management, data centers, customer experience, digital transformation, and enterprise architecture.",
      image: "/meerana-assets/solu-img-01.webp",
      items: ["Data management", "Digital transformation", "Enterprise architecture"],
    },
    {
      code: "02",
      title: "Bespoke Products",
      description: "Purpose-built digital services spanning software, cloud, automation, cybersecurity, IoT, and connected commerce.",
      image: "/meerana-assets/solu-img-02.webp",
      items: ["Software & cloud", "Automation & AI", "IoT applications"],
    },
    {
      code: "03",
      title: "Unique Products",
      description: "Meerana product initiatives across smart offices, legal management, real estate, EV charging, green technology, and warehousing.",
      image: "/meerana-assets/solu-img-03.webp",
      items: ["Smart office", "Green Hub", "Warehouse management"],
    },
    {
      code: "04",
      title: "Managed Services",
      description: "Operational support through hardware and software reselling and staff augmentation.",
      image: "/meerana-assets/herobg2.webp",
      items: ["Technology reselling", "Staff augmentation"],
    },
  ]

  return (
    <section className="section solutions" id="solutions">
      <div className="section-heading">
        <p className="eyebrow">01 / SOLUTIONS</p>
        <h2>From transformation strategy to connected delivery.</h2>
        <p>
          Meerana combines consultation, bespoke product development, its own technology products, and managed services.
        </p>
      </div>
      <div className="solution-layout">
        <article className="solution-feature">
          <div className="module-top">
            <span className="module-code">CAPABILITY / {solutionAreas[0].code}</span>
            <span className="status-dot">ADVISORY</span>
          </div>
          <div className="solution-image">
            <img src={solutionAreas[0].image} alt="" />
            <span>STRATEGY → ARCHITECTURE → TRANSFORMATION</span>
          </div>
          <div>
            <p className="product-name">CONSULTATION</p>
            <h3>{solutionAreas[0].title}</h3>
            <p>{solutionAreas[0].description}</p>
            <ul>
              {solutionAreas[0].items.map((item) => (<li key={item}>{item}</li>))}
            </ul>
          </div>
        </article>
        <div className="solution-stack">
          {solutionAreas.slice(1).map((solution) => (
            <article className="solution-row" key={solution.title}>
              <span className="module-code">CAP / {solution.code}</span>
              <div>
                <p className="product-name">{solution.items.join(" / ")}</p>
                <h3>{solution.title}</h3>
                <p>{solution.description}</p>
              </div>
              <span className="solution-index">{solution.code}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Command Center — Unified Product Cockpit
// ─────────────────────────────────────────────────────────────

const CONSOLE_METRICS = [
  [
    { label: "Gates monitored", value: "247", unit: "ACTIVE" },
    { label: "Access events", value: "1,842", unit: "/ HOUR" },
    { label: "Incidents blocked", value: "12", unit: "TODAY" },
  ],
  [
    { label: "Documents processed", value: "3,441", unit: "TODAY" },
    { label: "Workflows running", value: "128", unit: "ACTIVE" },
    { label: "Tasks automated", value: "89%", unit: "RATE" },
  ],
  [
    { label: "Processes mapped", value: "64", unit: "FLOWS" },
    { label: "Bottlenecks flagged", value: "7", unit: "LIVE" },
    { label: "Cycle time saved", value: "34%", unit: "GAIN" },
  ],
  [
    { label: "Camera feeds", value: "38", unit: "LIVE" },
    { label: "HSE compliance", value: "98%", unit: "PPE SCORE" },
    { label: "Zone breaches", value: "2", unit: "RESOLVED" },
  ],
]

function ConsoleViz({ slug }: { slug: string }) {
  if (slug === "yisbir") {
    return (
      <div className="viz-cv">
        <div className="cv-box cv-worker" style={{ left: "20%", top: "22%", width: "11%", height: "36%" }}>
          <span>WORKER · PPE_OK</span>
        </div>
        <div className="cv-box cv-worker" style={{ left: "52%", top: "18%", width: "10%", height: "38%" }}>
          <span>WORKER · PPE_OK</span>
        </div>
        <div className="cv-box cv-worker" style={{ left: "71%", top: "30%", width: "9%", height: "30%" }}>
          <span>WORKER · PPE_OK</span>
        </div>
        <div className="cv-box cv-zone" style={{ left: "5%", top: "62%", width: "28%", height: "22%" }}>
          <span>RESTRICTED ZONE / CLEAR</span>
        </div>
        <div className="cv-box cv-asset" style={{ left: "60%", top: "58%", width: "22%", height: "28%" }}>
          <span>ASSET · TRACKED</span>
        </div>
        <div className="cv-hud">
          <span className="cv-hud-item">PPE: 98%</span>
          <span className="cv-hud-item">WORKERS: 24</span>
          <span className="cv-hud-item">ALERTS: 0</span>
        </div>
      </div>
    )
  }
  if (slug === "wasel") {
    return (
      <div className="viz-access">
        {[
          { time: "14:32:07", event: "GATE_07 OPEN", user: "Ahmed Al-Rashidi", status: "GRANTED" },
          { time: "14:31:55", event: "VISITOR_REG", user: "John Smith · ADGM", status: "PENDING" },
          { time: "14:31:44", event: "GATE_03 ATTEMPT", user: "Unknown · Badge_Exp", status: "DENIED" },
          { time: "14:31:22", event: "GATE_01 OPEN", user: "Fatima Al-Zaabi", status: "GRANTED" },
          { time: "14:31:08", event: "PATROL ZONE B", user: "Security_04", status: "ACTIVE" },
        ].map((entry, i) => (
          <div key={i} className={`access-log-row status-${entry.status.toLowerCase()}`}>
            <span className="log-time">{entry.time}</span>
            <span className="log-event">{entry.event}</span>
            <span className="log-user">{entry.user}</span>
            <span className={`log-status log-${entry.status.toLowerCase()}`}>{entry.status}</span>
          </div>
        ))}
      </div>
    )
  }
  if (slug === "tasree3") {
    return (
      <div className="viz-process">
        <svg viewBox="0 0 500 220" fill="none" className="process-graph">
          <defs>
            <linearGradient id="pg1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0052FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          {[[30,110],[130,60],[230,140],[330,80],[440,110]].map(([x,y],i,arr) => (
            i < arr.length - 1 && (
              <line key={i} x1={x} y1={y} x2={arr[i+1][0]} y2={arr[i+1][1]} stroke="url(#pg1)" strokeWidth="1.5">
                <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2+i*0.5}s`} repeatCount="indefinite" />
              </line>
            )
          ))}
          {[[30,110],[130,60],[230,140],[330,80],[440,110]].map(([x,y],i) => (
            <g key={`pn${i}`}>
              <circle cx={x} cy={y} r="8" fill="#0052FF">
                <animate attributeName="r" values="7;10;7" dur={`${2.2+i*0.4}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={x} cy={y} r="14" fill="none" stroke="#00E5FF" strokeWidth="0.8">
                <animate attributeName="opacity" values="0.6;0;0.6" dur={`${2.2+i*0.4}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}
          {/* Throughput line */}
          <polyline points="30,195 100,185 170,175 240,188 310,168 380,160 440,145" stroke="#00E5FF" strokeWidth="1.2" opacity="0.5" />
          <text x="30" y="215" fill="#64748B" fontSize="9" fontFamily="monospace">PROCESS THROUGHPUT</text>
        </svg>
      </div>
    )
  }
  // mandoobee — document workflow
  return (
    <div className="viz-workflow">
      {[
        { label: "Pending approval", count: 12, pct: 48 },
        { label: "In review", count: 7, pct: 28 },
        { label: "Completed today", count: 41, pct: 82 },
        { label: "Overdue", count: 2, pct: 8 },
      ].map((row) => (
        <div key={row.label} className="workflow-row">
          <span>{row.label}</span>
          <div className="workflow-bar">
            <div className="workflow-fill" style={{ width: `${row.pct}%` }} />
          </div>
          <span className="workflow-count">{row.count}</span>
        </div>
      ))}
    </div>
  )
}

function Products() {
  const [active, setActive] = useState(0)
  const selected = services[active]
  const metrics = CONSOLE_METRICS[active]

  return (
    <section className="command-center" id="products">
      <div className="command-header">
        <div>
          <p className="eyebrow">02 / PRODUCT ECOSYSTEM</p>
          <h2>Products grounded in real operating environments.</h2>
        </div>
        <p className="command-sub">Four operating nodes. One intelligence core. Select a system to view live telemetry.</p>
      </div>
      <div className="command-layout">
        <nav className="command-nav" aria-label="Product nodes">
          {services.map((service, index) => (
            <button
              key={service.slug}
              className={`command-nav-item ${active === index ? "is-active" : ""}`}
              onClick={() => setActive(index)}
              type="button"
            >
              <span className="command-nav-code">{service.code}</span>
              <div className="command-nav-text">
                <strong>{service.product}</strong>
                <small>{service.short}</small>
              </div>
              <span className="command-nav-arrow" aria-hidden="true">→</span>
            </button>
          ))}
          <div className="command-nav-footer">
            <i aria-hidden="true" /><span>MEERANA INTELLIGENCE CORE</span>
          </div>
        </nav>

        <div className="command-console" key={active}>
          <div className="console-topbar">
            <span className="console-live"><i aria-hidden="true" />LIVE / {selected.product.toUpperCase()} NODE</span>
            <span className="console-id">{selected.short.toUpperCase()} · {selected.code} OF 04</span>
          </div>

          <div className="console-viewport">
            <img src={selected.image} alt={`${selected.product} — ${selected.title}`} />
            <div className="console-scan" aria-hidden="true" />
            <ConsoleViz slug={selected.slug} />
            <div className="console-metrics">
              {metrics.map((m) => (
                <div key={m.label} className="console-metric">
                  <small>{m.label}</small>
                  <strong>{m.value}</strong>
                  <span>{m.unit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="console-copy">
            <div className="console-copy-left">
              <span className="console-kicker">{selected.short} / NODE {selected.code}</span>
              <h3>{selected.product}</h3>
              <h4>{selected.title}</h4>
              <p>{selected.description}</p>
            </div>
            <div className="console-copy-right">
              <span>CAPABILITIES</span>
              <ul>
                {selected.features.map((f) => (<li key={f}>{f}</li>))}
              </ul>
              <a href={`/products/${selected.slug}`} className="console-link">
                Open {selected.product} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Operating Environments
// ─────────────────────────────────────────────────────────────

function OperatingEnvironments() {
  const environments = [
    { code: "01", title: "Corporate workplaces", text: "Smart office operations, employee services, document workflows, project coordination, and workplace intelligence." },
    { code: "02", title: "Government organizations", text: "Process visibility, correspondence workflows, controlled access, and enterprise-grade operational systems." },
    { code: "03", title: "Residential & commercial access", text: "Multi-gate management, visitor access, local network control, mobile access, and Bluetooth fallback." },
    { code: "04", title: "Construction sites", text: "Video intelligence for HSE compliance, restricted zones, asset protection, and incident investigation." },
    { code: "05", title: "Production & supply chain", text: "Process mining and modeling for bottlenecks, production flow, approvals, and continuous optimization." },
    { code: "06", title: "Multi-site operations", text: "Connected visibility across physical access, people, workflows, documents, and operational signals." },
  ]
  return (
    <section className="environments" aria-labelledby="environments-title">
      <div className="environment-visual">
        <img src="/meerana-assets/yisbir_cover_banner.png" alt="Yisbir construction site intelligence" />
        <GradualBlur target="parent" position="bottom" height="8rem" strength={2.4} divCount={8} curve="bezier" exponential animated="scroll" zIndex={1} />
        <div className="environment-overlay">
          <span>OPERATING ENVIRONMENT / 04</span>
          <strong>Physical systems meet operational intelligence.</strong>
        </div>
      </div>
      <div className="environment-content">
        <div className="environment-heading">
          <p className="eyebrow">WHERE MEERANA OPERATES</p>
          <h2 id="environments-title">Built for the environments where work happens.</h2>
        </div>
        <div className="environment-list">
          {environments.map((env) => (
            <article key={env.code}>
              <span>{env.code}</span>
              <div><h3>{env.title}</h3><p>{env.text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// About
// ─────────────────────────────────────────────────────────────

function AboutMeerana() {
  return (
    <section className="section about" id="about">
      <div className="about-media">
        <img src="/meerana-assets/herobg2.webp" alt="Meerana digital transformation" />
        <span>AN EMIRATI GROUP OF COMPANIES</span>
      </div>
      <div className="about-copy">
        <p className="eyebrow">03 / ABOUT MEERANA</p>
        <h2>Your digital transformation partner.</h2>
        <p>
          Meerana is an innovative technology company focused on developing leading-edge smart solutions.
          The company connects intelligent technology with how businesses are planned and operated, creating
          possibilities for customers and partners.
        </p>
        <blockquote>
          "Build the most trusted community to deliver the highest quality technological services."
        </blockquote>
        <div className="about-principles">
          {["AI-driven", "Future-ready", "Enterprise", "Integrated", "Scalable"].map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Signal Pipeline (animated event flow)
// ─────────────────────────────────────────────────────────────

const LIVE_EVENTS = [
  { text: "Unauthorized zone entry detected — Site B, Level 3", source: "HSE / YISBIR", color: "#f43f5e" },
  { text: "SLA breach predicted — Procurement approval at 97% queue load", source: "PROCESS / TASREE3", color: "#f59e0b" },
  { text: "Visitor credential expired — Gate 07, Business Bay Tower", source: "ACCESS / WASEL", color: "#3b82f6" },
  { text: "Document approval stalled 48h — Ministry correspondence cluster", source: "OPS / MANDOOBEE", color: "#a78bfa" },
]

const PIPELINE_STEPS = [
  { code: "01", state: "Edge trigger", title: "Signal detected", copy: "A real-world event surfaces at the operating edge — a zone breach, a process delay, an access anomaly." },
  { code: "02", state: "AI inference", title: "Intelligence classifies", copy: "The AI engine identifies type, severity, and context — cross-referencing live data to determine the response path." },
  { code: "03", state: "Autonomous action", title: "Systems respond", copy: "Workflows trigger instantly: access revoked, task assigned, alert routed — zero manual steps." },
  { code: "04", state: "Live telemetry", title: "Visibility updates", copy: "A unified dashboard reflects the resolved state. Decision-makers see the full incident timeline instantly." },
  { code: "05", state: "Business value", title: "Intelligence compounds", copy: "Every resolved event trains the model. Responses accelerate, exceptions decrease, operations improve." },
]

function Approach() {
  const [step, setStep] = useState(0)
  const [eventIdx, setEventIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = () => {
    setStep((prev) => {
      const next = (prev + 1) % PIPELINE_STEPS.length
      if (next === 0) setEventIdx((e) => (e + 1) % LIVE_EVENTS.length)
      return next
    })
  }

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(advance, 2100)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused])

  const event = LIVE_EVENTS[eventIdx]
  const pct = (step / (PIPELINE_STEPS.length - 1)) * 100

  return (
    <section className="section pipeline-section" id="approach">
      <div className="pipeline-header">
        <div>
          <p className="eyebrow">04 / INTELLIGENCE IN ACTION</p>
          <h2>Intelligence that acts,<br />not just observes.</h2>
        </div>
        <div className="pipeline-event" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="pipeline-event-badge" style={{ borderColor: event.color }}>
            <i style={{ background: event.color }} aria-hidden="true" />
            <span>LIVE EVENT</span>
          </div>
          <p className="pipeline-event-text">{event.text}</p>
          <span className="pipeline-event-source" style={{ color: event.color }}>{event.source}</span>
        </div>
      </div>

      <div className="pipeline-track" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="pipeline-beam" aria-hidden="true">
          <div className="pipeline-beam-fill" style={{ width: `${pct}%` }} />
          {PIPELINE_STEPS.map((_, i) => {
            const pos = (i / (PIPELINE_STEPS.length - 1)) * 100
            return (
              <button
                key={i}
                className={`pipeline-node-btn ${step >= i ? "is-lit" : ""} ${step === i ? "is-active" : ""}`}
                style={{ left: `${pos}%` }}
                onClick={() => setStep(i)}
                type="button"
                aria-label={PIPELINE_STEPS[i].state}
              />
            )
          })}
        </div>
        <div className="pipeline-steps">
          {PIPELINE_STEPS.map((s, i) => (
            <button
              key={s.code}
              className={`pipeline-step ${step === i ? "is-active" : ""} ${step > i ? "is-done" : ""}`}
              onClick={() => setStep(i)}
              type="button"
            >
              <div className="pipeline-step-head">
                <span className="pipeline-step-state">{s.state}</span>
                <span className="pipeline-step-code">{s.code}</span>
              </div>
              <h3>{s.title}</h3>
              <p>{s.copy}</p>
              {step > i && <span className="pipeline-check" aria-hidden="true">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Recognition (glassmorphic cards)
// ─────────────────────────────────────────────────────────────

function Recognition() {
  const items = [
    { date: "2023", title: "Future 100", copy: "Selected among the UAE's Future 100 companies — recognizing Meerana's technology leadership.", image: "/meerana-assets/new02.webp" },
    { date: "2023", title: "Workforce Wellbeing", copy: "Recognized through the MOHRE award for workforce wellbeing and quality of life.", image: "/meerana-assets/new01.webp" },
    { date: "2024", title: "Best Small Enterprise", copy: "Meerana received the national award for Best Small Enterprise.", image: "/meerana-assets/news12.webp" },
  ]
  return (
    <section className="recognition" id="recognition">
      <div className="recognition-heading">
        <p className="eyebrow">RECOGNITION / VERIFIED MILESTONES</p>
        <h2>Progress recognized in the UAE.</h2>
        <p>Selected milestones published on Meerana's existing website and company channels.</p>
      </div>
      <div className="recognition-list">
        {items.map((item, index) => (
          <article key={item.title} className="recognition-card">
            <div className="recognition-card-img">
              <img src={item.image} alt="" />
              <span className="recognition-number">0{index + 1}</span>
            </div>
            <div className="recognition-card-body">
              <span className="recognition-date">{item.date}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Partner Matrix
// ─────────────────────────────────────────────────────────────

function PartnerBand() {
  const logos = [
    ["dell.png", "Dell"],
    ["DubaiELEC.png", "Dubai Electricity and Water Authority"],
    ["EmiratesNBD.png", "Emirates NBD"],
    ["confluent.png", "Confluent"],
    ["botminds.png", "Botminds"],
    ["digital.png", "Digital"],
    ["moro.png", "Moro"],
    ["software.png", "Software AG"],
    ["ministryOfInterior.png", "Ministry of Interior"],
    ["kofax.png", "Kofax"],
  ]
  return (
    <section className="partner-band" aria-labelledby="partners-title">
      <div className="partner-intro">
        <p className="eyebrow">PARTNERS & CLIENTS</p>
        <h2 id="partners-title">Innovation through collaboration.</h2>
        <p>Organizations presented under Meerana's existing Partners & Clients portfolio.</p>
      </div>
      <div className="partner-logos">
        {logos.map(([file, name]) => (
          <div key={file}><img src={`/meerana-assets/${file}`} alt={name} /></div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Contact CTA
// ─────────────────────────────────────────────────────────────

function ContactSection() {
  const [submitted, setSubmitted] = useState(false)
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-grid">
        <div>
          <p className="eyebrow">05 / START A CONVERSATION</p>
          <h2>Together let's build what comes next.</h2>
          <p>
            Reach out for sovereign AI deployments, enterprise integrations, or multi-site automation.
            The prototype form keeps your message in the browser.
          </p>
          <div className="contact-details">
            <a href="mailto:info@meerana.ae">info@meerana.ae <span aria-hidden="true">↗</span></a>
            <address>#1704, Blue Bay Tower, Business Bay, Dubai, UAE</address>
          </div>
        </div>
        <form onSubmit={submit}>
          <div className="contact-row">
            <label>
              <span>Full name</span>
              <input required type="text" name="name" placeholder="Your full name" />
            </label>
            <label>
              <span>Company</span>
              <input required type="text" name="company" placeholder="Organization" />
            </label>
          </div>
          <label>
            <span>Work email</span>
            <input required type="email" name="email" placeholder="name@company.com" />
          </label>
          <label>
            <span>System requirements</span>
            <select required name="system" className="contact-select">
              <option value="">Select system type…</option>
              <option value="access">Smart Access (Wasel)</option>
              <option value="operations">Corporate Operations (Mandoobee)</option>
              <option value="process">Process Intelligence (Tasree3)</option>
              <option value="site">Site Intelligence (Yisbir)</option>
              <option value="integration">Multi-system Integration</option>
              <option value="consultation">Consultation</option>
            </select>
          </label>
          <label>
            <span>Brief description</span>
            <textarea required name="message" rows={3} placeholder="Briefly describe the system or opportunity." />
          </label>
          <button className="button button-azure" type="submit">
            Proceed enquiry <span aria-hidden="true">↗</span>
          </button>
          <p className="form-note" role="status">
            {submitted
              ? "Prototype only: your enquiry was validated locally but not sent."
              : "Prototype behaviour: no data is transmitted."}
          </p>
        </form>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <Brand compact />
        <p>Smart technology solutions and enterprise products from Dubai, UAE.</p>
        <a href="/#top">Back to top ↑</a>
      </div>
      <div className="footer-bottom">
        <span>MEERANA TECHNOLOGIES</span>
        <a href="mailto:info@meerana.ae">INFO@MEERANA.AE</a>
        <span>BUSINESS BAY, DUBAI, UAE</span>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────────
// Page root
// ─────────────────────────────────────────────────────────────

export default function MeeranaHome() {
  return (
    <ClickSpark sparkColor="#00E5FF" sparkCount={5} sparkRadius={12} sparkSize={7} duration={320}>
      <ScrollReveal />
      <Navigation />
      <main>
        <Hero />
        <IntelligenceTicker />
        <AuthorityBanner />
        <Solutions />
        <Products />
        <OperatingEnvironments />
        <AboutMeerana />
        <Approach />
        <Recognition />
        <PartnerBand />
        <ContactSection />
      </main>
      <Footer />
      <GradualBlur target="page" position="bottom" height="3.5rem" strength={1.2} divCount={5} curve="bezier" opacity={0.7} animated="scroll" zIndex={30} />
    </ClickSpark>
  )
}
