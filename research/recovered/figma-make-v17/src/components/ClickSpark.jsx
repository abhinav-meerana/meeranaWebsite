import { useCallback, useEffect, useRef } from "react"

export default function ClickSpark({
  sparkColor = "#3fd0ff",
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
  easing = "ease-out",
  extraScale = 1,
  children,
}) {
  const canvasRef = useRef(null)
  const sparksRef = useRef([])

  const ease = useCallback(
    (value) => {
      if (easing === "linear") return value
      if (easing === "ease-in") return value * value
      if (easing === "ease-in-out")
        return value < 0.5 ? 2 * value * value : -1 + (4 - 2 * value) * value
      return value * (2 - value)
    },
    [easing],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext("2d")
    let frame

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    const click = (event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      if (event.target.closest("a, button, input, textarea, select, label"))
        return
      const now = performance.now()
      sparksRef.current.push(
        ...Array.from({ length: sparkCount }, (_, index) => ({
          x: event.clientX,
          y: event.clientY,
          angle: (Math.PI * 2 * index) / sparkCount,
          start: now,
        })),
      )
    }
    window.addEventListener("click", click)

    const draw = (time) => {
      frame = requestAnimationFrame(draw)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      sparksRef.current = sparksRef.current.filter((spark) => {
        const progress = (time - spark.start) / duration
        if (progress >= 1) return false
        const eased = ease(progress)
        const distance = eased * sparkRadius * extraScale
        const length = sparkSize * (1 - eased)
        const x = spark.x + distance * Math.cos(spark.angle)
        const y = spark.y + distance * Math.sin(spark.angle)
        context.strokeStyle = sparkColor
        context.globalAlpha = 1 - eased
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(x, y)
        context.lineTo(
          x + length * Math.cos(spark.angle),
          y + length * Math.sin(spark.angle),
        )
        context.stroke()
        context.globalAlpha = 1
        return true
      })
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("click", click)
    }
  }, [
    duration,
    ease,
    extraScale,
    sparkColor,
    sparkCount,
    sparkRadius,
    sparkSize,
  ])

  return (
    <div className="click-spark-root">
      <canvas
        ref={canvasRef}
        className="click-spark-canvas"
        aria-hidden="true"
      />
      {children}
    </div>
  )
}
