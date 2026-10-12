import { useEffect, useMemo, useRef, useState } from "react"
import "./GradualBlur.css"

const curves = {
  linear: (value) => value,
  bezier: (value) => value * value * (3 - 2 * value),
  "ease-in": (value) => value * value,
  "ease-out": (value) => 1 - Math.pow(1 - value, 2),
}

export default function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  curve = "linear",
  opacity = 1,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  hoverIntensity,
  target = "parent",
  zIndex = 10,
  className = "",
}) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(animated !== "scroll")

  useEffect(() => {
    if (animated !== "scroll" || !ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      {
        threshold: 0.1,
      },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animated])

  const layers = useMemo(() => {
    const curveFunction = curves[curve] || curves.linear
    const currentStrength =
      hovered && hoverIntensity ? strength * hoverIntensity : strength
    const increment = 100 / divCount
    return Array.from({ length: divCount }, (_, index) => {
      const step = index + 1
      const progress = curveFunction(step / divCount)
      const blur = exponential
        ? Math.pow(2, progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * divCount + 1) * currentStrength
      const start = Math.max(0, increment * step - increment)
      const solid = Math.min(100, increment * step + increment)
      const direction = {
        top: "to top",
        bottom: "to bottom",
        left: "to left",
        right: "to right",
      }[position]
      return (
        <div
          key={step}
          style={{
            maskImage: `linear-gradient(${direction}, transparent ${start}%, black ${increment * step}%, black ${solid}%, transparent 100%)`,
            WebkitMaskImage: `linear-gradient(${direction}, transparent ${start}%, black ${increment * step}%, black ${solid}%, transparent 100%)`,
            backdropFilter: `blur(${blur.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blur.toFixed(3)}rem)`,
            opacity,
          }}
        />
      )
    })
  }, [
    curve,
    divCount,
    exponential,
    hovered,
    hoverIntensity,
    opacity,
    position,
    strength,
  ])

  const vertical = position === "top" || position === "bottom"
  return (
    <div
      ref={ref}
      className={`gradual-blur ${
        target === "page" ? "gradual-blur-page" : ""
      } ${className}`}
      style={{
        position: target === "page" ? "fixed" : "absolute",
        [position]: 0,
        ...(vertical
          ? { height, width: width || "100%", left: 0, right: 0 }
          : { width: width || height, height: "100%", top: 0, bottom: 0 }),
        zIndex: target === "page" ? zIndex + 100 : zIndex,
        opacity: visible ? 1 : 0,
        transition: animated ? `opacity ${duration} ${easing}` : undefined,
      }}
      onMouseEnter={hoverIntensity ? () => setHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setHovered(false) : undefined}
      aria-hidden="true"
    >
      <div className="gradual-blur-inner">{layers}</div>
    </div>
  )
}
