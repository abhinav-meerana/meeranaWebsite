"use client";

import { useEffect, useState } from "react";
import { routeKey, WHEEL_ITEMS, type WheelKey } from "@/content/navigation";

/**
 * The wheel item that matches what the reader is looking at.
 *
 * On the homepage: the `[data-nav]` section that crosses a reading line just
 * above the middle of the viewport, from one IntersectionObserver (no scroll
 * listener). Elsewhere: the route's own item.
 *
 * It only ever reports; it never scrolls, so it cannot fight the wheel.
 */
export function useActiveSection(pathname: string): WheelKey {
  const [key, setKey] = useState<WheelKey>(() => routeKey(pathname));

  useEffect(() => {
    if (pathname !== "/") {
      setKey(routeKey(pathname));
      return;
    }
    const valid = new Set(WHEEL_ITEMS.map((i) => i.key));
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-nav]"));
    if (sections.length === 0) return;
    const visible = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target, e.isIntersecting);
        /* The last section in document order whose box covers the line. */
        let next: WheelKey | null = null;
        for (const s of sections) {
          if (visible.get(s)) {
            const k = s.dataset.nav as WheelKey;
            if (valid.has(k)) next = k;
          }
        }
        if (next) setKey(next);
      },
      { rootMargin: "-42% 0px -56% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [pathname]);

  return key;
}
