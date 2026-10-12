import { useEffect } from "react"
import { Link, Navigate, useParams } from "react-router"
import ClickSpark from "../components/ClickSpark"
import GradualBlur from "../components/GradualBlur"
import MetaBalls from "../components/MetaBalls"
import ScrollReveal from "../components/ScrollReveal"
import { products } from "../data/products"
import { Footer, Navigation } from "./MeeranaHome"
import "./ProductPage.css"

export default function ProductPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)

  useEffect(() => {
    if (!product) return
    document.title = `${product.product} by Meerana Technologies`
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [product])

  if (!product) return <Navigate to="/" replace />

  const currentIndex = products.findIndex((item) => item.slug === product.slug)
  const nextProduct = products[(currentIndex + 1) % products.length]

  return (
    <ClickSpark
      sparkColor="#38bdf8"
      sparkCount={5}
      sparkRadius={12}
      sparkSize={7}
      duration={320}
    >
      <ScrollReveal />
      <Navigation />
      <main className={`product-page product-page-${product.slug}`}>
        <section className="product-page-hero" id="top">
          <div className="product-page-field" aria-hidden="true">
            <MetaBalls
              color="#38bdf8"
              cursorBallColor="#0d3bff"
              cursorBallSize={1.1}
              ballCount={11}
              animationSize={34}
              clumpFactor={0.9}
              speed={0.14}
              enableTransparency
            />
          </div>
          <div className="product-page-hero-copy">
            <p className="product-page-eyebrow">
              MEERANA TECHNOLOGIES / PRODUCT {product.code}
            </p>
            {product.logo ? (
              <img
                className="product-page-logo"
                src={product.logo}
                alt={product.product}
              />
            ) : (
              <div className="product-page-wordmark">
                <span>{product.product}</span>
                <small>BY MEERANA TECHNOLOGIES</small>
              </div>
            )}
            <h1>{product.tagline}</h1>
            <p className="product-page-intro">{product.description}</p>
            <div className="product-page-actions">
              <a
                className="button button-primary"
                href={`mailto:info@meerana.ae?subject=${encodeURIComponent(`${product.product} by Meerana Technologies enquiry`)}`}
              >
                Discuss {product.product} <span aria-hidden="true">↗</span>
              </a>
              {product.sourceUrl ? (
                <a
                  className="button button-secondary"
                  href={product.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Product website <span aria-hidden="true">↗</span>
                </a>
              ) : (
                <a className="button button-secondary" href="#capabilities">
                  Explore capabilities <span aria-hidden="true">↓</span>
                </a>
              )}
            </div>
          </div>
          <div className="product-page-visual">
            <img
              src={product.image}
              alt={`${product.product} by Meerana Technologies`}
            />
            <GradualBlur
              target="parent"
              position="bottom"
              height="7rem"
              strength={2}
              divCount={7}
              curve="bezier"
              exponential
              animated="scroll"
              zIndex={1}
            />
            <span>{product.title}</span>
          </div>
          <div
            className="product-page-stats"
            aria-label={`${product.product} overview`}
          >
            <div>
              <span>PRODUCT</span>
              <strong>{product.product}</strong>
            </div>
            <div>
              <span>CAPABILITIES</span>
              <strong>{String(product.modules.length).padStart(2, "0")}</strong>
            </div>
            <div>
              <span>OPERATING ENVIRONMENTS</span>
              <strong>
                {String(product.environments.length).padStart(2, "0")}
              </strong>
            </div>
            <div>
              <span>COMPANY</span>
              <strong>Meerana Technologies</strong>
            </div>
          </div>
        </section>

        <nav
          className="product-subnav"
          aria-label={`${product.product} page navigation`}
        >
          <span>{product.product.toUpperCase()} / PRODUCT SYSTEM</span>
          <div>
            <a href="#overview">Overview</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#environments">Environments</a>
          </div>
        </nav>

        <section className="product-overview" id="overview">
          <div className="product-section-heading">
            <p>01 / SYSTEM OVERVIEW</p>
            <h2>One connected operating layer.</h2>
          </div>
          <div className="product-overview-copy">
            <p>{product.architecture}</p>
            <div className="product-outcomes">
              {product.outcomes.map((outcome, index) => (
                <div key={outcome}>
                  <span>0{index + 1}</span>
                  <strong>{outcome}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="product-capabilities" id="capabilities">
          <div className="product-section-heading">
            <p>02 / CORE CAPABILITIES</p>
            <h2>What {product.product} brings together.</h2>
          </div>
          <div className="product-module-list">
            {product.modules.map((module, index) => (
              <article key={module.title}>
                <span className="product-module-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                </div>
                <ul>
                  {module.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="product-architecture">
          <div>
            <p>CONNECTED ARCHITECTURE</p>
            <h2>From user action to operational signal.</h2>
          </div>
          <div
            className="architecture-flow"
            aria-label={`${product.product} connected architecture`}
          >
            <span>People & interfaces</span>
            <i aria-hidden="true">→</i>
            <span>{product.product} core</span>
            <i aria-hidden="true">→</i>
            <span>Systems & data</span>
            <i aria-hidden="true">→</i>
            <span>Operational visibility</span>
          </div>
        </section>

        <section className="product-environments" id="environments">
          <div className="product-section-heading">
            <p>03 / OPERATING ENVIRONMENTS</p>
            <h2>Designed around where the work happens.</h2>
          </div>
          <div className="product-environment-list">
            {product.environments.map((environment, index) => (
              <div key={environment}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{environment}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="product-next">
          <div>
            <span>NEXT PRODUCT / {nextProduct.code}</span>
            <p>{nextProduct.short}</p>
          </div>
          <Link to={`/products/${nextProduct.slug}`}>
            <strong>{nextProduct.product}</strong>
            <span aria-hidden="true">↗</span>
          </Link>
        </section>

        <section className="product-contact">
          <p>MEERANA TECHNOLOGIES / DUBAI</p>
          <h2>Explore {product.product} with our team.</h2>
          <a
            className="button button-primary"
            href={`mailto:info@meerana.ae?subject=${encodeURIComponent(`${product.product} by Meerana Technologies enquiry`)}`}
          >
            Start a conversation <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>
      <Footer />
    </ClickSpark>
  )
}
