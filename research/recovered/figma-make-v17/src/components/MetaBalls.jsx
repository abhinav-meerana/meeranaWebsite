import { useEffect, useRef, useState } from "react"
import { Camera, Mesh, Program, Renderer, Transform, Triangle, Vec3 } from "ogl"
import "./MetaBalls.css"

function parseHexColor(hex) {
  const color = hex.replace("#", "")
  return [
    parseInt(color.substring(0, 2), 16) / 255,
    parseInt(color.substring(2, 4), 16) / 255,
    parseInt(color.substring(4, 6), 16) / 255,
  ]
}

const fract = (value) => value - Math.floor(value)

function hash31(value) {
  const result = [value * 0.1031, value * 0.103, value * 0.0973].map(fract)
  const rotated = [result[1], result[2], result[0]]
  const dot =
    result[0] * (rotated[0] + 33.33) +
    result[1] * (rotated[1] + 33.33) +
    result[2] * (rotated[2] + 33.33)
  return result.map((item) => fract(item + dot))
}

function hash33(value) {
  const result = [value[0] * 0.1031, value[1] * 0.103, value[2] * 0.0973].map(
    fract,
  )
  const rotated = [result[1], result[0], result[2]]
  const dot =
    result[0] * (rotated[0] + 33.33) +
    result[1] * (rotated[1] + 33.33) +
    result[2] * (rotated[2] + 33.33)
  const p = result.map((item) => fract(item + dot))
  return [
    fract((p[0] + p[1]) * p[2]),
    fract((p[0] + p[0]) * p[1]),
    fract((p[1] + p[0]) * p[0]),
  ]
}

const vertex = `#version 300 es
precision highp float;
layout(location = 0) in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`

const fragment = `#version 300 es
precision highp float;
uniform vec3 iResolution;
uniform vec3 iMouse;
uniform vec3 iColor;
uniform vec3 iCursorColor;
uniform float iAnimationSize;
uniform int iBallCount;
uniform float iCursorBallSize;
uniform vec3 iMetaBalls[50];
uniform bool enableTransparency;
out vec4 outColor;

float getMetaBallValue(vec2 center, float radius, vec2 point) {
  vec2 delta = point - center;
  return (radius * radius) / max(dot(delta, delta), 0.0001);
}

void main() {
  vec2 fragmentCoord = gl_FragCoord.xy;
  float scale = iAnimationSize / iResolution.y;
  vec2 coord = (fragmentCoord - iResolution.xy * 0.5) * scale;
  vec2 mouseWorld = (iMouse.xy - iResolution.xy * 0.5) * scale;
  float field = 0.0;
  for (int i = 0; i < 50; i++) {
    if (i >= iBallCount) break;
    field += getMetaBallValue(iMetaBalls[i].xy, iMetaBalls[i].z, coord);
  }
  float pointerField = getMetaBallValue(mouseWorld, iCursorBallSize, coord);
  float total = field + pointerField;
  float edge = smoothstep(-1.0, 1.0, (total - 1.3) / min(1.0, fwidth(total)));
  vec3 finalColor = vec3(0.0);
  if (total > 0.0) {
    finalColor = iColor * (field / total) + iCursorColor * (pointerField / total);
  }
  outColor = vec4(finalColor * edge, enableTransparency ? edge : 1.0);
}`

