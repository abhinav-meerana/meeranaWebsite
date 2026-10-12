"use client";

import { Component, type ReactNode } from "react";

/**
 * Error boundary around the WebGL room.
 *
 * Every failure path must leave a complete page. Without this, a machine that
 * cannot create a WebGL context takes the whole document down with it: the
 * launch checklist requires a legible page with no console errors when WebGL is
 * unavailable (plan/13 §D4), and a decorative scene must never be able to break
 * the copy.
 *
 * This module deliberately imports nothing from three or @react-three/fiber, so
 * the capability probe and the boundary stay out of the 3D chunk.
 */
export class RoomBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // Swallow deliberately: the fallback is the handling.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * WebGL capability probe.
 *
 * Creating a probe context and immediately releasing it is cheaper and more
 * reliable than letting R3F fail inside the render tree. `failIfMajorPerformanceCaveat`
 * is deliberately NOT set: a software renderer is slow but still better than no
 * room at all, and PerformanceMonitor will drop resolution if it struggles.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}
