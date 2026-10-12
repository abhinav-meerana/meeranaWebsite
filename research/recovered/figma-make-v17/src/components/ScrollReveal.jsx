import { useEffect } from "react"

const textSelectors = [
  ".section-heading .eyebrow",
  ".section-heading h2",
  ".section-heading > p:last-child",
  ".products-lead .eyebrow",
  ".products-lead h2",
  ".environment-heading .eyebrow",
  ".environment-heading h2",
  ".about-copy .eyebrow",
  ".about-copy h2",
  ".about-copy > p",
  ".about-copy blockquote",
  ".recognition-heading .eyebrow",
  ".recognition-heading h2",
  ".recognition-heading > p:last-child",
  ".partner-intro .eyebrow",
  ".partner-intro h2",
  ".partner-intro > p:last-child",
  ".contact .eyebrow",
  ".contact h2",
  ".contact-grid > div > p",
  ".solution-feature > div:last-child > *",
  ".solution-row > div > *",
  ".product-story-copy > *",
  ".environment-list article h3",
  ".environment-list article p",
  ".recognition-list article > div:last-child > *",
  ".approach-line article h3",
  ".approach-line article p",
  ".product-section-heading > *",
  ".product-overview-copy > p",
  ".product-architecture > div:first-child > *",
  ".product-contact > *",
]

const cardSelectors = [
  ".solution-feature",
  ".solution-row",
  ".product-story",
  ".environment-list article",
  ".recognition-list article",
  ".partner-logos > div",
  ".approach-line article",
  ".contact form",
  ".product-outcomes > div",
  ".product-module-list article",
  ".product-environment-list > div",
  ".product-next",
]

const imageSelectors = [
  ".product-photo",
  ".environment-visual",
  ".about-media",
  ".recognition-image",
  ".product-page-visual",
]

export default function ScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    const targets = []

    const prepare = (selectors, className, delayStep) => {
      document
        .querySelectorAll(selectors.join(","))
        .forEach((element, index) => {
          element.classList.add("scroll-reveal", className)
          element.style.setProperty(
            "--reveal-delay",
            `${(index % 4) * delayStep}ms`,
          )
          targets.push(element)
        })
    }

    prepare(textSelectors, "reveal-text", 70)
    prepare(cardSelectors, "reveal-card", 85)
    prepare(imageSelectors, "reveal-image", 55)

    if (reducedMotion) {
      targets.forEach((target) => target.classList.add("is-revealed"))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-revealed")
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return null
}