export default function MetaBalls({
  className = "",
  color = "#ffffff",
  speed = 0.3,
  enableMouseInteraction = true,
  hoverSmoothness = 0.05,
  animationSize = 30,
  ballCount = 15,
  clumpFactor = 1,
  cursorBallSize = 3,
  cursorBallColor = "#ffffff",
  enableTransparency = false,
}) {
  const containerRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 1.5),
        alpha: true,
      })
    } catch {
      setFailed(true)
      return
    }

    const gl = renderer.gl
    gl.clearColor(0, 0, 0, enableTransparency ? 0 : 1)
    container.appendChild(gl.canvas)

    const camera = new Camera(gl, {
      left: -1,
      right: 1,
      top: 1,
      bottom: -1,
      near: 0.1,
      far: 10,
    })
    camera.position.z = 1
    const geometry = new Triangle(gl)
    const baseColor = parseHexColor(color)
    const pointerColor = parseHexColor(cursorBallColor)
    const metaBalls = Array.from({ length: 50 }, () => new Vec3(0, 0, 0))
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iResolution: { value: new Vec3(0, 0, 0) },
        iMouse: { value: new Vec3(0, 0, 0) },
        iColor: { value: new Vec3(...baseColor) },
        iCursorColor: { value: new Vec3(...pointerColor) },
        iAnimationSize: { value: animationSize },
        iBallCount: { value: Math.min(ballCount, 50) },
        iCursorBallSize: { value: cursorBallSize },
        iMetaBalls: { value: metaBalls },
        enableTransparency: { value: enableTransparency },
      },
    })
    const mesh = new Mesh(gl, { geometry, program })
    const scene = new Transform()
    mesh.setParent(scene)

    const count = Math.min(ballCount, 50)
    const ballParams = Array.from({ length: count }, (_, index) => {
      const hash = hash31(index + 1)
      const secondary = hash33(hash)
      return {
        start: hash[0] * Math.PI * 2,
        delta: Math.PI * (0.1 + hash[1] * 0.3),
        scale: 5 + hash[1] * 5,
        toggle: Math.floor(secondary[0] * 2),
        radius: 0.62 + secondary[2] * 1.5,
      }
    })

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, inside: false }
    let frame
    let visible = true
    let pageVisible = !document.hidden
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const resize = () => {
      const width = Math.max(container.clientWidth, 1)
      const height = Math.max(container.clientHeight, 1)
      renderer.setSize(width, height)
      gl.canvas.style.width = `${width}px`
      gl.canvas.style.height = `${height}px`
      program.uniforms.iResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        0,
      )
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    intersectionObserver.observe(container)

    const onVisibility = () => {
      pageVisible = !document.hidden
    }
    document.addEventListener("visibilitychange", onVisibility)

    const updatePointer = (event) => {
      if (!enableMouseInteraction || reducedMotion) return
      const rect = container.getBoundingClientRect()
      pointer.targetX =
        ((event.clientX - rect.left) / rect.width) * gl.canvas.width
      pointer.targetY =
        (1 - (event.clientY - rect.top) / rect.height) * gl.canvas.height
    }
    const enter = () => {
      pointer.inside = true
    }
    const leave = () => {
      pointer.inside = false
    }
    container.addEventListener("pointermove", updatePointer)
    container.addEventListener("pointerenter", enter)
    container.addEventListener("pointerleave", leave)

    const start = performance.now()
    const update = (time) => {
      frame = requestAnimationFrame(update)
      if (!visible || !pageVisible) return
      const elapsed = reducedMotion ? 0 : (time - start) * 0.001
      ballParams.forEach((ball, index) => {
        const delta = elapsed * speed * ball.delta
        const angle = ball.start + delta
        metaBalls[index].set(
          Math.cos(angle) * ball.scale * clumpFactor,
          Math.sin(angle + delta * ball.toggle) * ball.scale * clumpFactor,
          ball.radius,
        )
      })

      if (!pointer.inside || reducedMotion) {
        pointer.targetX =
          gl.canvas.width * (0.5 + Math.cos(elapsed * speed) * 0.14)
        pointer.targetY =
          gl.canvas.height * (0.5 + Math.sin(elapsed * speed) * 0.14)
      }
      pointer.x += (pointer.targetX - pointer.x) * hoverSmoothness
      pointer.y += (pointer.targetY - pointer.y) * hoverSmoothness
      program.uniforms.iMouse.value.set(pointer.x, pointer.y, 0)
      renderer.render({ scene, camera })
    }
    frame = requestAnimationFrame(update)

    const onContextLost = () => setFailed(true)
    gl.canvas.addEventListener("webglcontextlost", onContextLost, {
      once: true,
    })

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
      container.removeEventListener("pointermove", updatePointer)
      container.removeEventListener("pointerenter", enter)
      container.removeEventListener("pointerleave", leave)
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [
    animationSize,
    ballCount,
    clumpFactor,
    color,
    cursorBallColor,
    cursorBallSize,
    enableMouseInteraction,
    enableTransparency,
    hoverSmoothness,
    speed,
  ])

  return (
    <div
      ref={containerRef}
      className={`metaballs-container ${
        failed ? "metaballs-fallback" : ""
      } ${className}`}
      role="img"
      aria-label="Interactive connected systems field"
    />
  )
}
